import React from 'react';
import { View, StyleSheet, AsyncStorage, Dimensions, Image, Picker } from 'react-native';
import { Text, Button, Body, Card, CardItem, Form, Item, Label, Input, Toast } from 'native-base';
import { TextField } from 'react-native-material-textfield';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class SellPass extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      userData : null,
      name: '',
      email: '',
      phone: '',
      college: '',
      event: 'Java'
    }
  }

  componentWillMount(){
    AsyncStorage.getItem('userData').then(val => {
      if(val){
        this.setState({userData: JSON.parse(val)});      
      }
    }).done()
  }

  componentDidMount(){
    GLOBALS.socket.on('alloted', data => {
      if(data.id === this.state.userData._id){
        alert('Passes Alloted');
        let d = this.state.userData
        d.passesAlloted = data.passesAlloted
        this.setState({userData: d}, () => {
          AsyncStorage.setItem('userData', JSON.stringify(this.state.userData))
        })
      } 
    })

    GLOBALS.socket.on('not-alloted', (data) => {
      if(data.id === this.state.userData._id){
        alert('Passes Dealloted');
        let d = this.state.userData;
        d.passesAlloted = 0;
        this.setState({userData: d}, () => {
          AsyncStorage.setItem('userData', JSON.stringify(this.state.userData))
        });
      }
    })
  }

  handleSubmit(){
    if(this.validateInputs() === 1){
      const { navigate } = this.props.navigation;
      navigate('reviewSell', {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        college: this.state.college,
        event: this.state.event,
        userData: this.state.userData
      });
    }
  }

  validateInputs(){
    if(this.state.name.length === 0)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'Name cannot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    
    if(this.state.email.length === 0)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'E-mail cannot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    
    if(!(this.state.email.contains('@') && this.state.email.contains('.')) || this.state.email.contains('@.'))
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'Invalid E-mail !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    
    if(this.state.phone.length !== 10)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'Phone should be of 10 digits !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})

    if(this.state.college.length === 0)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'College name cannnot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})

    return 1;
  }

  render(){

    let content = this.state.userData === null ? <Text>Cannot retreive user data</Text>:
      this.state.userData.passesAlloted - this.state.userData.passesSold <= 0 ? 
      <View style={styles.innerContainer}>
        <Image source={require('./../sad.png')} style={{ width: 120, height: 120}}/>
        <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
          {this.state.userData.passesAlloted - this.state.userData.passesSold === 0 ?
             'You have sold all your passes !':
             'You have been not alloted passes yet !'}
        </Text>
        <View style={{justifyContent: 'center', padding: 15}}>
        <Button primary> 
          <Text>Request Admin</Text> 
        </Button>
        </View>
      </View> :
      <View style={{backgroundColor: '#fff'}}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('./../grad.png')} />
        </View>
        <View style={styles.infohero}>
          <Text style={{color: '#fff', fontWeight: '800', fontSize: 22}}>
            {this.state.userData.passesAlloted - this.state.userData.passesSold} Passes Left
          </Text>
        </View>
        <View style={{marginTop: 50}}>
        <View style={styles.header}>
          <Text style={{color: GLOBALS.primaryColorDark}}>ENTER PARTICIPANT DETAILS</Text>
        </View>
        <View style={styles.body}>
          <TextField
            label='Name'
            value={this.state.name}
            onChangeText={ (name) => this.setState({ name })}
            tintColor={GLOBALS.primaryColor} 
          />
          <TextField
            label='E-mail'
            value={this.state.email}
            onChangeText={ (email) => this.setState({ email })}
            tintColor={GLOBALS.primaryColor}
            keyboardType="email-address" 
          />
          <TextField
            label='Phone'
            value={this.state.phone}
            onChangeText={ (phone) => this.setState({ phone })}
            tintColor={GLOBALS.primaryColor}
            keyboardType="numeric" 
          />
          <TextField
            label='College'
            value={this.state.college}
            onChangeText={ (college) => this.setState({ college })}
            tintColor={GLOBALS.primaryColor} 
          />
          <Label style={{marginTop: 10}}>Select Event</Label>
          <Picker style={{borderBottomColor: GLOBALS.primaryColor, borderBottomWidth: 1}}
            selectedValue={this.state.event}
            onValueChange={(itemValue, itemIndex) => this.setState({event: itemValue})}>
            <Picker.Item label="ABC" value="java" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
            <Picker.Item label="DEF" value="js" />
          </Picker>

          <Button block danger style={{marginTop: 20}}
            onPress={this.handleSubmit.bind(this)}>
            <Text>Submit</Text>
          </Button>
          <Toast ref={c => {this.toast =c }} />
        </View>
        </View>
      </View>
      

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    height: Dimensions.get('screen').height - 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  infohero: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('screen').width,
    backgroundColor: 'transparent',
    paddingTop: 25,
    paddingBottom: 30,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header:{
    paddingTop: 25,
    paddingLeft: 15
  },
  body: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  imageContainer : {
    top: 0,
    left: 0,
    width: Dimensions.get('screen').width,
    height: 50
  },
  image : {
    height: 90,
    resizeMode: 'stretch'
  },
  overlay : {
    position: 'relative',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: 0.7
  }
})