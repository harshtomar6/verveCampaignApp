import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Card, CardItem, Text } from 'native-base';
let GLOBALS = require('./../globals');

export default class About extends React.Component {

  render(){
    return (
      <View style={styles.container}>
        <Card>
          <CardItem header>
            <Text style={styles.heading}>Designed & Developed By:</Text>
          </CardItem>
        </Card>
        
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  heading: {
    color: GLOBALS.primaryColor
  }
})
