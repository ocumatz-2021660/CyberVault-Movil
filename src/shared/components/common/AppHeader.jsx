import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../../constants/theme";
import HeaderMenu from "./HeaderMenu";
import { useSettingsStore } from "../../store/settingStore";
import { Wallet, Menu } from "lucide-react-native";

const AppHeader = ({ navigation }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const { currency } = useSettingsStore();

    return (
        <>
            <View style={styles.header}>
                <View style={styles.logoWrapper}>
                    <Wallet size={20} color={COLORS.surface} />
                    <Text style={styles.currencyBadge}>{currency}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => setMenuVisible(true)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Menu size={28} color={COLORS.text_primary} />
                </TouchableOpacity>
            </View>
            <HeaderMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                navigation={navigation}
            />
        </>
    );
};