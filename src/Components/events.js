import React from 'react';
import { View ,StyleSheet, ListView} from 'react-native';
import { List, ListItem ,Separator, Text, Spinner, Toast, Left, Body, Thumbnail, Right, Icon} from 'native-base';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class EventsList extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      isLoading: false,
      data: [],
      mainStageEvents: [],
      technicalEvents: [],
      funEvents: [],
      sportsEvents: [],
      creativeEvents: [],
      gamingEvents: [],
      brainstormEvents: [],
      musicalEvents: [],
      category: {}
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

  handlePress(_id, name){
    const { navigate } = this.props.navigation;
    navigate('eventDetails', {
      _id,
      name,
      type: this.props.type
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

  render(){
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });
    
    let list2 = <View>
      <ListView
        dataSource={ds.cloneWithRowsAndSections(this.state.category)}
        renderRow={
        (item) => <ListItem button avatar
                      onPress={() => this.handlePress(item._id, item.name)}>
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
        }
        renderSectionHeader={
        (sectionData, category) => <Separator bordered>
          <Text style={styles.title}>{category}</Text>
        </Separator>
        }
        />
    </View>
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: list2
    return (
      <View style={styles.container}>

        <View style={styles.miniContainer}>
          <Text style={{color: '#fff', fontWeight: '800', fontSize: 22}}>Total Events: {this.state.data.length > 0 ? this.state.data.length: '-'}</Text>
        </View>
        {showSpinner}
          <Toast ref={c => {this.toast = c;}} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  miniContainer: {
    backgroundColor: GLOBALS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    paddingTop: 20,
  },
  title: {
    color: GLOBALS.primaryColor,
    margin: 10,
    fontSize: 14
  }
});
