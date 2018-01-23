import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, CardItem, Spinner, List, ListItem } from 'native-base';
let GLOBALS = require('./../globals');
const config = require('./../config');

export default class AdminHome extends React.Component {

  constructor(){
    super();
    this.state = {
      recentActivity: [],
      isLoading: false
    };
  }

  componentWillMount(){
    if(GLOBALS.recentActivity.length > 0){
      this.setState({recentActivity: GLOBALS.recentActivity})
      //this.props.isLoading(false)
    }
    else{
      this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getRecentActivity')
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
          GLOBALS.recentActivity = JSON.parse(res._bodyText).data
          this.setState({recentActivity: JSON.parse(res._bodyText).data})
          //this.props.isLoading(false)
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

  render(){
    let recentActivity = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: 
      <List dataArray={this.state.recentActivity}
        renderRow={(item) => 
          <ListItem>
            <Text>{item.description}</Text>
          </ListItem>
        }></List>
    return (
      <View style={styles.container}>
        <Card>
          <CardItem header>
            <Text style={{color: GLOBALS.primaryColorDark}}>SUMMARY</Text>
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text style={{color: GLOBALS.primaryColorDark}}>Recent Activity</Text>
          </CardItem>
          <CardItem>
            {recentActivity}
          </CardItem>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})