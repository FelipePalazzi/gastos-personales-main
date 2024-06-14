import react from "react"
import {View,StyleSheet, ScrollView, TouchableHighlight} from "react-native"
import StyledText from "./StyledText.jsx"
import Constants from 'expo-constants'
import theme from '../styles/theme.js'
import {Link, useLocation} from 'react-router-native'
import {pagina,symbols } from '../constants'

const styles = StyleSheet.create ({
    container: {
        backgroundColor: theme.appBar.primary,
        flexDirection: 'row',
        paddingTop: Constants.statusBarHeight + 10
    },
    scroll:{
        paddingBottom: 15
    },
    text: {
        color: theme.appBar.secondaryText,
        paddingHorizontal: 25
    },
    active: {
       color: theme.appBar.primaryText
    }
})
const AppBarTab = ({children,to}) => {
    const { pathname } = useLocation()
    const active = pathname === to

    const textStyles =[
        styles.text,
        active && styles.active
    ]
    return (
       <Link to={to} component={TouchableHighlight}>
            <StyledText fontWeight={theme.fontWeights.bold} style={textStyles}>
                {children}
            </StyledText>
       </Link>
    )
}

const AppBar = () => {
    return (
        <View style = {styles.container}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.scroll}>
                <AppBarTab to={`${symbols.barra}${pagina.pagina_resumen}`}>Resumen</AppBarTab>
                <AppBarTab to={`${symbols.barra}${pagina.pagina_ingreso}`}>Ingresos</AppBarTab>
                <AppBarTab to={`${symbols.barra}${pagina.pagina_gasto}`}>Gastos</AppBarTab>
            </ScrollView>
        </View>
    )
}

export default AppBar