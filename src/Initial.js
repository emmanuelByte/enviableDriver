import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
var PushNotification = require('react-native-push-notification');
import SoundPlayer from 'react-native-sound-player'
import { SERVER_URL } from './config/server';

export class Initial extends Component {
  constructor(props) {
    super();
    //AsyncStorage.clear();
    this.state = {
      user: false,
    }
<<<<<<< HEAD
=======
    this.init();
>>>>>>> d39fcbc9e4729d66cee47ac141eb52afc5cfcb70
  }

  async componentDidMount() {
    //this.getLoggedInUser();
<<<<<<< HEAD
    await this.init();

=======
>>>>>>> d39fcbc9e4729d66cee47ac141eb52afc5cfcb70
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
              this.props.navigation.navigate('RideShareHome')
            }else{
            //this.props.navigation.navigate('Home')
            this.props.navigation.navigate('ActiveOrders')
            }
          }else{
            this.props.navigation.navigate('CompanyHome')
          }
        });
<<<<<<< HEAD
       
=======
        // this.setState({
        //   customer: JSON.parse(value)
        // }, () => {
        //   this.setState({
        //     customer_id: this.state.customer.id
        //   })
        // });
          
>>>>>>> d39fcbc9e4729d66cee47ac141eb52afc5cfcb70
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
<<<<<<< HEAD
    // alert('init');
=======
>>>>>>> d39fcbc9e4729d66cee47ac141eb52afc5cfcb70
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
        console.error(err.message, err);
      },
  
      // senderID: "368002028471",
      senderID:"315359821673",
  
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },
  
      popInitialNotification: false,
      requestPermissions: true,
    });

<<<<<<< HEAD
    this.getLoggedInUser();    
=======
    // this.getLoggedInUser();    
>>>>>>> d39fcbc9e4729d66cee47ac141eb52afc5cfcb70
  }
  _onRemoteNotification(notification) {
   
    console.log(JSON.parse(notification.data.message).myId);
    if(JSON.parse(notification.data.message).myId == "merchant"){
      Alert.alert(
        JSON.parse(notification.data.message).title,
        JSON.parse(notification.data.message).body,
        [
          // {
          //   text: "Stay here",
          //   onPress: () => console.log("Cancel Pressed"),
          //   style: "cancel"
          // },
          //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
          { text: "Check order", onPress: () => this.props.navigation.push('MerchantOrderDetails', {
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
        //{ cancelable: false }
      );
    }
    if(JSON.parse(notification.data.message).myId == "dispatch"){
      Alert.alert(
        JSON.parse(notification.data.message).title,
        JSON.parse(notification.data.message).body,
        [
          // {
          //   text: "Stay here",
          //   onPress: () => console.log("Cancel Pressed"),
          //   style: "cancel"
          // },
          { text: "Close", onPress: () => this.props.navigation.navigate('ActiveOrders', {reload:true}) },
          { text: "Check order", onPress: () => this.props.navigation.push('DispatchOrderDetails', {
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
        // { cancelable: true }
      );
    } 
    if(JSON.parse(notification.data.message).myId == "ride_share"){
<<<<<<< HEAD
     
=======
      // Alert.alert(
      //   JSON.parse(notification.data.message).title,
      //   JSON.parse(notification.data.message).body,
      //   [
      //     // {
      //     //   text: "Stay here",
      //     //   onPress: () => console.log("Cancel Pressed"),
      //     //   style: "cancel"
      //     // },
      //     //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
      //     { text: "Check order", onPress: () => this.props.navigation.push('RideOrderDetails', {
      //       orderId: JSON.parse(notification.data.message).orderId ,
      //     })
      //    }
      //   ],
      //   //{ cancelable: false }
      // );
>>>>>>> d39fcbc9e4729d66cee47ac141eb52afc5cfcb70
      this.props.navigation.push('RideShareHome')
    } 
    try {
        // play the file tone.mp3
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
<<<<<<< HEAD
        <Text>New tRY</Text>
=======
        
>>>>>>> d39fcbc9e4729d66cee47ac141eb52afc5cfcb70
      </View>
    )
  }
}

export default Initial

<<<<<<< HEAD
=======
const styles = StyleSheet.create ({
  
})
>>>>>>> d39fcbc9e4729d66cee47ac141eb52afc5cfcb70
