import React, { Component  } from 'react';
import { AppState, View, Text, Alert, RefreshControl, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';

export class ActiveOrders extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,
      forgotVisible: false,
      email: '',
      password: '',
      email1: '',
      custmer: '',
      user_id: '',
      sideMenuModalVisible: false,
      productsCount:  0,
      orderDetailsCompletedCount:  0,
      orderDetailsPendingCount:  0,
      reviewsCount:  0,
      background1: '#e2aa2e',
      background2: 'transparent',
      orders: false,
      displayOrders: false,
      refreshing: false,
    }
    //AsyncStorage.clear();
  }

  async componentWillMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  async componentDidFocus(){
    await this.getLoggedInUser();
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

  getActiveOrders(){
    this.showLoader();
    console.log(this.state.user.id);
    fetch(`${SERVER_URL}/mobile/get_active_orders/${this.state.user.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     this.hideLoader();
     if(res.success){
          this.setState({
            orders:  res.active_orders,
            displayOrders: res.active_orders,
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
         { text: "Refresh", onPress: () => this.getActiveOrders() }
       ],
       //{ cancelable: false }
     );
    });
  }

  

  async getLoggedInUser(){
    await AsyncStorage.getItem('user').then((value) => {
      if(value){
        //this.props.navigation.navigate('Home')
        this.setState({
          user: JSON.parse(value),
          refreshing: false,
        }, () => {
          this.getActiveOrders();
          this.setState({
            user_id: this.state.user.id
          })
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

  getDashboardInfo(){
    fetch(`${SERVER_URL}/mobile/get_merchant_dashboard_info/${this.state.user.merchant_id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "orders");
       //this.hideLoader();
       if(res.success){
          this.setState({
            productsCount:  res.products_count,
            orderDetailsCompletedCount:  res.order_details_completed_count,
            orderDetailsPendingCount:  res.order_details_pending_count,
            reviewsCount:  res.ratings_count,
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
         { text: "Refresh", onPress: () => this.getDashboardInfo() }
       ],
       //{ cancelable: false }
     );
    });
  }
  onRefresh = () => {
    this.setState({
      refreshing: true,
    }, ()=> {
      this.getLoggedInUser();
    })
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

  gotoOrderDetails(order){
    console.log(order);
    if(order.merchant_name){
      this.props.navigation.navigate('MerchantOrderDetails', {
        orderId: order.id,
      });
    }else{
      this.props.navigation.navigate('DispatchOrderDetails', {
        orderId: order.id,
      });
    }
  }
  displayNoData(){
    var data = this.state.orders.length;
    if(data < 1){
      return(
          <View  style={styles.noView}> 
                  <Image source = {require('./imgs/no.png')} style = {styles.noImage} ></Image>
                  <Text style = {styles.ndt}>There is no active request at the moment...</Text>
          </View>
      )
    }
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
        <StatusBar translucent={true} backgroundColor={'#0B277F'}  />
        <TouchableOpacity style = {styles.menuImageView} onPress={() => this.showSideMenu()} >
          <Icon name="menu" size={29} color="#000"  style = {styles.menuImage}/>
          <Text style = {styles.headerText}>Dashboard</Text>
          </TouchableOpacity>
            
            
          
       
          <View style = {styles.bottomView}>
            {/*
            <View  style = {styles.row}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}  style = {[styles.colk, {borderColor: '#0B277F'}]}>
                <Text style={styles.segmentText}>New orders</Text>
              </TouchableOpacity>
              <TouchableOpacity  style = {[styles.coll, {backgroundColor: '#0B277F'}]}>
                <Text style={styles.segmentText1}>Active orders</Text>
              </TouchableOpacity>
            </View>
            */}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
            >
              <View style={styles.sView}>
              {this.state.orders && this.displayNoData()}
                {this.state.displayOrders && this.state.displayOrders.map((displayOrder, index) => (
                <View  style = {styles.card} key={index} >
                  <View  style = {styles.cardRow}>
                    <View  style = {styles.col1}>
                      <Text style={styles.tHead}>Order number</Text>
                      <Text style={styles.tText}>#{displayOrder.order_number} </Text>
                      <Text style={styles.tHead}>Total distance</Text>
                      <Text style={styles.tText}>{displayOrder.distance}km</Text>
                      <Text style={styles.tHead}>Delivery fee</Text>
                      <Text style={styles.tText}>₦{parseFloat(displayOrder.delivery_fee).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                    </View>
                    <View  style = {styles.col2}>
                    <Text style={styles.tHead}>Pickup location</Text>
                      <Text style={styles.tText}> {displayOrder.pickup_address} {displayOrder.merchant_address}</Text>
                      <Text style={styles.tHead}>Delivery location</Text>
                      <Text style={styles.tText}>{displayOrder.delivery_address} {displayOrder.address}</Text>
                    </View>
                  </View>
                  <TouchableWithoutFeedback style={styles.addView} onPress={() => this.gotoOrderDetails(displayOrder) }>
                    <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
                      <Text style={styles.addText}>See details</Text>
                    </LinearGradient>
                  </TouchableWithoutFeedback>
                </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {this.state.visible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        <Modal
          isVisible={this.state.sideMenuModalVisible}
          onBackdropPress={() => {
            this.setState({ sideMenuModalVisible: false });
          }}
          height= {'100%'}
          width= {'100%'}
          style={styles.sideMenuModal}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          swipeDirection={'left'}
          onSwipeComplete={(left)=> {this.setState({ sideMenuModalVisible: false });}}
        >
        <View style={styles.modalContainer}> 
          <ScrollView>
            <TouchableOpacity onPress={this.navigateToScreen('Profile')}  style={styles.topRow}>
              <View style = {styles.topImageView}>
                <TouchableOpacity  onPress={this.navigateToScreen('Profile')}>
                <Image source = {require('./imgs/round-profile.png')}  style = {styles.userImage} />
                </TouchableOpacity>
              </View>
              <View style = {styles.topTextView}>
                <Text style = {styles.topTextName}  onPress={this.navigateToScreen('Profile')}>
                {this.state.user && this.state.user.first_name} {this.state.user && this.state.user.last_name}
                </Text>
                <Text style = {styles.topLocation}  onPress={this.navigateToScreen('Profile')}> 
                  VIEW PROFILE
                </Text>
              </View>
            </TouchableOpacity>
            <View style = {styles.linkBody}>
              {/*
            <TouchableOpacity onPress={this.navigateToScreen('Profile')} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                <Icon.Button name="person" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} >Profile</Text>
                </View>
              </TouchableOpacity>
              */}
              <TouchableOpacity onPress={this.navigateToScreen('ActiveOrders')} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                <Icon.Button name="dashboard" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} >Dashboard</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={this.navigateToScreen('Orders')} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                  <Icon.Button name="history" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} >Order history</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={this.navigateToScreen('Transactions')} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                  <Icon.Button name="account-balance-wallet" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} >Transactions</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={this.navigateToScreen('Help')} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                <Icon.Button name="help" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} >Help</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={() => {AsyncStorage.removeItem('user');this.hideSideMenu();this.props.navigation.navigate('Login')}} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                <Icon.Button name="power-settings-new" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} onPress={() => {AsyncStorage.removeItem('user');this.hideSideMenu();this.props.navigation.navigate('Login')}} >Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
    </Modal>
        
      </View>
    )
  }
}

export default ActiveOrders

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
  body: {
    minHeight: '100%',
    backgroundColor: "#fefefe",
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
    height: 220,
    zIndex:0,
    //opacity: 0.6,
    overflow: 'hidden',
    borderBottomEndRadius: 30, 
    borderBottomStartRadius: 30, 
  },
  sView: {
    marginBottom: 250,
    flex:1,
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  row: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#0B277F',
    borderRadius: 18,
    flexDirection: 'row',
    //marginTop: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 20,
    elevation: 2,
    marginTop: 15,
  },
  cardRow: {
    flexDirection: 'row',
  },
  col1: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#a9a9a9' ,
  },
  col2: {
    width: '50%',
    paddingLeft: 15
  },
  tHead: {
    color: '#000' ,
    marginTop: 10,
  },
  tText: {
    color: '#555' ,
    fontSize: 13,
  },
  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  addView: {
    width: '100%',
    height: 40,
    
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
    marginTop: 10,
  },
  segmentText: {
    color: '#0B277F',
    fontSize: 12,
    paddingTop: 6,
    paddingBottom: 7,
    textAlign: 'center'
  },
  segmentText1: {
    color: '#fff',
    fontSize: 12,
    paddingTop: 6,
    paddingBottom: 7,
    textAlign: 'center'
  },
  colk: {
    width: '50%',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  coll: {
    width: '50%',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  menuImage: {
    width: 40,

    //marginLeft: 20,
    //marginTop: 59,
  },
  menuImageView: {
    zIndex: 999999999999999,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 20,
    //backgroundColor: '#000',
    height: 55,
    //paddingLeft: 20,
    //paddingRight: 20,
    //marginLeft: 20,
    marginTop: 50,
    //elevation: 2,
  },
  bottomView: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 250,
    minHeight: '100%',
    flex: 1,
    //marginTop: 10,
    //paddingLeft: 20,
    //paddingRight: 20,
  },
  noView: {
    width: '100%',
    marginTop: 40,
  },
  noImage: {
    width: 140,
    height: 150,
    alignSelf: 'center',
  },
  ndt: {
    textAlign: 'center',
    color: '#a8a8a8',
  },
  headerText: {
    fontSize: 17,
    //paddingLeft: 20,
    color: '#000',
    width: '50%',
    marginTop: 5,
  },
  headerText1: {
    fontSize: 20,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: "bold",

  },
  card1: {
    //flexDirection: 'row',
    width: '50%',
    height: 100,
    marginBottom: 13,
    
    borderRadius: 10,
    marginRight: 5,
    backgroundColor: '#3353F6',
    padding: 15,
  },
  card1Value: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    marginTop: 7,
  },
  cardText:{
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
  },
  card1Text:{
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
  },
  card2: {
    //flexDirection: 'row',
    width: '50%',
    height: 100,
    marginBottom: 13,
    
    borderRadius: 10,
    //marginLeft: 5,
    backgroundColor: '#F59159',
    padding: 15,
  },
  card2Value: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    marginTop: 7,
  },
  card2Text:{
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
  },

  card3: {
    //flexDirection: 'row',
    width: '50%',
    height: 100,
    marginBottom: 13,
    
    borderRadius: 10,
    marginRight: 5,
    backgroundColor: '#41E426',
    padding: 15,
  },
  card3Value: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    marginTop: 7,
  },
  card3Text:{
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
  },
  card4: {
    //flexDirection: 'row',
    width: '50%',
    height: 100,
    marginBottom: 13,
    
    borderRadius: 10,
    //marginLeft: 5,
    backgroundColor: '#FFCD3A',
    padding: 15,
  },
  card4Value: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    marginTop: 7,
  },
  card4Text:{
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
  },
  colImage: {
    width: '35%'
  },
  colContent: {
    width: '65%',
    flexDirection: 'column',
  },
  cImage: {
    alignSelf: 'center',
    marginTop: 5,
  },
  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#5D626A',
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
  
submitButton: {
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
  // borderColor: '#9c77b1',
  // borderWidth: 6,
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
loading: {
  position: 'absolute',
  elevation: 2, 
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 9999999999999999999999999,
  //height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
}

  
})