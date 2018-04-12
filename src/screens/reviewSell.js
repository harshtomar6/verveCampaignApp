import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { Container, Content, Card, CardItem, Text, Label, Body, Button, Toast, Spinner} from 'native-base';
import AppBar from './../Components/header';
import { NavigationActions } from 'react-navigation';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class ReviewSell extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      userData: null,
      isLoading: false,
      events: []
    }
  }

  componentWillMount(){
    this.setState({
      userData: GLOBALS.userData
    });
    let arr = []
    let i=0;
    let events = this.props.navigation.state.params.events

    if(events !== 'ARMAN MALIK LIVE CONCERT'){
      events.forEach(element => {
        i++;
        arr.push(GLOBALS.events.filter(item => item._id == element)[0].name)   
        if(i == events.length)
          this.setState({events: arr});   
      });
    }
    else
      this.setState({events: [events]});
  }

  handleSubmit(){
    if(!this.state.isLoading){
    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/addParticipant', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: this.props.navigation.state.params.name,
        email: this.props.navigation.state.params.email,
        phone: this.props.navigation.state.params.phone,
        college: this.props.navigation.state.params.college,
        eventsRegistered: this.state.events,
        eventsAttended: ['none'],
        price: this.props.navigation.state.params.price,
        ownerid: this.state.userData._id
      })
    })
      .then(res => {
        this.setState({isLoading: false})
        if(!res.ok){
          if(this.toast !== null)
            return this.toast._root.showToast({
              text: JSON.parse(res._bodyText).err,
              position: 'bottom',
              buttonText: 'Okay',
              duration: 3000,
              style: {
                backgroundColor: GLOBALS.primaryErrColor
              }
            })
        }
        
        GLOBALS.socket.emit('record-activity', {
          type: 'PASS_SOLD',
          owner: {
            id: this.state.userData._id,
            name: this.state.userData.name
          }
        })

        const goToSuccess = NavigationActions.reset({
          index:  1,
          actions: [
            NavigationActions.navigate({routeName: 'Volunteer'}),
            NavigationActions.navigate({routeName: 'success'})
          ]
        });

        AsyncStorage.getItem('userData').then(val => {
          if(val){
            let d = JSON.parse(val);
            d.passesSold += 1;
            
            AsyncStorage.setItem('userData', JSON.stringify(d));
            this.props.navigation.dispatch(goToSuccess);
          }
        }).done()
      })
      .catch(err => {
        alert(err)
        this.setState({isLoading: false})
        if(this.toast !== null)
        this.toast._root.showToast({
          text: 'An Error Occured !',
          position: 'bottom',
          buttonText: 'Okay',
          duration: 3000,
          style: {
            backgroundColor: GLOBALS.primaryErrColor
          }
        })
      })
    }else
      alert('Your request is being processed !');
  }

  render(){
    const { params } = this.props.navigation.state;
    return (
      <Container>
        <AppBar title='Review Details' left='arrow-back'
          icon='none' navigation={this.props.navigation} />

        <Content>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>REVIEW DETAILS</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Label>Name</Label>
                <Text style={styles.info}>{params.name}</Text>
                <Label>E-mail</Label>
                <Text style={styles.info}>{params.email}</Text>
                <Label>Phone</Label>
                <Text style={styles.info}>{params.phone}</Text>
                <Label>College</Label>
                <Text style={styles.info}>{params.college}</Text>
                <Label>Events</Label>
                <View style={styles.rowLabel}>
                  {
                  this.state.events.map( item => 
                    <View style={styles.badge}>
                      <Text style={{color: '#fff', fontSize: 14}}>{item}</Text>
                    </View>
                  )}
                </View>
                <Label>COST</Label>
                <Text style={styles.info}>&#8377;&nbsp;&nbsp;{params.price}</Text>
              </Body>
            </CardItem>
            
          <View style={{padding: 20}}>
          <Button block danger onPress={this.handleSubmit.bind(this)}>
            <Text>OK</Text>
          </Button>
          {this.state.isLoading ? <Spinner color={GLOBALS.primaryColor} />: <Text></Text>}
        </View>
          </Card>
          <Toast ref={c => {this.toast = c}} />
        </Content>
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  info: {
    fontSize: 18,
    margin: 10,
    color: GLOBALS.primaryColorDark
  },
  rowLabel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: 10
  },
  badge: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: GLOBALS.primaryColor,
    margin: 5
  },
})