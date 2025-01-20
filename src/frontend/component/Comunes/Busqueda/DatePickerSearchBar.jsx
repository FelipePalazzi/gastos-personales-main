import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment';
import 'moment/locale/es';
import theme from '../../../theme/theme';

const DatePickerSearchBar = ({
    placeholder = "Seleccionar fecha",
    value = "",
    onSelect = () => { },
    style = {},
    searchbarStyle = {},
    onClear = () => { },
    deleteMode,
}) => {
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value);

    useEffect(() => {
        setSelectedDate(value);
    }, [value]);

    const handleOpenDatePicker = () => {
        setDatePickerVisible(true);
    };

    const handleConfirmDate = (event, date) => {
        setDatePickerVisible(false)
        if (event.type === 'set' && date) {
            const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
            setSelectedDate(formattedDate);
            onSelect(formattedDate);
        }
    };
    const handleClear = () => {
        setDatePickerVisible(false);
        setSelectedDate(null);
        onClear();
    };
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={!deleteMode ? handleOpenDatePicker : null} disabled={deleteMode}>
                {deleteMode && (
                    <TouchableOpacity
                        style={styles.overlayButton}
                        disabled={true}
                        onPress={null}
                    />
                )}
                <View style={[styles.searchbarContainer]}>
                    {selectedDate ? (
                        <Text style={styles.label}>Fecha:</Text>
                    ) : null}
                    <Searchbar
                        placeholder={placeholder}
                        value={selectedDate ? moment(selectedDate).utc().format('LL') : null}
                        editable={false}
                        style={[
                            selectedDate ? styles.selectedSearchbar : styles.searchbar,
                            searchbarStyle
                        ]}
                        icon="calendar"
                        iconColor={selectedDate ? theme.colors.white : theme.colors.primary}
                        placeholderTextColor={selectedDate ? theme.colors.white : theme.colors.primary}
                        inputStyle={{
                            color: selectedDate ? theme.colors.white : theme.colors.primary
                        }}
                        onClearIconPress={handleClear}
                        clearIcon={deleteMode}
                    />
                </View>
            </TouchableOpacity>
            {datePickerVisible && (
                <DateTimePicker
                    value={selectedDate ? moment(selectedDate).toDate() : new Date()}
                    mode="date"
                    onChange={handleConfirmDate}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    searchbarContainer: {
        position: 'relative',
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
    searchbar: {
        backgroundColor: theme.colors.white,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        marginBottom: 10,
    },
    selectedSearchbar: {
        backgroundColor: theme.colors.primary,
        borderWidth: 2,
        borderColor: theme.colors.white,
        marginBottom: 10,
    },
    overlayButton: {
        position: 'absolute', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
});

export default DatePickerSearchBar;
