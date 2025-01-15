import React from 'react';
import { View } from 'react-native';
import { DataTable, FAB } from 'react-native-paper';
import theme from '../../../theme/theme.js';
import { alerts, symbols, pagina } from '../../../../constants.js';
import { styleComun, styleBusquedaAvanzada } from '../../../styles/styles.js';
import Icon from 'react-native-vector-icons/FontAwesome'

const Pagination = ({
    data,
    page,
    numberOfPages,
    onPageChange,
    onItemsPerPageChange,
    numberOfItemsPerPageList,
    numberOfItemsPerPage,
    handleSubmit,
    tipo,
    style,
    navigation,
    keyId
}) => {
    return (
        <View style={{backgroundColor:theme.colors.white}}>
            <DataTable.Pagination
                page={page}
                numberOfPages={numberOfPages}
                onPageChange={onPageChange}
                label={`${pagina.nombre} ${page + 1} ${symbols.de} ${numberOfPages}`}
                onItemsPerPageChange={onItemsPerPageChange}
                selectPageDropdownLabel={alerts.cantidad}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={numberOfItemsPerPage}
                style={style.pagination}
            />
            <View style={styleComun.agregar.container}>
                <Icon.Button
                    backgroundColor={theme.colors.white}
                    name={'plus'}
                    onPress={handleSubmit}
                    style={{
                        paddingHorizontal: 180,
                    }}
                    color={theme.colors.primary}
                    iconStyle={{ marginRight: 0 }} // Ajusta el margen del ícono
                />
            </View>
        </View>
    )
}
export default Pagination