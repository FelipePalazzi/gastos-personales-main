import 'react-native-gesture-handler';
import React from 'react'
import Main from './src/component/Main.jsx'
import {NativeRouter} from 'react-router-native'
import { PaperProvider, MD3LightTheme  } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

function App () {
  return (
    <SafeAreaProvider>
    <PaperProvider theme={MD3LightTheme}>
      <NativeRouter>
      <NavigationContainer>
          <Main/>
      </NavigationContainer>
        </NativeRouter>
      </PaperProvider>
      </SafeAreaProvider>
  );
}
export default App;
