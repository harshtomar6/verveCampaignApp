import React from 'react';
import { View, StyleSheet, Image} from 'react-native';
import { Container, Text, Card, CardItem, Label, Toast, Content, Spinner, Body,
  Button } from 'native-base';
import AppBar from './../Components/header';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class EventDetails extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      data: [],
      isLoading: false
    }
  }

  componentWillMount(){
    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getEventById', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: this.props.navigation.state.params._id})
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

  handleUpdate(){
    const {navigate} = this.props.navigation;
    navigate('updateEvent', {
      name: this.state.data.name,
      team: this.state.data.team,
      ticket: this.state.data.ticket,
      day: this.state.data.place.day,
      time: this.state.data.place.time,
      place: this.state.data.place.venue,
      organiserName: this.state.data.organisers.name,
      contact: this.state.data.organisers.contact,
      firstPrize: this.state.data.prize.first,
      secondPrize: this.state.data.prize.second
    })
  }

  handlePress(){
    let {navigate} = this.props.navigation;
    navigate('eventParticipant', {
      event: this.state.data.name
    })
  }

  render(){
    let {params} = this.props.navigation.state;
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: <Text></Text>
    
    let info = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: 
      <CardItem>
        <Body>
        <Label>Event Name</Label>
        <Text style={styles.info}>{this.state.data.name}</Text>
        <Label>No. per Team</Label>
        <Text style={styles.info}>{this.state.data.team}</Text>
        <Label>Ticket Price</Label>
        <Text style={styles.info}>&#8377;&nbsp;{this.state.data.ticket}</Text>
        <Label>Event Type</Label>
        <Text style={styles.info}>{this.state.data.type}</Text>
        </Body>
      </CardItem>

    let venueInfo = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: 
      <CardItem>
        <Body>
        <Label>Day</Label>
        <Text style={styles.info}>{this.state.data.place.day}</Text>
        <Label>Time</Label>
        <Text style={styles.info}>{this.state.data.place.time}</Text>
        <Label>Place</Label>
        <Text style={styles.info}>{this.state.data.place.venue}</Text>
        </Body>
      </CardItem>
    
    let organiserInfo = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: 
      <CardItem>
        <Body>
        <Label>Name</Label>
        <Text style={styles.info}>{this.state.data.organisers.name}</Text>
        <Label>Contact</Label>
        <Text style={styles.info}>{this.state.data.organisers.contact}</Text>
        </Body>
      </CardItem>
    
    return (
      <Container>
        <AppBar title={params.name} left="arrow-back" icon="none" navigation={this.props.navigation} 
        noShadow={true}/>
        <Content>
          {params.type === 'admin' ?
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                {this.state.isLoading ? '-' : this.state.data.participantsRegistered} People Registered
              </Text>
              <Text style={{color: '#fff'}}>
                {this.state.isLoading ? '-': this.state.data.participantsAttended} People Attended
              </Text>
            </View>: <Text />
          }
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>PRIZE DETAILS</Text>
            </CardItem>
            <CardItem>
              <View style={{flex: 1,flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                  <Image style={{width: 60, height: 60}} source={require('./../prize1.png')}/>
                  <Text style={{fontWeight: '700', fontSize: 23, marginTop: 10}}>&#8377;&nbsp;
                    {this.state.isLoading ? '-' : this.state.data.prize.first}
                  </Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                  <Image style={{width: 60, height: 60}} source={require('./../prize2.png')}/>
                  <Text style={{fontWeight: '700', fontSize: 23, marginTop: 10}}>&#8377;&nbsp;
                    {this.state.isLoading ? '-' : this.state.data.prize.second}
                  </Text>
                </View>
              </View>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>ABOUT EVENT</Text>
            </CardItem>
            {info}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>VENUE DETAILS</Text>
            </CardItem>
            {venueInfo}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>ORGANISER DETAILS</Text>
            </CardItem>
            {organiserInfo}
          </Card>
          {params.type === 'admin' ?
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>ACTIONS</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Button block danger onPress={this.handlePress.bind(this)}>
                  <Text>View Participants</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
          : <Text/>
          }
        </Content>
        <Toast ref={c=>{this.toast = c}} />
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
  }
})