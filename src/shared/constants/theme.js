
//la cantidad de espaciado que se va a trabajar
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};
//es el tamaño de las letras
export const FONT_SIZE = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    huge: 32,
};
//colores para el proyecto xd
export const COLORS = {
    primary: "#2d6a4f",//verde menta (general de las cosas)
    text_primary: "#1e293b",
    text_secondary: "#64748b",
    primary_dark: "#1a3a2a",
    primary_light: "#40916c",
    background: "#f5f7fa",
    surface: "#ffffff",
    border: "#e2e8f0",
    error: "#ff0000",
    light_error: "#fad2d2",
    light_primary: "#cbedde"
}

export const FONT_TYPE = {
    outfit: "Outfit-Regular", 
    outfitBold: "Outfit-Bold",
    inter: "Inter-Regular",
    interMedium: "Inter-Medium",
}

export const SHADOWS = {
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { top: 1, bottom: 1, right: 1, left: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    error: {
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.15,
        elevation: 8,
    }
};