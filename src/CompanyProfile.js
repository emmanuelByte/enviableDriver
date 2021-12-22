import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import { SERVER_URL } from './config/server';

export class CompanyProfile extends Component {
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
        //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
        { text: "Leave", onPress: () => BackHandler.exitApp() }
      ],
      //{ cancelable: false }
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

  getOrders(){
    fetch(`${SERVER_URL}/mobile/get_merchant_orders/${this.state.user.merchant_id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "orders");
       //this.hideLoader();
       if(res.success){
          this.setState({
            orders:  res.orders
          });
       }else{
         Alert.alert('Error', res.error);
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
         { text: "Refresh", onPress: () => this.getOrders() }
       ],
       //{ cancelable: false }
     );
    });
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
      if(value){
        this.setState({
          user: JSON.parse(value)
        }, () => {
          this.getProfile();
          this.setState({
            user_id: this.state.user.id
          })
        });
          
      }else{
        this.props.navigation.navigate('Login')
      }
    });
  }
  async getProfile(){
    this.showLoader()
    
    fetch(`${SERVER_URL}/mobile/get_vendor_profile/${this.state.user.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
       //console.log(res, "res");
       this.hideLoader();
       if(res.success){
        AsyncStorage.setItem('user', JSON.stringify(res.user)).then(() => {
           this.setState({
              user: res.user
            }, ()=> {
              console.log(this.state.user, 'kk');
            
              this.setState({
                locationPlaceholder: this.state.user.city_name +" - "+ this.state.user.state_name,
                cityId: this.state.user.city_id,
                stateId: this.state.user.state_id,
    
                firstName: this.state.user.first_name,
                lastName: this.state.user.last_name,
                phone: this.state.user.phone1,
                email: this.state.user.email,
                bankName: this.state.user.bank_name,
                bankAccountName: this.state.user.bank_account_name,
                bankAccountNumber: this.state.user.bank_account_number,
                bankAccountType: this.state.user.bank_account_type,
                // latitude: this.state.user.latitude,
                // longitude: this.state.user.longitude,
                // address: this.state.user.address
              })
            })
        })
       }else{
         Alert.alert('Error', res.error);
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
         { text: "Refresh", onPress: () => this.getProfile() }
       ],
       //{ cancelable: false }
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
  
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  static navigationOptions = {
      header: null
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
          <Text style = {styles.headerText}>Account</Text>
          <TouchableOpacity style = {styles.editText} onPress={() => this.props.navigation.navigate('CompanyEditProfile')}>
          <Text style = {styles.editT}>Edit</Text>
          </TouchableOpacity>
        </LinearGradient>
         
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
              <View style={styles.itemView}>
                <View style={styles.item1}>
                  <View style={styles.contentCol2}>
                  <Image source = {require('./imgs/round-profile.png')}  style = {styles.userImage} />
                  </View>
                  <View style={styles.contentCol3}> 
                    <Text style = {styles.pName}> {this.state.user.first_name} {this.state.user.last_name}</Text>
                  {/*
                  <Text style = {styles.desc}> </Text>
                  */}
                    <View style={{flexDirection: 'row', paddingTop: 5}}>
                      {/* <Text style = {styles.date3}>{this.state.user.company_name || 'Enviable Riders'}</Text>  */}
                      <Text style = {styles.date3}>{'Enviable Riders'}</Text> 

                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.itemView}>
              <Text style = {styles.pName1}> User details</Text>
                <View style={styles.item11}>
                  <View style={styles.contentCol21}>
                  <Icon name="room" size={18} color="#000"  style = {styles.infoIcon}/>
                  </View>
                  <View style={styles.contentCol31}> 
                    <Text style = {styles.address}> {this.state.user.city_name}, {this.state.user.state_name}</Text>
                  </View>
                </View>
                <View style={styles.item11}>
                  <View style={styles.contentCol21}>
                  <Icon name="mail" size={18} color="#000"  style = {styles.infoIcon}/>
                  </View>
                  <View style={styles.contentCol31}> 
                    <Text editable={false} selectTextOnFocus={false} style = {styles.address}> {this.state.user.email}</Text>
                  </View>
                </View>
                <View style={styles.item11}>
                  <View style={styles.contentCol21}>
                  <Icon name="phone" size={18} color="#000"  style = {styles.infoIcon}/>
                  </View>
                  <View style={styles.contentCol31}> 
                    <Text style = {styles.address}> {this.state.user.phone1}</Text>
                  </View>
                </View>
                <View style={styles.item11}>
                  <View style={styles.contentCol21}>
                  <Icon name="person" size={18} color="#000"  style = {styles.infoIcon}/>
                  </View>
                  <View style={styles.contentCol31}> 
                    <Text style = {styles.address}> {this.state.user.first_name} {this.state.user.last_name}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.itemView}>
              <Text style = {styles.pName1}> Bank details</Text>
                <View style={styles.item11}>
                  <View style={styles.contentCol21}>
                  <Icon name="business" size={18} color="#000"  style = {styles.infoIcon}/>
                  </View>
                  <View style={styles.contentCol31}> 
                    <Text style = {styles.address}> {this.state.user.bank_name} {!this.state.user.bank_name && "Not set"}</Text>
                  </View>
                </View>
                <View style={styles.item11}>
                  <View style={styles.contentCol21}>
                  <Icon name="bookmark" size={18} color="#000"  style = {styles.infoIcon}/>
                  </View>
                  <View style={styles.contentCol31}> 
                    <Text style = {styles.address}> {this.state.user.bank_account_type} {!this.state.user.bank_account_type && "Not set"}</Text>
                  </View>
                </View>
                <View style={styles.item11}>
                  <View style={styles.contentCol21}>
                  <Icon name="person" size={18} color="#000"  style = {styles.infoIcon}/>
                  </View>
                  <View style={styles.contentCol31}> 
                    <Text style = {styles.address}> {this.state.user.bank_account_name} {!this.state.user.bank_account_name && "Not set"}</Text>
                  </View>
                </View>
                <View style={styles.item11}>
                  <View style={styles.contentCol21}>
                  <Icon name="copyright" size={18} color="#000"  style = {styles.infoIcon}/>
                  </View>
                  <View style={styles.contentCol31}> 
                    <Text style = {styles.address}> {this.state.user.bank_account_number} {!this.state.user.bank_account_number && "Not set"}</Text>
                  </View>
                </View>
              </View>
          </View>
        </ScrollView>


        
      </View>
    )
  }
}

export default CompanyProfile

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#f8f8f8",
  },
  cView: {
    minHeight: 1200,
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
    //marginRight: 20,
    //flexDirection: 'row',
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
    //flexDirection: 'row',
  },
  orderNumber: {
    color: '#000',
    marginBottom: 10,
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
    //marginTop: 15,
  },
  date3: {
    //width: '20%',
    color: '#000',
    //paddingTop: 10,
    
  },
  date: {
    width: '20%',
    color: '#000',
    //paddingTop: 10,
    
  },
  desc: {
    color: '#999',
    //paddingTop: 10,
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

  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 8,
    //borderColor: '#9c77b1',
    //borderWidth: 6,
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
    //paddingTop: 4,
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
    //alignSelf: 'center',
  },
  row: {
    width: '100%',
    alignSelf: 'center',
    
    flexDirection: 'row',
    marginTop: 20,
  },
  col1: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  col2: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  
  },
  col3: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  col4: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  sView:{
    
  },
  bImage1: {
    width: '100%',
    height: 220,
    //opacity: 0.6,
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
    //flexDirection: 'row',
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
    //textAlign: 'center',
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
    //textAlign: 'right'
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
    //marginTop: -7,
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
  // width: '100%',
  // height: '100%',
  // opacity: 0.9,
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
  // width: '100%',
  // height: '100%',
  // opacity: 0.9,
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
  //height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
}
  
})