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

export class License extends Component {
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
    }
    this.getLoggedInUser();
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
        
        { text: "Leave", onPress: () => BackHandler.exitApp() }
      ],
      
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
        }, ()=>{
          console.log(this.state.user.riders_license);
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

  upload(data){
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/riderUploadLicense`, {
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
      this.prepareImage();
    });
  }

  prepareImage(){
    const data = new FormData();

    data.append("image", {
      name: this.state.image.modificationDate,
      type: this.state.image.mime,
      mime: this.state.image.mime,
      uri:
        Platform.OS === "android" ? this.state.image.path : this.state.image.path.replace("file://", "")
    });
    data.append("userId", this.state.user.id);
    this.upload(data);
  }
  displayImage(){
    if(this.state.user.riders_license != null){
      return(
        <View>
          <Image source = {{uri: SERVER_URL+this.state.user.riders_license}} style = {styles.imgBg1} />
          <Text style = {styles.logoText}>STATUS: {this.state.user.riders_license_status}</Text>
          <Text style = {styles.logoText1}>Kindly check back later while we review your license!!!</Text>
       </View>
      )
    }else{
      return(
        <View>
          <Image source = {require('@images/img-bg.png')} style = {styles.imgBg} />
          <Text style = {styles.logoText}>Photo of your rider's/driver's license</Text>
          
        </View>
      )
    }
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
          <Text style = {styles.headerText}>Upload License</Text>
            <View style = {styles.bottomView}>
            
            <TouchableOpacity  onPress={() => this.openImagePicker()}>
              {this.displayImage()}
            
            </TouchableOpacity>
            
              
              <TouchableOpacity   onPress={() => this.openImagePicker()} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Upload license</Text>
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

export default License

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
    marginTop: 50,

  },
  imgBg1: {
    width: 120,
    height: 120, 
    alignSelf: 'center',

  },
  logoText: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  logoText1: {
    textAlign: 'center',
    marginBottom: 10,
    
    color: 'brown',
    width: '80%',
    alignSelf: 'center',
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