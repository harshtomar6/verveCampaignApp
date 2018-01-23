import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { AsyncStorage } from 'react-native'
import { Root } from 'native-base';
import HomeScreen from './src/screens/homeScreen';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import Splash from './src/screens/splashScreen';
import VolunteerScreen from './src/screens/volunteerScreen';
import volunteerDetails from './src/screens/volunteerDetails';
import VolunteerSearch from './src/screens/volunteerSearch';

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

  componentWillUnmount(){
    AsyncStorage.removeItem('volunteerList');
  }

  render() {
    return (
      <Root>
        <RootNavigator />
      </Root>      
    );
  }
}

