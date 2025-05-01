import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { usePoints } from "../context/PointsContext";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const MODAL_HEIGHT = 180; // Fixed height for the modal

export default function TaskVerificationModal({
  visible,
  onClose,
  onConfirm,
}: Props) {
  const { theme } = useTheme();
  const { addPoints } = usePoints();
  const [showAnimation, setShowAnimation] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const contentOpacityAnim = React.useRef(new Animated.Value(1)).current;

  const handleConfirm = async () => {
    // Fade out content
    Animated.timing(contentOpacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowAnimation(true);

      // Start animation after content is hidden
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Add points and handle the callback
      addPoints(50, () => {
        // After points are added and animation is complete, close the modal
        setTimeout(() => {
          scaleAnim.setValue(0);
          opacityAnim.setValue(0);
          contentOpacityAnim.setValue(1);
          onConfirm();
        }, 2000);
      });
    });
  };

  useEffect(() => {
    if (visible) {
      setShowAnimation(false);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.card,
              height: MODAL_HEIGHT,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.contentContainer,
              { opacity: contentOpacityAnim },
              showAnimation && styles.hidden,
            ]}
          >
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Task Completion
            </Text>
            <Text style={[styles.message, { color: theme.colors.text }]}>
              Did you complete this task?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.error }]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {showAnimation && (
            <Animated.View
              style={[
                styles.animationContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                },
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={80}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={[styles.pointsText, { color: theme.colors.text }]}>
                +50 points!
              </Text>
            </Animated.View>
          )}
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
    width: "80%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "100%",
  },
  hidden: {
    display: "none",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  animationContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  pointsText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },
});
