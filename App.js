import React from 'react'
import Main from './src/component/Main.jsx'
import {NativeRouter} from 'react-router-native'
import { PaperProvider, MD3LightTheme  } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
function App () {
  return (
    <SafeAreaProvider>
    <PaperProvider theme={MD3LightTheme}>
      <NativeRouter>
        <Main />
        </NativeRouter>
      </PaperProvider>
      </SafeAreaProvider>
  );
}
export default App;
