import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import theme from '../../../theme/theme.js';
import Icon from 'react-native-vector-icons/FontAwesome'
import { button_text } from '../../../../constants.js';

const CardTable = ({
    Cardrows,
    item,
    onDelete,
    onEdit,
    style
}) => {
    return (
        <Card style={style.card}>
            <Card.Content>
                {Cardrows.map((row, rowIndex) => (
                    row.key !== item.monedamonto && item[row.key] && <View key={rowIndex} style={style.descriptionRow}>
                        <Text style={style.description}>{row.label}</Text>
                        <Text style={style.descriptionItem}>
                            {row.render
                                ? row.render(item[row.key])
                                : item[row.key]
                            }
                        </Text>
                    </View>
                ))}
                <View>
                    <Card.Actions>
                        <View>
                            <Icon.Button
                                backgroundColor={theme.colors.primary}
                                color={theme.colors.white}
                                name={theme.icons.editar}
                                onPress={() => onEdit(item)}
                            >{button_text.edit}
                            </Icon.Button>
                        </View>
                        <View>
                            <Icon.Button
                                backgroundColor={theme.colors.white}
                                color={theme.colors.primary}
                                name={theme.icons.borrar}
                                onPress={() => onDelete(item)}
                            >{button_text.delete}
                            </Icon.Button>
                        </View>
                    </Card.Actions>
                </View>
            </Card.Content>
        </Card >
    )
}
export default CardTable