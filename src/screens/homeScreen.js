import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { 
  Container,
  Icon,
  Button,
  Content,
  Text,
  Footer,
  Spinner,
  FooterTab
} from 'native-base';
import AppBar from './../Components/header';
import About from './../Components/about';
import Volunteers from './../Components/volunteers';
import AdminHome from './../Components/adminHome';
let GLOBALS = require('./../globals');

export default class HomeScreen extends React.Component {
  constructor(){
    super();
    this.tabView = null;
    this.isLoading = this.isLoading.bind(this);
    this.state = {
      tabs: [styles.active, styles.inactive, styles.inactive],
      appBarTitle: 'Verve 2018',
      icon: 'more',
      isLoading: true
    }
  }

  _handleTabTouch(e){
    this.updateTabStyle(e)
  }

  updateTabStyle(ref){
    switch(ref){
      case 0:
        this.setState({
          tabs: [styles.active, styles.inactive, styles.inactive],
          appBarTitle: 'Verve 2018',
          icon: 'more'
        });
        break;
      case 1:
        this.setState({
          tabs: [styles.inactive, styles.active, styles.inactive],
          appBarTitle: 'Volunteers',
          icon: 'search'
        });
        break;
      case 2:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.active],
          appBarTitle: 'About',
          icon: 'none'
        });
        break;
    }
  }

  isLoading(data){
    this.setState({isLoading: data})
  }

  render(){
    const { navigate } = this.props.navigation;
    let content=<Text></Text>;

    if (this.state.tabs[0] === styles.active)
      content = <AdminHome />

    if (this.state.tabs[1] === styles.active)
      content= <Volunteers navigation={this.props.navigation} isLoading={this.isLoading} />

    if (this.state.tabs[2] === styles.active)
      content = <About />

    return(
      <Container>
        <AppBar title={this.state.appBarTitle} left='none'
         icon={this.state.icon} isLoading={this.state.isLoading}
         navigation = {this.props.navigation} />
        <Content >
          {content}
        </Content>
        <Footer>
          <FooterTab style={styles.tabs}>
            <Button vertical ref={0} onPress={() => this._handleTabTouch(0)}>
              <Icon name="home" style={this.state.tabs[0]}/>
              <Text style={this.state.tabs[0]}>Home</Text>
            </Button>
            <Button vertical ref={1} onPress={() => this._handleTabTouch(1)}>
              <Icon name="people" style={this.state.tabs[1]}/>
              <Text style={this.state.tabs[1]}>Volunteers</Text>
            </Button>
            <Button vertical ref={2} onPress={() => this._handleTabTouch(2)}>
              <Icon name="information-circle" style={this.state.tabs[2]}/>
              <Text style={this.state.tabs[2]}>About</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )    
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
