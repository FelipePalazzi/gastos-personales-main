import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, FlatList } from 'react-native'
import useCombinedData from '../../hooks/useCombinedData.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../theme/theme'
import { ActivityIndicator, TextInput, } from 'react-native-paper'
import moment from 'moment'
import 'moment/locale/es'
import { alerts, button_text, symbols, pagina } from '../../../constants'
import { styleForm, styleComun, screenWidth, styleLoading } from '../../styles/styles.js'
import { useRoute, useNavigation } from '@react-navigation/native';
import { PAGINA_URL as PAGINA_URL_ENV } from '@env';
const PAGINA_URL = process.env.PAGINA_URL || PAGINA_URL_ENV;
import { useAuth } from '../../helpers/AuthContext.js';
import FaltanDatos from '../Comunes/Dialogs/FaltanDatos.jsx';
import Correcto from '../Comunes/Dialogs/CorrectoNavigation.jsx';
import Delete from '../Comunes/Dialogs/Delete.jsx';
import SearchDropdown from '../Comunes/Busqueda/SearchDropdown.jsx';
import { getAtributosForm } from './formConfig.js';
import DatePickerSearchBar from '../Comunes/Busqueda/DatePickerSearchBar.jsx';
import CurrencyInput from '../Comunes/CurrencyInput.jsx';

const MovimientoForm = ({ routeParams }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const { itemParam, deleteMode, keyId, labelHeader } = route.params;
    const [item, setItem] = useState({ fecha: moment().format('YYYY-MM-DD HH:mm:ss'), ...itemParam, });
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
    const RutaAnterior = esEntrada ? 'Ingresos' : 'Gastos';
    const [categorias, setCategorias] = React.useState([]);
    const [subcategorias, setSubcategorias] = React.useState([]);
    const [responsables, setResponsables] = React.useState([]);
    const [monedas, setMonedas] = React.useState([]);
    const [metodopagos, setMetodopagos] = React.useState([]);
    const [submetodopagos, setSubmetodopagos] = React.useState([]);

    React.useEffect(() => {
        if (itemParam) {
            updateItemProperty('estado', itemParam.nombre === 'Activo' ? 'Archivado' : 'Activo')
            updateItemProperty('id_moneda_origen', itemParam.id_moneda)
            updateItemProperty('monto', item[item.monedamonto].toFixed(2))
            updateItemProperty('metodopago', item.id_metodopago)
            updateItemProperty('submetodopago', item.id_submetodopago)
            updateItemProperty('categoria', item.id_categoria)
            updateItemProperty('subcategoria', item.id_subcategoria)
            updateItemProperty('responsable', item.id_responsable)
            setLoading(false)
        }
    }, [itemParam])
    React.useEffect(() => {
        setCategorias(categoria.map(item => ({
            id: item.id_categoria,
            nombre: item.categoria,
            activo: item.categoria_activo
        })));

        setSubcategorias(subcategoria.map(item => ({
            id: item.id_subcategoria,
            nombre: item.subcategoria,
            id_categoria: item.id_categoria,
            id_responsable: item.id_responsable,
            activo: item.subcategoria_activo
        })));

        setResponsables(responsable.map(item => ({
            id: item.id_responsable,
            nombre: item.responsable,
            activo: item.responsable_activo
        })));

        setMonedas(moneda.map(item => ({
            id: item.id_moneda,
            nombre: item.codigo_moneda,
            activo: item.moneda_activo
        })));
        setMetodopagos(metodopago.map(item => ({
            id: item.id_metodopago,
            nombre: item.metodopago,
            activo: true
        })));
        setSubmetodopagos(submetodopago.map(item => ({
            id: item.id_submetodo_pago,
            nombre: item.submetodo_pago,
            id_metodopago: item.id_metodopago,
            activo: item.submetodo_pago_activo
        })));
    }, [keyId, categoria, subcategoria, responsable, moneda, metodopago, submetodopago]);

    React.useEffect(() => {
        if (categorias.find(option => option.id === item.categoria)?.nombre &&
            responsables.find(option => option.id === item.responsable)?.nombre &&
            subcategorias.find(option => option.id === item.subcategoria)?.nombre) {
            setLoading(true);
        }
    }, [categorias, responsables, subcategorias]);

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

    const renderInput = (atributo) => {
        const { key, label, renderType, data, icon } = atributo;
        if (key === 'categoria') {
            return (
                <View key={key}>
                    <SearchDropdown
                        options={categorias.map(option => ({ nombre: option.nombre, activo: option.activo }))}
                        placeholder={label}
                        value={categorias.find(option => option.id === item.categoria)?.nombre}
                        onSelect={(value) => {
                            const selected = categorias.find(option => option.nombre === value.nombre);
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
                        icon={icon}
                        deleteMode={deleteMode}
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
                        options={filteredSubcategoria.map(option => ({ nombre: option.nombre, activo: option.activo }))}
                        placeholder={label}
                        value={subcategorias.find(option => option.id === item.subcategoria)?.nombre}
                        onSelect={(value) => {
                            const selected = subcategorias.find(option => option.nombre === value.nombre);
                            updateItemProperty('subcategoria', selected ? selected.id : null);
                        }}
                        onClear={() => {
                            updateItemProperty('subcategoria', null);
                            updateItemProperty('responsable', null);
                        }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={icon}
                        deleteMode={deleteMode}
                    />
                </View>
            );
        }

        if (key === 'responsable') {
            return (
                <View key={key}>
                    <SearchDropdown
                        options={responsables.map(option => ({ nombre: option.nombre, activo: option.activo }))}
                        placeholder={label}
                        value={responsables.find(option => option.id === item.responsable)?.nombre}
                        onSelect={(value) => {
                            const selected = responsables.find(option => option.nombre === value.nombre);
                            updateItemProperty('responsable', selected ? selected.id : null);
                        }}
                        onClear={() => {
                            updateItemProperty('responsable', null);
                        }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={icon}
                        deleteMode={deleteMode}
                    />
                </View>
            );
        }

        if (key === 'metodopago') {
            return (
                <View key={key}>
                    <SearchDropdown
                        options={metodopagos.map(option => ({ nombre: option.nombre, activo: option.activo }))}
                        placeholder={label}
                        value={!itemParam ? metodopagos.find(option => option.id === item.metodopago)?.nombre : item.metododepago}
                        onSelect={(value) => {
                            const selected = metodopagos.find(option => option.nombre === value.nombre);
                            updateItemProperty('metodopago', selected ? selected.id : null);
                            updateItemProperty('submetodopago', null);
                        }}
                        onClear={() => {
                            updateItemProperty('metodopago', null);
                            updateItemProperty('submetodopago', null);
                        }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={icon}
                        deleteMode={deleteMode}
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
                        options={filteredSubmetodopagos.map(option => ({ nombre: option.nombre, activo: option.activo }))}
                        placeholder={label}
                        value={!itemParam ? submetodopagos.find(option => option.id === item.submetodo_pago)?.nombre : item.submetododepago}
                        onSelect={(value) => {
                            const selected = submetodopagos.find(option => option.nombre === value.nombre);
                            updateItemProperty('submetodopago', selected ? selected.id : null);
                        }}
                        onClear={() => {
                            updateItemProperty('submetodopago', null);
                        }}
                        filterKey={key}
                        setFilter={setItem}
                        icon={icon}
                        deleteMode={deleteMode}
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
                            outlineStyle={{ borderColor:theme.colors.primary, borderRadius: 27 }}
                            disabled={deleteMode}
                            label={label}
                            textColor={item[key] ? theme.colors.white : theme.colors.primary}
                            outlineColor={item[key] ? theme.colors.white : theme.colors.primary}
                            activeOutlineColor={item[key] ? theme.colors.white : theme.colors.primary}
                            theme={{ colors: { onSurfaceVariant: item[key] ? theme.colors.white : theme.colors.primary, onSurfaceDisabled: theme.colors.white } }}
                            right={
                                item[key] && !deleteMode ? (
                                    <TextInput.Icon
                                        icon="close"
                                        onPress={() => updateItemProperty(key, '')}
                                        size={26}
                                        color={theme.colors.white}
                                        style={{ marginTop: 34 }}
                                    />
                                ) : null
                            }
                        />
                        :
                        key === 'id_moneda_origen' ?
                            (<View style={[styleComun.rowContainer, { marginVertical: 20, height: 55 }]}>
                                <SearchDropdown
                                    key={key}
                                    options={data.map(option => ({ nombre: option.nombre, activo: option.activo }))}
                                    placeholder={label}
                                    onSelect={(value) => {
                                        const selected = data.find(option => option.nombre === value.nombre);
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
                                    icon={icon}
                                    deleteMode={deleteMode}
                                />
                                <CurrencyInput
                                    value={String(item.monto || '')}
                                    onChange={(value) => updateItemProperty('monto', value)}
                                    label={'Importe'}
                                    deleteMode={deleteMode}
                                />
                            </View>)
                            : null}
                </View>
            );
        }
        if (renderType === 'datePicker') {
            return (
                <DatePickerSearchBar
                    value={item[key] || ''}
                    onSelect={(date) => {
                        updateItemProperty(key, moment(date).format('YYYY-MM-DD HH:mm:ss'));
                    }}
                    onClear={() => updateItemProperty(key, null)}
                    placeholder="Fecha"
                    deleteMode={deleteMode}
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
            const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina[`pagina_${tipo}`]}${symbols.barra}${keyId}${symbols.barra}${item.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'refresh-token': refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
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
                const response = await fetch(`${PAGINA_URL}${symbols.barra}${pagina[`pagina_${tipo}`]}${symbols.barra}${keyId}${symbols.barra}${item.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'refresh-token': refreshToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ estado: item.estado }),
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
                        archivar={item.estado === 'Archivado' ? true : false}
                        navigation={navigation}
                        RutaAnterior={RutaAnterior}
                        goBack={false}
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
                                <Icon.Button backgroundColor={theme.colors.primary} color={theme.colors.white} name={theme.icons.borrar} onPress={() => setvisibleDelete(true)}>
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