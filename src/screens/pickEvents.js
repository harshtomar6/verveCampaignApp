import React from 'react';
import { View, StyleSheet, ListView, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Body, Text, Button, Spinner, Toast, CheckBox, 
  Separator, Left, List, ListItem, Right, Footer, Icon } from 'native-base';
import AppBar from './../Components/header';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class PickEvents extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      data: [],
      isLoading: false,
      checked: false,
      category: {},
      selected: [],
      totalPrice: 0
    }
  }

  componentWillMount(){
    if(GLOBALS.events.length > 0){
      this.setState({data: GLOBALS.events}, () => {
        this.categorizeData(this.state.data)
      })
    }
    else
      this.fetchData();
  }

  componentWillReceiveProps(newProps){
    if(newProps.refresh)
      this.fetchData()
  }

  fetchData(){
    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getEvents')
      .then(res => {
        this.setState({isLoading: false})
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
        GLOBALS.events = JSON.parse(res._bodyText).data
        this.setState({data: JSON.parse(res._bodyText).data}, () => {
          this.categorizeData(this.state.data)
        })
      })
      .catch(err => {
        this.setState({isLoading: false})
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

  categorizeData(data){
    let category = this.state.category
    let i=0;
    data.forEach(d => {
      i++;
      if(!category[d.type])
        category[d.type] = []
      
      category[d.type].push(d);
      if(i == data.length)
        this.setState({category});
    })
  }

  handlePress(_id, name){
    const { navigate } = this.props.navigation;
    navigate('eventDetails', {
      _id,
      name,
      type: this.props.type
    })
  }

  handleCheck(_id, ticket){
    let selected = this.state.selected;
    let price = this.state.totalPrice;
    let data = this.state.data;

    if(selected.includes(_id)){
      selected.splice(selected.indexOf(_id), 1)
      price -= ticket
    }
    else{
      selected.push(_id)
      price += ticket
    }

    
    this.setState({selected, totalPrice: price});
  }

  handleSubmit(){
    if(this.state.selected.length === 0)
      return this.toast._root.showToast({config: {
        text: 'Atleast 1 Event must be selected !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    else{
      const { navigate } = this.props.navigation;
      navigate('reviewSell', {
        name: this.props.navigation.state.params.name,
        email: this.props.navigation.state.params.email,
        phone: this.props.navigation.state.params.phone,
        college: this.props.navigation.state.params.college,
        events: this.state.selected,
        price: this.state.totalPrice
      });
    }
  }

  handleComboPress(){
    const { navigate } = this.props.navigation;

    let selected = [
      "5ab664c2a8cb34214472add8",
      "5a8af4cd191fb64044a1fecf",
      "5a8af4e2191fb64044a1fed0",
      "5a8af4f4191fb64044a1fed1",
      "5a8af509191fb64044a1fed2",
      "5a8af5b3191fb64044a1fed6",
      "5a8af5c7191fb64044a1fed7",
      "5a8af5d4191fb64044a1fed8",
      "5ab66757a8cb34214472adda",
      "5ab6772ca8cb34214472ade2",
      "5a8af6db191fb64044a1fee5",
      "5ab67836a8cb34214472ade5",
      "5a8af77d191fb64044a1feec",
      "5ab66834a8cb34214472adde",
      "5a8af6b7191fb64044a1fee3",
      "5a8af6ce191fb64044a1fee4"
    ]
    if(!this.state.isLoading)
      navigate('reviewSell', {
        name: this.props.navigation.state.params.name,
        email: this.props.navigation.state.params.email,
        phone: this.props.navigation.state.params.phone,
        college: this.props.navigation.state.params.college,
        events: selected,
        price: 200
      });
    else
      alert('Tap after events are loaded');
  }

  handleConcertPress(){
    let { navigate } = this.props.navigation;

    navigate('reviewSell', {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      phone: this.props.navigation.state.params.phone,
      college: this.props.navigation.state.params.college,
      events: 'ARMAN MALIK LIVE CONCERT',
      price: 250
    })
  }

  render(){
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });
    
    let list = <View>
      <ListView
        dataSource={ds.cloneWithRowsAndSections(this.state.category)}
        renderRow={
        (item) => <ListItem avatar button onPress={() => {this.handleCheck(item._id, item.ticket)}}>
                      <Left style={{marginRight: 20, marginLeft: -10}}>
                        <CheckBox color={GLOBALS.primaryColor} 
                          checked={this.state.selected.includes(item._id) ? true : false}
                          onPress={() => this.handleCheck(item._id, item.ticket)}/>
                      </Left>
                      <Body style={{marginLeft: 10}}>
                        <Text>{item.name}</Text>
                        <Text note>No per Team: {item.team}</Text>
                        <Text note>Ticket Price: &#8377;{item.ticket}</Text>
                      </Body>
                      <Right>
                        <Button small danger onPress={() => this.handlePress(item._id, item.name)}>
                          <Text>More</Text>
                        </Button>
                      </Right>
                    </ListItem>
        }
        renderSectionHeader={
        (sectionData, category) => <Separator bordered>
          <Text style={styles.title}>{category}</Text>
        </Separator>
        }
        />
    </View>
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: list
    
    return (
      <Container>
        <AppBar title='Pick Events' left='arrow-back' navigation={this.props.navigation} />
    
        <Content>
          <ScrollView horizontal>
            <View style={{backgroundColor: '#fff', flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => this.handleComboPress()} activeOpacity={0.7}>
                <View style={styles.card}>
                  <Text style={{color: '#fff', fontSize: 20, fontWeight: '700'}}>SRT COMBO</Text>
                  <Text style={{color: '#fff'}}>16 Events &#8377; 200</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.handleConcertPress()} activeOpacity={0.7}>
                <View style={styles.card}>
                  <Text style={{color: '#fff', fontSize: 20, fontWeight: '700'}}>CONCERT</Text>
                  <Text style={{color: '#fff'}}>&#8377;&nbsp;&nbsp;250</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={{flex: 1, backgroundColor: '#fff'}}>
          {showSpinner}
          </View>
          <View style={{backgroundColor: '#fff', height: this.state.isLoading ? 0 : 80 }}></View>
        </Content>
          <View style={styles.footer}>
            <View style={{paddingTop: 5, paddingBottom: 5}}>
            <Text style={styles.footerTitle}>
              SELECTED: &nbsp;&nbsp;{this.state.selected.length}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; &#8377;
              &nbsp;&nbsp;{this.state.totalPrice}
            </Text>
            </View>
            <Button transparent small style={{padding: 0}} onPress={this.handleSubmit.bind(this)}>
            <Icon name="arrow-forward" style={{color: '#fff', fontSize: 18}} />
            </Button>
          </View>
        <Toast ref={c=>{this.toast = c}} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: GLOBALS.primaryColor,
    margin: 10,
    fontSize: 14
  },
  footer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 20,
    width: Dimensions.get('window').width -30,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: GLOBALS.primaryColor,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerTitle: {
    color: '#fff',
    fontSize: 15
  },
  card: {
    borderRadius: 10,
    backgroundColor: GLOBALS.primaryColor,
    margin: 10,
    width: Dimensions.get('window').width/2,
    padding: 20
  }
});