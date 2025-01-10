import React from 'react';
import { View } from 'react-native';
import { DataTable, FAB } from 'react-native-paper';
import theme from '../../../theme/theme.js';
import { alerts, symbols, pagina } from '../../../../constants.js';
import { styleComun } from '../../../styles/styles.js';

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
    style
}) => {
    return (
        <View>
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
            <View style={styleComun.fab}>
                <FAB
                    color={theme.colors.white}
                    backgroundColor={theme.colors.agregar}
                    icon={theme.icons.agregar}
                    onPress={() => handleSubmit(data)}
                />
            </View>
        </View>
    )
}
export default Pagination