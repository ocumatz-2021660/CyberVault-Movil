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
        navigation?.navigate("Home", { screen: "Profile" });
    };

    const handleLogout = () => {
        onClose();
        logout();
    };

    const handleSelectCurrency = (code) => {
        setCurrency(code);
        setShowCurrencies(false);
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    styles.popover,
                    { transform: [{ scale }], opacity },
                ]}
            >
                {!showCurrencies ? (
                    <>
                        <TouchableOpacity style={styles.menuItem} onPress={handlePerfil}>
                            <User size={20} color={COLORS.text_primary} />
                            <Text style={styles.menuItemText}>Perfil</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => setShowCurrencies(true)}>
                            <DollarSign size={20} color={COLORS.text_primary} />
                            <Text style={styles.menuItemText}>Moneda: {currency}</Text>
                            <ChevronRight size={20} color={COLORS.text_secondary} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <LogOut size={20} color={COLORS.error} />
                            <Text style={[styles.menuItemText, { color: COLORS.error }]}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity style={styles.menuItem} onPress={() => setShowCurrencies(false)}>
                            <ArrowLeft size={20} color={COLORS.text_primary} />
                            <Text style={styles.menuItemText}>Moneda</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        {AVAILABLE_CURRENCIES.map((c) => (
                            <TouchableOpacity
                                key={c.code}
                                style={styles.menuItem}
                                onPress={() => handleSelectCurrency(c.code)}
                            >
                                {currency === c.code ? (
                                    <CircleDot size={20} color={COLORS.primary} />
                                ) : (
                                    <Circle size={20} color={COLORS.text_secondary} />
                                )}
                                <Text style={styles.menuItemText}>
                                    {c.symbol} {c.code} - {c.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    popover: {
        position: "absolute",
        top: 64,
        right: SPACING.sm,
        width: POPOVER_WIDTH,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        paddingVertical: SPACING.xs,
        ...SHADOWS.md,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SPACING.sm + 2,
        paddingHorizontal: SPACING.md,
        gap: SPACING.sm,
    },
    menuItemText: {
        flex: 1,
        fontSize: FONT_SIZE.md,
        color: COLORS.text_primary,
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.md,
    },
});

export default HeaderMenu;
