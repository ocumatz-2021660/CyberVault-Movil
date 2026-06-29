import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Animated, Dimensions, Modal, } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../constants/theme";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useSettingsStore, AVAILABLE_CURRENCIES } from "../../store/settingStore";
import { User, DollarSign, ChevronRight, LogOut, ArrowLeft, CircleDot, Circle, } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const POPOVER_WIDTH = SCREEN_WIDTH * 0.55;

const HeaderMenu = ({ visible, onClose, navigation }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const { logout } = useAuth();
    const { currency, setCurrency } = useSettingsStore();
    const [showCurrencies, setShowCurrencies] = useState(false);

    useEffect(() => {
        if (visible) {
            setShowCurrencies(false);
            Animated.parallel([
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 8,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handlePerfil = () => {
        onClose();
        navigation?.navigate("Profile");
    };

    const handleLogout = () => {
        onClose();
        logout();
    };

    const handleSelectCurrency = (code) => {
        setCurrency(code);
        setShowCurrencies(false);
    };

}
