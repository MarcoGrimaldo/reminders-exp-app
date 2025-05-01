import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  previousRank: {
    tier: string;
    level: number;
  };
  newRank: {
    tier: string;
    level: number;
  };
};

export default function RankUpModal({
  visible,
  onClose,
  previousRank,
  newRank,
}: Props) {
  const { theme } = useTheme();
  const scale = React.useRef(new Animated.Value(0)).current;
  const rotate = React.useRef(new Animated.Value(0)).current;
  const sparkleOpacity = React.useRef(new Animated.Value(0)).current;
  const titleSlide = React.useRef(new Animated.Value(-100)).current;
  const rankSlide = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scale.setValue(0);
      rotate.setValue(0);
      sparkleOpacity.setValue(0);
      titleSlide.setValue(-100);
      rankSlide.setValue(100);

      // Start animation sequence
      Animated.sequence([
        // Pop in the medal
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 5,
        }),
        // Rotate medal and show sparkles
        Animated.parallel([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.elastic(1),
          }),
          Animated.timing(sparkleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          // Slide in texts
          Animated.stagger(200, [
            Animated.spring(titleSlide, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }),
            Animated.spring(rankSlide, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }),
          ]),
        ]),
      ]).start();
    }
  }, [visible]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const getMedalColor = (tier: string) => {
    switch (tier) {
      case "Iron":
        return "#71717a";
      case "Platinum":
        return "#0ea5e9";
      case "Diamond":
        return "#7c3aed";
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[styles.container, { backgroundColor: theme.colors.card }]}
        >
          {/* Sparkles */}
          <Animated.View
            style={[styles.sparkleContainer, { opacity: sparkleOpacity }]}
          >
            {[...Array(8)].map((_, i) => (
              <Ionicons
                key={i}
                name="star"
                size={24}
                color={theme.colors.primary}
                style={[
                  styles.sparkle,
                  {
                    transform: [
                      { rotate: `${i * 45}deg` },
                      { translateX: 80 },
                      { rotate: `${-i * 45}deg` },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>

          {/* Medal */}
          <Animated.View
            style={[
              styles.medalContainer,
              {
                transform: [{ scale }, { rotate: spin }],
              },
            ]}
          >
            <View
              style={[
                styles.medal,
                { backgroundColor: getMedalColor(newRank.tier) },
              ]}
            >
              <Ionicons name="trophy" size={40} color="#fff" />
            </View>
          </Animated.View>

          {/* Texts */}
          <Animated.Text
            style={[
              styles.congratsText,
              { color: theme.colors.text },
              { transform: [{ translateX: titleSlide }] },
            ]}
          >
            Congratulations!
          </Animated.Text>

          <Animated.View
            style={[
              styles.rankContainer,
              { transform: [{ translateX: rankSlide }] },
            ]}
          >
            <Text style={[styles.rankText, { color: theme.colors.text }]}>
              {previousRank.tier} {previousRank.level}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={theme.colors.primary}
              style={styles.arrow}
            />
            <Text
              style={[
                styles.rankText,
                { color: getMedalColor(newRank.tier) },
                styles.newRank,
              ]}
            >
              {newRank.tier} {newRank.level}
            </Text>
          </Animated.View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.85,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  sparkleContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sparkle: {
    position: "absolute",
  },
  medalContainer: {
    marginVertical: 20,
  },
  medal: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  rankContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  rankText: {
    fontSize: 20,
    fontWeight: "600",
  },
  newRank: {
    fontSize: 24,
    fontWeight: "bold",
  },
  arrow: {
    marginHorizontal: 12,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
