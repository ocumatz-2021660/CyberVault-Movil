import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../../constants/theme";
import HeaderMenu from "./HeaderMenu";
import { useSettingsStore } from "../../store/settingStore";
import { Wallet, Menu } from "lucide-react-native";