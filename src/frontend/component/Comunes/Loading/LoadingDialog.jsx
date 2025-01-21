import { Portal, Dialog, ActivityIndicator, Text } from "react-native-paper"
import { View } from "react-native"
import theme from "../../../theme/theme"
import { styleLoading } from "../../../styles/styles"

const LoadingDialog = () => {
    return (
        <Portal>
            <Dialog visible={true} style={{ backgroundColor: theme.colors.white, paddingBottom: 25, paddingTop: 15 }}>
                <ActivityIndicator color={theme.colors.primary} size={'large'} />
                <View style={[styleLoading.loadingContainer,{height:null, width:null}]}>
                    <Text style={styleLoading.loadingText}>
                        Cargando
                    </Text>
                </View>
            </Dialog>
        </Portal>
    )
}
export default LoadingDialog