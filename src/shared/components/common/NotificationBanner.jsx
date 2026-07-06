import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react-native";
import { useNotificationStore } from "../../store/notificationStore";

const BANNER_CONFIG = {
  error: { bg: "#e74c3c", icon: AlertCircle },
  success: { bg: "#2ecc71", icon: CheckCircle },
  warning: { bg: "#f39c12", icon: AlertTriangle },
  info: { bg: "#3498db", icon: Info },
};

const NotificationBanner = () => {
  const { visible, message, type, duration, hideNotification } =
    useNotificationStore();
  const insets = useSafeAreaInsets();
  const [localVisible, setLocalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const timerRef = useRef(null);

  const config = BANNER_CONFIG[type] || BANNER_CONFIG.error;
  const Icon = config.icon;

  useEffect(() => {
    if (visible) {
      setLocalVisible(true);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible]);

  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setLocalVisible(false);
      hideNotification();
    });
  };

  if (!localVisible) return null;


  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      paddingBottom: 12,
      paddingHorizontal: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 20,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    icon: {
      flexShrink: 0,
    },
    message: {
      flex: 1,
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
      lineHeight: 20,
    },
    closeButton: {
      flexShrink: 0,
      padding: 4,
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          paddingTop: insets.top + 8,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Icon size={20} color="#fff" style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <X size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default NotificationBanner;
