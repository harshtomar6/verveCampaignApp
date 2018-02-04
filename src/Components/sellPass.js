import React from 'react';
import { View, StyleSheet, AsyncStorage, Dimensions, Image } from 'react-native';
import { Text, Button, Body, Card, CardItem, Form, Item, Label, Input } from 'native-base';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class SellPass extends React.Component {

  constructor(){
    super();
    this.state = {
      userData : null
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

  render(){

    let content = this.state.userData === null ? <Text>Cannot retreive user data</Text>:
      this.state.userData.passesAlloted === 0 ? 
      <View style={styles.innerContainer}>
        <Image source={require('./../sad.png')} style={{ width: 120, height: 120}}/>
        <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
          You have been not alloted passes yet !
        </Text>
        <View style={{justifyContent: 'center', padding: 15}}>
        <Button primary> 
          <Text>Request Admin</Text> 
        </Button>
        </View>
      </View> :
      <Card>
        <CardItem header>
          <Text style={{color: GLOBALS.primaryColorDark}}>ENTER PARTICIPANT DETAILS</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Form>
              <Item stackedLabel style={{width: 300}}>
                <Label>Full Name</Label>
                <Input />
              </Item>
              <Item stackedLabel style={{width: 300}}>
                <Label>Email</Label>
                <Input />
              </Item>
              <Item stackedLabel style={{width: 300}}>
                <Label>Phone</Label>
                <Input />
              </Item>
              <Item stackedLabel style={{width: 300}}>
                <Label>College</Label>
                <Input />
              </Item>
              <Item stackedLabel style={{width: 300}}>
                <Label>Pass Type </Label>
                <Input />
              </Item>
            </Form>
          </Body>
        </CardItem>
        <CardItem footer>
          
          <Button block danger>
            <Text>Submit</Text>
          </Button>
        </CardItem>
      </Card>

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
  }
})