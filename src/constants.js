const predefinedColors = {
  'Felipe': '#009688',
  'Fernanda': '#EC407A',
  'Gaston':'#26C6DA',
  'Raquel':'#7E57C2',
};

const alerts = {
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
    regresar:'Estas seguro de volver?',
    cantidad:'Cant.',
    errorLineChart: 'No hay suficientes datos para graficar',
  };
 const symbols = {
    space: ' ',
    colon:': ',
    peso:'$',
    and:' y ',
    guion: '-',
    barra:'/',
    de:'de ',
    mil:'k',
  };
const button_text = {
    ok: 'OK',
    sumbit: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit:'Editar',
    select: 'Seleccione',
    ingresar: 'Ingresar',
    agregar:'Agregar',
    opcional: '(Opcional)',
    formulario:'Formulario ',
    volver:'Volver ',
    filtrar:'Filtrar',
    ingreseAño:'Ingrese Año',
  };
const atributos = {
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
    gastoResumen:'GASTO',
    ingresoResumen:'INGRESO',
    balanceResumen: 'BALANCE'
  }
const pagina = {
    nombre:'Página',
    mensaje:'Gastos Personales',
    pagina_gasto:'gasto',
    pagina_ingreso: 'ingreso',
    pagina_new:'new',
    pagina_resumen:'resumen',
    pagina_categoria_gasto:'categoriagasto',
    pagina_moneda_ingreso: 'monedaingreso',
    pagina_responsable:'responsableIngreso',
    pagina_tipo_gasto: 'tipogasto',

  }
  const months = {
    '1': 'Ene',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Abr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Ago',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dic',
  };
  const monedaMaxValues = {
    ARG: 1.2,
    UYU: 1.2,
    USD: 1.2
  };
const lineChart = {
    animacionDuration: 1500,
    xAxisTextNumberOfLines: 2,
    initialSpacing: 10,
    spacing:50,
    thickness:2,
    startOpacity: 0.9,
    endOpacity:0.2,
    noOfSections: 5,
    ejesThickness:0,
  }
  
const pointerConfig={
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
const barChart={
  barWidth:25,
  spacing:30,
  initialSpacing:8,
  ejesThickness:0,
  barBorderRadius:4,
  noOfSections:6,
}

const pieChart={
  radius:90,
  innerRadius:60,
}

  module.exports = {
    predefinedColors,
    alerts,
    symbols,
    button_text,
    atributos,
    pagina,
    months,
    monedaMaxValues,
    lineChart,
    pointerConfig,
    barChart,
    pieChart,
  };