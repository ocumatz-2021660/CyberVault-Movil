import { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_TYPE, FONT_SIZE, SHADOWS } from "../../constants/theme";

const Input = ({label, error, icon, ...props})=>{

    const [isFocused, setIsFocused] = useState(false);
    const styles = StyleSheet.create({
    
        container: {
            marginBottom: SPACING.md,
            width: "100%",
        },
        label: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            color: COLORS.text_secondary,
            marginBottom: SPACING.xs,  
            
        },
        inputContainer:{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 8,
            paddingHorizontal: SPACING.md,
            
        },
        input: {
            flex: 1,
            paddingVertical: SPACING.sm,
            fontSize: FONT_SIZE.md,
            color: COLORS.text_secondary,
            outlineStyle: "none",
        },
        icon:{
            marginRight: SPACING.sm,
            justifyContent: "center",
            alignItems: "center",
        },
        inputFocused: {
            borderColor: COLORS.primary, 
        },
        inputError: {
            borderColor: COLORS.primary_dark,
            ...SHADOWS.error,
        },
        textError: {
            color: COLORS.error,
            fontSize: FONT_SIZE.xs,
            fontWeight: "700",
            marginTop: SPACING.xs,
        },        
    });

    return(
        <View
            style={styles.container}    
        >
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, !!error && styles.inputError]}>
                {icon && (
                    <View style={styles.icon}>
                        {icon}
                    </View>
                )}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={COLORS.text_secondary}
                    underlineColorAndroid="transparent"
                    onFocus={(e) => {
                        setIsFocused(true);
                        if (onFocus) onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        if (onBlur) onBlur(e);
                    }}
                    {...props}
                />
            </View>            
            {!!error && <Text style={styles.textError}>{error}</Text>}
        </View>
    );
};
export default Input;