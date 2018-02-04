import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card, CardItem, Spinner, List, ListItem, Left, Thumbnail,
  Body, Right, Icon, Label, Toast } from 'native-base';
let GLOBALS = require('./../globals');
const config = require('./../config');

export default class AdminHome extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      data: [],
      isLoading: false,
      errLoading: false,
      swiper: [
        {
          text: 'ONE'
        },
        {
          text: 'TWO'
        },
        {
          text: 'THREE'
        }
      ]
    };
  }

  componentWillMount(){
    if(GLOBALS.recentActivity.hasOwnProperty('summary')){
      this.setState({data: GLOBALS.recentActivity})
      //this.props.isLoading(false)
    }
    else{
      this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getHomeData')
        .then(res => {
          if(!res.ok){
            this.setState({isLoading: false})
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
          GLOBALS.recentActivity = JSON.parse(res._bodyText).data
          this.setState({data: JSON.parse(res._bodyText).data}, () => {
            this.setState({isLoading: false})
          })
          //this.props.isLoading(false)
        })
        .catch(err => {
          this.setState({isLoading: false, errLoading: true})
          if(this.toast !== null)
          this.toast._root.showToast({config: {
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
  }

  getRecentActivityIcon(type){
    let icon = '';

    switch(type){
      case 'REGISTER':
        icon = require('./../volunteer-thumbnail.png');
        break;
      case 'PASS_SOLD':
        icon = require('./../dollarIcon.png');
        break;
      case 'LOGIN':
        icon = require('./../login.png');
        break;
      case 'LOGOUT':
        icon = require('./../logout.png');
        break;
      default:
        icon = '';
    }

    return icon;
  }

  activityPress(volunteerId, volunteerName, passesSold){
    const { navigate } = this.props.navigation;
    navigate('volunteerDetails', {
      volunteerId,
      volunteerName,
      passesSold
    })
  }

  render(){

    let summary = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} /> :
      this.state.errLoading ? <Text>Err Loading</Text>:
      <Body>
        <Label>Total Passes Alloted</Label>
        <Text style={styles.info}>{this.state.data.summary.totalPassesAlloted}</Text>
        <Label>Total Passes Sold</Label>
        <Text style={styles.info}>{this.state.data.summary.totalPassesSold}</Text>
        <Label>Total Volunteers Registered</Label>
        <Text style={styles.info}>{this.state.data.summary.totalVolunteersRegistered}</Text>
      </Body>

    let recentActivity = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: 
      this.state.errLoading ? <Text>Err Loading</Text>:
      <List dataArray={this.state.data.recentActivity}
        renderRow={(item) => 
          <ListItem button avatar
            onPress={() => this.activityPress(item.owner.id, item.owner.name)}>
            <Left>
              <Thumbnail style={{width: 45, height: 45}} source={this.getRecentActivityIcon(item.type)} />
            </Left>
            <Body>
              <Text>{item.description}</Text>
              <Text note>{new Date(item.time).toDateString()},&nbsp; 
                {new Date(item.time).toTimeString().split('GMT')[0]}
              </Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        }></List>
    return (
      <View style={styles.container}>
        <View style={{padding: 10, backgroundColor:'#fff'}}>
          
        </View>
        <Card>
          <CardItem header>
            <Text style={{color: GLOBALS.primaryColorDark}}>SUMMARY</Text>
          </CardItem>
          <CardItem>
            {summary}
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text style={{color: GLOBALS.primaryColorDark}}>RECENT ACTIVITY</Text>
          </CardItem>
          <CardItem style={{flex: 1}}>
            {recentActivity}
          </CardItem>
        </Card>
        <Toast ref={(c) => {this.toast = c}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  swiper: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 70,
    backgroundColor: '#fff'
  },
  banner: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 70,
    backgroundColor: GLOBALS.primaryColor
  },
  bannerText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '800'
  },
  info: {
    fontSize: 18,
    margin: 10,
    color: GLOBALS.primaryColorDark,
    fontWeight: '600'
  }
})