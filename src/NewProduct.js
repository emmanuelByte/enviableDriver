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

export class NewProduct extends Component {
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
      weight: '',
      businessName: '',
      businessCategoryId: '',
      
      email: '',
      user: false,
      user_id: '',
      customer: '',
      productCategoryId: '',
      name: '',
      descripition: '',
      price: '',
      image: '',
      cityId: '',
      stateid: '',
      locationPlaceholder: '',
      categories: false,
      cities: false,
    }
    this.getLoggedInUser();
    this.getCategories();
    this.getCities();
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

  getLocation(){
    //this.showLoader();
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
              //To Check, If Permission is granted
              //that.callLocation(that);
            } else {
              alert("Location Permission Denied");
            }
          } catch (err) {
            alert("err",err);
            console.warn(err)
          }
        }
        requestLocationPermission();
      }
    }

    callLocation(that){
      //alert("callLocation Called");
        navigator.geolocation.getCurrentPosition(
          //Will give you the current location
           (position) => {
              const currentLongitude = JSON.stringify(position.coords.longitude);
              //console.log(currentLongitude);
              //getting the Longitude from the location json
              const currentLatitude = JSON.stringify(position.coords.latitude);
              //getting the Latitude from the location json
              that.setState({ longitude:currentLongitude });
              //Setting state Longitude to re re-render the Longitude Text
              that.setState({ latitude:currentLatitude });
              //Setting state Latitude to re re-render the Longitude Text
              //this.getUsers();
              //this.hideLoader();
           },
           (error) => console.log(error)
        );
        that.watchID = navigator.geolocation.watchPosition((position) => {
          //Will give you the location on location change
            const currentLongitude = JSON.stringify(position.coords.longitude);
            //console.log(currentLongitude);
            //getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            //getting the Latitude from the location json
           that.setState({ longitude1:currentLongitude });
           //Setting state Longitude to re re-render the Longitude Text
           that.setState({ latitude1:currentLatitude });
           //Setting state Latitude to re re-render the Longitude Text
           //this.getUsers();
           //this.hideLoader();
        });
        // this.subs = [
        //   this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
        // ];
     }
  componentDidMount() {
    this.getLocation();
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
        }, () => {
          //this.getCategories();
          this.setState({
            user_id: this.state.user.id
          })
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
    
    fetch(`${SERVER_URL}/mobile/get_merchant_product_categories`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
       console.log(res, "res");
       this.hideLoader();
       if(res.success){
          this.setState({
            categories:  res.merchant_product_categories,
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

  addProduct(data){
    console.log(data, "body");
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/add_product`, {
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
              this.props.navigation.navigate('Products')
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
    if(this.state.name == "" || this.state.productCategoryId == "" ||
    this.state.description == "" || this.state.price == "" || this.state.weight == "" 
    ){
      this.showAlert("info", "All fields are compulsory.");
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
    data.append("name", this.state.name);
    data.append("merchantProductCategoryId", this.state.productCategoryId);
    data.append("description", this.state.description);
    data.append("price", this.state.price);
    data.append("weight", this.state.weight);
    data.append("merchant_id", this.state.user.merchant_id);
    this.addProduct(data);
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
          <Text style = {styles.headerText}>Add new product</Text>
            <View style = {styles.bottomView}>
            <TouchableOpacity  onPress={() => this.openImagePicker()}>
              {!this.state.imageUri && 
            <Image source = {require('./imgs/img-bg.png')} style = {styles.imgBg} />
              }
              {this.state.imageUri && 
            <Image source = {{uri: this.state.imageUri}} style = {styles.imgBg1} />
              }
            <Text style = {styles.logoText}>Upload product image</Text>
            </TouchableOpacity>
            <Text style = {styles.label}>Product name</Text>
              <TextInput
                                style={styles.input}
                                placeholder="Product name"
                                onChangeText={(text) => this.setState({name: text})}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#ccc" 
                                value={this.state.name}
                              />
              <Text style = {styles.label}>Product Category</Text>
              <TouchableOpacity style={[styles.input]}>
              <Picker
                //selectedValue={selectedValue}
                selectedValue={this.state.productCategoryId}  
                //style={{ height: 100, width: 200 }}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => this.setState({productCategoryId: itemValue})}
              >
                {this.state.categories && this.state.categories.map(category => (
                <Picker.Item color="#444" label={category.name} value={category.id} />
                ))}
              </Picker>
              </TouchableOpacity>
              <Text style = {styles.label}>Product description</Text>
              <TextInput
                                style={styles.input}
                                placeholder="Product descripition"
                                onChangeText={(text) => this.setState({description: text})}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#ccc" 
                                value={this.state.description}
                              />
              <Text style = {styles.label}>Price</Text>
              <TextInput
                            style={styles.input}
                            placeholder="Price"
                            onChangeText={(text) => this.setState({price: text})}
                            underlineColorAndroid="transparent"
                            minLength={11}
                            maxLength={11}
                            keyboardType={'numeric'}
                          />
              <Text style = {styles.label}>Weight</Text>
              <TextInput
                            style={styles.input}
                            placeholder="Weight"
                            onChangeText={(text) => this.setState({weight: text})}
                            underlineColorAndroid="transparent"
                            minLength={11}
                            maxLength={11}
                            keyboardType={'numeric'}
                          />
              
            
              
              
              
              
              <TouchableOpacity style = {styles.forgotView1} onPress={() => this.prepareImage()} style={styles.submitButton}>
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

export default NewProduct

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