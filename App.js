import React, { Component } from 'react';
import { AppRegistry, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button, Platform, StyleSheet, Text, View, TouchableOpacity,PermissionsAndroid,AsyncStorage } from 'react-native';

import Initial from './src/Initial';
import Login from './src/Login';
import Register from './src/Register';
import RegisterCompany from './src/RegisterCompany';
import RegisterType from './src/RegisterType';
import IndividualRegisterType from './src/IndividualRegisterType';
import RiderRegisterType from './src/RiderRegisterType';
import Home from './src/Home';
import CompanyHome from './src/CompanyHome';
import ActiveOrders from './src/ActiveOrders';
import Reviews from './src/Reviews';
import CompanyReviews from './src/CompanyReviews';
import CompanyTransactions from './src/CompanyTransactions';
import CompanyTransactionsDebit from './src/CompanyTransactionsDebit';
import CompanyRiderTransactionsDebit from './src/TransactionsDebit';
import CompanyRiderTransactions from './src/CompanyRiderTransactions';
import Profile from './src/Profile';
import CompanyProfile from './src/CompanyProfile';
import RiderProfile from './src/RiderProfile';
import EditProfile from './src/EditProfile';
import CompanyEditProfile from './src/CompanyEditProfile';
import Welcome from './src/Welcome';
import Orders from './src/Orders';
import CompanyOrders from './src/CompanyOrders';
import CompanyRiderOrders from './src/CompanyRiderOrders';
import MerchantOrderDetails from './src/MerchantOrderDetails';
import CompanyMerchantOrderDetails from './src/CompanyMerchantOrderDetails';
import DispatchOrderDetails from './src/DispatchOrderDetails';
import CompanyDispatchOrderDetails from './src/CompanyDispatchOrderDetails';
import Transactions from './src/Transactions';
import RiderBalance from './src/RiderBalance';
import Help from './src/Help';
import License from './src/License';
import RideShareHome from './src/RideShareHome';
import RideOrders from './src/RideOrders';
import RideOrderDetails from './src/RideOrderDetails';
import Guarantor from './src/Guarantor';
import Riders from './src/Riders';
import AddRider from './src/AddRider';
navigator.geolocation = require('@react-native-community/geolocation');
import Geolocation from '@react-native-community/geolocation';

import { SERVER_URL } from './src/config/server';
import { EditPassword } from './src/EditPassword';

console.disableYellowBox = true;



const MainNavigator = createStackNavigator({
  
  Initial: {screen: Initial},
  Welcome: {screen: Welcome},
  Home: {screen: Home},
  CompanyHome: {screen: CompanyHome},
  ActiveOrders: {screen: ActiveOrders},
  Profile: {screen: Profile},
  RiderProfile: {screen: RiderProfile},
  Reviews: {screen: Reviews},
  CompanyReviews: {screen: CompanyReviews},
  CompanyTransactions: {screen: CompanyTransactions},
  CompanyTransactionsDebit: {screen: CompanyTransactionsDebit},
  CompanyRiderTransactions: {screen: CompanyRiderTransactions},
  CompanyRiderTransactionsDebit: {screen: CompanyRiderTransactionsDebit},
  EditProfile: {screen: EditProfile},
  CompanyEditProfile: {screen: CompanyEditProfile},
  Orders: {screen: Orders},
  CompanyOrders: {screen: CompanyOrders},
  CompanyProfile: {screen: CompanyProfile},
  CompanyRiderOrders: {screen: CompanyRiderOrders},
  MerchantOrderDetails: {screen: MerchantOrderDetails},
  CompanyMerchantOrderDetails: {screen: CompanyMerchantOrderDetails},
  DispatchOrderDetails: {screen: DispatchOrderDetails},
  CompanyDispatchOrderDetails: {screen: CompanyDispatchOrderDetails},
  Transactions: {screen: Transactions},
  RiderBalance: {screen: RiderBalance},
  Help: {screen: Help},
  License: {screen: License},
  Guarantor: {screen: Guarantor},
  Login: {screen: Login},
  Register: {screen: Register},
  RegisterCompany: {screen: RegisterCompany},
  Riders: {screen: Riders},
  AddRider: {screen: AddRider},
  RegisterType: {screen: RegisterType},
  IndividualRegisterType: {screen: IndividualRegisterType},
  RiderRegisterType: {screen: RiderRegisterType},
  RideShareHome: {screen: RideShareHome},
  RideOrderDetails: {screen: RideOrderDetails},
  RideOrders: {screen: RideOrders},
  EditPassword:{screen:EditPassword}
  
  
   
});

const AppContainer = createAppContainer(MainNavigator);

export default class App extends Component {
  
  state ={
    id:null,
  }
  constructor(props){
    super(props);
    
  }
   getLocation(){

    var that =this;
    //Checking for the permission just after component loaded
    if(Platform.OS === 'ios'){
      this.callLocation(that);
    }else{
        async function requestLocationPermission() {

          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'This App needs to Access your location'
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
               
              that.callLocation(that);
            } else {
              alert("Permission Denied");
            }
          } catch (err) {
            alert("err",err);
            console.log(err)
          }
        }
        requestLocationPermission();
      }
    }
  
     callLocation(that){
 
       
      setInterval(()=>{

        Geolocation.getCurrentPosition(async (position)=>{
          var currentLongitude = position.coords.longitude;
          var currentLatitude = position.coords.latitude;
           
          await this.getLoggedInUser();
          await this.saveLocation(currentLatitude, currentLongitude)
        })
        }, 10000)
      
      
       

       
       
       
       
       

       
       
       
       
       
       
       
       
       
       
       
       
      
   }
  
  
   async getLoggedInUser(){
    await AsyncStorage.getItem('user').then((value) => {
      if(value){
         
         
        this.setState({id:JSON.parse(value).id})
      }else{
         
      }
    });
  }

     saveLocation(origin_latitude, origin_longitude){
    console.log(origin_latitude, origin_longitude);
    if(this.state.id){
      fetch(`${SERVER_URL}/mobile/save_rider_location`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            latitude: origin_latitude,
            longitude: origin_longitude,
            user_id: this.state.id, 
        })
      }).then((response) => response.json())
          .then((res) => res)
          .catch(e=> alert('This is a startup error'));
    }

  }
  async componentDidMount(){
     
    await this.getLocation()
  }
  render () {
    return (
        /*<Provider store={store}>*/
          <AppContainer/>
        /*</Provider>*/
    )
  }
}