import React from 'react'
import Main from './src/component/Main.jsx'
import {NativeRouter} from 'react-router-native'
import { PaperProvider } from 'react-native-paper';

function App () {
  return (
    <PaperProvider>
      <NativeRouter>
        <Main />
        </NativeRouter>
      </PaperProvider>
  );
}
export default App;
