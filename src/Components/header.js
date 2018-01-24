import React from 'react';
import {
  StyleSheet, AsyncStorage,
} from 'react-native';
import {
  Header,
  Body,
  Title,
  Left,
  Right,
  Button,
  Icon,
  ActionSheet,
  Text, Input, Item, Form
} from 'native-base';
import { NavigationActions } from 'react-navigation';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class AppBar extends React.Component{
  
  constructor(){
    super();
  }

  componentWillUnmount() { 
    ActionSheet.actionsheetInstance = null;
  }

  handlePress(){
    var BUTTONS = [
      {text: 'Sign Out', icon: 'log-out', iconColor: GLOBALS.primaryColor},
      {text: 'Cancel', icon: 'close', iconColor: GLOBALS.primaryColor}
    ];

    const removeFromStack = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Login'})
      ]
    })

    if(this.props.icon === 'more')
      ActionSheet.show({
        options: BUTTONS,
        cancelButtonIndex: 1,
        title: 'More'
      },
      buttonIndex => {
        if(buttonIndex == 0){
          AsyncStorage.removeItem('userType');
          this.props.navigation.dispatch(removeFromStack);
          AsyncStorage.getItem('userData').then(val => {
            if(val)
              fetch(config.SERVER_URI+'/addRecentActivity', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  type: 'LOGOUT', 
                  owner: {
                    id: JSON.parse(val)._id,
                    name: JSON.parse(val).name
                  }
                })
              })
                .then(res => {
                  if(!res.ok)
                    console.log('Error logging');
                  AsyncStorage.removeItem('userData');
                })
                .catch(res => {
                  console.log('Error logging');
                })
          }).done();
        }
      })
    
    if(this.props.icon === 'search'){
      this.props.navigation.navigate('volunteerSearch');
    }
  }

  handleLeftPress(){

    const { goBack } = this.props.navigation

    if(this.props.left === 'arrow-back')
      return goBack()
  }

  render(){
    
    let leftIcon = this.props.left === 'none' ? <Text /> :
    <Left>
      <Button transparent rounded
        onPress={this.handleLeftPress.bind(this)}>
        <Icon name={this.props.left} style={{color: '#fff'}}/>
      </Button>
    </Left> 

    let icon = this.props.icon === 'none' ? <Right /> : 
    <Right>
      <Button transparent rounded>
        <Icon name='refresh' style={{color: '#fff'}} />
      </Button>
      <Button transparent rounded
        onPress={this.handlePress.bind(this)}>
        <Icon name={this.props.icon} style={{color: '#fff'}}/>
      </Button>
    </Right> 

    return (
      <Header androidStatusBarColor={GLOBALS.primaryColorDark} style={styles.header}
        noShadow={this.props.noShadow}>
          {leftIcon}
          <Body>
            <Title>{this.props.title}</Title>
          </Body>
          {this.props.isLoading ? <Text/> : icon}
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: GLOBALS.primaryColor
  },
})