import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import { SERVER_URL } from './config/server';

export class Riders extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,
      forgotVisible: false,
      orders: false,
      email: '',
      password: '',
      total: false,
      user: false,
      riders: false,
      email1: '',
      customer: false,
      cartItems: false,
      deliveryInfo: false,
    }
  }

  

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.subs.forEach(sub => sub.remove());
  }
  async componentDidFocus(){
    await this.getLoggedInUser();
  }
  handleBackPress = () => {
    Alert.alert(
      "Confirm exit",
      "Are you sure you want to exit this app?",
      [
        {
          text: "Stay here",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        
        { text: "Leave", onPress: () => BackHandler.exitApp() }
      ],
      
    );
    return true
  }

  componentWillMount(){
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
  }
  componentDidMount() {
    
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  toggleUpdate(){
    if(this.state.toggleUpdate == true){
      this.setState({
        toggleUpdate: false
      })
    }else{
      this.setState({
        toggleUpdate: true
      })
    }
  }
  showAlert(type, message){
    Alert.alert(
      type,
      message,
    );
  }

  async getLoggedInUser(){
    await AsyncStorage.getItem('user').then((value) => {
      console.log(value);
      if(value){
        this.setState({
          user: JSON.parse(value)
        }, () => {
          this.getRider();
          this.setState({
            user_id: this.state.user.id
          })
        });
          
      }else{
        this.props.navigation.navigate('Login')
      }
    });
  }
  async getRider(){
    this.showLoader()
    
    fetch(`${SERVER_URL}/mobile/get_riders/${this.state.user.vendor_id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
    console.log(res, 'kk');
       this.hideLoader();
       if(res.success){
        this.setState({
              riders: res.riders
          }, ()=> {
            
          });
        }
   })
   .catch((error) => {
      console.error(error);
      Alert.alert(
       "Communictaion error",
       "Ensure you have an active internet connection",
       [
         {
           text: "Ok",
           onPress: () => console.log("Cancel Pressed"),
           style: "cancel"
         },
         { text: "Refresh", onPress: () => this.getRider() }
       ],
       
     );
    });
    
  }

  showLoader(){
    this.setState({
      visible: true
    });
  }
  hideLoader(){
    this.setState({
      visible: false
    });
  }
  gotoRiderProfile(riderId){
    this.props.navigation.navigate('RiderProfile', {
      riderId: riderId,
    });
  }
  
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  static navigationOptions = {
      header: null
  }
  displayNoData(){
    var data = this.state.riders.length;
    console.log(data, 'data')
    if(data < 1){
      return(
          <View  style={styles.noView}> 
                  <Image source = {require('@images/no.png')} style = {styles.noImage} ></Image>
                  <Text style = {styles.ndt}>You have not added any rider at the moment...</Text>
          </View>
      )
    }
  }
  

  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
        <LinearGradient start={{x: 0, y: 0}} end={{x:0, y: 1}}  colors={['#0B277F', '#0B277F']} style={styles.header}>
        <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
        <Icon name="arrow-back" size={18} color="#fff"  style = {styles.menuImage}/>
        </TouchableOpacity>
          <Text style = {styles.headerText}>Riders</Text>
          <TouchableOpacity style = {styles.editText} onPress={() => this.props.navigation.navigate('RegisterType')}>
          <Text style = {styles.editT}>Add new</Text>
          </TouchableOpacity>
        </LinearGradient>
         
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
            {this.state.riders && this.displayNoData()}
          {this.state.riders && this.state.riders.map((rider, index) => (
            <TouchableOpacity  onPress={() => this.gotoRiderProfile(rider.id) } style={styles.itemView}>
              <View style={styles.item1}>
                <View style={styles.contentCol2}>
                <Image source = {require('@images/user.png')}  style = {styles.userImage} />
                </View>
                <View style={styles.contentCol3}> 
                  <Text style = {styles.pName}> {rider.first_name} {rider.last_name}</Text>
                  <Text style = {styles.t}>{rider.phone1}</Text> 
                  <View style={{flexDirection: 'row', paddingTop: 5}}>
                    <Text style = {styles.date}>{rider.rating}*</Text> 
                    <Text style = {styles.label}>{rider.ratings_count} reviews</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Riders

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#f8f8f8",
  },
  cView: {
    
    width: '95%',
    alignSelf: 'center',
    paddingBottom: 50,
  },
  header: {
    width: '100%',
    height: 110,
    backgroundColor: '#0B277F',
    flexDirection: 'row',
  },
  cartImage: {
    width: 21,
    height: 15,
    marginRight: 30,
    marginTop: 69,
  },
  descContent: {
    color: '#535871',
    textAlign: 'justify',
  },
  itemView: {
    width: '95%',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignSelf: 'center',
    
    
  },
  itemView4: {
    width: '90%',
    marginTop: 30,
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginRight: 25,
    marginLeft: 30,
    flexDirection: 'row',
  },
  itemView1: {
    width: '90%',
    marginTop: 10,
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginRight: 25,
    marginLeft: 30,
    
  },
  orderNumber: {
    color: '#000',
    marginBottom: 10,
  },
  t: {
    color: '#454A65',
    fontSize: 12,
    paddingLeft: 4,
    
    width: '100%',
    
  },
  pName: {
    color: '#000',
    fontWeight: 'bold',
    width: '100%',
    marginTop: 15,
  },
  pName1: {
    color: '#000',
    fontWeight: 'bold',
    width: '100%',
    
  },
  date: {
    width: '20%',
    color: '#000',
    
    
  },
  desc: {
    color: '#999',
    
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    paddingTop: 10,
  },
  item1: {
    width: '100%',
    flexDirection: 'row',
  },
  item11: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10, 
  },
  item22: {
    flexDirection: 'row',
  },
  item2: {
    width: '100%',
    flexDirection: 'row'
  },
  item3: {
    width: '100%'
  },

  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  addView: {
    width: '80%',
    height: 40,
    alignSelf: 'center',
    marginTop: 40,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
  },
  item: {
    width: '100%',
    marginLeft: 5,
    marginRight: 10,
    flexDirection: 'row',
  },
  contentCol1: {
    width: '60%',
    paddingRight: 9,
    overflow: 'hidden',
  },
  contentCol2: {
    width: '30%',
    overflow: 'hidden',
  },
  contentCol21: {
    width: '15%',
    marginLeft: 20,
    overflow: 'hidden',
  },
  contentCol3: {
    width: '70%',
    overflow: 'hidden',
  },
  contentCol31: {
    width: '80%',
    overflow: 'hidden',
  },
  itemNameText: {
    paddingTop: 10,
    fontWeight: 'bold',
  },
  itemPriceText: {
    
    fontWeight: 'bold',
    color: '#585757',
  },
  itemBottom: {
    flexDirection: 'row',
    width: '100%',
  },
  itemVendorText: {
    color: '#0B277F',
    fontSize: 12,
    width: '75%',
  },
  itemRatingText: {
    width: '25%',
    fontSize: 12,
    color: '#585757',
    textAlign: 'right',
  },
  itemImage: {
    width: 80,
    height: 80,
    
  },
  row: {
    width: '100%',
    alignSelf: 'center',
    
    flexDirection: 'row',
    marginTop: 20,
  },
  col1: {
    
    borderRadius: 18,
    textAlign: 'center',
  },
  col2: {
    
    borderRadius: 18,
    textAlign: 'center',
  
  },
  col3: {
    
    borderRadius: 18,
    textAlign: 'center',
  },
  col4: {
    
    borderRadius: 18,
    textAlign: 'center',
  },
  sView:{
    
  },
  noView: {
    width: '100%',
    marginTop: 100,
  },
  noImage: {
    width: 140,
    height: 150,
    alignSelf: 'center',
  },
  ndt: {
    textAlign: 'center',
    color: '#a8a8a8',
  },
  bImage1: {
    width: '100%',
    height: 220,
    
    overflow: 'hidden',
    borderBottomEndRadius: 20, 
    borderBottomStartRadius: 20, 
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  menuImage: {
    marginLeft: 20,
    marginTop: 74,
  },
  counterView: {
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    borderColor: '#888888',
    flexDirection: 'row',
    width: 80,
    height: 27,
    paddingTop: 3,
    marginTop: 5,
  },
  minusText: {
    textAlign: 'center',
    width: '33%',
    fontSize: 13,
    
  },
  counterText: {
    textAlign: 'center',
    width: '34%',
    fontSize: 13,
  },
  plusText: {
    textAlign: 'center',
    width: '33%',
    fontSize: 13,
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: -60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 10,
    color: '#fff',
    marginTop: 73,
    width: '50%',
  },
  editText: {
    width: '30%',
    alignContent: 'flex-end',
  },
  editT: {
    marginTop: 78,
    
    textAlign: 'right',
  },
  headerText1: {
    fontSize: 20,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: "bold",

  },
  card: {
    
    width: '100%',
    marginBottom: 4,
    
    borderWidth: 1,
    borderRadius: 9,
    elevation: 1,
    borderColor: '#fefefe',
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 7,
  },
  locationText: {
    color: '#0B277F',
    textAlign: 'right',
    paddingTop: 2,
    marginRight: 10,
    fontSize: 12,
  },
  colImage: {
    width: '35%'
  },
  colContent: {
    width: '65%',
    flexDirection: 'column',
  },
  cImage: {
    alignSelf: 'center',
    marginTop: 5,
  },
  segmentText: {
    
    paddingRight: 10,
    marginRight: 10,
  },
  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#5D626A',
  },


  label:{
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '40%',
    
  },
  labelZ:{
    color: '#454A65',
    fontWeight: 'bold',
    marginTop: 1,
    fontSize: 13,
  },
  txt: {
    color: '#3D3838',
  },
  searchInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#Fefefe',
    borderWidth: 1,
    borderRadius: 18,
    elevation: 1,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#ccc',
  },
  input: {
    width: '94%',
    height: 40,
    backgroundColor: '#F9F9FB',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#ccc',
  },
  input1: {
    width: '9%',
    height: 40,
    backgroundColor: '#aaa',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 25,
    color: '#222'
  },
  forgotText: {
    textAlign: 'right',
    marginRight: 30,
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
  },
  
  createText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  locImageView: {
    marginTop: -14,
  },
  locImage: {
    
    width: 10,
    height: 10,
    width: 10,
    paddingRight: 4,
    },
submitButton: {
  marginTop: 20,
  backgroundColor: '#ED6315',
  borderRadius: 10,
  width: '80%',
  alignSelf: 'center',
  paddingTop: 12,
  paddingBottom: 13,
},
submitButton1: {
  marginTop: 20,
  backgroundColor: '#e2aa2e',
  opacity: 0.7,
  borderRadius: 2,
  width: '90%',
  alignSelf: 'center',
  paddingTop: 12,
  paddingBottom: 13,
},
submitButtonText: {
  color: '#fff',
  textAlign: 'center'
},
loaderImage: {
  width: 80,
  height: 80,
  alignSelf: 'center',
  zIndex: 99999999999999,
  
},
modal: {
  margin: 0,
  padding: 0
},
modalView: {
  
  
  
  alignSelf: 'center',
  height: 50,
  width: 100,
  backgroundColor: '#FFF',
  paddingTop: 18,
},

label1: {
  color: '#333',
  marginTop: 15,
  paddingLeft: 20,
},
forgotModalView: {
  
  
  
  alignSelf: 'center',
  height: 280,
  width: '90%',
  backgroundColor: '#FFF',
  paddingTop: 18,
},
loading: {
  position: 'absolute',
  elevation: 2, 
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 9999999999999999999999999,
  
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
}
  
})