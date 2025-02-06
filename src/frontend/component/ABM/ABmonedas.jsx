import React, { useState, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { TextInput, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { symbols, button_text, alerts, pagina } from '../../../constants';
import { styleComun, styleForm, } from '../../styles/styles';
import theme from '../../theme/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const PAGINA_URL_ENV  = process.env.PAGINA_URL
import { styleLoading, screenWidth } from '../../styles/styles.js';
import { getMonedas } from './monedasConfig';
import { useAuth } from '../../helpers/AuthContext';
import useMoneda from '../../hooks/useMoneda';
import useMonedasFaltantes from '../../hooks/useMonedasFaltantes';
import FaltanDatos from '../Comunes/Dialogs/FaltanDatos.jsx';
import Correcto from '../Comunes/Dialogs/CorrectoNavigation.jsx';
import Delete from '../Comunes/Dialogs/Delete.jsx';
import Error from '../Comunes/Dialogs/Error';
import SearchDropdown from '../Comunes/Busqueda/SearchDropdown';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;

const ABmonedas = ({ navigation }) => {
    const route = useRoute();
    const { labelHeader, entityType, keyId } = route.params;
    const { accessToken, refreshToken } = useAuth()
    const [item, setItem] = useState({ activo: true });
    const [itemid, setItemid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(false);
    const [changeItem, setChangeItem] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleOK, setvisibleOK] = useState(false);
    const [visibleDelete, setvisibleDelete] = useState(false);
    const [visibleOKDelete, setvisibleOKDelete] = useState(false);
    const [visibleError, setVisibleError] = useState(false);
    const [message, setMessage] = useState([]);
    const [AB, setAB] = useState('agregar');

    const { moneda } = useMoneda(keyId);
    const { monedasfaltantes } = useMonedasFaltantes(keyId)
    const [monedas, setMonedas] = React.useState([]);
    const [monedasFaltantes, setMonedasFaltantes] = React.useState([]);

    const [sinMonedas, setSinMonedas] = React.useState(false);

    React.useEffect(() => {
        setMonedas(moneda.map(item => ({ id: item.id_moneda, nombre: item.codigo_moneda, activo: item.moneda_activo })));
        (monedasfaltantes.length > 0 ?
            setMonedasFaltantes(monedasfaltantes.map(item => ({ id: item.id_monedas_posibles, nombre: item.nombre_monedas_posibles, codigo: item.codigo_monedas_posibles })))
            : setSinMonedas(true)
        )
    }, [keyId, moneda, monedasfaltantes]);

    const handleChange = (field, value) => {
        setItem((prev) => ({ ...prev, [field]: value }))
        setSelectedItem(true);
    };

    const entidades = useMemo(() => getMonedas({ monedas, monedasFaltantes }), [
        monedas,
        monedasFaltantes
    ]);

    const renderEntity = (atributo) => {
        const { key, label, data, icon } = atributo;
        return (
            <View key={key}>
                {AB === 'agregar' && key === 'id_moneda_faltante' &&
                    (monedasFaltantes.length > 0 ?
                        <SearchDropdown
                            options={data
                                .map(option => ({ nombre: `${option.codigo} - ${option.nombre}`, activo: true }))}
                            placeholder={`Seleccione moneda a agregar...`}
                            value={data.find(option => option.id === item[key])?.nombre}
                            onSelect={(selectedName) => {
                                const selectedOption = data.find(option => `${option.codigo} - ${option.nombre}` === selectedName.nombre);
                                if (selectedOption) {
                                    setItemid(selectedOption.id);
                                }
                            }}
                            onClear={() => { setItemid(null) }}
                            filterKey={key}
                            setFilter={setItem}
                            icon={icon}
                        />
                        : <Text style={[styleComun.title, { color: theme.colors.primary }]}>
                            Ya se agregaron todas las monedas posibles
                        </Text>
                    )}
                {AB === 'archivar' && key === 'id_moneda' &&
                    <SearchDropdown
                        options={data
                            .map(option => ({ nombre: option.nombre, activo: option.activo }))}
                        placeholder={`Seleccione ${label} a ${item.activo ? AB : `des${AB}`}`}
                        value={data.find(option => option.id === item[key])?.nombre}
                        onSelect={(selectedName) => {
                            const selectedOption = data.find(option => option.nombre === selectedName.nombre);
                            if (selectedOption) {
                                setItemid(selectedOption.id);
                                handleChange('nombre', selectedOption.nombre);
                                handleChange('activo', selectedOption.activo);
                            }
                        }}
                        onClear={() => { handleChange(key, null) }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={icon}
                    />}
            </View>
        );
    }

    const handleSubmit = async () => {
        if (!itemid) {
            setMessage('No se selecciono ningun valor')
            setVisible(true)
            return
        }
        try {
            const url = `${PAGINA_URL}${symbols.barra}${pagina.pagina_moneda}${symbols.barra}${keyId}`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'refresh-token': refreshToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_moneda: itemid }),
            });
            if (response.ok) {
                setMessage(`Se creo correctamente`)
                setvisibleOK(true)
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Error desconocido.');
                setVisibleError(true);
            }
        } catch (error) {
            console.error(error);
            const errorData = await response.json();
            setMessage(errorData.message || 'Error desconocido.');
            setVisibleError(true);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) {
            setMessage('Selecciona un valor')
            setVisible(true)
            return;
        }
        try {
            const url = `${PAGINA_URL}${symbols.barra}${pagina.pagina_moneda}${symbols.barra}${keyId}${symbols.barra}${itemid}`
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
                const errorData = await response.json();
                setMessage(errorData.message || 'Error desconocido.');
                setVisibleError(true);
            }
        } catch (error) {
            console.error(error);
            const errorData = await response.json();
            setMessage(errorData.message || 'Error desconocido.');
            setVisibleError(true);
        }
    };

    return (
        <>
            {!loading ? (
                <View style={styleLoading.loadingContainer}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
                    <Text style={styleLoading.loadingText}>{alerts.cargando} datos...</Text>
                </View>
            ) : (
                <><SegmentedButtons
                    value={AB}
                    onValueChange={setAB}
                    style={{ margin: 10 }}
                    buttons={[
                        {
                            value: 'agregar',
                            label: 'Agregar',
                            icon: theme.icons.save,
                            checkedColor: theme.colors.white,
                            uncheckedColor: theme.colors.primary,
                            style: { backgroundColor: AB === 'agregar' ? theme.colors.primary : theme.colors.white }
                        },
                        {
                            value: 'archivar',
                            label: 'Archivar',
                            icon: theme.icons.borrar,
                            checkedColor: theme.colors.white,
                            uncheckedColor: theme.colors.primary,
                            style: { backgroundColor: AB === 'archivar' ? theme.colors.primary : theme.colors.white }
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
                    <Error visibleError={visibleError} setVisibleError={setVisibleError} message={message} />

                    {/* Botones de acción */}
                    <View style={styleForm.rowButton}>
                        <View style={styleForm.button}>
                            <Icon.Button backgroundColor={theme.colors.white} color={theme.colors.primary} name={theme.icons.close} onPress={() => navigation.goBack({ refresh: true })}>
                                {button_text.cancel}
                            </Icon.Button>
                        </View>
                        {AB === 'agregar' && monedasFaltantes.length > 0 && (
                            <View style={styleForm.button}>
                                <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={theme.icons.save} onPress={handleSubmit}>
                                    {button_text.sumbit}
                                </Icon.Button>
                            </View>
                        )}
                        {AB === 'archivar' && (
                            <View style={styleForm.button}>
                                <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={theme.icons.borrar} onPress={() => (!selectedItem ?
                                    (setMessage('Selecciona un valor'), setVisible(true)) : setvisibleDelete(true))}>
                                {item.activo ? button_text.archivar : button_text.desarchivar}
                            </Icon.Button>
                            </View>
                        )}
                </View>
        </>
    )
}
        </>

    );
};

export default ABmonedas;
