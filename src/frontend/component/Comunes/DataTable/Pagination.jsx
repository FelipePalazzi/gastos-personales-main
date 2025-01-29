import React from 'react';
import { View } from 'react-native';
import { DataTable } from 'react-native-paper';
import theme from '../../../theme/theme.js';
import { alerts, symbols, pagina } from '../../../../constants.js';
import { styleComun } from '../../../styles/styles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js'

const Pagination = ({
    page,
    numberOfPages,
    onPageChange,
    onItemsPerPageChange,
    numberOfItemsPerPageList,
    pageSize,
    handleSubmit,
    style,
    IconHandleSumbit,
    textIconSumbit,
}) => {
    return (
        <View style={{ backgroundColor: theme.colors.white }}>
            <DataTable.Pagination
                page={page}
                numberOfPages={numberOfPages}
                onPageChange={onPageChange}
                label={`${pagina.nombre} ${page + 1} ${symbols.de} ${numberOfPages}`}
                onItemsPerPageChange={onItemsPerPageChange}
                selectPageDropdownLabel={alerts.cantidad}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={pageSize}
                style={style.pagination}
            />
            {handleSubmit && <View style={styleComun.agregar.container}>
                <Icon.Button
                    backgroundColor={theme.colors.white}
                    name={IconHandleSumbit ? IconHandleSumbit : 'plus'}
                    onPress={handleSubmit}
                    style={{
                        paddingHorizontal: 180,
                    }}
                    color={theme.colors.primary}
                    iconStyle={{ marginRight: textIconSumbit? 10 : 0 }}
                >
                    {textIconSumbit ? textIconSumbit : null}
                </Icon.Button>
            </View>}
        </View>
    )
}
export default Pagination