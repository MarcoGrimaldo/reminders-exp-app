import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RankUpModal from "../components/RankUpModal";

type Rank = {
  tier: "Iron" | "Platinum" | "Diamond";
  level: 1 | 2 | 3 | 4 | 5;
};

type PointsContextType = {
  points: number;
  rank: Rank;
  addPoints: (amount: number, onPointsAdded?: () => void) => Promise<void>;
  getNextRankPoints: () => number;
  getCurrentRankPoints: () => number;
};

const PointsContext = createContext<PointsContextType | undefined>(undefined);

const RANK_THRESHOLDS = {
  Iron: [0, 100, 200, 300, 400, 500],
  Platinum: [500, 1000, 2000, 3000, 4000, 5000],
  Diamond: [5000, 6000, 7000, 8000, 9000, 10000],
};

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState<Rank>({ tier: "Iron", level: 1 });
  const [showRankUpModal, setShowRankUpModal] = useState(false);
  const [previousRank, setPreviousRank] = useState<Rank>({
    tier: "Iron",
    level: 1,
  });
  const [newRank, setNewRank] = useState<Rank>({ tier: "Iron", level: 1 });
  const pendingRankUp = useRef<boolean>(false);

  useEffect(() => {
    loadPoints();
  }, []);

  const loadPoints = async () => {
    try {
      const storedPoints = await AsyncStorage.getItem("userPoints");
      if (storedPoints) {
        const parsedPoints = parseInt(storedPoints, 10);
        setPoints(parsedPoints);
        updateRank(parsedPoints);
      }
    } catch (error) {
      console.error("Error loading points:", error);
    }
  };

  const updateRank = (currentPoints: number) => {
    let tier: Rank["tier"] = "Iron";
    let level: Rank["level"] = 1;

    if (currentPoints >= RANK_THRESHOLDS.Diamond[0]) {
      tier = "Diamond";
      for (let i = 0; i < 5; i++) {
        if (currentPoints >= RANK_THRESHOLDS.Diamond[i]) {
          level = (i + 1) as Rank["level"];
        }
      }
    } else if (currentPoints >= RANK_THRESHOLDS.Platinum[0]) {
      tier = "Platinum";
      for (let i = 0; i < 5; i++) {
        if (currentPoints >= RANK_THRESHOLDS.Platinum[i]) {
          level = (i + 1) as Rank["level"];
        }
      }
    } else {
      for (let i = 0; i < 5; i++) {
        if (currentPoints >= RANK_THRESHOLDS.Iron[i]) {
          level = (i + 1) as Rank["level"];
        }
      }
    }

    const newRankValue = { tier, level };

    // Check if rank has changed
    if (tier !== rank.tier || level !== rank.level) {
      setPreviousRank(rank);
      setNewRank(newRankValue);
      pendingRankUp.current = true;
    }

    setRank(newRankValue);
  };

  const addPoints = async (amount: number, onPointsAdded?: () => void) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    await AsyncStorage.setItem("userPoints", newPoints.toString());
    updateRank(newPoints);

    if (onPointsAdded) {
      onPointsAdded();
    }

    // If there's a pending rank up, show the modal after the callback
    if (pendingRankUp.current) {
      setShowRankUpModal(true);
      pendingRankUp.current = false;
    }
  };

  const getCurrentRankPoints = () => {
    const index = rank.level - 1;
    return RANK_THRESHOLDS[rank.tier][index];
  };

  const getNextRankPoints = () => {
    const index = rank.level - 1;
    const currentTier = rank.tier;

    // If at max level of current tier
    if (rank.level === 5) {
      if (currentTier === "Diamond") {
        return RANK_THRESHOLDS.Diamond[5]; // Max points
      }
      // Move to next tier
      const nextTier = currentTier === "Iron" ? "Platinum" : "Diamond";
      return RANK_THRESHOLDS[nextTier][0];
    }

    // Otherwise, just get next level in current tier
    return RANK_THRESHOLDS[currentTier][index + 1];
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        rank,
        addPoints,
        getNextRankPoints,
        getCurrentRankPoints,
      }}
    >
      {children}
      <RankUpModal
        visible={showRankUpModal}
        onClose={() => setShowRankUpModal(false)}
        previousRank={previousRank}
        newRank={newRank}
      />
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
}
