import { View, Text } from "react-native"
import { ActivityIndicator } from 'react-native-paper'
import theme from "../../../theme/theme"
import { styleLoading } from "../../../styles/styles"
import { alerts } from "../../../../constants"

const LoadingScreen = ({Nombre}) => {
    return (
        <View style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
            <View style={{ marginTop: 160, marginHorizontal: 10, backgroundColor: theme.colors.white, borderColor: theme.colors.gray, borderRadius: 5, borderWidth: 2, paddingBottom: 170 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 160 }}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
                    <Text style={styleLoading.loadingText}>{alerts.cargando} {Nombre} ...</Text>
                </View>
            </View>
        </View>
    )
}
export default LoadingScreen