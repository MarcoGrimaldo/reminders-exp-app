import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { usePoints } from "../context/PointsContext";

export default function RankProgressBar() {
  const { theme } = useTheme();
  const { points, rank, getNextRankPoints, getCurrentRankPoints } = usePoints();
  const progress = useRef(new Animated.Value(0)).current;
  const prevRank = useRef({ tier: rank.tier, level: rank.level });

  useEffect(() => {
    // Check if rank has changed
    if (
      prevRank.current.tier !== rank.tier ||
      prevRank.current.level !== rank.level
    ) {
      // Reset progress to 0 first
      progress.setValue(0);
      prevRank.current = { tier: rank.tier, level: rank.level };
    }

    const currentPoints = getCurrentRankPoints();
    const nextPoints = getNextRankPoints();
    const range = nextPoints - currentPoints;

    // If we're at the start (0 points) or there's no range, show 0 progress
    const progressValue =
      range <= 0 ? 0 : Math.min((points - currentPoints) / range, 1);

    Animated.timing(progress, {
      toValue: progressValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [points, rank]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.rankInfo}>
        <Text style={[styles.rankText, { color: theme.colors.text }]}>
          {rank.tier} {rank.level}
        </Text>
        <Text style={[styles.pointsText, { color: theme.colors.text }]}>
          {points} pts
        </Text>
      </View>
      <View
        style={[styles.progressBar, { backgroundColor: theme.colors.border }]}
      >
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor: theme.colors.primary,
              width: progressWidth,
            },
          ]}
        />
      </View>
      <Text style={[styles.nextRankText, { color: theme.colors.text }]}>
        Next rank: {getNextRankPoints()} pts
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
  },
  rankInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pointsText: {
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 4,
  },
  nextRankText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
});
