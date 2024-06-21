import { PAGINA_URL } from '../config.js';
import { screenWidth } from './styles/styles.js';

export const alerts = {
    exito: 'Éxito',
    missing_data: 'Faltan datos',
    completado_exito: 'Se completo con éxito',
    guardado_exito: 'Se guardó con éxito',
    actualizado_exito: 'Se actualizó con éxito',
    delete_exito: 'Se elimino con éxito',
    error_ocurrido: 'Ocurrió un error',
    delete_question: '¿Estás seguro de eliminar este gasto?',
    cargando: 'Cargando...',
    noData:'No hay datos registrado',
  };
  export const symbols = {
    space: ' ',
    colon:': ',
    peso:'$',
    and:' y ',
    guion: '-',
    barra:'/',
  };
  export const button_text = {
    ok: 'OK',
    sumbit: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit:'Editar',
    select: 'Seleccione',
    ingresar: 'Ingresar',
    agregar:'Agregar',
    opcional: '(Opcional)',
  };
  export const atributos = {
    gasto: 'Gasto',
    ingreso:'Ingreso',
    tipo: 'Tipo',
    ar: 'ARG',
    uy: 'UYU',
    usd:'USD',
    cambio: 'Cambio AR-UY',
    tipo_cambio: 'Tipo de cambio',
    tipo_gasto: 'Tipo de gasto',
    total_arg: 'Total ARG',
    total_uyu: 'Total UYU',
    responsable: 'Responsable',
    fecha: 'Fecha',
    descripcion: 'Descripcion',
    categoria: 'Categoria',
    importe:'Importe',
    tipo_importe:'Tipo de importe',
  }
  export const pagina = {
    mensaje:'Gastos Personales',
    pagina: PAGINA_URL,
    pagina_gasto:'gasto',
    pagina_ingreso: 'ingreso',
    pagina_new:'new',
    pagina_resumen:'resumen',
    pagina_categoria_gasto:'categoriagasto',
    pagina_moneda_ingreso: 'monedaingreso',
    pagina_responsable:'responsableIngreso',
    pagina_tipo_gasto: 'tipogasto',

  }
  export const lineChart = {
    animacionDuration: 1500,
    xAxisTextNumberOfLines: 2,
    width: screenWidth-95,
    height: 220,
    initialSpacing: 10,
    spacing:50,
    thickness:2,
    startOpacity: 0.9,
    endOpacity:0.2,
    noOfSections: 5,
    yAxisThickness:0,
    xAxisThickness:0,
  }
  
  export const pointerConfig={
    dataPointLabelShiftX: 10,
    dataPointLabelShiftY: 20,
    pointerStripHeight:150,
    strokeDashArray: [2, 1],
    pointerStripWidth: 4,
    radius: 6,
    pointerLabelWidth: 100,
    pointerLabelHeight: 90,
    activatePointersOnLongPress: true,
    pointerVanishDelay: 2000,
    autoAdjustPointerLabelPosition: false,
  }
