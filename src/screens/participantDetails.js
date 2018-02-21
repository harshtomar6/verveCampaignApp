import React from 'react';
import { StyleSheet, View, Linking} from 'react-native';
import {Toast, Spinner, Container, Content, Body, Card, CardItem, Button, Label,
   Text, Icon} from 'native-base';
import AppBar from './../Components/header';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class ParticipantDetails extends React.Component {
  constructor(){
    super();
    this.callNumber = this.callNumber.bind(this);
    this.toast = null;
    this.state = {
      data: '',
      isLoading: true,
      participantId: ''
    }
  }

  componentWillMount(){
    this.setState({
      participantId: this.props.navigation.state.params.participantId
    })

    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getParticipantDetails', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: this.props.navigation.state.params.participantId})
    })
      .then(res => {
        if(!res.ok){
          this.setState({isLoading: false})
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
        
        this.setState({data: JSON.parse(res._bodyText).data}, () => {
          this.setState({isLoading: false})
        })
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
  }

  callNumber(phoneNumber){
    Linking.canOpenURL(phoneNumber).then(supported => {
      if(!supported)
        alert('Cannot handle');
      else
        return Linking.openURL(phoneNumber);
    }).catch(err => alert(err))
  }

  render(){
    const {params} = this.props.navigation.state;
    let eventsInfo = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} /> :
      <CardItem>
        <Body>
          <Label>Events Registered</Label>
          <View style={styles.rowLabel}>
            {
            this.state.data.eventsRegistered.map( item => 
              <View style={styles.badge}>
                <Text style={{color: '#fff', fontSize: 14}}>{item}</Text>
              </View>
            )}
          </View>
          <Label>Events Attended</Label>
          <View style={styles.rowLabel}>
            {
            this.state.data.eventsAttended.map( item => 
              <View style={styles.badge2}>
                <Text style={{color: '#fff', fontSize: 14}}>{item}</Text>
              </View>
            )}
          </View>
        </Body>
      </CardItem>
    let info = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} /> : 
      <CardItem>
        <Body>
          <Label>Participant ID</Label> 
          <Text style={styles.info}>{this.state.data.id}</Text>
          <Label>Name</Label>
          <Text style={styles.info}>{this.state.data.name}</Text>
          <Label>E-mail</Label>
          <View style={styles.row}>
            <View style={{width: '90%'}}>
              <Text style={styles.info}>{this.state.data.email}</Text>
            </View>
            <View>
              <Button transparent 
                onPress={() => this.callNumber(`mailto:${this.state.data.email}`)}>
                <Icon name="mail" style={{fontSize: 22, color: '#FC4442'}}/>
              </Button>
            </View>
          </View>
          <Label>Phone</Label>
          <View style={styles.row}>
            <View style={{width: '75%'}}>
              <Text style={styles.info}>{this.state.data.phone}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Button transparent title='Call Now'
                onPress={() => this.callNumber(`tel:+91${this.state.data.phone}`)}>
                <Icon name="call" style={{fontSize: 22}}/>
              </Button>
              <Button transparent title='Send SMS'
                onPress={() => this.callNumber(`sms:+91${this.state.data.phone}`)}>
                <Icon name='text' style={{fontSize: 24, marginLeft: 10}} />
              </Button>
            </View>
          </View>
        </Body>
      </CardItem>

    return (
      <Container>
        <AppBar title={params.participantName} left='arrow-back'
          icon='none' navigation={this.props.navigation} noShadow={true}/>
        <Content>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {params.eventsRegistered >= 0 ? params.eventsRegistered : this.state.isLoading ? '-' : this.state.data.passesSold } 
                &nbsp;Events Registered</Text>
            <Text style={{color: '#fff'}}>
              {params.eventsAttended.length > 1 ? params.eventsAttended.length: params.eventsAttended[0] === 'none'? 
                '0': '1'} 
                &nbsp;Events Attended
            </Text>
          </View>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>EVENTS INFORMATION</Text>
            </CardItem>
            {eventsInfo}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>OTHER INFORMATION</Text>
            </CardItem>
            {info}
          </Card>
        </Content>
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: GLOBALS.primaryColor,
    paddingTop: 50,
    paddingBottom: 50,
    alignItems: 'center'
  },
  bannerText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '800'
  },
  info: {
    fontSize: 18,
    margin: 10
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    backgroundColor: '#FC4442',
    margin: 5
  },
  badge2: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: GLOBALS.primaryColor,
    margin: 5
  }
})