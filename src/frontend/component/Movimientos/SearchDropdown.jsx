import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { styleSearchDropdown } from '../../styles/styles';

const SearchDropdown = ({
    options = [],
    placeholder = "Buscar...",
    onSelect = () => { },
    style = {},
    filterKey,
    setFilter,
    dropdownStyle = {},
    searchbarStyle = {},
    value = "",
}) => {
    const [searchQuery, setSearchQuery] = useState(value);
    const [visible, setVisible] = useState(false);

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return [];
        return options.filter(option =>
            option.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, options]);

    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
        setVisible(query.length > 0);
    };

    const handleSelectOption = (option) => {
        setSearchQuery(option);
        setVisible(false);
        onSelect(option);
    };

    const handleClear = () => {
        setSearchQuery('');
        setVisible(false);
        setFilter(filterKey, '');
    };

    return (
        <View style={[styleSearchDropdown.container, style]}>
            <Searchbar
                mode={'bar'}
                placeholder={placeholder}
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                style={[styleSearchDropdown.searchbar, searchbarStyle]}
                onClearIconPress={handleClear}
            />
            {visible && (
                <FlatList
                    data={filteredOptions}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    style={[styleSearchDropdown.dropdown, dropdownStyle]}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelectOption(item)}>
                            <Text style={styleSearchDropdown.dropdownItem}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default SearchDropdown;
