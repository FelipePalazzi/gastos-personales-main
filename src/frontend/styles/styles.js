import styleLista from './styleGastosIngresos/styleLista.js';
import styleGasto from './styleGastosIngresos/styleGasto.js';
import styleIngreso from './styleGastosIngresos/styleIngreso.js';
import styleForm from './styleGastosIngresos/styleForm.js';
import styleBusquedaAvanzada from './styleGastosIngresos/styleBusquedaAvanzada.js';
import styleResumen from './styleResumen/styleResumen.js';
import { Dimensions} from 'react-native';
import styleLoading from './styleComunes/styleLoading.js';
import styleSearchDropdown from './styleComunes/styleSearchDropdown.js';
import styleLogin from './styleLogin/styleLogin.js';
import styleRegister from './styleLogin/styleRegister.js';
import styleEntidades from './styleCreacion/styleEntidades.js';
import styleComun from './styleComunes/styleComun.js';
import styleDrawer from './styleMain/styleDrawer.js';
const screenWidth = Dimensions.get('window').width;

export {
  styleComun,
  styleLista,
  styleGasto,
  styleIngreso,
  styleBusquedaAvanzada,
  styleResumen,
  screenWidth,
  styleForm,
  styleLoading,
  styleSearchDropdown,
  styleLogin,
  styleRegister,
  styleEntidades,
  styleDrawer,
};