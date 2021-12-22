import React, { Component  } from 'react';
import { AppState, View, PermissionsAndroid, Linking,  Text, Alert, Image, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; 
navigator.geolocation = require('@react-native-community/geolocation');
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { showLocation } from 'react-native-map-link';
import RNPicker from 'react-native-picker-select';
import { SERVER_URL } from './config/server';
import { OpenMapDirections } from 'react-native-navigation-directions';

export class RideOrderDetails extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      visible: false,loaderVisible: false,
      loaderVisible: false,
      order: false,
      rider: false,
      origin: false,
      destination: false,
      customer: false
      
    }
    this.getLoggedInUser();
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
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
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
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
  componentDidFocus = () => {
    //this.getLocation();
    this.getOrder(this.props.navigation.state.params.orderId);    
  }

  getOrder(orderId){
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_ride_share_order_for_rider/${orderId}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     console.log(res);
     this.hideLoader();
       if(res.success){
         var origin = {
           latitude: JSON.parse(res.order.pickup_latitude),
           longitude: JSON.parse(res.order.pickup_longitude),
           latitudeDelta: 0.009922,
           longitudeDelta: 0.009421,
         }
         var destination = {
          latitude: JSON.parse(res.order.delivery_latitude),
          longitude: JSON.parse(res.order.delivery_longitude),
          latitudeDelta: 0.009922,
           longitudeDelta: 0.009421,
        }
          this.setState({
            order:  res.order,
            customer: res.customer,
            origin: origin,
            destination: destination,
          }, ()=>{

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
         { text: "Refresh", onPress: () => this.getOrder(orderId) }
       ],
       //{ cancelable: false }
     );
    });
  }
  
  async getLoggedInUser(){
    await AsyncStorage.getItem('user').then((value) => {
      if(value){
        this.setState({
          user: JSON.parse(value),
        }, () => {
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
      loaderVisible: true
    });
  }
  hideLoader(){
    this.setState({
      loaderVisible: false,
    });
  }

  changeStatus(status){
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/rider_${status}_ride_share/${this.state.order.id}/${this.state.user.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "orders");
       this.hideLoader();
       if(res.success){
         this.getOrder(this.props.navigation.state.params.orderId)
         this.showAlert("Success", res.success);
          //this.gotoOrderDetails(order);
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {this.hideLoader();
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
    });
  }

  accept(){
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/rider_accept_ride_share/${this.state.order.id}/${this.state.user.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "orders");
       this.hideLoader();
       if(res.success){
         this.showAlert("Success", res.success);
         this.getOrder(this.props.navigation.state.params.orderId)
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {this.hideLoader();
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
    });
  }

  displayButton(){
    if(this.state.order.status == "Looking for rider"){
      return(
        <TouchableOpacity  onPress={() => {this.accept()}} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Accept ride</Text>
        </TouchableOpacity>
      )
    }
    else if(this.state.order.status == "Rider accepted"){
      return(
        <TouchableOpacity  onPress={() => {this.changeStatus("arrived")}} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Arrived at pickup location</Text>
        </TouchableOpacity>
      )
    }else if(this.state.order.status == "Rider arrived at location"){
      return(
        <TouchableOpacity  onPress={() => {this.changeStatus("started")}} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Start ride</Text>
        </TouchableOpacity>
      )
    }
    else if(this.state.order.status == "Ride started"){
      return(
        <TouchableOpacity  onPress={() => {this.changeStatus("completed")}} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Ride completed</Text>
        </TouchableOpacity>
      )
    }
  }
  use(){
    const startPoint = {
      latitude: parseFloat(this.state.order.pickup_latitude),
      longitude: parseFloat(this.state.order.pickup_longitude),
    } 

    const endPoint = {
      latitude: parseFloat(this.state.order.delivery_latitude),
      longitude: parseFloat(this.state.order.delivery_longitude),
    }

		const transportPlan = 'w';
    if(this.state.order.status == "Rider accepted"){
    OpenMapDirections(startPoint, endPoint, transportPlan).then(res => {
      console.log(res)
    });
  }
  else {
    
  }
    
    // if(this.state.order.status == "Rider accepted"){
    //   showLocation({
    //     latitude: this.state.order.pickup_latitude,
    //     longitude: this.state.order.pickup_longitude,
    //     //sourceLatitude: this.state.origin.latitude,  // optionally specify starting location for directions
    //     //sourceLongitude: this.state.origin.longitude,  // not optional if sourceLatitude is specified
    //     title: this.state.order.pickup_address,  // optional
    //     //googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
    //     //googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
    //     //alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
    //     dialogTitle: 'Change map', // optional (default: 'Open in Maps')
    //     dialogMessage: 'Open in google map', // optional (default: 'What app would you like to use?')
    //     cancelText: 'Cancel', // optional (default: 'Cancel')
    //     appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
    //     naverCallerName: 'com.Enviable',  // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
    //     appTitles: { 'google-maps': "Direction to client pickup location" } // optionally you can override default app titles
    //     // app: 'uber'  // optionally specify specific app to use
    //   })
    // }else{
    //   showLocation({
    //     latitude: this.state.order.delivery_latitude,
    //     longitude: this.state.order.delivery_longitude,
    //     //sourceLatitude: this.state.origin.latitude,  // optionally specify starting location for directions
    //     //sourceLongitude: this.state.origin.longitude,  // not optional if sourceLatitude is specified
    //     title: this.state.order.delivery_address,  // optional
    //     //googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
    //     //googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
    //     //alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
    //     dialogTitle: 'Change map', // optional (default: 'Open in Maps')
    //     dialogMessage: 'Open in google map', // optional (default: 'What app would you like to use?')
    //     cancelText: 'Cancel', // optional (default: 'Cancel')
    //     // appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
    //     naverCallerName: 'com.Enviable',  // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
    //     appTitles: { 'google-maps': "Direction to your destination" } // optionally you can override default app titles
    //     // app: 'uber'  // optionally specify specific app to use
    //   })
    // }
      
  }
  displayRatingButton(){
    if(this.state.orderParam && this.state.orderParam.status == "Delivered" && this.state.orderParam.rated == "No"){
      return (
        <View style={{flexDirection: 'row', width: '90%', alignSelf: 'center'}}>
          <TouchableOpacity style={styles.addView7} onPress={() => this.setState({rateVisible: true})}>
            <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['rgba(126,83,191,1)', 'rgba(126,83,191,1)']} style={styles.addGradient}>
              <Text style={styles.addText}>Rate rider </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
  }
  rateRider(){
    this.setState({
      rateVisible: false,
    })
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/rateRider`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          userId: this.state.customer.id,
          orderId: this.state.orderParam.id,
          type: "Dispatch",
          rating: this.state.rating,
          review: this.state.review,
      })
    }).then((response) => response.json())
        .then((res) => {
          console.log(res);
          this.getOrderDetails(this.state.orderParam.id)
          this.hideLoader();
          if(res.success){
            Alert.alert(
              "Success",
              res.success,
            );
          }else{
            this.showAlert("Error", res.error)
          }
    }).done();
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


  render() {
    const { visible } = this.state;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        { this.state.origin && this.state.destination &&
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={[StyleSheet.absoluteFill, styles.map]}
            origin={this.state.origin}
            region={this.state.origin}
            followUserLocation={true}
            ref={ref => (this.mapView = ref)}
            zoomEnabled={true}
            showsUserLocation={true}
            //onMapReady={this.goToInitialRegion.bind(this)}
            //initialRegion={this.state.initialRegion}
          >
                  <Marker 
                      coordinate={this.state.origin}
                    ></Marker>
                     <Marker 
                      coordinate={this.state.destination}
                    ></Marker>
                  <MapViewDirections
                    resetOnChange={true}
                    origin={this.state.origin}
                    destination={this.state.destination}
                    mode="DRIVING"
                    strokeColor="brown"
                    strokeWidth={3}
                    apikey={'AIzaSyAyQQRwdgd4UZd1U1FqAgpRTEBWnRMYz3A'}
                  />
                  
          </MapView>
          }
          <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" size={18} color="#000"  style = {styles.menuImage}/>
          </TouchableOpacity>
          <View style= {styles.infoView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity  onPress={() => this.use()}>
                < Text style = {styles.use}>Use google navigations </Text>
              </TouchableOpacity>
              {this.state.order &&
              <View>
                <View style= {styles.row}>
                  <View style= {styles.col1}>
                  <Image source = {require('./imgs/round-profile.png')} style = {styles.carImage} />
                  </View>
                  {this.state.customer ?
                  
                  <View style= {styles.col2}>
                  < Text style = {styles.price}>{this.state.customer.first_name} {this.state.customer.last_name}</Text>
                  < Text style = {styles.plate}>{this.state.customer.email}</Text>
                  </View>
                
                :
                null
                }
                  
                </View>
                

                <TouchableOpacity onPress={() => {}} style= {styles.row1}>
                <View style= {styles.col11}>
                  <Image source = {require('./imgs/pho.png')} style = {styles.cardImage} />
                </View>
                <TouchableOpacity onPress={()=> Linking.openURL('tel:'+this.state.customer.phone1)} style= {styles.col21}>
                  < Text style = {styles.price1}>Call customer</Text>
                </TouchableOpacity>
                <View style= {styles.col22}>
                {this.state.order.price && < Text style = {styles.price2}>Price: ₦{parseFloat(this.state.order.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>}
                </View>
                </TouchableOpacity>
                <View style= {styles.statusView}>
                  < Text style = {styles.statusText}>{this.state.order.status}</Text>
                </View>
                <View style= {styles.methodView}>
                  < Text style = {styles.methodText}>{this.state.order.payment_method}</Text>
                </View>
                  <Text style = {styles.est}>Estimated journey duration is {Math.ceil(this.state.order.estimated_time/60)} minutes, based on current traffic info.</Text>
                {this.displayButton()}
                {this.state.orderParam && this.displayRatingButton()}
              </View>
              }
            </ScrollView>
          </View>

          <Modal
            isVisible={this.state.rateVisible}
            onBackdropPress={() => {
              this.setState({ rateVisible: false });
            }}
            height= {'100%'}
            width= {'100%'}
            style={styles.modal}
          >
            <View style={styles.forgotModalView}>
            <Text style = {styles.headerText7}>Rate Rider</Text>
            <Text style = {styles.headerText8}>Kindly rate this rider</Text>

              <Text style = {styles.label1}>Rating</Text>
              {/* <TouchableOpacity style={[styles.input]}>
              <Picker
                //selectedValue={selectedValue}
                selectedValue={this.state.rating}  
                //style={{ height: 100, width: 200 }}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => this.setState({rating: itemValue})}
              >
                <Picker.Item color="#444" label={"5*"} value={"5"} />
                <Picker.Item color="#444" label={"4*"} value={"4"} />
                <Picker.Item color="#444" label={"3*"} value={"3"} />
                <Picker.Item color="#444" label={"2*"} value={"2"} />
                <Picker.Item color="#444" label={"1*"} value={"1"} />
              </Picker>
              </TouchableOpacity> */}


<RNPicker
          placeholder="Account Type"
          // style={{backgroundColor:'RED'}}
          selectedValue={this.state.rating}  
          onValueChange={(itemValue, itemIndex) => this.setState({rating: itemValue})}

          style={{
            inputIOSContainer:styles.input,
            placeholder:{color:'black'},
            inputAndroid: styles.input,

          }}
          items={[
            { label: '5*', value: '5' },
            { label: '4*', value: '4' },
            { label: '3*', value: '3' },
            { label: '2*', value: '2' },
            { label: '1*', value: '1' },

        ]}          
        returnKeyType={'done'}
        />
              <Text style = {styles.label1}>Review</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {this.setState({review: text}) }}
                underlineColorAndroid="transparent"
                //keyboardType={'numeric'}
                //min={1}
                value={this.state.review}
              />
              
              <TouchableOpacity style={styles.addView3} onPress={() => this.rateRider()}>
                <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient4}>
                  <Text style={styles.addText}>Rate rider </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Modal>
          {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        
      </View>
    )
  }
}

export default RideOrderDetails

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#FFF",
  },
  backImage: {
    width: 18,
    height: 12,
    marginLeft: 20,
    marginTop: 40,
  },
  
  header: {
    width: '100%',
    height: 110,
    backgroundColor: 'rgb(126,83,191)',
    flexDirection: 'row',
  },
  menuImage: {
    //width: 21,
    //height: 15,
    marginLeft: 20,
    marginTop: 39,
  },
  map: {
    height: '45%',
    width: '100%',
  },
  infoView: {
    position: 'absolute', 
    bottom: 0,
    marginTop: -50, 
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    height: '56%',
    alignSelf: 'center',
    padding: 10,
    paddingBottom: 20,
  },
  row: {
    width: '100%',
    flexDirection: 'row'
  },
  col1: {
    width: '30%',
  },
  carImage: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginTop: 15,
  },
  statusView: {
    backgroundColor: '#E9FBFF',
    padding: 20,
  },
  methodView: {
    marginTop: 10,
    backgroundColor: 'green',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
    paddingBottom: 2,
    width: 120,
    borderRadius: 12,
  },
  methodText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
  },
  statusText: {
    color: '#8D9092'
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
  },
  plate: {
    fontSize: 12,
    color: '#848484',
    //fontWeight: 'bold',
    //marginTop: 20,
  },
  est: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 15,
    //textAlign: 'center',
  },
  submitButton: {elevation: 2,
    marginTop: 20,
    backgroundColor: '#0B277F',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },
  
  submitButtonText: {
    color: '#fff',
    textAlign: 'center'
  },

  row1: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
   //paddingLeft: 20,
    
    marginTop: 5,
    paddingTop: 15,
    paddingBottom: 15,
  },
  col11: {
    width: '5%',
  },
  col21: {
    width: '35%',
  },
  col22: {
    width: '60%',
  },
  price2: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    //paddingRight: 20,
    //width: 
    marginTop: 2,
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
    height: 340,
    width: '90%',
    backgroundColor: '#FFF',
    paddingTop: 18,
    paddingBottom: 38,
  },
  headerText7: {
    color: '#333',
    paddingLeft: 20,
    fontWeight: '700',
    marginTop: 5,
    fontSize: 15
  },
  headerText8: {
    color: '#333',
    paddingLeft: 20,
    fontSize: 12
  },
  addView3: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  ccImage: {
    width: 160,
    height: 150,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 15,
  },
  addView7: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
    marginTop: 40,
  },
  price1: {
    fontSize: 14,
    //fontWeight: 'bold',
    marginTop: 3,
    paddingLeft: 10,
  },
  cardImage: {
    width: 20,
    height: 20,
    //alignSelf: 'center',
    marginTop: 3,
  },
  use: {
    color: '#0B277F',
    textAlign: 'right',
    paddingRight: 20,
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