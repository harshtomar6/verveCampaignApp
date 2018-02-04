import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { AsyncStorage } from 'react-native'
import { Root, Toast, ActionSheet } from 'native-base';
import SocketIOClient from 'socket.io-client';
import HomeScreen from './src/screens/homeScreen';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import Splash from './src/screens/splashScreen';
import VolunteerScreen from './src/screens/volunteerScreen';
import volunteerDetails from './src/screens/volunteerDetails';
import VolunteerSearch from './src/screens/volunteerSearch';
const config = require('./src/config');
const GLOBALS = require('./src/globals');

const RootNavigator = StackNavigator({
  splash: {screen: Splash},
  Home: {screen: HomeScreen},
  Login: {screen: Login},
  Signup: {screen: Signup},
  Volunteer: {screen: VolunteerScreen},
  volunteerDetails: {screen: volunteerDetails},
  volunteerSearch: {screen: VolunteerSearch}
},{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
})

export default class App extends Component {

  constructor(){
    super();
    this.socket = SocketIOClient(config.SERVER_URI);
    GLOBALS.socket = this.socket;
  }

  componentWillUnmount(){
    Toast.toastInstance = null;
    ActionSheet.actionsheetInstance = null;
  }

  render() {
    return (
      <Root>
        <RootNavigator />
      </Root>      
    );
  }
}

