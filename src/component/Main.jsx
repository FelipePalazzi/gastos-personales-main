import { View} from "react-native";
import AppBar from "./AppBar.jsx"
import {Routes, Route} from 'react-router-native'
import  GastoList  from "./Gastos/GastosList.jsx";
import  IngresoList  from "./Ingresos/IngresosList.jsx";
import AgregarGasto from "./Gastos/GastoForm.jsx";
import AgregarIngreso from "./Ingresos/IngresoForm.jsx";
import Resumen from "./Resumen/Resumen.jsx";
import LoginScreen from "./Login/Login.jsx";
import {pagina,symbols } from '../constants'
//import StyledText from "./StyledText.jsx";

const Main= () => {
    return (
        <View style={{flex: 1}}>
             <AppBar />
             <Routes>
         { /*      <Route path='/'
                        element={
                       <StyledText  fontWeight = 'bold' color = 'secondary' alignText = 'center'>En desarrollo</StyledText>
                    }
                >         */ }
                <Route path={symbols.barra  /*`${symbols.barra}${pagina.pagina_resumen}`*/} element={<LoginScreen/>}/>

                <Route path={`${symbols.barra}${pagina.pagina_ingreso}`} element={<IngresoList/>}/>
                <Route path={`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}${pagina.pagina_new}`}  element={<AgregarIngreso/>}/>
                 <Route path={`${symbols.barra}${pagina.pagina_ingreso}${symbols.barra}:id`} element={<AgregarIngreso/>}/>

                 <Route path={`${symbols.barra}${pagina.pagina_gasto}`} element={<GastoList/>}/>
                  <Route path={`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}${pagina.pagina_new}`}  element={<AgregarGasto/>}/>
                 <Route path={`${symbols.barra}${pagina.pagina_gasto}${symbols.barra}:id`} element={<AgregarGasto />}/>

            </Routes>
        </View>


    )
}

export default Main