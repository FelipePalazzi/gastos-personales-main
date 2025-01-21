import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { DataTable, ActivityIndicator } from 'react-native-paper';
import theme from '../../../theme/theme.js';
import { alerts, atributos } from '../../../../constants.js';
import { styleComun, styleLoading } from '../../../styles/styles.js';
import CardTable from './CardTable.jsx';

const Rows = ({
    data,
    expanded,
    onRowClick,
    columns,
    Cardrows,
    refreshing,
    onRefresh,
    loading,
    page,
    pageSize,
    style,
    tipoMovimiento,
    onEdit,
    boton1,
    onDelete,
    boton2,
    message
}) => {
    React.useEffect(() => {
    }, [data]);
    return (
        <ScrollView
            showsVerticalScrollIndicator={true}
            vertical
            style={[styleComun.scroll, { backgroundColor: theme.colors.white }]}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
            <View style={style.container}>
                {
                    loading ? (
                        <View style={styleLoading.loadingData}>
                            <ActivityIndicator animating={true} color={style.colorLoading} size={theme.icons.big} />
                            <Text style={[styleLoading.loadingText, { color: style.colorLoading }]}>{alerts.cargando} {atributos[tipoMovimiento]}...</Text>
                        </View>
                    ) : (
                        data.length > 0 ? (
                            <DataTable>
                                {data.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                        <DataTable.Row
                                            style={[style.row, expanded[item.id] && style.expandedrow]}
                                            onPress={() => onRowClick(item.id, index)}
                                        >
                                            {columns.map((col, colIndex) => (
                                                <DataTable.Cell
                                                    key={colIndex}
                                                    textStyle={style.textRowTable}
                                                    style={colIndex === 0 ? { marginHorizontal: 0, marginStart: 20 } : null}
                                                >
                                                    {col.render
                                                        ? (col.key === 'importe'
                                                            ? col.render(item[item.monedamonto])
                                                            : col.render(item[col.key]))
                                                        : item[col.key]
                                                    }
                                                </DataTable.Cell>
                                            ))}
                                        </DataTable.Row>
                                        {expanded[item.id] && (
                                            <CardTable
                                                Cardrows={Cardrows}
                                                item={item}
                                                onDelete={() => onDelete(item)}
                                                onEdit={() => onEdit(item)}
                                                style={style}
                                                boton1={boton1}
                                                boton2={boton2}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </DataTable>
                        ) : (
                            <View style={style.SinDatoscontainer}>
                                <Text style={style.SinDatos}>{message ? message : 'Sin coincidencias'}</Text>
                            </View>
                        )
                    )
                }

            </View>
        </ScrollView>
    )
}
export default Rows