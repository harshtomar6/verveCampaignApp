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
  FooterTab, Toast, ActionSheet
} from 'native-base';
import AppBar from './../Components/header';
import About from './../Components/about';
import Volunteers from './../Components/volunteers';
import AdminHome from './../Components/adminHome';
import RecentActivity from './../Components/recentActivity';
let GLOBALS = require('./../globals');

export default class HomeScreen extends React.Component {
  constructor(){
    super();
    this.tabView = null;
    this.isLoading = this.isLoading.bind(this);
    this.state = {
      tabs: [styles.active, styles.inactive, styles.inactive, styles.inactive, styles.inactive],
      tabsText: [styles.tabTextActive, styles.tabsTextInactive, 
        styles.tabsTextInactive, styles.tabsTextInactive, styles.tabsTextInactive],
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
          tabs: [styles.active, styles.inactive, styles.inactive, styles.inactive, styles.inactive],
          tabsText: [styles.tabTextActive, styles.tabsTextInactive, 
            styles.tabsTextInactive, styles.tabsTextInactive, styles.tabsTextInactive],
          appBarTitle: 'Verve 2018',
          icon: 'more'
        });
        break;
      case 1:
        this.setState({
          tabs: [styles.inactive, styles.active, styles.inactive, styles.inactive, styles.inactive],
          tabsText: [styles.tabsTextInactive, styles.tabTextActive, 
            styles.tabsTextInactive, styles.tabsTextInactive, styles.tabsTextInactive],
          appBarTitle: 'Requests',
          icon: 'none'
        });
        break;
      case 2:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.active, styles.inactive, styles.inactive],
          tabsText: [styles.tabsTextInactive, styles.tabsTextInactive, 
            styles.tabTextActive, styles.tabsTextInactive, styles.tabsTextInactive],
          appBarTitle: 'People',
          icon: 'search',
          hasTabs: true
        });
        break;
      case 3:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.inactive, styles.active, styles.inactive],
          tabsText: [styles.tabsTextInactive, styles.tabsTextInactive, 
            styles.tabsTextInactive, styles.tabTextActive, styles.tabsTextInactive],
          appBarTitle: 'Recent Activity',
          icon: 'none'
        })
        break;
      case 4:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.inactive, styles.inactive, styles.active],
          tabsText: [styles.tabsTextInactive, styles.tabsTextInactive, 
            styles.tabsTextInactive, styles.tabsTextInactive, styles.tabTextActive],
          appBarTitle: 'About',
          icon: 'none'
        })
    }
  }

  isLoading(data){
    this.setState({isLoading: data})
  }

  render(){
    const { navigate } = this.props.navigation;
    let content=<Text></Text>;

    if (this.state.tabs[0] === styles.active)
      content = <AdminHome navigation={this.props.navigation}/>

    if (this.state.tabs[1] === styles.active)
      content = <Text>Hello</Text>

    if (this.state.tabs[2] === styles.active)
      content= <Volunteers navigation={this.props.navigation} isLoading={this.isLoading} />
    
    if(this.state.tabs[3] === styles.active)
      content= <RecentActivity navigation={this.props.navigation} />

    if (this.state.tabs[4] === styles.active)
      content = <About />

    return(
      <Container>
        <AppBar title={this.state.appBarTitle} left='none'
         icon={this.state.icon} hasTabs={this.state.hasTabs}
         navigation = {this.props.navigation} />
        <Content >
          {content}
        </Content>
        <Footer style={{borderTopColor: GLOBALS.primaryColorInactive, borderTopWidth: 0.2}}>
          <FooterTab style={styles.tabs}>
            <Button vertical ref={0} onPress={() => this._handleTabTouch(0)}>
              <Icon name="home" style={this.state.tabs[0]}/>
              <Text style={this.state.tabsText[0]}>Home</Text>
            </Button>
            <Button vertical ref={1} onPress={() => this._handleTabTouch(1)}>
              <Icon name="logo-buffer" style={this.state.tabs[1]}/>
              <Text style={this.state.tabsText[1]}>Requests</Text>
            </Button>
            <Button vertical ref={2} onPress={() => this._handleTabTouch(2)}>
              <Icon name="people" style={this.state.tabs[2]}/>
              <Text style={this.state.tabsText[2]}>People</Text>
            </Button>
            <Button vertical ref={3} onPress={() => this._handleTabTouch(3)}>
              <Icon name="document" style={this.state.tabs[3]}/>
              <Text style={this.state.tabsText[3]}>Activity</Text>
            </Button>
            <Button vertical ref={4} onPress={() => this._handleTabTouch(4)}>
              <Icon name="information-circle" style={this.state.tabs[4]}/>
              <Text style={this.state.tabsText[4]}>About</Text>
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
    fontSize: 28,
    color: GLOBALS.primaryColorDark
  },
  inactive: {
    color: GLOBALS.primaryColorInactive
  },
  tabTextActive: {
    fontSize: 7.6,
    color: GLOBALS.primaryColorDark
  },
  tabsTextInactive: {
    fontSize: 7.6,
    color: GLOBALS.primaryColorInactive
  }
});
