import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { TextInput, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { symbols, button_text, alerts, pagina } from '../../../constants';
import { styleForm, } from '../../styles/styles';
import theme from '../../theme/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { PAGINA_URL } from '@env';
import { styleLoading, screenWidth } from '../../styles/styles.js';
import { useAuth } from '../../helpers/AuthContext';
import FaltanDatos from '../Comunes/Dialogs/FaltanDatos.jsx';
import Correcto from '../Comunes/Dialogs/CorrectoNavigation.jsx';
import Delete from '../Comunes/Dialogs/Delete.jsx';
import SearchDropdown from '../Comunes/Busqueda/SearchDropdown';
import useGetKeys from '../../hooks/useGetKeys';

const AMBKeys = ({ navigation }) => {
    const route = useRoute();
    const { labelHeader } = route.params;
    const { accessToken, refreshToken } = useAuth()
    const [item, setItem] = useState({ activo: true });
    const [itemid, setItemid] = useState(null);
    const [ABM, setABM] = useState('crear');
    const [selectedItem, setSelectedItem] = useState(false);
    const [changeItem, setChangeItem] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleOK, setvisibleOK] = useState(false);
    const [visibleDelete, setvisibleDelete] = useState(false);
    const [visibleOKDelete, setvisibleOKDelete] = useState(false);
    const [message, setMessage] = useState([]);
    const [keys, setKeys] = React.useState([]);
    const {getkeys, loading, fetchGetKeys} = useGetKeys();

    useEffect(() => {
        setKeys(getkeys.map(item => ({ id: item.id_key, nombre: item.nombre, descripcion: item.descripcion, activo: item.activo })));
    }, [getkeys]);

    const entidades = useMemo(() => [{ key: 'id', label: 'Cuentas', data: keys, icon: 'tag' }],
        [keys]);

    const handleChange = (field, value) => {
        setItem((prev) => ({ ...prev, [field]: value }))
        setSelectedItem(true);
    };

    const updateItemProperty = (key, value) => {
        setItem(prevItem => ({
            ...prevItem,
            [key]: value,
        }));
        setChangeItem(true);
    };
    const renderEntity = (atributo) => {
        const { key, label, data, icon } = atributo;
        return (
            <View key={key}>
                {ABM !== 'crear' &&
                    <SearchDropdown
                        options={data
                            .filter(option => ABM === 'modificar' ? option.activo : true)
                            .map(option => ({ nombre: option.nombre, activo: option.activo }))}
                        placeholder={label}
                        value={data.find(option => option.id === item[key])?.nombre}
                        onSelect={(selectedName) => {
                            const selectedOption = data.find(option => option.nombre === selectedName.nombre);
                            if (selectedOption) {
                                setItemid(selectedOption.id);
                                handleChange('nombre', selectedOption.nombre);
                                handleChange('descripcion', selectedOption.descripcion || '');
                                handleChange('activo', selectedOption.activo);
                            }
                        }}
                        onClear={() => { handleChange(key, null) }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={icon}
                    />}
                {ABM !== 'archivar' &&
                    <>
                        <TextInput
                            mode='outlined'
                            value={item.nombre || ''}
                            onChangeText={(value) => updateItemProperty('nombre', value)}
                            placeholder={`Nombre`}
                            style={{
                                marginRight: 0,
                                width: screenWidth - 40,
                                backgroundColor: item[key] ? theme.colors.primary : theme.colors.white,
                                height: 38,
                                paddingVertical: 10,
                                color: theme.colors.white,
                                marginBottom:20,
                            }}
                            outlineStyle={{ borderColor: ABM === 'archivar' ? theme.colors.disabled : theme.colors.primary, borderRadius: 27 }}
                            disabled={ABM === 'archivar'}
                            label={'Nombre'}
                            textColor={item[key] ? theme.colors.white : theme.colors.primary}
                            outlineColor={item[key] ? theme.colors.white : theme.colors.primary}
                            activeOutlineColor={item[key] ? theme.colors.white : theme.colors.primary}
                            theme={{ colors: { onSurfaceVariant: item[key] ? theme.colors.white : theme.colors.primary } }}
                        />
                        <TextInput
                            mode='outlined'
                            value={item.descripcion || ''}
                            onChangeText={(value) => updateItemProperty('descripcion', value)}
                            placeholder={`Descripcion${symbols.space}${button_text.opcional}`}
                            style={{
                                marginRight: 0,
                                width: screenWidth - 40,
                                backgroundColor: item[key] ? theme.colors.primary : theme.colors.white,
                                height: 38,
                                paddingVertical: 10,
                                color: theme.colors.white
                            }}
                            outlineStyle={{ borderColor: ABM === 'archivar' ? theme.colors.disabled : theme.colors.primary, borderRadius: 27 }}
                            disabled={ABM === 'archivar'}
                            label={'Descripcion'}
                            textColor={item[key] ? theme.colors.white : theme.colors.primary}
                            outlineColor={item[key] ? theme.colors.white : theme.colors.primary}
                            activeOutlineColor={item[key] ? theme.colors.white : theme.colors.primary}
                            theme={{ colors: { onSurfaceVariant: item[key] ? theme.colors.white : theme.colors.primary } }}
                        />
                    </>}
            </View>
        );
    }

    const handleSubmit = async () => {
        if (!changeItem) {
            setMessage('No se ingreso ningun valor')
            setVisible(true)
            return
        }
        try {
            const url = `${PAGINA_URL}${symbols.barra}${pagina.pagina_key}${symbols.barra}`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'refresh-token': refreshToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            });

            if (response.ok) {
                setMessage(`Se creo correctamente`)
                setvisibleOK(true)
            } else {
                alert("Error al enviar los datos");
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con la API");
        }
    };

    const handleModify = async () => {
        if (!selectedItem && !changeItem) {
            setMessage('No se ingreso ningun valor')
            setVisible(true)
            return;
        }
        try {
            const url = `${PAGINA_URL}${symbols.barra}${pagina.pagina_key}${symbols.barra}${itemid}`
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'refresh-token': refreshToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });

            if (response.ok) {
                setMessage(`Se Modifico correctamente`)
                setvisibleOK(true)
            } else {
                alert('Error al modificar la entidad');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con la API');
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) {
            setMessage('Selecciona un valor')
            setVisible(true)
            return;
        }
        try {
            const url = `${PAGINA_URL}${symbols.barra}${pagina.pagina_key}${symbols.barra}${itemid}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'refresh-token': refreshToken
                },
            });

            if (response.ok) {
                setvisibleDelete(false)
                setMessage(`Se ${item.activo ? 'Archivo' : 'Desarchivo'} correctamente`)
                setvisibleOKDelete(true)
            } else {
                alert('Error al eliminar la entidad');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con la API');
        }
    };

    return (
        <>
            {getkeys.lenght > 0 ? (
                <View style={styleLoading.loadingContainer}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
                    <Text style={styleLoading.loadingText}>{alerts.cargando} datos...</Text>
                </View>
            ) : (
                <>
                    <SegmentedButtons
                        value={ABM}
                        onValueChange={setABM}
                        style={{ marginHorizontal: 20, marginTop:20 }}
                        buttons={[
                            {
                                value: 'crear',
                                label: 'Crear',
                                icon: theme.icons.save,
                                checkedColor: theme.colors.white,
                                uncheckedColor: theme.colors.primary,
                                style: { backgroundColor: ABM === 'crear' ? theme.colors.primary : theme.colors.white }
                            },
                            {
                                value: 'modificar',
                                label: 'Modificar',
                                icon: theme.icons.editar,
                                checkedColor: theme.colors.white,
                                uncheckedColor: theme.colors.primary,
                                style: { backgroundColor: ABM === 'modificar' ? theme.colors.primary : theme.colors.white }
                            },
                            {
                                value: 'archivar',
                                label: 'Archivar',
                                icon: theme.icons.borrar,
                                checkedColor: theme.colors.white,
                                uncheckedColor: theme.colors.primary,
                                style: { backgroundColor: ABM === 'archivar' ? theme.colors.primary : theme.colors.white }
                            },
                        ]}
                    />
                    {/* Contenido de la lista */}
                    <FlatList
                        data={entidades}
                        renderItem={({ item }) => renderEntity(item)}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={true}
                        style={{ flex: 1, margin: 20 }}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="handed"
                    />
                    {/* Vistas modales */}
                    <FaltanDatos visible={visible} setVisible={setVisible} message={message} />
                    <Correcto visible={visibleOK} setVisible={setvisibleOK} navigation={navigation} goBack={true} message={message} />
                    <Delete
                        visible={visibleDelete}
                        setVisible={setvisibleDelete}
                        handleDelete={handleDelete}
                        visibleOk={visibleOKDelete}
                        setVisibleOk={setvisibleOKDelete}
                        archivar={item.activo}
                        navigation={navigation}
                        goBack={true}
                    />

                    {/* Botones de acción */}
                    <View style={styleForm.rowButton}>
                        <View style={styleForm.button}>
                            <Icon.Button backgroundColor={theme.colors.white} color={theme.colors.primary} name={theme.icons.close} onPress={() => navigation.goBack({ refresh: true })}>
                                {button_text.cancel}
                            </Icon.Button>
                        </View>
                        {ABM !== 'archivar' && (
                            <View style={styleForm.button}>
                                <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={theme.icons.save} onPress={ABM === 'modificar' ? handleModify : handleSubmit}>
                                    {button_text.sumbit}
                                </Icon.Button>
                            </View>
                        )}
                        {ABM === 'archivar' && (
                            <View style={styleForm.button}>
                                <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={theme.icons.borrar} onPress={() => setvisibleDelete(true)}>
                                    {item.activo ? button_text.archivar : button_text.desarchivar}
                                </Icon.Button>
                            </View>
                        )}
                    </View>
                </>
            )}
        </>

    );
};

export default AMBKeys;
