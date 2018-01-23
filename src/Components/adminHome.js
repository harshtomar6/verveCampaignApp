import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, CardItem } from 'native-base';
let GLOBALS = require('./../globals');
const config = require('./../config');

export default class AdminHome extends React.Component {

  render(){
    return (
      <View style={styles.container}>
        <Card>
          <CardItem header>
            <Text style={{color: GLOBALS.primaryColorDark}}>SUMMARY</Text>
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