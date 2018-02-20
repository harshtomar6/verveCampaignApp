import React from 'react';
import { View ,StyleSheet} from 'react-native';
import { List, ListItem ,Seperator, Text, Spinner, Toast, Left, Body, Thumbnail, Right, Icon} from 'native-base';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class Events extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      isLoading: false,
      data: [],
      mainStageEvents: [],
      technicalEvents: []
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
          //this.categorizeData(this.state.data)
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

  handlePress(){

  }

  categorizeData(data){
    this.setState({
      mainStageEvents: data.filter(() => {return data.type === 'Main Stage Events'}),
      technicalEvents: data.filter(() => {return data.type === 'Technical Events'})
    })
  }

  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: <Text></Text>
    return (
      <View style={styles.container}>
        {showSpinner}
          <Seperator bordered>
            <Text>Main Stage Events</Text>
          </Seperator>
          <List dataArray={this.state.mainStageEvents}
          renderRow={item => 
            <ListItem button avatar 
              onPress={() => this.handlePress(item.id, item.name, item._id)}>
              <Left>
                <Thumbnail style={{width: 45, height: 45}} source={require('./../7.png')} />
              </Left>
              <Body>
                <Text>{item.name}</Text>
                <Text note>No per Team: {item.team}</Text>
                <Text note>Ticket Price: &#8377;{item.ticket}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"></Icon>
              </Right>
            </ListItem>  
            }></List>
          <Toast ref={c => {this.toast = c;}} />
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