import React from 'react';
import { View, Stylesheet, StyleSheet } from 'react-native';
import { 
  Container,
  Icon,
  Button,
  Content,
  Text,
  Footer,
  Spinner,
  FooterTab,
  Toast, ActionSheet
} from 'native-base';
import AppBar from './../Components/header';
let GLOBALS = require('./../globals');

export default class VolunteerScreen extends React.Component {

  constructor(){
    super();
    this.state = {
      appBarTitle: 'Verve 2018',
      tabs: [styles.active, styles.inactive, styles.inactive, styles.inactive],
      icon: 'more'
    }
  }

  componentWillUnmount(){
    Toast.toastInstance = null;
    ActionSheet.actionsheetInstance = null;
  }

  _handleTabTouch(e){
    this.updateTabStyle(e)
  }

  updateTabStyle(ref){
    switch(ref){
      case 0:
        this.setState({
          tabs: [styles.active, styles.inactive, styles.inactive, styles.inactive],
          appBarTitle: 'Verve 2018',
          icon: 'more'
        });
        break;
      case 1:
        this.setState({
          tabs: [styles.inactive, styles.active, styles.inactive, styles.inactive],
          appBarTitle: 'Add New Purchase',
          icon: 'search'
        });
        break;
      case 2:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.active, styles.inactive],
          appBarTitle: 'Alerts',
          icon: 'none'
        });
        break;
      case 3:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.inactive, styles.active],
          appBarTitle: 'About',
          icon: 'none'
        })
    }
  }

  render(){
    return (
      <Container>
        <AppBar title={this.state.appBarTitle} icon={this.state.icon} left='none'
          navigation={this.props.navigation} />
        <Content>

        </Content>
        <Footer>
          <FooterTab style={styles.tabs}>
            <Button vertical ref={0} onPress={() => this._handleTabTouch(0)}>
              <Icon name="home" style={this.state.tabs[0]}/>
              <Text style={this.state.tabs[0]}>Home</Text>
            </Button>
            <Button vertical ref={1} onPress={() => this._handleTabTouch(1)}>
              <Icon name="add" style={this.state.tabs[1]}/>
              <Text style={this.state.tabs[1]}>Add</Text>
            </Button>
            <Button vertical ref={2} onPress={() => this._handleTabTouch(2)}>
              <Icon name="alert" style={this.state.tabs[2]}/>
              <Text style={this.state.tabs[2]}>Alerts</Text>
            </Button>
            <Button vertical ref={3} onPress={() => this._handleTabTouch(3)}>
              <Icon name="information-circle" style={this.state.tabs[3]}/>
              <Text style={this.state.tabs[3]}>About</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container:{

  },
  tabs: {
    backgroundColor: '#fff'
  },
  active: {
    color: GLOBALS.primaryColorDark
  },
  inactive: {
    color: GLOBALS.primaryColorInactive
  }
})