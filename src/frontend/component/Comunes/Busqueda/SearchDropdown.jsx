import React, { useState, useMemo, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import theme from '../../../theme/theme';
import { styleBusquedaAvanzada } from '../../../styles/styles';
import { BlurView } from '@react-native-community/blur';

const SearchDropdown = ({
    options = [],
    placeholder = "Buscar...",
    onSelect = () => { },
    style = {},
    searchbarStyle = {},
    value = "",
    onClear = () => { },
    icon = 'magnify'
}) => {
    const [searchQuery, setSearchQuery] = useState(value);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setSearchQuery(value);
    }, [value]);

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, options]);

    const handleOpenModal = () => {
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
    };

    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
    };

    const handleSelectOption = (option) => {
        setSearchQuery(option);
        setVisible(false);
        onSelect(option);
    };

    const handleClear = () => {
        setSearchQuery('');
        setVisible(false); // Asegura que el modal se cierre
        onClear();
    };
    const handleClearInside = () => {
        setSearchQuery('');
        onClear();
    };
console.log(filteredOptions)
    return (
        <View style={[styles.container, style]}>
            {/* "Botón" para abrir el modal */}
            <TouchableOpacity onPress={handleOpenModal}>
                <View style={[styles.searchbarContainer]}>
                    {searchQuery ? (
                        <Text style={styles.label}>{placeholder}:</Text>
                    ) : null}
                    <Searchbar
                        placeholder={placeholder}
                        value={searchQuery}
                        editable={false} // Hace que no sea editable, actuando como un botón
                        style={[
                            searchQuery ? styles.modalSearchbar : styles.searchbar, // Cambia el estilo según `searchQuery`
                            searchbarStyle,
                        ]}
                        iconColor={searchQuery ? theme.colors.white : theme.colors.primary}
                        placeholderTextColor={searchQuery ? theme.colors.white : theme.colors.primary}
                        inputStyle={{ color: searchQuery ? theme.colors.white : theme.colors.primary }}
                        onClearIconPress={handleClear} // Borra el valor y cierra el modal
                        icon={icon}
                    />
                </View>
            </TouchableOpacity>
            {/* Modal para la búsqueda */}
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={handleCloseModal} // Permite cerrar el modal con el botón de atrás
            >
                <BlurView
                    style={styleBusquedaAvanzada.blurView}
                    blurType="light"
                    blurAmount={5}
                >
                    <TouchableWithoutFeedback onPress={handleCloseModal}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.title}>
                                <Text style={[styleBusquedaAvanzada.closeButtonText, {color:theme.colors.white}]}>{placeholder}</Text>
                            </View>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    {/* Searchbar dentro del modal */}
                                    <View style={[styles.searchbarContainer]}>
                                        {searchQuery ? (
                                            <Text style={styles.labelRight}>Borrar</Text>
                                        ) : null}
                                        <Searchbar
                                            placeholder={placeholder}
                                            value={searchQuery}
                                            onChangeText={handleSearchQueryChange}
                                            onClearIconPress={handleClearInside}
                                            style={[
                                                searchQuery ? styles.modalSearchbar : styles.searchbar, // Cambia el estilo según `searchQuery`
                                                searchbarStyle,
                                            ]}
                                            iconColor={searchQuery ? theme.colors.white : theme.colors.primary}
                                            placeholderTextColor={searchQuery ? theme.colors.white : theme.colors.primary}
                                            inputStyle={{ color: searchQuery ? theme.colors.white : theme.colors.primary }}
                                            icon={icon}
                                        />
                                    </View>
                                    {/* Lista de opciones */}
                                    {filteredOptions && filteredOptions.length > 0  ? (
                                        <FlatList
                                        data={filteredOptions}
                                        keyExtractor={(item, index) => `${item}-${index}`}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => handleSelectOption(item)}
                                                style={styles.dropdownItem}
                                            >
                                                <Text style={styles.dropdownText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                        keyboardShouldPersistTaps="handled"
                                        nestedScrollEnabled
                                        showsVerticalScrollIndicator
                                    />)
                                : (<View style={styles.noDataContainer}>
                                    <Text style={styles.noDataText}>No hay datos disponibles</Text>
                                </View>)}
                                    <TouchableOpacity onPress={handleCloseModal} style={styleBusquedaAvanzada.closeButton}>
                                        <Text style={styleBusquedaAvanzada.closeButtonText}>Cerrar</Text>
                                    </TouchableOpacity>

                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </BlurView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: theme.colors.white,
        borderRadius: 8,
        marginTop: 10,
    },
    noDataText: {
        fontSize: 16,
        color: theme.colors.primary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    container: {
        width: '100%',
    },
    searchbarContainer: {
        position: 'relative', // Permite posicionar el texto del label
        width: '100%',
    },
    label: {
        position: 'absolute',
        zIndex: 2,
        top: 0, 
        left: 15,
        fontSize: 12, 
        color: theme.colors.white, 
        paddingHorizontal: 5,
    },
    labelRight:{
        position: 'absolute',
        zIndex: 2,
        top: 6,
        right: 6, 
        fontSize: 12, 
        color: theme.colors.white, 
        paddingHorizontal: 5, 
    },
    title: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: theme.colors.white,
    },
    searchbar: {
        backgroundColor: theme.colors.white,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '70%',
        backgroundColor: theme.colors.white,
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalSearchbar: {
        marginBottom: 10,
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.gray,
    },
    dropdownText: {
        fontSize: 16,
        color: theme.colors.text,
    },
});

export default SearchDropdown;
