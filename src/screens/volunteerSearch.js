import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Header, Content, Text, Left, Button,
  Icon, Item, Input, Body, Form, List, ListItem, Right, Thumbnail } from 'native-base';
const GLOBALS = require('./../globals');

export default class VolunteerSearch extends React.Component {

  constructor(){
    super();
    this.state = {
      searchText: '',
      volunteerList: GLOBALS.volunteerList,
      searchResult: []
    }
  }

  handleChange(text){
    let result = []
    this.setState({searchText: text, searchResult: []}, () => {
      result = this.state.searchResult;
    })
    let i=0;

    if(text == '')
      return this.setState({searchResult: []})

    this.state.volunteerList.forEach((item) => {
      i++;
      if(item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1){
        result.push(item);
      }else{
        //let index = this.state.volunteerList.indexOf(item);
        //if(index !== -1)
          //result.splice(index, 1);
      }

      if(i === this.state.volunteerList.length){  
        this.setState({searchResult: result})
      }
    })
  }

  handlePress(volunteerId, volunteerName, passesSold){
    const { navigate } = this.props.navigation;
    navigate('volunteerDetails', {
      volunteerId,
      volunteerName,
      passesSold
    })
  }

  render(){
    const { goBack } = this.props.navigation;
    return (  
      <Container>
        <Header androidStatusBarColor={GLOBALS.primaryColorDark}
           style={styles.header} searchBar rounded>
          <Left>  
            <Button transparent onPress={() => goBack()}>
              <Icon name='arrow-back' style={{color: '#fff'}} />
            </Button>
          </Left> 
          <Item style={{left: -60}}>
            <Input placeholder='Search by name' 
              onChangeText={(text) => this.handleChange(text)} autoFocus/>
          </Item>
        </Header>

        <Content>
          <Text style={{color: GLOBALS.primaryColorInactive, margin: 10}}>
            Search Results for&nbsp;  
            <Text style={{color: GLOBALS.primaryColorDark}}>
               {this.state.searchText}
            </Text>
          </Text>
          <View style={{backgroundColor:'#fff'}}>
          <List dataArray={this.state.searchResult}
          renderRow={item => 
            <ListItem button avatar
              onPress={() => this.handlePress(item._id, item.name, item.passesSold)}>
              <Left>
                <Thumbnail source={require('./../volunteer-thumbnail.png')} />
              </Left>
              <Body>
                <Text>{item.name}</Text>
                <Text note>Passes Sold: {item.passesSold}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"></Icon>
              </Right>
            </ListItem>  
          }></List>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: GLOBALS.primaryColor
  }
})