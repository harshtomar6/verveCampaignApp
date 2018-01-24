import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, ListItem, Text, Spinner, Left, Body, Right,
  Thumbnail, Icon, Toast } from 'native-base';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class RecentActivity extends React.Component {
  constructor(){
    super();
    this.state = {
      data: [],
      isLoading: false
    }
  }

  componentWillMount(){

    if(GLOBALS.recentActivityFull.length > 0){
      this.setState({data: GLOBALS.recentActivityFull})
    }
    else{
      this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getAllRecentActivity')
        .then(res => {
          this.setState({isLoading: false})
          if(!res.ok)
            return Toast.show({
              text: JSON.parse(res._bodyText).err,
              position: 'bottom',
              buttonText: 'Okay',
              duration: 3000,
              style: {
                 backgroundColor: GLOBALS.primaryErrColor
              }
            })
          GLOBALS.recentActivityFull = JSON.parse(res._bodyText).data
          this.setState({data: JSON.parse(res._bodyText).data})
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

  handlePress(volunteerId, volunteerName){
    const { navigate } = this.props.navigation;
    navigate('volunteerDetails', {
      volunteerId,
      volunteerName
    })
  }

  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <View style={styles.container}>
        {showSpinner}
        <List dataArray={this.state.data}
          renderRow={item => 
            <ListItem button avatar 
              onPress={() => this.handlePress(item.owner.id, item.owner.name)}>
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
                <Icon name="arrow-forward"></Icon>
              </Right>
            </ListItem>  
          }></List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});