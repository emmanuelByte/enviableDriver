import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image, Platform, PermissionsAndroid, Picker, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import ImagePicker from 'react-native-image-crop-picker';

export class CompanyEditProfile extends Component {
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
      account_type: ''
    }
    this.getLoggedInUser();
    this.getCategories();
    this.getCities();
    //this.setBanks();
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
            // latitude: this.state.user.latitude,
            // longitude: this.state.user.longitude,
            // address: this.state.user.address
          })
        })
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
       //console.log(res, "res");
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

  register(data){
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/vendorEditProfile`, {
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
                  //this.props.navigation.navigate('Home')
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

  prepareImage(){
    if(this.state.firstName == "" || this.state.lastName == "" || this.state.phone == "" ||
    this.state.email == ""  || this.state.cityId == "" ||
      this.state.bankName == "" || this.state.bankAccountName == ""
    || this.state.bankAccountNumber == "" || this.state.bankAccountType == ""
    ){
      this.showAlert("info", "All fields are compulsory.");
      return;
    }
    
    const data = new FormData();

    data.append("firstName", this.state.firstName);
    data.append("lastName", this.state.lastName);
    data.append("phone", this.state.phone);
    data.append("email", this.state.email);
    data.append("cityId", this.state.cityId);
    data.append("stateId", this.state.stateId);
    data.append("address", this.state.address);
    data.append("bankName", this.state.bankName);
    data.append("bankAccountName", this.state.bankAccountName);
    data.append("bankAccountNumber", this.state.bankAccountNumber);
    data.append("bankAccountType", this.state.bankAccountType);
    data.append("userId", this.state.user.id);
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
          <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
          <Icon name="arrow-back" size={18} color="#000"  style = {styles.backImage}/>
          </TouchableOpacity>
          <Text style = {styles.headerText}>Update profile</Text>
            <View style = {styles.bottomView}>
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
                            value={this.state.phone}
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
                  <Picker.Item label="Current" value="Current" />
                  <Picker.Item label="Savings" value="Savings" />
                  
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
              <TouchableOpacity  onPress={() => this.prepareImage()} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Update</Text>
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

export default CompanyEditProfile

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