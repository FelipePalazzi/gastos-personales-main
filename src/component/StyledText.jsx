import react from "react"
import {Text, StyleSheet} from "react-native"
import theme from '../theme.js'

const styles=StyleSheet.create ({
    text: {
        fontSize:theme.fontSizes.body,
        color: theme.colors.textPrimary,
        fontFamily: theme.fonts.main,
        fontWeight: theme.fontWeights.normal
    },
    colorPrimary: {
        color:theme.colors.primary
    },
    colorSecondary: {
        color:theme.colors.textSecondary
    },
    bold: {
        fontWeight: theme.fontWeights.bold
    },
    subheading: {
        fontSize:theme.fontSizes.subheading
    },
    textAlignCenter: {
        textAlign: 'center',
        paddingVertical: 250,
    },

})
export default function StyledText({children, alignText, color, fontSize, fontWeight,style, ...restOfProps}) {
    const textStyles = [
        styles.text,
        color === 'primary' && styles.colorPrimary,
        color === 'secondary' && styles.colorSecondary,
        fontSize === 'subheading' && styles.fontSize.subheading,
        fontWeight === 'bold' && styles.bold,
        alignText === 'center' && styles.textAlignCenter,
        style
    ]
    return (
        <Text style={textStyles} {... restOfProps}>
            {children}
        </Text>
    )

}