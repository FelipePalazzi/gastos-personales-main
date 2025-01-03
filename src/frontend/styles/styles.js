import styleLista from './styleGastosIngresos/styleLista.js';
import styleForm from './styleGastosIngresos/styleForm.js';
import styleResumen from './styleResumen/styleResumen.js';
import { Dimensions} from 'react-native';
import styleLoading from './styleComunes/styleLoading.js';
import styleLogin from './styleLogin/styleLogin.js';
import styleRegister from './styleLogin/styleRegister.js';
import styleEntidades from './styleCreacion/styleEntidades.js';
import styleComun from './styleComunes/styleComun.js';

const screenWidth = Dimensions.get('window').width;

export {
  styleComun,
  styleLista,
  styleResumen,
  screenWidth,
  styleForm,
  styleLoading,
  styleLogin,
  styleRegister,
  styleEntidades,
};