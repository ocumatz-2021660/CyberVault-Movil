import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../../constants/theme";

const styles = StyleSheet.create({
    button: {
        paddingVertical: SPACING.md, // (16)
        borderRadius: SPACING.xl, //(32)
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: COLORS.primary
    },
    button_Secondary: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: COLORS.primary
    },
    text_Base: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700"
    },
    text_primary: {
        color: COLORS.surface //blanco
    },
    text_secundary: {
        color: COLORS.primary //verde principal
    },
    text_other:{
        backgroundColor: COLORS.text_secondary //gris
    },
     button_Disabled: {
    opacity: 0.6,
  },
    
});

const Button = ({
    title, 
    onPress,
    loading = false,
    style,
    variant = "primary",
    ...props    
}) => {
    const isSecondary = variant === "secondary"
    const isOther = variant === "other"
    return (
        <TouchableOpacity        
            style={[
                styles.button,   
                //para usos de variantes (transparente y borde verde o fondo verde y letras blancas)
                isSecondary && styles.button_Secondary,                
                loading && styles.button_Disabled,
                style,
            ]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={isSecondary ? COLORS.surface : COLORS.text_primary}
                />
            ) : (
                <Text
                    style={[
                    styles.text_btn,
                    isSecondary ? styles.text_secundary : styles.text_primary
                    ]}
                >
                    {title}
                </Text>
            )
        }
        </TouchableOpacity>
    )    
}

export default Button;