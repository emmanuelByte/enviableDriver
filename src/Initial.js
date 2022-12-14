import React, { Component  } from 'react';
import { AppState, View, Text, Platform, Alert, Image, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SoundPlayer from 'react-native-sound-player'
import { SERVER_URL } from './config/server';
var PushNotification = require('react-native-push-notification');



export class Initial extends Component {
  constructor(props) {
    super();
    
    this.state = {
      user: false,
    }
  }

  async componentDidMount() {
    
    await this.init();

  }
  
  async getLoggedInUser(token){
    
    await AsyncStorage.getItem('user').then((value) => {
      if(value){
        console.log(value, 's');
        var user = JSON.parse(value);
        this.setState({
          user: JSON.parse(value)

        }, ()=>{
          this.savePush(token);
          if(user.role == "rider"){
            if(user.vehicle_type_id == 13 || user.vehicle_type_id == 14 || user.vehicle_type_id == 15){
              this.props.navigation.navigate('RideShareHome');
            }else{
            
            this.props.navigation.navigate('ActiveOrders')
            }
          }else{
            this.props.navigation.navigate('CompanyHome')
          }
        });
       
      }else{
        AsyncStorage.getItem('loginvalue').then((value) => {
          if(value){
            this.props.navigation.navigate('Login');
          }  else{
            this.props.navigation.navigate('Welcome');
          } 
        });
      }
    });
  }


  async init() {
    
    
    await PushNotification.configure({
      largeIcon: "ic_notification",
      smallIcon: "ic_notification",
      soundName: "rush.mp3",

      priority: "max",
      importance: "max",
      vibrate: true,
      onRegister: (token) => {
        
        console.log(token, "TOEKN REFRHED")
        AsyncStorage.setItem('pushToken', token.token, () => {
          
          this.getLoggedInUser(token.token); 
        })
      },
      onNotification: (notification) => {
        
          this._onRemoteNotification(notification);
          
      },
      
      onRegistrationError: function(err) {
        Alert.alert('Unable to register notifications', err.message);
        
        console.error(err.message, err);
      },
  
      
      senderID:"315359821673",
  
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },
  
      popInitialNotification: false,
      requestPermissions: true,
    });

    this.getLoggedInUser();    
  }
  _onRemoteNotification(notification) {
   
    console.log(JSON.parse(notification.data.message).myId);
    
    if(JSON.parse(notification.data.message).myId == "merchant"){
      Alert.alert(
        JSON.parse(notification.data.message).title,
        JSON.parse(notification.data.message).body,
        [
          
          
          
          
          
          
          { text: "Check order", onPress: () => this.props.navigation.push('MerchantOrderDetails', {
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
        
      );
    }
    if(JSON.parse(notification.data.message).myId == "dispatch"){
      Alert.alert(
        JSON.parse(notification.data.message).title,
        JSON.parse(notification.data.message).body,
        [
          
          
          
          
          
          { text: "Close", onPress: () => this.props.navigation.navigate('ActiveOrders', {reload:true}) },
          { text: "Check order", onPress: () => this.props.navigation.push('DispatchOrderDetails', {
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
        
      );
    } 
    if(JSON.parse(notification.data.message).myId == "ride_share"){
     
      this.props.navigation.push('RideShareHome');
    } 
    try {
        
        SoundPlayer.playSoundFile('rush', 'mp3')
    } catch (e) {
        console.log(`cannot play the sound file`, e)
    }


  }

  savePush(token){
    console.log(token,'123ERGJDKDFDFSFS');
    fetch(`${SERVER_URL}/mobile/save_push_token`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          push_token: token,
          user_id: this.state.user.id, 
      })
    }).then((response) => response.json())
        .then((res) => {
          console.log(res)
          if(res.success){
            
          }else{
            
          }
  }).done();
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
    return (
      <View>
        {/* <Text>New tRY</Text> */}
      </View>
    )
  }
}

export default Initial

