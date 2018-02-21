import React from 'react';
import { StyleSheet, View, Alert, Linking, Modal } from 'react-native';
import { Container, Icon, Right, Body, Content, Card,
   Text, CardItem, Spinner, Toast, Button, Form,
   Item, Label, Input, ActionSheet } from 'native-base';
import AppBar from './../Components/header';
const config = require('./../config');
let GLOBALS = require('./../globals');

export default class VolunteerDetails extends React.Component {

  constructor(){
    super();
    this.callNumber = this.callNumber.bind(this);
    this.toast = null;
    this.state = {
      data: '',
      isLoading: false,
      volunteerId: '',
      modalVisible: false,
      passes: '',
      allotingPasses: false,
      resetModalVisible: false,
      resettingPasses: false
    }
  }

  componentWillMount(){
    this.setState({
      volunteerId: this.props.navigation.state.params.volunteerId
    })
  }

  componentDidMount(){
    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getVolunteerDetail', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: this.props.navigation.state.params.volunteerId})
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
        
        this.setState({data: JSON.parse(res._bodyText).data})
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

  handleDelete(){
    Alert.alert(
      'Block Volunteer',
      'Are You Sure ? ',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.blockVolunteer},
      ],
      { cancelable: false }
    )
  }

  handleReset(){
    this.setState({resetModalVisible: true})
  }

  resetPasses(){
    this.setState({resettingPasses: true});
    GLOBALS.socket.emit('reset-passes', {id: this.state.volunteerId})
    GLOBALS.socket.on('ok', data => {
      this.setState({resettingPasses: false, resetModalVisible: false})
      let d = this.state.data;
      d.passesAlloted = 0;
      this.setState({data: d})
      if(this.toast !== null)
      this.toast._root.showToast({config:{
        text: 'Passes Resetted',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryColor
        }
      }})
    })
    GLOBALS.socket.on('err', data => {
      this.setState({resetPasses: false, resetModalVisible: false});
      if(this.toast !== null)
      this.toast._root.showToast({config:{
        text: 'An Error Occured !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    })
  }

  blockVolunteer(){
    
  }

  allotPasses(){
    if(this.state.passes > 0){
      this.setState({allotingPasses: true})
      fetch(config.SERVER_URI+'/allotPasses', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.props.navigation.state.params.volunteerId,
          passes: this.state.passes
        })
      })
        .then(res => {
          this.setState({allotingPasses: false, modalVisible: false})
          if(!res.ok){
            if(this.toast !== null)
            return this.toast._root.showToast({config: {
              text: JSON.parse(res._bodyText).err,
              position: 'bottom',
              buttonText: 'Okay',
              duration: 3000,
              style: {
                backgroundColor: GLOBALS.primaryErrColor
              }
            }})
          }
          let d = this.state.data;
          d.passesAlloted = this.state.passes;
          this.setState({data: d})
          GLOBALS.socket.emit('allot-passes', {id: this.state.volunteerId, passes: this.state.passes})
          if(this.toast !== null)
            this.toast._root.showToast({config: {
              text: 'Passes Alloted',
              position: 'bottom',
              buttonText: 'Okay',
              duration: 3000,
              style: {
                backgroundColor: GLOBALS.primaryColor
              }
            }})
        })
        .catch(err => {
          alert(err)
          this.setState({allotingPasses: false})
          if(this.toast !== null)
            this.toast._root.showToast({config:{
              text: 'An Error Occured !',
              position: 'bottom',
              buttonText: 'Okay',
              duration: 3000,
              style: {
                backgroundColor: GLOBALS.primaryErrColor
              }
            }})
        })
    }else{
      this.setState({modalVisible: false})
      if(this.toast !== null)
      this.toast._root.showToast({config:{
        text: 'Passes number should be greater than 0 !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    }
  }

  render(){
    const {params} = this.props.navigation.state;
    let infoColor = this.state.data.passesAlloted === 0 ? '#FC4442': GLOBALS.primaryColorDark
    let passesInfo = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} /> :
      <CardItem>
        <Body>
          <View style={styles.row}>
            <View style={{width: '50%'}}>
              <Text style={styles.info}>Passes Status</Text>
            </View>
            <View>
              <Text 
                style={{fontSize: 18, margin: 10, color: infoColor, fontWeight: '700' }}>
                {this.state.data.passesAlloted === 0 ? 'Not Alloted': 'Alloted'}
              </Text>
            </View>
          </View>
          <Text></Text>
          {this.state.data.passesAlloted === 0 ? 
          <Button block style={{backgroundColor: GLOBALS.primaryColor}}
            onPress={() => this.setState({modalVisible: true})}>
            <Text>Allot Passes</Text>            
          </Button> : 
          <Button block style={{backgroundColor: GLOBALS.primaryColor}}
            onPress={() => this.setState({modalVisible: true})}>
            <Text>Change Alloted Passses</Text>            
          </Button>}
        </Body>
      </CardItem>

    let info = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} /> : 
      <CardItem>
        <Body>
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
          <Label>USN</Label> 
          <Text style={styles.info}>{this.state.data.userid}</Text>
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
        <AppBar title={params.volunteerName ? params.volunteerName: this.state.isLoading ? '-': this.state.data.name} 
          left='arrow-back' icon='none' navigation={this.props.navigation} noShadow />
        <Modal visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}
          animationType={'fade'} transparent>
          <View onResponderGrant={() => this.setState({modalVisible: false})} 
            style={styles.modalOuterContainer}>
            <View style={styles.modalInnerContainer}>
              <Text style={styles.modalTitle}>Allot Passes</Text>
              <Text style={styles.modalSubTitle}>Enter number of passes</Text>
              <Item success>
                <Input placeholder="eg: 100" keyboardType='numeric' 
                  value={this.state.passes} autoFocus
                  onChangeText={(num) => this.setState({passes: num})} />
              </Item>
              <View style={styles.modalFooter}>
                <Button transparent
                  onPress={() => this.setState({modalVisible: false})}>
                  <Text style={{color: GLOBALS.primaryColorDark}}>CANCEL</Text>
                </Button>
                <Button transparent onPress={this.allotPasses.bind(this)}>
                  <Text style={{color: GLOBALS.primaryColorDark}}>OK</Text>
                </Button>
              </View>
              {this.state.allotingPasses ? <Spinner color={GLOBALS.primaryColorDark} /> : <Text></Text>}
            </View>
          </View>
        </Modal>

        {/* RESET PASSES MODAL*/}
        
        <Modal visible={this.state.resetModalVisible}
          onRequestClose={() => this.setState({resetModalVisible: false})}
          animationType={'fade'} transparent>
          <View onResponderGrant={() => this.setState({resetModalVisible: false})} 
            style={styles.modalOuterContainer}>
            <View style={styles.modalInnerContainer}>
              <Text style={styles.modalTitle}>Reset Alloted Passes</Text>
              <Text style={styles.modalSubTitle}>Are You Sure</Text>
              <View style={styles.modalFooter}>
                <Button transparent
                  onPress={() => this.setState({resetModalVisible: false})}>
                  <Text style={{color: GLOBALS.primaryColorDark}}>CANCEL</Text>
                </Button>
                <Button transparent onPress={this.resetPasses.bind(this)}>
                  <Text style={{color: GLOBALS.primaryColorDark}}>OK</Text>
                </Button>
              </View>
              {this.state.resettingPasses ? <Spinner color={GLOBALS.primaryColorDark} /> : <Text></Text>}
            </View>
          </View>
        </Modal>
        
        <Content>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {params.passesSold >= 0 ? params.passesSold : this.state.isLoading ? '-' : this.state.data.passesSold } 
                &nbsp;Passes Sold</Text>
            <Text style={{color: '#fff'}}>
              {this.state.isLoading ? '-': this.state.data.passesAlloted} Passes Alloted
            </Text>
          </View>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>PASSES INFORMATION</Text>
            </CardItem>
            {passesInfo}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>OTHER INFORMATION</Text>
            </CardItem>
            {info}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>ACTIONS</Text>
            </CardItem>
            <CardItem>
              <Body>
              <Button block primary onPress={this.handleReset.bind(this)}>
                <Text>Reset Alloted Passes</Text>
              </Button>
              <Text></Text>
              <Text></Text>
              <Button block danger onPress={this.handleDelete.bind(this)}>
                <Text>Block Volunteer</Text>
              </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>
        <Toast ref={(c) => {this.toast = c; }} />
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
  modalOuterContainer: {
    flex: 1, 
    justifyContent: 'center', 
    paddingLeft: 25, 
    paddingRight: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalInnerContainer: {
    padding: 20,
    paddingBottom: 5,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {width: 2, height: 10},
    shadowRadius: 3,
    borderRadius: 2
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: 20
  },
  modalSubTitle:{
    marginTop: 15,
    marginBottom: 15,
    fontWeight: '200'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20
  }  
})