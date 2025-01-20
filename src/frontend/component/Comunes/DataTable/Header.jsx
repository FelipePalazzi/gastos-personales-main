import React from 'react';
import { View, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import theme from '../../../theme/theme.js';
import { Feather } from '@expo/vector-icons'

const Header = ({
    columns,
    handleSort,
    getIcon,
    style
}) => {
    return (
        <View>
            <DataTable.Header style={style.headerRow}>
                {columns.map((col, index) => (
                    <DataTable.Title
                        key={index}
                        onPress={() => handleSort(col.key)}
                        textStyle={style.textTitleTable}
                    >
                        <Text>{col.label}</Text>
                        {col.sortable && (
                            <Feather name={getIcon(col.key)} size={theme.icons.ordenar} color={col.key === 'fecha' ? theme.colors.white : theme.colors.gray} />
                        )}
                    </DataTable.Title>
                ))}
            </DataTable.Header>
        </View>
    )
}
export default Header