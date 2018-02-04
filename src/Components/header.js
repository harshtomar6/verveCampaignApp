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
    this.actionSheet = null;
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
      if(this.actionSheet !== null){
      this.actionSheet._root.showActionSheet({
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
              GLOBALS.socket.emit('record-activity', {
                type: 'LOGOUT',
                owner: {
                  id: JSON.parse(val)._id,
                  name: JSON.parse(val).name
                }
              });
          }).done();
        }
      })
    }
    
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
      <Button transparent rounded
        onPress={this.handlePress.bind(this)}>
        <Icon name={this.props.icon} style={{color: '#fff'}}/>
      </Button>
    </Right> 

    return (
      <Header androidStatusBarColor={GLOBALS.primaryColorDark} style={styles.header}
        noShadow={this.props.noShadow} hasTabs={this.props.hasTabs}>
          {leftIcon}
          <Body>
            <Title>{this.props.title}</Title>
          </Body>
          {icon}
          <ActionSheet ref={(c) => { this.actionSheet = c; }} />
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: GLOBALS.primaryColor
  },
})