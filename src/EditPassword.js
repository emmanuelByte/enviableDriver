import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image, Platform, TextInput, extInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import ImagePicker from 'react-native-image-crop-picker';

import RNPicker from 'react-native-picker-select'


export class EditPassword extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      imageUri: false,
      visible: false,
      loaderVisible: false,
      forgotVisible: false,
      user: false,
      businessName: '',
      businessCategoryId: '',
      latitude: false, 
      longitude: false, 
      longitude1: '',
      latitude1: '',
      markers: false, 
      cacNo: '',
      address: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      email1: '',
      customer: '',
      image: '',
      cityId: '',
      stateid: '',
      locationPlaceholder: '',
      categories: false,
      cities: false,
      bankAccountType: "Savings",
      banks: [
        { id: "1", value: "Access Bank", label: "Access Bank" , code:"044" },
        { id: "2", value:"Citibank", label: "Citibank", code:"023" },
        { id: "3", value:"Diamond Bank", label: "Diamond Bank", code:"063" },
        { id: "4", value:"Dynamic Standard Bank", label: "Dynamic Standard Bank", code:"44" },
        { id: "5", value:"Ecobank Nigeria", label: "Ecobank Nigeria", code:"050" },
        { id: "6", value:"Fidelity Bank Nigeria",label: "Fidelity Bank Nigeria", code:"070" },
        { id: "7", value:'First Bank of Nigeria', label: "First Bank of Nigeria", code:"011" },
        { id: "8", value:'First City Monument Bank', label: "First City Monument Bank", code:"214" },
        { id: "9", value:"Guaranty Trust Bank", label: "Guaranty Trust Bank", code:"058" },
        { id: "10", value:"Heritage Bank Plc",label: "Heritage Bank Plc", code:"030" },
        { id: "11", value:'Jaiz Bank',label: "Jaiz Bank", code:"301" },
        { id: "12", value:'Keystone Bank Limited"',label: "Keystone Bank Limited", code:"082" },
        { id: "13", value:'Providus Bank Plc', label: "Providus Bank Plc", code:"101" },
        { id: "14", value:'Polaris Bank', label: "Polaris Bank", code:"076" },
        { id: "15", value:'Stanbic IBTC Bank Nigeria Limited', label: "Stanbic IBTC Bank Nigeria Limited", code:"221" },
        { id: "16", value:'Standard Chartered Bank', label: "Standard Chartered Bank", code:"068" },
        { id: "17", value:'Sterling Bank', label: "Sterling Bank", code:"232" },
        { id: "18", value:'Suntrust Bank Nigeria Limited', label: "Suntrust Bank Nigeria Limited", code:"100" },
        { id: "19", value: "Union Bank of Nigeria", label: "Union Bank of Nigeria", code:"032" },
        { id: "20", value: "United Bank for Africa", label: "United Bank for Africa", code:"033" },
        { id: "21", value: "Unity Bank Plc",  label: "Unity Bank Plc", code:"215" },
        { id: "22", value: "Wema Bank", label: "Wema Bank", code:"035" },
        { id: "23", value: "Zenith Bank", label: "Zenith Bank", code:"057" }
    ],
      bankName: '',
      accountName: '',
      account_number: '',
      account_type: '',
      password:'',
      cpassword:''
    }
    // this.getCategories();
    // this.getCities();
    
  }

   componentDidMount() {
     this.getLoggedInUser();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);


  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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
        }, ()=> {
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
               
          })
        });

        console.log(this.state.user);
        AsyncStorage.getItem('loginvalue').then((value) => {
          if(value){
            this.setState({
              email: value
            })
          }  
          
        });
      }else{
        this.props.navigation.navigate('Login') 
      }
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

  async getCategories(){
    this.showLoader()
    
    fetch(`${SERVER_URL}/mobile/get_merchant_categories`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
       
       this.hideLoader();
       if(res.success){
          this.setState({
            categories:  res.merchant_categories,
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
         { text: "Refresh", onPress: () => this.getCategories() }
       ],
       
     );
    });
    
  }

  
  
  getCities(){
    fetch(`${SERVER_URL}/mobile/get_cities`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "cities");
       
       if(res.success){
          this.setState({
            cities:  res.cities
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
         { text: "Refresh", onPress: () => this.getCities() }
       ],
       
     );
    });
  }


 

  

  updatePassword() {
    if (this.state.password != this.state.cpassword) {
      this.showAlert('Info', 'Provided passwords do not match');
      return;
    }
    if (this.state.password.length < 6) {
      this.showAlert(
        'Info',
        'Provided passwords must have at least 6 characters',
      );
      return;
    }
    this.showLoader();
    console.log(this.state.user, "USER STATE");

    fetch(`${SERVER_URL}/mobile/update_password`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.state.user.id,
        password: this.state.password,
      }),
    })
      .then(response => response.json())
      .then(res => {
        console.log(res, "err of respobse");

        this.hideLoader();
        if (res.success) {
          this.showAlert('success', res.success);
        } else {
          console.log(res.error, "err");
          this.showAlert('Error', res.error);
        }
      })
      .catch(e=>console.log(e, "error occured"));
  }


  


  showLoader(){
    this.setState({
      loaderVisible: true
    });
  }
  hideLoader(){
    this.setState({
      loaderVisible: false
    });
  }
  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} >
          <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
          <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
          <Icon name="arrow-back" size={18} color="#000"  style = {styles.backImage}/>
          </TouchableOpacity>
          <Text style = {styles.headerText}>Update password</Text>
          <View>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={text => this.setState({password: text})}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#ccc"
                  autoCapitalize="none"
                  value={this.state.password}
                  secureTextEntry={true}
                />
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={text => this.setState({cpassword: text})}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#ccc"
                  autoCapitalize="none"
                  value={this.state.cpassword}
                  secureTextEntry={true}
                />
                <View style={styles.row}>
                  <View style={styles.col50}>
                    <TouchableOpacity
                      onPress={() => this.updatePassword()}
                      style={styles.submitButton}>
                      <Text style={styles.submitButtonText}>
                        Update password
                      </Text>
                    </TouchableOpacity>
                  </View>
                 
                </View>
              </View>

          </ScrollView>
          {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
      </View>
    )
  }
}

export default EditPassword;

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#fff",
    
  },
  forgotView1: {
    marginBottom: 50,
  },
  backImage: {
    
    
    marginLeft: 20,
    marginTop: 40,
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 25,
    marginTop: 8,
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 30,
  },
  imgBg: {
    width: 180,
    height: 82,
    alignSelf: 'center',

  },
  imgBg1: {
    width: 120,
    height: 120, 
    alignSelf: 'center',

  },
  logoText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    width: '95%',
    alignContent: 'center',
    alignSelf: 'center',
  },



  label1:{
    color: '#555',
    paddingLeft: 10,
    marginTop: 10,
  },
  label:{
    color: '#555',
    paddingLeft: 15,
    marginTop: 10,
  },
  input: {
    width: '90%',
    height: 46,
    backgroundColor: '#EFF0F3',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#444',
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
    textAlign: 'center',
    
    color: '#5B5B5B',
    fontSize: 12,
    marginTop: 10,
  },
  forgotText1: {
    textAlign: 'center',
    
    color: '#0B277F',
    fontSize: 12,
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
  },
  
  createText: {
    textAlign: 'center',
    color: '#0B277F',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  col50: {
    width: '50%',
  },
  locSelect: {
    width: '90%',
    height: 46,
    backgroundColor: '#EFF0F3',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 5,
    paddingTop: 12,
    paddingLeft: 10,
    color: '#444',
  },
submitButton: {
  marginTop: 20,
  backgroundColor: '#0B277F',
  borderRadius: 10,
  width: '80%',
  alignSelf: 'center',
  paddingTop: 12,
  paddingBottom: 13,
  marginBottom: 60,
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


forgotModalView: {
  
  
  
  alignSelf: 'center',
  height: 280,
  width: '90%',
  backgroundColor: '#FFF',
  paddingTop: 18,
},
loading: {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
}
})