import React, { useState, useEffect, useMemo, useRef } from 'react'
import { View, Text, ScrollView, Pressable, FlatList, KeyboardAvoidingView } from 'react-native'
import useCombinedData from '../../hooks/useCombinedData.js';
import { Picker } from '@react-native-picker/picker'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme'
import { ActivityIndicator, Dialog, Portal, TextInput, } from 'react-native-paper'
import moment from 'moment'
import 'moment/locale/es'
import { alerts, button_text, atributos, symbols, pagina } from '../../../constants'
import { styleForm, styleComun, screenWidth, styleLoading } from '../../styles/styles.js'
import { useRoute, useNavigation } from '@react-navigation/native';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;
import { useAuth } from '../../helpers/AuthContext.js';
import FaltanDatos from '../Comunes/Dialogs/FaltanDatos.jsx';
import Correcto from '../Comunes/Dialogs/Correcto.jsx';
import Delete from '../Comunes/Dialogs/Delete.jsx';
import SearchDropdown from '../Comunes/Busqueda/SearchDropdown.jsx';
import { getAtributosForm } from './formConfig.js';
import DatePickerSearchBar from '../Comunes/Busqueda/DatePickerSearchBar.jsx';
import CurrencyInput from 'react-native-currency-input';

const MovimientoForm = ({ routeParams }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const { itemParam, deleteMode, keyId, labelHeader } = route.params;
    const [item, setItem] = useState({ fecha: moment().format('YYYY-MM-DD HH:mm:ss'), ...itemParam });
    const [loading, setLoading] = useState(true);
    const { categoria, subcategoria, responsable, moneda, metodopago, submetodopago } = useCombinedData(keyId);
    const [visible, setVisible] = useState(false);
    const [visibleOK, setvisibleOK] = useState(false);
    const [visibleDelete, setvisibleDelete] = useState(false);
    const [visibleOKDelete, setvisibleOKDelete] = useState(false);
    const [message, setMessage] = useState([]);
    const { accessToken, refreshToken } = useAuth()
    const tipo = routeParams?.tipo || route.params?.tipo;
    const esEntrada = tipo === 'entradas';
    const esSalida = tipo === 'salidas';
    const RutaAnterior = esEntrada ? 'Ingresos' : 'Gastos';
    const [categorias, setCategorias] = React.useState([]);
    const [subcategorias, setSubcategorias] = React.useState([]);
    const [responsables, setResponsables] = React.useState([]);
    const [monedas, setMonedas] = React.useState([]);
    const [metodopagos, setMetodopagos] = React.useState([]);
    const [submetodopagos, setSubmetodopagos] = React.useState([]);

    React.useEffect(() => {
        if (itemParam) {
            updateItemProperty('monto', item[item.monedamonto])
            updateItemProperty('metodopago', item.id_metodopago)
            updateItemProperty('submetodopago', item.id_submetodopago)
        }
    }, [itemParam])
    React.useEffect(() => {
        setCategorias(categoria.map(item => ({ id: item.id_categoria, nombre: item.categoria })));
        setSubcategorias(subcategoria.map(item => ({
            id: item.id_subcategoria,
            nombre: item.subcategoria,
            id_categoria: item.id_categoria,
            id_responsable: item.id_responsable,
        })));
        setResponsables(responsable.map(item => ({ id: item.id_responsable, nombre: item.responsable })));
        setMonedas(moneda.map(item => ({ id: item.id_moneda, nombre: item.codigo_moneda })));
        setMetodopagos(metodopago.map(item => ({ id: item.id_metodopago, nombre: item.metodopago })));
        setSubmetodopagos(submetodopago.map(item => ({
            id: item.id_submetodo_pago,
            nombre: item.submetodo_pago,
            id_metodopago: item.id_metodopago
        })));
    }, [keyId, categoria, subcategoria, responsable, moneda, metodopago, submetodopago]);

    const atributosForm = useMemo(() => getAtributosForm(esEntrada, { categorias, subcategorias, responsables, monedas, metodopagos, submetodopagos }), [
        esEntrada,
        categorias,
        subcategorias,
        responsables,
        monedas,
        metodopagos,
        submetodopagos,
    ]);

    React.useEffect(() => {
        if (item.subcategoria) {
            const selectedSub = subcategorias.find(sub => sub.id === item.subcategoria);
            if (selectedSub) {
                updateItemProperty('categoria', selectedSub.id_categoria);
                updateItemProperty('responsable', selectedSub.id_responsable);
            }
        }
    }, [item.subcategoria]);

    React.useEffect(() => {
        if (item.submetodopago) {
            const selectedSub = submetodopagos.find(sub => sub.id === item.submetodopago);
            if (selectedSub) {
                updateItemProperty('metodopago', selectedSub.id_metodopago);
            }
        }
    }, [item.submetodopago]);

    const [value, setValue] = useState(Number(item.monto) || 0);

    useEffect(() => {
        // Si item.monto cambia, actualiza el valor
        setValue(Number(item.monto) || 0);
    }, [item.monto]);

    const renderInput = (atributo) => {
        const { key, label, renderType, data } = atributo;
        if (key === 'categoria') {
            return (
                <View key={key}>
                    <SearchDropdown
                        options={categorias.map(option => option.nombre)}
                        placeholder={label}
                        value={!itemParam ? categorias.find(option => option.id === item.categoria)?.nombre : item.categoria}
                        onSelect={(value) => {
                            const selected = categorias.find(option => option.nombre === value);
                            updateItemProperty('categoria', selected ? selected.id : null);
                            updateItemProperty('subcategoria', null);
                            updateItemProperty('responsable', null);
                        }}
                        onClear={() => {
                            updateItemProperty('categoria', null);
                            updateItemProperty('subcategoria', null);
                            updateItemProperty('responsable', null);
                        }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={'tag'}
                    />
                </View>
            );
        }

        if (key === 'subcategoria') {
            const filteredSubcategoria = item.categoria
                ? subcategorias.filter(sub => sub.id_categoria === item.categoria)
                : subcategorias;
            return (
                <View key={key}>
                    <SearchDropdown
                        options={filteredSubcategoria.map(option => option.nombre)}
                        placeholder={label}
                        value={!itemParam ? subcategorias.find(option => option.id === item.subcategoria)?.nombre : item.subcategoria}
                        onSelect={(value) => {
                            const selected = subcategorias.find(option => option.nombre === value);
                            updateItemProperty('subcategoria', selected ? selected.id : null);
                        }}
                        onClear={() => {
                            updateItemProperty('subcategoria', null);
                            updateItemProperty('responsable', null);
                        }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={'layers'}
                    />
                </View>
            );
        }

        if (key === 'responsable') {
            return (
                <View key={key}>
                    <SearchDropdown
                        options={responsables.map(option => option.nombre)}
                        placeholder={label}
                        value={!itemParam ? responsables.find(option => option.id === item.responsable)?.nombre : item.responsable}
                        onSelect={(value) => {
                            const selected = responsables.find(option => option.nombre === value);
                            updateItemProperty('responsable', selected ? selected.id : null);
                        }}
                        onClear={() => {
                            updateItemProperty('responsable', null);
                        }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={'account'}
                    />
                </View>
            );
        }

        if (key === 'metodopago') {
            return (
                <View key={key}>
                    <SearchDropdown
                        options={metodopagos.map(option => option.nombre)}
                        placeholder={label}
                        value={!itemParam ? metodopagos.find(option => option.id === item.metodopago)?.nombre : item.metododepago}
                        onSelect={(value) => {
                            const selected = metodopagos.find(option => option.nombre === value);
                            updateItemProperty('metodopago', selected ? selected.id : null);
                            updateItemProperty('submetodopago', null);
                        }}
                        onClear={() => {
                            updateItemProperty('metodopago', null);
                            updateItemProperty('submetodopago', null);
                        }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={'bank'}
                    />
                </View>
            );
        }

        if (key === 'submetodopago') {
            const filteredSubmetodopagos = item.metodopago
                ? submetodopagos.filter(sub => sub.id_metodopago === item.metodopago)
                : submetodopagos;
            return (
                <View key={key}>
                    <SearchDropdown
                        options={filteredSubmetodopagos.map(option => option.nombre)}
                        placeholder={label}
                        value={!itemParam ? submetodopagos.find(option => option.id === item.submetodo_pago)?.nombre : item.submetododepago}
                        onSelect={(value) => {
                            const selected = submetodopagos.find(option => option.nombre === value);
                            updateItemProperty('submetodopago', selected ? selected.id : null);
                        }}
                        onClear={() => {
                            updateItemProperty('submetodopago', null);
                        }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={'credit-card'}
                    />
                </View>
            );
        }
        if (renderType === 'textInput' || key === 'id_moneda_origen') {
            return (
                <View key={key} style={[styleComun.rowContainer, { marginBottom: 20, height: 55 }]}>
                    {renderType === 'textInput' && key !== 'monto' ?
                        <TextInput
                            mode='outlined'
                            value={item[key] || ''}
                            onChangeText={(value) => updateItemProperty(key, value)}
                            placeholder={`${label}${symbols.space}${button_text.opcional}`}
                            style={{
                                marginRight: 0,
                                width: screenWidth - 40,
                                backgroundColor: item[key] ? theme.colors.primary : theme.colors.white,
                                height: 38,
                                paddingVertical: 10,
                                color: theme.colors.white
                            }}
                            outlineStyle={{ borderColor: deleteMode ? theme.colors.disabled : theme.colors.primary, borderRadius: 27 }}
                            disabled={deleteMode}
                            label={label}
                            textColor={item[key] ? theme.colors.white : theme.colors.primary}
                            outlineColor={item[key] ? theme.colors.white : theme.colors.primary}
                            activeOutlineColor={item[key] ? theme.colors.white : theme.colors.primary}
                            theme={{ colors: { onSurfaceVariant: item[key] ? theme.colors.white : theme.colors.primary } }}
                        />
                        :
                        key === 'id_moneda_origen' ?
                            (<View style={[styleComun.rowContainer, { marginVertical: 20, height: 55 }]}>
                                <SearchDropdown
                                    key={key}
                                    options={data.map(option => option.nombre)}
                                    placeholder={label}
                                    onSelect={(value) => {
                                        const selected = data.find(option => option.nombre === value);
                                        updateItemProperty(key, selected ? selected.id : null);
                                    }}
                                    onClear={() => {
                                        updateItemProperty(key, null);
                                    }}
                                    value={
                                        data.find(option => option.id === item[key])?.nombre || item.monedamonto
                                    }
                                    filterKey={key}
                                    setFilter={setItem}
                                    style={{ width: screenWidth / 3, marginTop: 16 }}
                                    icon={'currency-usd'}
                                />
                                <TextInput
                                    value={item.monto || ''}
                                    mode='outlined'
                                    placeholder={label}
                                    style={{
                                        width: screenWidth / 3 * 2 - 50,
                                        marginLeft: 10,
                                        backgroundColor: item.monto ? theme.colors.primary : theme.colors.white,
                                        paddingVertical: 10,
                                        color: theme.colors.white,
                                        height: 38,
                                    }}
                                    outlineStyle={{
                                        borderColor: deleteMode ? theme.colors.disabled : theme.colors.primary,
                                        borderRadius: 27,
                                    }}
                                    disabled={deleteMode}
                                    keyboardType="numeric"
                                    label={label}
                                    textColor={item.monto ? theme.colors.white : theme.colors.primary}
                                    outlineColor={item.monto ? theme.colors.white : theme.colors.primary}
                                    activeOutlineColor={item.monto ? theme.colors.white : theme.colors.primary}
                                    theme={{ colors: { onSurfaceVariant: item.monto ? theme.colors.white : theme.colors.primary } }}
                                    render={(props) => (
                                        <CurrencyInput
                                            {...props}
                                            value={value || ''}
                                            onChangeValue={(value) => updateItemProperty('monto', value)}  // Guarda el valor numérico real
                                            prefix={item.id_moneda_origen ? `${data.find(option => option.id === item[key])?.nombre} ` : '$ '}
                                            delimiter="."
                                            separator=","
                                            precision={0}
                                            minValue={0}
                                        />
                                    )}
                                />


                            </View>)
                            : null}
                </View>
            );
        }

        if (renderType === 'datePicker') {
            return (
                <DatePickerSearchBar
                    value={item[key]} // Valor actual de la fecha
                    onSelect={(date) => {
                        updateItemProperty(key, moment(date).format('YYYY-MM-DD HH:mm:ss'));
                    }}
                    onClear={() => updateItemProperty(key, null)} // Para limpiar la fecha
                    placeholder="Fecha"
                />

            );
        }

        return null;
    };
    const updateItemProperty = (key, value) => {
        setItem(prevItem => ({
            ...prevItem,
            [key]: value,
        }));
    };

    const create = async (item) => {
        try {
            setLoading(false)
            const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina[`pagina_${tipo}`]}${symbols.barra}${keyId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'refresh-token': refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
            const data = await response.json()
            setLoading(true)
            setvisibleOK(true);
        } catch (error) {
            console.error(error)
        }
    }

    const update = async (item) => {
        try {
            setLoading(false)
            const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina[`pagina_${tipo}`]}${symbols.barra}${keyid}${symbols.barra}${[tipo].id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'refresh-token': refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tipo),
            })
            const data = await response.json()
            setLoading(true)
            setvisibleOK(true);
        } catch (error) {
            console.error(error)
        }
    }
    const handleDelete = async () => {
        if (item.id) {
            try {
                setLoading(false)
                const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina[`pagina_${tipo}`]}${symbols.barra}${item.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'refresh-token': refreshToken,
                        'Content-Type': 'application/json'
                    }
                })
                setLoading(true)
                setvisibleDelete(false)
                setvisibleOKDelete(true)
            }
            catch { (error) }
        }
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault()
        const missingFields = [];

        atributosForm.forEach((atributo) => {
            if (atributo.key !== 'comentario' && !item[atributo.key]) {
                missingFields.push(atributo.label);
            }
        });
        if (missingFields.length > 0) {
            const message = missingFields.map((field) => `\n\n→ ${field}`).join('\n');
            setMessage(message)
            setVisible(true);
            return;
        }

        if (item.id) {
            await update(item)
        } else {
            await create(item)
        }
    }

    return (

        <>
            {!loading ? (
                <View style={styleLoading.loadingContainer}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size={theme.icons.big} />
                    <Text style={styleLoading.loadingText}>{alerts.cargando} datos...</Text>
                </View>
            ) : (
                <>
                    {/* Contenido de la lista */}
                    <FlatList
                        data={atributosForm}
                        renderItem={({ item }) => renderInput(item)}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={true}
                        style={{ flex: 1, margin: 20 }}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="handed"
                    />
                    {/* Vistas modales */}
                    <FaltanDatos visible={visible} setVisible={setVisible} message={message} />
                    <Correcto visible={visibleOK} setVisible={setvisibleOK} navigation={navigation} RutaAnterior={RutaAnterior} goBack={false} />
                    <Delete
                        visible={visibleDelete}
                        setVisible={setvisibleDelete}
                        handleDelete={handleDelete}
                        visibleOk={visibleOKDelete}
                        setVisibleOk={setvisibleOKDelete}
                        archivar={item.activo}
                        navigation={navigation}
                        RutaAnterior={RutaAnterior} goBack={false}
                    />

                    {/* Botones de acción */}
                    <View style={styleForm.rowButton}>
                        <View style={styleForm.button}>
                            <Icon.Button backgroundColor={theme.colors.white} color={theme.colors.primary} name={theme.icons.close} onPress={() => navigation.goBack({ refresh: true })}>
                                {button_text.cancel}
                            </Icon.Button>
                        </View>
                        {!deleteMode && (
                            <View style={styleForm.button}>
                                <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={theme.icons.save} onPress={handleSubmitForm}>
                                    {button_text.sumbit}
                                </Icon.Button>
                            </View>
                        )}
                        {deleteMode && (
                            <View style={styleForm.button}>
                                <Icon.Button backgroundColor={theme.colors.red} name={theme.icons.borrar} onPress={() => setvisibleDelete(true)}>
                                    {button_text.delete}
                                </Icon.Button>
                            </View>
                        )}
                    </View>
                </>
            )}
        </>

    )


}
export default MovimientoForm