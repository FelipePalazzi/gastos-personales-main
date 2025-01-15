import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { DataTable, ActivityIndicator, Card } from 'react-native-paper';
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
    onDelete
}) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={true}
            vertical
            style={[styleComun.scroll,{backgroundColor:theme.colors.white}]}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
            <View style={style.container}>
                {
                    loading ? (
                        <View style={styleLoading.loadingContainer}>
                            <ActivityIndicator animating={true} color={style.colorLoading} size={theme.icons.big} />
                            <Text style={[styleLoading.loadingText, { color: style.colorLoading }]}>{alerts.cargando} {atributos[tipoMovimiento]}...</Text>
                        </View>
                    ) : (
                        data.length > 0 ? (
                            <DataTable>
                                {data.slice(page * pageSize, (page + 1) * pageSize).map((item, index) => (
                                    <React.Fragment key={index}>
                                        <DataTable.Row
                                            style={[style.row, expanded[item.id] && style.expandedrow]}
                                            onPress={() => onRowClick(item.id, index)}
                                        >
                                            {columns.map((col, colIndex) => (
                                                <DataTable.Cell
                                                    key={colIndex}
                                                    textStyle={style.textRowTable}
                                                    style={col.key === 'fecha' ? { marginHorizontal: 10, marginStart: 20 } : null}
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
                                            <CardTable Cardrows={Cardrows} item={item} onDelete={()=> onDelete(item)} onEdit={() =>onEdit(item)} style={style} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </DataTable>
                        ) : (
                            <View style={style.SinDatoscontainer}>
                                <Text style={style.SinDatos}>Sin coincidencias</Text>
                            </View>
                        )
                    )
                }

            </View>
        </ScrollView>
    )
}
export default Rows