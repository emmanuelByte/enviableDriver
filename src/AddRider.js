import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image, Platform, PermissionsAndroid, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {Picker} from '@react-native-picker/picker'; 
navigator.geolocation = require('@react-native-community/geolocation');
import RNPicker from 'react-native-picker-select';

export class AddRider extends Component {
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
      plate_no: '',
      categories: false,
      cities: [],
      user: false,
      marital_status: "Single",
      vehicleTypes: false,
      vehicleTypeId: '',
      type: props.navigation.state.params.type,
    }
    
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

  componentDidMount() {
    
    this.getLoggedInUser();
    this.getCategories();
    this.getCities();
    this.getVehicleTypes();
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
          this.setState({
            user: JSON.parse(value)
          })
      }else{
        
      }
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
       
     );
    });
  }

  register(data){
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/vendor_add_rider`, {
      method: 'POST', 
      
      
      
      
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
              this.props.navigation.push('Riders')
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
    data.append("plate_no", this.state.plate_no);
    data.append("password", this.state.password);
    data.append("cityId", this.state.cityId);
    data.append("stateId", this.state.stateId);
    data.append("marital_status", this.state.marital_status);
    data.append("vehicleTypeId", this.state.vehicleTypeId);
    data.append("vendorId", this.state.user.vendor_id);
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
          <TouchableOpacity  onPress={() =>  this.props.navigation.goBack()}>
          <Icon name="arrow-back" size={18} color="#000"  style = {styles.backImage}/>
          </TouchableOpacity>
          <Text style = {styles.headerText}>Add New Rider</Text>
            <View style = {styles.bottomView}>
            <TouchableOpacity  onPress={() => this.openImagePicker()}>
              {!this.state.imageUri && 
            <Image source = {require('@images/img-bg.png')} style = {styles.imgBg} />
              }
              {this.state.imageUri && 
            <Image source = {{uri: this.state.imageUri}} style = {styles.imgBg1} />
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
              {/* <TouchableOpacity style={[styles.input]}> */}
              {/* <Picker
                
                selectedValue={this.state.marital_status}  
                
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => this.setState({marital_status: itemValue})}
              >
                <Picker.Item color="#444" label={"Single"} value={"Single"} />
                <Picker.Item color="#444" label={"Married"} value={"Married"} />
              </Picker> */}

              
  <RNPicker
          placeholder="Marital status"
          
          selectedValue={this.state.marital_status}  
          onValueChange={(itemValue, itemIndex) => this.setState({marital_status: itemValue})}

          style={{
            inputIOSContainer:styles.input,
            inputAndroid: styles.input,

            placeholder:{color:'black'}
          }}          
          items={[
            { label: 'Single', value: 'Single' },
            { label: 'Married', value: 'Married' },
        ]}          
        returnKeyType={'done'}
        />
        
              {/* </TouchableOpacity> */}
              <Text style = {styles.label}>Vehicle type</Text>
              {/* <TouchableOpacity style={[styles.input]}>
              <Picker
                
                selectedValue={this.state.vehicleTypeId}  
                
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => this.setState({vehicleTypeId: itemValue})}
              >
                {this.state.vehicleTypes && this.state.vehicleTypes.map(vehicleType => (
                <Picker.Item color="#444" label={vehicleType.name} value={vehicleType.id} />
                ))}
              </Picker>

              </TouchableOpacity> */}

              
<RNPickerSelect
          placeholder="Vehicle type"
          
          selectedValue={this.state.vehicleTypeId}  
          onValueChange={(itemValue, itemIndex) => this.setState({vehicleTypeId: itemValue})}
          style={{
            inputIOSContainer:styles.input,
            placeholder:{color:'black'},
            inputAndroid: styles.input,

          }}
          items={this.state.vehicleTypes && this.state.vehicleTypes.map(vehicleType => ( {label: vehicleType.name, value:vehicleType.id }))}
          returnKeyType={'done'}
        />


              <Text style = {styles.label}>Plate no.</Text>
              <TextInput
                                style={styles.input}
                                placeholder="Plate no."
                                onChangeText={(text) => this.setState({plate_no: text})}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#ccc" 
                                value={this.state.plate_no}
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
                     
              
              <TouchableOpacity  onPress={() => this.prepareImage()} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Continue</Text>
                
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

export default AddRider

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
  marginBottom: 100,
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