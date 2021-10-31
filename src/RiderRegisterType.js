import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image, Platform, PermissionsAndroid, Picker, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');

export class RegisterType extends Component {
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
      marital_status: "Single",
      vehicleTypes: false,
      vehicleTypeId: '',
    }
    this.getLoggedInUser();
    // this.getCategories();
    // this.getCities();
    // this.getVehicleTypes();
  }

  async componentDidMount() {
    
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
        //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
        { text: "Leave", onPress: () => BackHandler.exitApp() }
      ],
      //{ cancelable: false }
    );
    return true
  }

  componentDidMount() {
    //this.getLocation();
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
      if(value){
        AsyncStorage.getItem('loginvalue').then((value) => {
          if(value){
            this.setState({
              email: value
            })
          }  
          this.props.navigation.navigate('Home') 
        });
      }else{
        
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
       console.log(res, "res");
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
       //{ cancelable: false }
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
       //this.hideLoader();
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
       //{ cancelable: false }
     );
    });
  }

  getVehicleTypes(){
    fetch(`${SERVER_URL}/mobile/get_vehicle_types`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       if(res.success){
          this.setState({
            vehicleTypes:  res.vehicle_types,
            vehicleTypeId: res.vehicle_types[0].id,
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
         { text: "Refresh", onPress: () => this.getVehicleType() }
       ],
       //{ cancelable: false }
     );
    });
  }

  register(data){
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/riderRegister`, {
      method: 'POST',
      // headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json'
      // },
      body: data
    }).then((response) => response.json())
        .then((res) => {
          console.log(res);
          this.hideLoader();
          if(res.success){
            this.showAlert("success", res.success);
            this.setState({
              user:  res.user
            }, ()=> {
              AsyncStorage.setItem('user', JSON.stringify(res.user)).then(() => {
                AsyncStorage.setItem('loginvalue', this.state.email).then(() => {
                  this.props.navigation.push('Home')
                });
              });
            });
          }else{
            this.showAlert("Error", res.error)
          }
  }).done();
}

  forgot(){
      this.showLoader();
      fetch(`${SERVER_URL}/mobile/forgot_password_post`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: this.state.email,
        })
      }).then((response) => response.json())
          .then((res) => {
            this.hideLoader();
            if(res.success){
              this.showAlert("success", res.success)
            }else{
              this.showAlert("Error", res.error)
            }
    }).done();
  }

  openImagePicker(){
    ImagePicker.openPicker({
       width: 400,
       height: 400,
       cropping: true
    }).then(image => {
      this.setState({ image: image }, ()=> {
        this.setState({
          imageUri: this.state.image.path
        })
      });
      //this.prepareImage();
    });
  }

  prepareImage(){
    if(
      !this.state.image ||
    this.state.firstName == "" || this.state.lastName == "" || this.state.phone == "" ||
    this.state.email == "" || this.state.password == "" || this.state.cityId == "" 
    ){
      this.showAlert("info", "All fields are compulsory. Also ensure you upload a valid profile photo");
      return;
    }
    
    const data = new FormData();

    data.append("image", {
      name: this.state.image.modificationDate,
      type: this.state.image.mime,
      mime: this.state.image.mime,
      uri:
        Platform.OS === "android" ? this.state.image.path : this.state.image.path.replace("file://", "")
    });
    data.append("firstName", this.state.firstName);
    data.append("lastName", this.state.lastName);
    data.append("phone", this.state.phone);
    data.append("email", this.state.email);
    data.append("password", this.state.password);
    data.append("cityId", this.state.cityId);
    data.append("stateId", this.state.stateId);
    data.append("marital_status", this.state.marital_status);
    data.append("vehicleTypeId", this.state.vehicleTypeId);
    this.register(data);
  }
  
  onCancel = () => {
    this.setState({
      visible: false
    });
  }
  onSelect = (city) => {
    console.log(city, "city");
    this.setState({
      cityId: city.id,
      stateId: city.state_id,
      locationPlaceholder: city.label,
      visible: false 
    }, ()=> {  })
    
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
          <TouchableOpacity  onPress={() => this.props.navigation.navigate('Login')}>
          <Icon name="arrow-back" size={18} color="#000"  style = {styles.backImage}/>
          </TouchableOpacity>
          <Text style = {styles.headerText}>Choose how you want to operate</Text>
            <View style = {styles.bottomView}>
              <TouchableOpacity style = {styles.card1} onPress={() => this.props.navigation.navigate('IndividualRegisterType')}>
                <Text style = {styles.hText}>Independent Rider</Text>
                <Text style = {styles.tText}>This category is best for people with only one vehicle.</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style = {styles.card2} onPress={() => this.props.navigation.navigate('RegisterCompany')}>
                <Text style = {styles.hText2}>Fleet</Text>
                <Text style = {styles.tText2}>  is best for people with more than one vehicle.</Text>
              </TouchableOpacity> */}
            
            </View>

          </ScrollView>
          {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
      </View>
    )
  }
}

export default RegisterType

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
    // width: 18,
    // height: 12,
    marginLeft: 20,
    marginTop: 60,
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
    padding: 20,
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
    //marginRight: 30,
    color: '#5B5B5B',
    fontSize: 12,
    marginTop: 10,
  },
  forgotText1: {
    textAlign: 'center',
    //marginRight: 30,
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

card1: {
  backgroundColor: '#0B277F',
  width: '100%',
  padding: 20,
  paddingTop: 40,
  paddingBottom: 40,
},
hText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
tText: {
  color: '#fff',
  fontSize: 14,
  //textAlign: 'justify',
},
card2: {
  elevation: 1,
  //borderWidth: 1,
  borderColor: '#fff',
  width: '100%',
  padding: 20,
  marginTop: 20,
  paddingTop: 40,
  paddingBottom: 40,
},
hText2: {
  color: '#414141',
  fontSize: 16,
  fontWeight: 'bold',
},
tText2: {
  color: '#7B7E8F',
  fontSize: 14,
  //textAlign: 'justify'
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
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  //height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
}
})