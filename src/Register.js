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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export class Register extends Component {
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
      car_description: '',
      image: false,
      cityId: '',
      stateid: '',
      plate_no: '',
      locationPlaceholder: '',
      categories: false,
      cities: false,
      marital_status: "Single",
      vehicleTypes: false,
      vehicleTypeId: '',
      token: '',
      type: props.navigation.state.params.type,
      banks: [
        { id: "1", name: "Access Bank" , code:"044" },
        { id: "2", name: "Citibank", code:"023" },
        { id: "3", name: "Diamond Bank", code:"063" },
        { id: "4", name: "Dynamic Standard Bank", code:"44" },
        { id: "5", name: "Ecobank Nigeria", code:"050" },
        { id: "6", name: "Fidelity Bank Nigeria", code:"070" },
        { id: "7", name: "First Bank of Nigeria", code:"011" },
        { id: "8", name: "First City Monument Bank", code:"214" },
        { id: "9", name: "Guaranty Trust Bank", code:"058" },
        { id: "10", name: "Heritage Bank Plc", code:"030" },
        { id: "11", name: "Jaiz Bank", code:"301" },
        { id: "12", name: "Keystone Bank Limited", code:"082" },
        { id: "13", name: "Providus Bank Plc", code:"101" },
        { id: "14", name: "Polaris Bank", code:"076" },
        { id: "15", name: "Stanbic IBTC Bank Nigeria Limited", code:"221" },
        { id: "16", name: "Standard Chartered Bank", code:"068" },
        { id: "17", name: "Sterling Bank", code:"232" },
        { id: "18", name: "Suntrust Bank Nigeria Limited", code:"100" },
        { id: "19", name: "Union Bank of Nigeria", code:"032" },
        { id: "20", name: "United Bank for Africa", code:"033" },
        { id: "21", name: "Unity Bank Plc", code:"215" },
        { id: "22", name: "Wema Bank", code:"035" },
        { id: "23", name: "Zenith Bank", code:"057" }
    ],
      bankName: '',
      accountName: '',
      account_number: '',
      account_type: '',
      bankAccountName: '',
      bankAccountNumber: '',
      bankAccountType: '',
    }
    this.getLoggedInUser();
    this.getCategories();
    this.getCities();
    this.getVehicleTypes();
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
    AsyncStorage.getItem('pushToken').then((value) => {
      this.setState({
        token: value
      })
    });
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
   .catch((error) => {this.hideLoader();
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
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/get_cities`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "cities");
       this.hideLoader();
       if(res.success){
          this.setState({
            cities:  res.cities
          });
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {this.hideLoader();
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

  filterVehicleType(vehicleType) {
    return vehicleType.type == this.state.type;
  }

  getVehicleTypes(){
    var type = this.state.type;
    fetch(`${SERVER_URL}/mobile/get_vehicle_types`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {

       if(res.success){
          this.setState({
            vehicleTypes:  res.vehicle_types.filter(function(vehicleType){return vehicleType.type == type}),
            vehicleTypeId: res.vehicle_types[0].id,
          });
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {this.hideLoader();
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

  setTypeSelectValue(itemValue){
    this.setState({
      bankAccountType:itemValue,
    }, () => {
      
      });
    
  }
  setBankSelectValue(itemValue){
    this.setState({
      bankName:itemValue,
    }, () => {
      
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
                  if(res.user.vehicle_type_id == 13){
                    this.props.navigation.navigate('RideShareHome')
                  }else{
                  //this.props.navigation.push('Home')
                  this.props.navigation.navigate('ActiveOrders')
                  }
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
    // ImagePicker.openPicker({
    //    width: 400,
    //    height: 400,
    //    cropping: true
    // }).then(image => {
    //   this.setState({ image: image }, ()=> {
    //     this.setState({
    //       imageUri: this.state.image.path
    //     })
    //   });
    //   //this.prepareImage();
    // });
    var options = {
      mediaType: 'photo',
      //includeBase64: true,
      quality: 0.5,
      cameraType: 'front' 
    }
    launchCamera(options, (response)  => {
      // Response data
      console.log(response, 'rre')
      //return;
      this.setState({
        image: response.assets[0]
      }, ()=>{
        //this.prepareImage();
      }) 
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
      name: this.state.image.fileName,
      type: this.state.image.type,
      mime: this.state.image.type,
      uri:
        Platform.OS === "android" ? this.state.image.uri : this.state.image.uri.replace("file://", "")
    });
    data.append("firstName", this.state.firstName);
    data.append("lastName", this.state.lastName);
    data.append("phone", this.state.phone);
    data.append("email", this.state.email);
    data.append("plate_no", this.state.plate_no);
    data.append("password", this.state.password);
    data.append("cityId", this.state.cityId);
    data.append("stateId", this.state.stateId);
    data.append("marital_status", this.state.marital_status);
    data.append("car_description", this.state.car_description);
    data.append("vehicleTypeId", this.state.vehicleTypeId);
    data.append("push_token", this.state.token);
    data.append("device", 'Android');
    data.append("bankName", this.state.bankName);
    data.append("bankAccountName", this.state.bankAccountName);
    data.append("bankAccountNumber", this.state.bankAccountNumber);
    data.append("bankAccountType", this.state.bankAccountType);
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
          <Text style = {styles.headerText}>Become an Enviable Rider</Text>
            <View style = {styles.bottomView}>
            <TouchableOpacity  onPress={() => this.openImagePicker()}>
              {!this.state.image.uri && 
            <Image source = {require('./imgs/img-bg.png')} style = {styles.imgBg} />
              }
              {this.state.image && 
                <Image source = {{uri: this.state.image.uri}} style = {styles.imgBg1} />
              }
            <Text style = {styles.logoText}>Upload profile photo</Text>
            </TouchableOpacity>
            
              <View style= {styles.row}>
                <View style= {styles.col50}>
                  <Text style = {styles.label1}>First name</Text>
                  <TextInput
                                    style={styles.input}
                                    placeholder="First name"
                                    onChangeText={(text) => this.setState({firstName: text})}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor="#ccc" 
                                    value={this.state.firstName}
                                    //keyboardType={'email-address'}
                                  />
                </View>
                <View style= {styles.col50}>
                  <Text style = {styles.label1}>Last name</Text>
                  <TextInput
                                    style={styles.input}
                                    placeholder="Last name"
                                    onChangeText={(text) => this.setState({lastName: text})}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor="#ccc" 
                                    value={this.state.lastName}
                                    //keyboardType={'email-address'}
                                  />
                </View>
              </View>
              <Text style = {styles.label}>Phone</Text>
              <TextInput
                            style={styles.input}
                            placeholder="Phone"
                            onChangeText={(text) => this.setState({phone: text})}
                            underlineColorAndroid="transparent"
                            minLength={11}
                            maxLength={11}
                            keyboardType={'phone-pad'}
                          />
              
              <Text style = {styles.label}>City</Text>
                {this.state.visible &&
                <ModalFilterPicker
                  style={styles.input}
                  onSelect={this.onSelect}
                  onCancel={this.onCancel}
                  options={this.state.cities}
                />
                }
            <TouchableOpacity onPress={() => this.setState({visible: true})}  >
              <Text style={styles.locSelect}>{this.state.locationPlaceholder}</Text>
            </TouchableOpacity>
            <Text style = {styles.label}>Marital status</Text>
              <TouchableOpacity style={[styles.input]}>
              <Picker
                //selectedValue={selectedValue}
                selectedValue={this.state.marital_status}  
                //style={{ height: 100, width: 200 }}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => this.setState({marital_status: itemValue})}
              >
                <Picker.Item color="#444" label={"Single"} value={"Single"} />
                <Picker.Item color="#444" label={"Married"} value={"Married"} />
              </Picker>
              </TouchableOpacity>
              <Text style = {styles.label}>Vehicle type</Text>
              <TouchableOpacity style={[styles.input]}>
              <Picker
                //selectedValue={selectedValue}
                selectedValue={this.state.vehicleTypeId}  
                //style={{ height: 100, width: 200 }}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => this.setState({vehicleTypeId: itemValue})}
              >
                {this.state.vehicleTypes && this.state.vehicleTypes.map(vehicleType => (
                <Picker.Item color="#444" label={vehicleType.name} value={vehicleType.id} />
                ))}
              </Picker>
              </TouchableOpacity>
 
              <Text style = {styles.label}>Plate no.</Text>
              <TextInput
                                style={styles.input}
                                placeholder="Plate no."
                                onChangeText={(text) => this.setState({plate_no: text})}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#ccc" 
                                value={this.state.plate_no}
                              />
              <Text style = {styles.label}>Car description</Text>
              <TextInput
                                style={styles.input}
                                placeholder="eg. Blue Toyota corrola"
                                onChangeText={(text) => this.setState({car_description: text})}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#ccc" 
                                value={this.state.car_description}
                              />
              <Text style = {styles.label}>Email</Text>
              <TextInput
                                style={styles.input}
                                placeholder="Email"
                                onChangeText={(text) => this.setState({email: text})}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#ccc" 
                                value={this.state.email}
                                keyboardType={'email-address'}
                                autoCapitalize = "none"
                              />
              
              <Text style = {styles.label}>Password</Text>
              <TextInput
                                style={styles.input}
                                placeholder="Password"
                                onChangeText={(text) => this.setState({password:text})}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#ccc" 
                                autoCapitalize = "none"
                                secureTextEntry={true} 
                              />
              <Text style = {styles.label}>Bank</Text>
              <View style={styles.input}>
                <Picker
                  //selectedValue={selectedValue}
                  selectedValue={this.state.bankName}  
                  style={styles.input5}
                  onValueChange={(itemValue, itemIndex) => this.setBankSelectValue(itemValue)}
                >
                  {this.state.banks && this.state.banks.map(bank => (
                <Picker.Item label={bank.name} value={bank.name} />
                ))}
                </Picker>
              </View>
              <Text style = {styles.label}>Account type</Text>
              <View style={styles.input}>
                <Picker
                  //selectedValue={selectedValue}
                  selectedValue={this.state.bankAccountType}  
                  style={styles.input5}
                  onValueChange={(itemValue, itemIndex) => this.setTypeSelectValue(itemValue)}
                >
                  <Picker.Item label="Savings" value="Savings" />
                  <Picker.Item label="Current" value="Current" />
                </Picker>
              </View>
              <Text style = {styles.label}>Account name.</Text>
              <TextInput
                                style={styles.input}
                                placeholder="Account name."
                                onChangeText={(text) => this.setState({bankAccountName: text})}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#ccc" 
                                value={this.state.bankAccountName}
                                
                              />
              <Text style = {styles.label}>Account no.</Text>
              <TextInput
                                style={styles.input}
                                placeholder="Account no."
                                onChangeText={(text) => this.setState({bankAccountNumber: text})}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#ccc" 
                                value={this.state.bankAccountNumber}
                                keyboardType={'numeric'}
                                autoCapitalize = "none"
                              />
              <TouchableOpacity style = {styles.forgotView}  >
                <Text style = {styles.forgotText}>By tapping continue, you agree to Enviable's{`\n`}<Text style = {styles.forgotText1}>Terms of Service</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity  onPress={() => this.prepareImage()} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Continue</Text>
                
              </TouchableOpacity>
              <TouchableOpacity style = {styles.forgotView1} onPress={() => this.props.navigation.navigate('Login')}>
              <Text style = {styles.createText1}>Have an account? <Text style = {styles.createText}>Login</Text></Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
          {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
      </View>
    )
  }
}

export default Register

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
     paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
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