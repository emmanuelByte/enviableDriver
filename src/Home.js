import React, { Component  } from 'react';
import { AppState, View, Text, Switch, RefreshControl, Alert, CheckBox, PermissionsAndroid, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
navigator.geolocation = require('@react-native-community/geolocation');

export class Home extends Component {
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
      user: false,
      sideMenuModalVisible: false,
      productsCount:  0,
      orderDetailsCompletedCount:  0,
      orderDetailsPendingCount:  0,
      onlineStatus: false,
      reviewsCount:  0,
      background1: '#e2aa2e',
      background2: 'transparent',
      orders: false,
      displayOrders: false,
      orderAvailable: true,
      refreshing: false,
    }
    
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

  getAvailableOrders(){
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_available_orders/${this.state.user.vehicle_type_id}/${this.state.user.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     this.hideLoader()
     if(res.success){
          this.setState({
            orders:  res.available_orders,
            displayOrders: res.available_orders,
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
         { text: "Refresh", onPress: () => this.getAvailableOrders() }
       ],
       
     );
    });
  }
  showExit(){
    Alert.alert(
      "Pending approval",
      "We are presently reviewing you guarantor's information. Kindly check back later",
      [
        
        { text: "Check back later", onPress: () => BackHandler.exitApp() }
      ],
      
    );
  }

  async getRider(){
    this.showLoader()
    console.log(this.state.user.id, 'this.state.user.id')
    fetch(`${SERVER_URL}/mobile/get_rider/${this.state.user.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
       console.log(res, "resdjdjdj");
       this.hideLoader();
       if(res.success){
        AsyncStorage.setItem('user', JSON.stringify(res.user)).then(() => {
           this.setState({
              user: res.user
            }, ()=> {
              if(res.user.online_status == "Online"){
                this.setState({
                  onlineStatus: true
                }, ()=>{
                  this.getAvailableOrders();
                })
              }else{
                this.setState({
                  onlineStatus: false
                }, ()=>{
                  this.showAlert("Info", "You are presently offline. You will not be able to see new request")
                })
              }
              if(this.state.user.riders_license == null){
                this.showAlert("Info", "You must upload a valid drivers license to use this app");
                this.props.navigation.push('License');
              }
              else if(this.state.user.riders_license_status == "Pending"){
                this.showAlert("Info", "Admin is reviewing your rider's license. Kindly check back later");
                this.props.navigation.push('License');
              }
              else if(this.state.user.riders_license_status == "Declined"){
                this.showAlert("Info", "Admin has declined your rider's license. Ensure you upload a clear valid rider's license");
                this.props.navigation.push('License');
              }
              else if(!this.state.user.guarantor_status){
                this.showAlert("Info", "You must provide a guarantor to use this app");
                this.props.navigation.push('Guarantor');
              }else if(this.state.user.guarantor_status != "Approved"){
                
                
                this.showExit();
              }
              else if(this.state.user.status == "Inactive"){
                
                
                this.showAlert("Info", "Your acount has been disabled");
                this.showExit();
              }
            })
        })
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
         { text: "Refresh", onPress: () => this.getRider() }
       ],
       
     );
    });
    
  }

  async getLoggedInUser(){
    await AsyncStorage.getItem('user').then((value) => {
      if(value){
        
        this.setState({
          user: JSON.parse(value),
          refreshing: false,
        }, () => {
          
          this.getRider();
          
          this.setState({
            user_id: this.state.user.id
          }, ()=> {
            this.getLocation();
          })
        });
          
      }else{
        this.props.navigation.navigate('Login')
      }
    });
  }
  getLocation(){
    
    var that =this;
    
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
              
              that.callLocation(that);
            } else {
              alert("Permission Denied");
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
    
      navigator.geolocation.getCurrentPosition(
        
         (position) => {
            const currentLongitude = position.coords.longitude;
            console.log(currentLongitude);
            const currentLatitude = position.coords.latitude;
            var origin = {
              latitude: currentLatitude,
              longitude: currentLongitude,
            }
            that.setState({ 
              origin:origin,
              latitude:currentLatitude,
              longitude:currentLongitude
            });
            
         },
         (error) => console.log(error)
      );
      that.watchID = navigator.geolocation.watchPosition((position) => {
        
        
          const currentLongitude = position.coords.longitude;
          const currentLatitude = position.coords.latitude;
          
         var origin = {
           latitude: currentLatitude,
           longitude: currentLongitude,
         }
         that.setState({ 
           
           latitude:currentLatitude,
           longitude:currentLongitude
         }, ()=> {
          this.saveLocation(currentLatitude, currentLongitude)
         });
         
      });
      
   }


   saveLocation(origin_latitude, origin_longitude){
     console.log(origin_latitude, 'origin_latitude')
    fetch(`${SERVER_URL}/mobile/save_rider_location`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          latitude: origin_latitude,
          longitude: origin_longitude,
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
         { text: "Refresh", onPress: () => this.getDashboardInfo() }
       ],
       
     );
    });
  }

  acceptDispatch(order){
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/rider_accept_dispatch/${order.order_number}/${this.state.user.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
        console.log(res, "orders");
        this.hideLoader();
       if(res.success){
         this.showAlert("Success", res.success);
         order.status = "Rider accepted";
         this.gotoOrderDetails(order);
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {this.hideLoader();
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
    });
  }

  acceptMerchantDispatch(order){
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/rider_accept_merchant_dispatch/${order.order_number}/${this.state.user.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "orders");
       this.hideLoader();
       if(res.success){
         this.showAlert("Success", res.success);
         order.status = "Rider confirmed";
          this.gotoOrderDetails(order);
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {this.hideLoader();
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
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
  accept(order){
    if(order.merchant_name){
      this.acceptMerchantDispatch(order);
    }else{
      this.acceptDispatch(order);
    }
  }
  displayStatus(){
    if(this.state.user && this.state.user.online_status == "Online"){
      return(
        <Text style={{marginTop: 5, marginRight: 50,}}>Online</Text>
      )
    }else if(this.state.user && this.state.user.online_status == "Offline") {
      return(
        <Text style={{marginTop: 5, marginRight: 50,}}>Offline</Text>
      )
    }
    else {
     return (
        <Text style={{marginTop: 5, marginRight: 50,}}>Busy</Text>
      )
    }
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

  changeStatus = () => {
    var status = this.state.user.online_status;
    console.log(status, "11status");
    if(status == "Online"){
      var newStatus = "Offline";
    }else{
      var newStatus = "Online";
    }
    
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/rider/status/${this.state.user.id}/${newStatus}`, {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((res) => {
        console.log(res, "status");
        this.hideLoader();
        if(res.success){
          this.getRider();
        }else{
          Alert.alert( 
            "Communictaion error",
            "Ensure you have an active internet connection",
            [
              { 
                text: "Ok",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Refresh", onPress: () => this.changeStatus() }
            ],
            
          );
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
            { text: "Refresh", onPress: () => this.changeStatus() }
          ],
          
        );
    });
  }

  danger(){
    Alert.alert(
      "Confirm",
      "Are you sure you are in danger?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes I am", onPress: () => this.logDanger() }
      ],
      
    );
  }

  logDanger = () => {
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/rider/log_danger/${this.state.user.id}`, {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((res) => {
        console.log(res, "status");
        this.hideLoader();
        if(res.success){
          this.showAlert("info", res.success)
        }else{
          Alert.alert( 
            "Communictaion error",
            "Ensure you have an active internet connection",
            [
              { 
                text: "Ok",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Refresh", onPress: () => this.logDanger() }
            ],
            
          );
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
            { text: "Refresh", onPress: () => this.changeStatus() }
          ],
          
        );
    });
  }

  displayNoData(){
    if(this.state.orders < 1){
      return(
          <View  style={styles.noView}> 
                  <Image source = {require('@images/no.png')} style = {styles.noImage} ></Image>
                  <Text style = {styles.ndt}>There is no available request at the moment...</Text>
          </View>
      )
    }
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    }, ()=> {
      this.getLoggedInUser();
    })
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
             <Text style = {styles.headerText}>{this.state.user && this.state.user.online_status}</Text>
            {this.state.user && 
                
                <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={this.state.onlineStatus ? "#0B277F" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                style={{ paddingTop: 0, marginTop: -20, transform: [{ scaleX: 1.2 }, { scaleY: 1 }] }}
                onValueChange={this.changeStatus}
                value={this.state.onlineStatus}
              />
              }
        </TouchableOpacity>
          <TouchableOpacity style = {styles.dangerView} onPress={() => this.danger()}>
          <Text style = {styles.danger} >Tap here if you are in danger</Text>
          </TouchableOpacity>
       
          <View style = {styles.bottomView}>
            <View  style = {styles.row}>
              <TouchableOpacity style = {[styles.colk, {backgroundColor: '#0B277F'}]}>
                <Text style={styles.segmentText}>New orders</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('ActiveOrders')}  style = {[styles.coll, {borderColor: '#0B277F'}]}>
                <Text style={styles.segmentText1}>Active orders</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
            >
              <View style={styles.sView}>
                {this.state.orders &&
                   this.displayNoData()
                }
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
                  {/*<View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.addView1} onPress={() => this.accept(displayOrder) }>
                        <Text style={styles.addText1}>Accept</Text>
                </TouchableOpacity>*/}
                    <TouchableWithoutFeedback style={styles.addView} onPress={() => this.gotoOrderDetails(displayOrder) }>
                      <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
                        <Text style={styles.addText}>See details</Text>
                      </LinearGradient>
                    </TouchableWithoutFeedback>
                  {/*</View>*/}
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
          <View>
            <TouchableOpacity onPress={this.navigateToScreen('Profile')}  style={styles.topRow}>
              <View style = {styles.topImageView}>
                <TouchableOpacity  onPress={this.navigateToScreen('Profile')}>
                <Image source = {require('@images/round-profile.png')}  style = {styles.userImage} />
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
            
              <TouchableOpacity onPress={this.navigateToScreen('Home')} style = {styles.linkItem}>
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
              
              <TouchableOpacity onPress={this.navigateToScreen('Transactions')}  style = {styles.linkItem}>
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
              <TouchableOpacity  onPress={() => {this.navigateToScreen('Help')}} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                <Icon.Button name="power-settings-new" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} onPress={() => {AsyncStorage.removeItem('user');this.hideSideMenu();this.props.navigation.navigate('Login')}} >Logout</Text>
                </View>
              </TouchableOpacity>
            </View>


          </View>
        </ScrollView>
        
      </View>
    </Modal>
        
      </View>
    )
  }
}

export default Home

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
    
    overflow: 'hidden',
    borderBottomEndRadius: 30, 
    borderBottomStartRadius: 30, 
  },
  dangerView: {
    position: 'absolute',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    bottom: 10,
    right: 10,
    zIndex: 999999,
    borderWidth: 1,
    borderColor: 'brown',
    borderRadius: 32,
  },
  danger: {
    color: 'brown',
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
    
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 20,
    elevation: 2,
    marginTop: 15,
  },
  wait: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
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
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  noView: {
    width: '100%',
    marginTop: 100,
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
  addText1: {
    textAlign: 'center',
    fontSize: 16,
    color: '#0B277F',
  },
  addView1: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#0B277F',
    borderRadius: 10,
    marginTop: 10,
    marginRight: 5,
    paddingTop: 7,
  },
  addGradient1: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
    marginTop: 10,
  },
  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  addView: {
    width: '90%',
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
    color: '#fff',
    fontSize: 12,
    paddingTop: 6,
    paddingBottom: 7,
    textAlign: 'center'
  },
  segmentText1: {
    color: '#0B277F',
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

    
    
  },
  menuImageView: {
    zIndex: 999999999999999,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 20,
    
    height: 55,
    
    
    
    marginTop: 50,
    
  },
  bottomView: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 250,
    minHeight: '100%',
    flex: 1,
    
    
    
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 10,
    color: '#000',
    
    paddingRight: 10,
    marginTop: 5,
    
  },
  headerText1: {
    fontSize: 20,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: "bold",

  },
  card1: {
    
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
    
    width: '50%',
    height: 100,
    marginBottom: 13,
    
    borderRadius: 10,
    
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
    
    width: '50%',
    height: 100,
    marginBottom: 13,
    
    borderRadius: 10,
    
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
  c: {
    alignSelf: 'center',
   width: '700%',
    
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
  
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
}
  

  
})