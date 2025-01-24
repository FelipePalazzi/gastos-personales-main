import React from 'react'
import HomeStackNavigator from "./NavigatorScreens/HomeStackNavigator.jsx";
import {AuthProvider} from '../../helpers/AuthContext.js'

const Main = () => {
  return (
    <AuthProvider>
    <HomeStackNavigator />
    </AuthProvider>
  );
};

export default Main;
