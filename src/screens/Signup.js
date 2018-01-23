import React from 'react';
import { View, StatusBar, StyleSheet, Image, AsyncStorage } from 'react-native';
import { Container, Icon, Button, Input, Item, Form, Text,
  Toast, Spinner, Content } from 'native-base';
import { NavigationActions } from 'react-navigation';
const remote = require('./../login-back.jpg');
const config = require('./../config.js');
let GLOBALS = require('./../globals');

export default class Signup extends React.Component {

  constructor(){
    super();
    this.validateInputs = this.validateInputs.bind(this);
    this.state = {
      name: '',
      usn: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
      err: false
    }
  }

  componentWillUnmount() { 
    Toast.toastInstance = null;
  }

  handleSubmit(){
    let data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      userid: this.state.usn,
      phone: this.state.phone
    }

    const moveToVolunteer = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Volunteer'})
      ]
    })

    if(this.validateInputs() === 1){
      this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/addVolunteer', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
        .then(res => {
          this.setState({isLoading: false})
          if(!res.ok){
            return Toast.show({
              text: JSON.parse(res._bodyText).err,
              position: 'bottom',
              buttonText: 'Okay',
              duration: 3000,
              style: {
                backgroundColor: GLOBALS.primaryErrColor
              }
            })
          }

          AsyncStorage.setItem('userType', 'Volunteer')
          this.props.navigation.dispatch(moveToVolunteer);
          fetch(config.SERVER_URI+'/addRecentActivity', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({type: 'REGISTER', owner: this.state.name})
          })
            .then(res => {
              if(!res.ok)
                console.log('Error logging');
            })
            .catch(res => {
              console.log('Error logging');
            })
        })
        .catch(err => {
          this.setState({isLoading: false})
          Toast.show({
            text: 'An Error Occured !',
            position: 'bottom',
            buttonText: 'Okay',
            duration: 3000,
            style: {
              backgroundColor: GLOBALS.primaryErrColor
            }
          })
        })
    }
  }

  validateInputs(){
    if(this.state.name.length === 0)
      return Toast.show({
        text: 'Name cannot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      })

    if(this.state.usn.length !== 10)
      return Toast.show({
        text: 'USN must be 10 letters long !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      })

    if(!(this.state.usn.startsWith('1js') || this.state.usn.startsWith('1JS')))
      return Toast.show({
        text: 'Invalid USN !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
    })
    
    if(this.state.email.length === 0)
      return Toast.show({
        text: 'Email cannot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      })
    
    if(!(this.state.email.contains('@') && this.state.email.contains('.')) || this.state.email.contains('@.'))
      return Toast.show({
        text: 'Invalid E-mail !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      })
    
    if(this.state.phone.length !== 10)
      return Toast.show({
        text: 'Phone should be of 10 digits !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      })

    if(this.state.password.length === 0)
      return Toast.show({
        text: 'Password cannot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      })

    if(this.state.password !== this.state.confirmPassword)
      return Toast.show({
        text: 'Password do not match !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      })

    return 1;
  }

  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <Container>
      <Content>
      <View style={styles.container}>
        <StatusBar backgroundColor='#000' />
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={remote} />
        </View>
        <View style={styles.overlay} />
        <View style={styles.col1}>
          <Text style={styles.heading}>VERVE 2018</Text>
        </View>
        <View style={styles.col2}>
          <Form>
          <Item rounded style={styles.input}>
            <Icon name="person" style={{color: '#fff'}} />
            <Input placeholder="Full Name" placeholderTextColor='#fff'
              onChangeText={text => this.setState({name: text})}
              value={this.state.name}
              style={{color: '#fff'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="key" style={{color: '#fff'}} />
            <Input placeholder="USN" placeholderTextColor='#fff'
              onChangeText={text => this.setState({usn: text})}
              value={this.state.usn}
              style={{color: '#fff'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="mail" style={{color: '#fff'}} />
            <Input placeholder="E-mail" placeholderTextColor='#fff'
              onChangeText={text => this.setState({email: text})}
              keyboardType='email-address'
              value={this.state.email}
              style={{color: '#fff'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="call" style={{color: '#fff'}} />
            <Input placeholder="Phone" placeholderTextColor='#fff'
              onChangeText={text => this.setState({phone: text})}
              keyboardType='numeric'
              value={this.state.phone}
              style={{color: '#fff'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="lock" style={{color: '#fff'}} />
            <Input placeholder="Password" placeholderTextColor='#fff'
              onChangeText={text => this.setState({password: text})}
              value={this.state.password}
              secureTextEntry style={{color: '#fff'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="lock" style={{color: '#fff'}} />
            <Input placeholder="Confirm Password" placeholderTextColor='#fff'
              onChangeText={text => this.setState({confirmPassword: text})}
              value={this.state.confirmPassword}
              returnKeyType='go'
              onSubmitEditing={this.handleSubmit.bind(this)}
              secureTextEntry style={{color: '#fff'}} />
          </Item>
          <Button block style={styles.btn} 
            onPress={this.handleSubmit.bind(this)}>
            <Text>Signup</Text>
          </Button>
          {showSpinner}
          </Form>
        </View>
      </View>
      </Content>
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',  
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
    opacity: 0.6
  },
  col1:{
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  col2: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    zIndex: 5,
    paddingBottom: 40
  },
  heading: {
    fontSize: 38,
    color: '#fff',
    fontWeight: '900'
  },
  input: {
    marginTop: 15, 
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 0
  },
  btn: {
    backgroundColor: GLOBALS.primaryColorDark, 
    borderRadius: 25,
    marginTop: 15,
    height: 50
  }
})