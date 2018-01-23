import React from 'react';
import { StyleSheet, View, StatusBar, Image, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Text } from 'native-base';
const remote = require('./../splash-back.jpg');

export default class Splash extends React.Component {
  
  componentDidMount(){
    let userType = '';
    let removeFromStack;

    AsyncStorage.getItem('userType').then((val) => {
      userType = val;
      if(userType == 'Admin')
        removeFromStack = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: 'Home'})
          ]
        })
      else if(userType == 'Volunteer')
        removeFromStack = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: 'Volunteer'})
          ]
        })
      else
        removeFromStack = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: 'Login'})
          ]
        })

      setTimeout(() => {
        //navigate('Home');
        this.props.navigation.dispatch(removeFromStack);
      }, 2000);
    }).done();
  }
  
  render(){
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#000' />
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={remote} />
        </View>
        <View style={styles.overlay} />
        <Text style={styles.text}>VERVE 2018</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'  
  },
  imageContainer : {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  image : {
    flex: 1,
    resizeMode: 'cover'
  },
  overlay : {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: 0.7
  },
  text: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '900'
  }
})