import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';

export class RegisterType extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,loaderVisible: false,
      forgotVisible: false,
      email: '',
      password: '',
      email1: '',
      custmer: '',
      customer_id: '',
      sideMenuModalVisible: false,
      balance: false,
    }
    //AsyncStorage.clear();
  }

  async componentWillMount() {
    
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('Login')
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

  showSideMenu(){
    this.setState({
      sideMenuModalVisible: true
    });
  }
  hideSideMenu(){
    this.setState({
      sideMenuModalVisible: false
    });
  }
  
  gotoRegister(type){
    this.props.navigation.navigate('AddRider', {
      type: type,
    });
  }
  
  navigateToScreen = (route) => () => {
    this.hideSideMenu();
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  static navigationOptions = {
      header: null
  }
  
  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <StatusBar translucent={true} barStyle={'dark-content'} backgroundColor={'transparent'}  />
           <View style = {styles.bottomView}>
            <TouchableOpacity  onPress={() =>  this.props.navigation.goBack()}>
              <Icon name="arrow-back" size={18} color="#000"  style = {styles.backImage}/>
            </TouchableOpacity>
              <View style = {styles.top}>
              <Text style = {styles.headerText}>How would you like to operate{`\n`}Enviable</Text>
                <View style = {styles.row}>
                  <TouchableWithoutFeedback onPress={() => this.gotoRegister("Haulage")}>
                    <View style = {styles.card}>
                      <View style = {styles.colImage}>
                        <Image source = {require('./imgs/ha.png')} style = {styles.cImage} />
                      </View>
                      <View style = {styles.colContent}>
                        <Text style = {styles.contentText1}>Haulage service</Text>
                        <Text style = {styles.contentTextBody}>Manage all your shipments and payments with easy</Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                {/*
                <View style = {styles.row}>  
                  <TouchableWithoutFeedback  onPress={() => this.gotoRegister("Courier")}>
                    <View style = {styles.card1}>
                      <View style = {styles.colImage}>
                        <Image source = {require('./imgs/hb.png')} style = {styles.cImage1} />
                      </View>
                      <View style = {styles.colContent}>
                        <Text style = {styles.contentText2}>Courier service</Text>
                        <Text style = {styles.contentTextBody}>For courier drivers  </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                */}
                <View style = {styles.row}>
                  <TouchableWithoutFeedback  onPress={() => this.gotoRegister("Ride Share")} >
                    <View style = {styles.card}>
                      <View style = {styles.colImage}>
                        <Image source = {require('./imgs/hc.png')} style = {styles.cImage2} />
                      </View>
                      <View style = {styles.colContent}>
                        <Text style = {styles.contentText3}>Ride share</Text>
                        <Text style = {styles.contentTextBody}> For Ride share riders.</Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                {/*
                <View style = {styles.row}>
                  <TouchableWithoutFeedback  onPress={() => this.gotoRegister("Courier")} >
                    <View style = {styles.card1}>
                      <View style = {styles.colImage}>
                        <Image source = {require('./imgs/hd.png')} style = {styles.cImage3} />
                      </View>
                      <View style = {styles.colContent}>
                        <Text style = {styles.contentText4}>Food delivery</Text>
                        <Text style = {styles.contentTextBody}>Fro drivers into food delivery.</Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                */}
              </View>
            </View>
      </View>
    )
  }
}

export default RegisterType

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  sideMenuModal: {
    margin: 0,
  },
  modalContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#0B277F',
    margin: 0,
  },
  modalB: {
    height: '100%',
  },
  body: {
    minHeight: '100%',
  },
  bImage: {
    width: '100%',
    height: 220,
    zIndex:1,
    backgroundColor: '#0B277F',
    borderBottomEndRadius: 30, 
    borderBottomStartRadius: 30, 
  },
  bImage1: {
    width: '100%',
    height: '100%',
    zIndex:0,
    //opacity: 0.6,
    overflow: 'hidden',
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  menuImage: {
    //marginLeft: 20,
    //marginTop: 69,
    width: 30,
    height: 19,
  },
  dash: {
    width: 18,
    height: 18,
    marginTop: 13,
    marginBottom: 10,
  },
  dash1: {
    width: 20,
    height: 13,
    marginTop: 15,
    marginBottom: 10,
  },

  menuImageView: {
    zIndex: 999999999999999,
    width: '100%',
    //backgroundColor: '#000',
    height: 15,
    paddingLeft: 20,
    paddingRight: 40,
    paddingBottom: 20,
    //marginLeft: 20,
    paddingTop: 80,
    //elevation: 2,
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    //position: 'absolute',
    //bottom: 0,
    marginTop: 30,
    //paddingLeft: 20,
    //paddingRight: 20,
  },
  backImage: {
    marginTop: 20,
    marginLeft: 20,
  },
  tButton: {
    //marginTop: 20,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 6,
    width: '50%',
    //alignSelf: 'flex-end',
    marginRight: 5,
    paddingTop: 7,
    paddingBottom: 8,
    marginTop: 10,
    zIndex: 999999999999,
    marginLeft: 20,
  },
  tButtonText: {
    color: '#fff',
    textAlign: 'center'
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 20,
    color: '#313131',
    marginTop: 30,
    marginBottom: 10,
  },
  headerText1: {
    fontSize: 17,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: "bold",

  },
  logo: {
    width: 100,
    height: 30,
  },
  card: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    //height: 150,
    marginBottom: 13,
    //marginRight: '10%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
  },
  card1: {
    flexDirection: 'row',
    alignSelf: 'center',
    //height: 150,
    width: '90%',
    marginBottom: 13,
    
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
  },
  colImage: {
    width: '35%',
    alignSelf: 'center',
  },
  colContent: {
    width: '65%',
    flexDirection: 'column',
  },
  cImage: {
    //alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: 60,
    height: 30,
  },
  cImage1: {

    //alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: 60,
    height: 48,
  },
  cImage2: {
    //alignSelf: 'center',
    // marginTop: 20,
    // marginBottom: 20,
    width: 80,
    height: 70,
  },
  cImage3: {
    //alignSelf: 'center',
    marginLeft: 14,
    marginTop: 10,
    marginBottom: 10,
    width: 50,
    height: 45,
  },
  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#000',
    marginTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
    //textAlign: 'center',
  },
  contentText2: {
    color: '#000',
    marginTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
    //textAlign: 'center',
  },
  contentText3: {
    color: '#000',
    //marginTop: 20,
    fontSize: 13,
    fontWeight: 'bold',
    //textAlign: 'center',
  },
  contentText4: {
    color: '#000',
    marginTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
    //textAlign: 'center',
  },
  contentTextBody: {
    color: '#313131'
  },

  label:{
    color: '#ddd',
    paddingLeft: 25,
    marginTop: 13,
  },
  input: {
    width: '90%',
    height: 46,
    backgroundColor: '#5E4385',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#ccc',
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
    textAlign: 'right',
    marginRight: 30,
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
  },
  
  createText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  
submitButton: {elevation: 2,
  marginTop: 20,
  backgroundColor: '#ED6315',
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

label1: {
  color: '#333',
  marginTop: 15,
  paddingLeft: 20,
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

top: {
  //marginBottom: 60,
  width: '100%',
  //height: '100%'
},

row: {
  width: '100%',
  //alignSelf: 'center',
  marginTop: 10,
  
},

row1: {
  width: '100%',
  //position: 'absolute',
  bottom: 0,
  
},
bCol1: {
  width: '50%',
  paddingBottom: 15,
  paddingTop: 15,
}, 
lText1: {
  color: '#fff',
  //width: '50%',
  fontSize: 16,
  textAlign: 'center',
  fontWeight: '700',
},
bCol2: {
  width: '50%',
  backgroundColor: '#fff',
  borderTopLeftRadius: 15,
  paddingTop: 15,
  paddingBottom: 15,
}, 
lText2: {
  color: '#0B277F',
  //width: '50%',
  fontSize: 16,
  textAlign: 'center',
  fontWeight: '700', 
},

topRow: { 
  flexDirection: 'row', 
  width: '100%',
  height: 120,
  paddingTop: 50,
},
topImageView: {
  paddingLeft: 30,
  width: '35%',
},
userImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
  //borderColor: '#9c77b1',
  //borderWidth: 6,
},
topTextView: {
  paddingLeft: 20,
  paddingTop: 15,
  width: '60%',
},
linkItem: {
  width: '100%',
  paddingLeft: 15,
  flexDirection: 'row',
  marginBottom: 2,
},
linkBody: {
  paddingTop: 25,
  paddingLeft: 10,
},
linkBodyBottom: {
  borderTopColor: '#eee',
  borderTopWidth: 1,
  marginTop: 35,
  paddingLeft: 20,
  paddingTop: 20,
},
linkItemBottom: {
  width: '100%',
  //paddingLeft: 20,
  flexDirection: 'row',
  marginBottom: 5,
},
textLink: {
  paddingTop: 3,
  fontSize: 16,
  color: '#fff',
},
textLinkBottom: {
  paddingTop: 7,
  fontSize: 16,
  color: '#fff',
},
current: {
  paddingTop: 0,
  fontSize: 16,
  color: '#cc5490',
},
iconView: {
  width: '20%',
},
iconViewBottom: {
  width: '20%',
},
textView: {
  width: '80%',
  paddingTop: 7,
},
linkIcon: {
  width: 20,
  height: 20,
  //paddingRi: 20,
},

profilePix: {
  width: 60,
  height: 60,
  marginLeft: 20,
  marginTop: 30,
  borderRadius: 30,
  padding: 20,
  borderWidth: 1,
  borderColor: '#555',

},
topBackground: {
  width: '100%',
  height: 80,
  backgroundColor: "#2a486c",
},

topLocation: {
  color: '#fff',
fontSize: 10,
},
topTextName: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 14,
},

  
})