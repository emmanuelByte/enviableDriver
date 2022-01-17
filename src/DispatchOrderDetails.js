import React, { Component  } from 'react';
import { AppState, View, Animated, Text, Alert, Image, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import TimeAgo from 'react-native-timeago';
import { SERVER_URL } from './config/server';
import { showLocation } from 'react-native-map-link';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import Modal from 'react-native-modal';

export class DispatchOrderDetails extends Component {
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
      total: false,
      email1: '',
      orderId: false,
      customer: false,
      cartItems: false,
      deliveryInfo: false,
      orderId: false,
      deliveryCode: '',
      orderParam: false,
      orderDetails: false,
      trn_ref: false,
      rateVisible: false,
    }
    this.getLoggedInUser();
  }

  componentWillMount(){
    this.setState({
      orderId: this.props.navigation.state.params.orderId,
    }, () => {
      
      
      
      this.getOrderDetails(this.state.orderId);
    })
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

  getOrderDetails(order_id){
    console.log(order_id, 'l')
    fetch(`${SERVER_URL}/mobile/get_dispatch_order_details/${order_id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "orderDetails");
       
       if(res.success){
          this.setState({
            orderParam: res.order_param,
            orderDetails:  res.order_details,
            trn_ref: res.order_param.order_number+Math.floor(1000 + Math.random() * 9000)
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
         { text: "Refresh", onPress: () => this.getOrders() }
       ],
       
     );
    });
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
          customer: JSON.parse(value)
        }, () => {
          this.setState({
            customer_id: this.state.customer.id
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
  
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  static navigationOptions = {
      header: null
  }

  openGoogleMap(){
    Alert.alert(
      "Info",
      "Ensure you put on your location from phone settings",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        
        { text: "OK, Open map", onPress: () => {
          showLocation({
            latitude: this.state.orderDetails[0].pickup_latitude,
            longitude: this.state.orderDetails[0].pickup_longitude,
            
            
            
            
            
            
            dialogTitle: 'Change map', 
            dialogMessage: 'Open in google map', 
            cancelText: 'Cancel', 
            
            naverCallerName: 'com.EnviableRider',  
            appTitles: { 'google-maps': "Merchant location" } 
            
          })
          }}
        ],
        
      );
      return true
    
    }
    openGoogleMap1(){
      Alert.alert(
        "Info",
        "Ensure you put on your location from phone settings",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          
          { text: "OK, Open map", onPress: () => {
            showLocation({
              latitude: this.state.orderParam.delivery_latitude,
              longitude: this.state.orderParam.delivery_longitude,
              
              
              
              
              
              
              dialogTitle: 'Change map', 
              dialogMessage: 'Open in google map', 
              cancelText: 'Cancel', 
              
              naverCallerName: 'com.EnviableRider',  
              appTitles: { 'google-maps': "Delivery location" } 
              
          })
            }}
          ],
          
        );
        return true
      
      }


  payWithWallet(){
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/pay_dispatch`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user_id: this.state.customer.id,
          order_number: this.state.orderParam.order_number,
          amount: this.state.orderParam.delivery_fee,
          payment_method: "Pay with wallet",
      })
    }).then((response) => response.json())
        .then((res) => {
          console.log(res);
          this.hideLoader();
          if(res.success){
            this.showAlert("success", res.success);
            
            
            
            
            
            
            
            this.getOrderDetails(this.state.orderParam.id)
          }else{
            this.showAlert("Error", res.error)
          }
  }).done();
}

payWithCard(){
  this.showLoader();
  
  fetch(`${SERVER_URL}/mobile/pay_dispatch_card`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user_id: this.state.customer.id,
        order_number: this.state.orderParam.order_number,
        trn_ref: this.state.trn_ref,
        amount: this.state.orderParam.delivery_fee,
        payment_method: "Pay with card",
    })
  }).then((response) => response.json())
      .then((res) => {
        console.log(res);
        this.hideLoader();
        if(res.success){
          this.showAlert("success", res.success);
          
          
          
          
          
          
          
          this.getOrderDetails(this.state.orderParam.id)
        }else{
          this.showAlert("Error", res.error)
        }
}).done();
}
  acceptDispatch(order){
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/rider_accept_dispatch/${order.order_number}/${this.state.customer.id}`, {
      method: 'GET'
  })
  .then((response) => response.json())
  .then((res) => {
        console.log(res, "orders");
        this.hideLoader();
      if(res.success){
        this.showAlert("Success", res.success);
        this.getOrderDetails(this.state.orderParam.id)
        
        
        
      }else{
        Alert.alert('Error', res.error);
      }
  })
  .catch((error) => {
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
    });
  }
  cancelDispatch(order){
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/rider_cancel_dispatch/${order.order_number}`, {
      method: 'GET'
  })
  .then((response) => response.json())
  .then((res) => {
        console.log(res, "orders");
        this.hideLoader();
      if(res.success){
        this.showAlert("Success", res.success);
        this.getOrderDetails(this.state.orderParam.id)
      }else{
        Alert.alert('Error', res.error);
      }
  })
  .catch((error) => {
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
    });
  }
  transitDispatch(order){
    if(this.state.orderParam.payment_status == "Pending"){
      this.showAlert("Info", "You will be notified when client pays. Kindly wait");
      return;
    }
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/rider_transit_dispatch/${order.order_number}/${this.state.customer.id}`, {
      method: 'GET'
  })
  .then((response) => response.json())
  .then((res) => {
        console.log(res, "orders");
        this.hideLoader();
      if(res.success){
        this.showAlert("Success", res.success);
        
        
        
        
        
        
        this.getOrderDetails(this.state.orderParam.id)
        
      }else{
        Alert.alert('Error', res.error);
      }
  })
  .catch((error) => {
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
    });
  }
  deliverDispatch(order){
    if(this.state.deliveryCode.length < 4){
      this.showAlert("Info", "Delivery code must be 4 digits");
      return;
    }
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/rider_deliver_dispatch/${order.order_number}/${this.state.customer.id}/${this.state.deliveryCode}`, {
      method: 'GET'
  })
  .then((response) => response.json())
  .then((res) => {
        console.log(res, "orders");
        this.setState({
          forgotVisible: false
        })
        this.hideLoader();
      if(res.success){
        this.showAlert("Success", res.success);
        
        
        
        
        
        
        this.getOrderDetails(this.state.orderParam.id)
        
      }else{
        Alert.alert('Error', res.error);
      }
  })
  .catch((error) => {
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
    });
  }
  gotoOrderDetails(order){
    this.props.navigation.push('DispatchOrderDetails', {
      order: order,
    });
  }
  
  displayButton(){
    if(this.state.orderParam && this.state.orderParam.payment_status == "Pending"){
      return (
        <View style={{flexDirection: 'row', width: '90%', alignSelf: 'center'}}>
        <TouchableOpacity style={styles.addView} onPress={() => this.payWithWallet()}>
          <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
            <Text style={styles.addText}>Pay with wallet </Text>
          </LinearGradient>
        </TouchableOpacity>
        {this.state.customer && this.state.trn_ref &&
        <View style={styles.addGradient1}>
        <PaystackWebView
          buttonText="Pay with card"
          textStyles={styles.addText1}
          btnStyles={styles.addGradient6}
          showPayButton={true}
           paystackKey="pk_live_6b3b23bc38a669799804cdc53316494a4678dcdb"
           amount={Math.floor(this.state.orderParam.delivery_fee)}
           billingEmail="paystackwebview@something.com"
           billingMobile={this.state.customer.phone1}
           billingName={this.state.customer.first_name}
           refNumber={this.state.trn_ref}
          ActivityIndicatorColor="green"
          handleWebViewMessage={(e) => {
            
            console.log(e);
          }}
          onCancel={(e) => {
            
            console.log(e);
          }}
          onSuccess={(e) => {
            console.log(e);
            this.payWithCard();
          }}
          autoStart={false}
        />
      </View>
    }
        </View>
      )
    }
  }
  cancelDispatch(){
    if(this.state.orderParam.payment_status != "Pending"){
      return;
    }
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/cancel_dispatch/${this.state.orderParam.order_number}`, {
      method: 'GET'
  })
  .then((response) => response.json())
  .then((res) => {
        console.log(res, "orders");
        this.hideLoader();
      if(res.success){
        this.showAlert("Info", res.success);
        this.getOrderDetails(this.state.orderParam.id)
      }else{
        
      }
  })
  .catch((error) => {
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
    });
  }

  dispayActionButton(){
    if(this.state.orderParam && this.state.orderParam.status == "Pending"){
      return(
        <TouchableOpacity style={styles.addView5} onPress={() => this.acceptDispatch(this.state.orderParam) }>
          <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
            <Text style={styles.addText}>Accept order</Text>
          </LinearGradient>
        </TouchableOpacity>
      )
    }
   
    
    if(this.state.orderParam && this.state.orderParam.status == "Rider accepted" && this.state.orderParam.payment_status == "Completed"){
      return(
        <TouchableOpacity style={styles.addView5} onPress={() => this.transitDispatch(this.state.orderParam) }>
          <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
            <Text style={styles.addText}>In-transit</Text>
          </LinearGradient>
        </TouchableOpacity>
      )
    }
    if(this.state.orderParam && this.state.orderParam.status == "In transit"){
      return(
        <TouchableOpacity style={styles.addView5} onPress={() => this.setState({'forgotVisible': true})} >
          <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
            <Text style={styles.addText}>Mark as delivered</Text>
          </LinearGradient>
        </TouchableOpacity>
      )
    }
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

  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
        <LinearGradient start={{x: 0, y: 0}} end={{x:0, y: 1}}  colors={['#0B277F', '#0B277F']} style={styles.header}>
        {/* <TouchableOpacity  onPress={() => this.props.navigation.navigate('ActiveOrders') }> */}
        <TouchableOpacity  onPress={() => this.props.navigation.pop() }>

        <Icon name="arrow-back" size={18} color="#fff"  style = {styles.menuImage}/>
        </TouchableOpacity>
          <Text style = {styles.headerText}>Dispatch summary</Text>
        </LinearGradient>
         
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
            {/*this.state.orderParam && this.state.orderParam.payment_status == "Pending"  && this.state.orderParam.status == "Rider accepted"  &&
              <View style={styles.itemView4}>
                <View style={styles.center}>
                    <CountdownCircleTimer
                        onComplete={() => {
                          this.cancelDispatch()
                        }}
                          isPlaying
                          strokeWidth={2}
                          duration={1800}
                          size={40}
                          colors={[
                            ['#0B277F', 0.4],
                            ['#F7B801', 0.4],
                            ['#A30000', 0.2],
                          ]}
                        >
                          {({ remainingTime, animatedColor }) => (
                            <Animated.Text style={{ color: animatedColor, fontSize: 10, }}>
                              {remainingTime}s
                            </Animated.Text>
                          )}
                    </CountdownCircleTimer>
                    <Text style = {styles.wait}>Wait while customer pays for request before going on transit...  </Text>
                  
                </View>
              </View>
                          */}
            <View style={styles.itemView4}>
              <View style={styles.item31}>
                <Text style = {styles.label60}>Tracking No</Text>
                <Text style = {styles.txt60}>#{this.state.orderParam && this.state.orderParam.order_number}</Text>
              </View> 
              <Text style = {styles.txt601}><TimeAgo time={this.state.orderParam && this.state.orderParam.created_at}/></Text>
            </View>
            <View style={styles.itemView}> 
              <Text style = {styles.topic}>Delivery information</Text>
              <View style={styles.item1}>
                <Text style = {styles.label10}>Contact Person</Text>
                <Text style = {styles.label20}>Phone</Text>
              </View>
              <View style={styles.item2}>
                <Text style = {styles.txt10}>{this.state.orderParam && this.state.orderParam.receiver_name}</Text>
                <Text style = {styles.txt20}>{this.state.orderParam && this.state.orderParam.receiver_phone}</Text>
              </View>
              <View style={styles.item3}>
                <Text style = {styles.label}  onPress={() =>this.openGoogleMap1()}>Address (get direction) </Text>
                <Text style = {styles.txt} onPress={() =>this.openGoogleMap1()}>{this.state.orderParam && this.state.orderParam.delivery_address}</Text>
              </View>
            </View>
            <View style={styles.itemView}> 
              <Text style = {styles.topic}>Pickup information</Text>
              <View style={styles.item1}>
                <Text style = {styles.label10}>Contact Person</Text>
                <Text style = {styles.label20}>Phone</Text>
              </View>
              <View style={styles.item2}>
                <Text style = {styles.txt10}>{this.state.orderParam && this.state.orderParam.sender_name}</Text>
                <Text style = {styles.txt20}>{this.state.orderParam && this.state.orderParam.sender_phone}</Text>
              </View>
              <View style={styles.item3}>
                <Text style = {styles.label} onPress={() =>this.openGoogleMap()}>Address (get direction)</Text>
                <Text style = {styles.txt} onPress={() =>this.openGoogleMap()}>{this.state.orderParam && this.state.orderParam.pickup_address}</Text>
              </View>
            </View>
            {/*
            <View style={styles.itemView}>
              <View style={styles.item3}>
                <Text style = {styles.label}>Address</Text>
                <Text style = {styles.txt}>{this.state.orderParam.address}</Text>
              </View>
            </View>
            */}
            
            
            <View style={styles.itemView1}>
              <Text style = {styles.topic1}>Items in this order</Text>
              {!this.state.orderDetails &&
              <ActivityIndicator style={styles.loading1} size="small" color="#ccc" />
              }
              {this.state.orderDetails && this.state.orderDetails.map((orderDetail, index) => (
                <View style={styles.item11}>
                <Text style = {styles.label40}>{orderDetail.order_detail_description} (x{orderDetail.order_detail_quantity})</Text>
                {/*}
                <Text style = {styles.label}>{orderDetail.merchant_product_description.substring(0,50)}</Text>
                <Text style = {styles.label50}>₦{orderDetail.order_detail_price * orderDetail.order_detail_quantity}.00</Text>
              */}
                </View>
              ))}
              
            </View>

            <View style={styles.itemView}>
            <View style={styles.item3}>
                <Text style = {styles.label70}>Payment information</Text>
                {/*
                <View style={styles.item22}>
                  <Text style = {styles.label}>Items Total</Text>
                  <Text style = {styles.labelZ}>₦{this.state.orderParam.delivery}.00</Text>
                </View>
                <View style={styles.item22}>
                  <Text style = {styles.label}>Shipping fee</Text>
                  <Text style = {styles.labelZ}>--</Text>
                </View>
                */}
                <View style={styles.item22}>
                  <Text style = {styles.label}>Total</Text>
                  <Text style = {styles.labelZZ}>₦{parseFloat(this.state.orderParam && this.state.orderParam.delivery_fee).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
              <View style={styles.item36}>
                <Text style = {styles.label88}>Payment status</Text>
                <Text style = {styles.txt}>{this.state.orderParam && this.state.orderParam.payment_status}</Text>
              </View>
              <View style={styles.item36}>
                <Text style = {styles.label88}>Payment method</Text>
                <Text style = {styles.txt}>{this.state.orderParam && this.state.orderParam.payment_method}</Text>
              </View>
              </View>
            </View>
            <View style={styles.itemView}>
              <View style={styles.item3}>
                <Text style = {styles.label70}>Vehicle type</Text>
                <View style={styles.item22}> 
                  <Text style = {styles.label}>{this.state.orderParam && this.state.orderParam.vehicle_type_name}</Text>
                  <Text style = {styles.labelZ}></Text>
                </View>
              </View> 
              </View>
            <View style={styles.itemView}>
              <View style={styles.item3}>
                <Text style = {styles.label70}>Order status</Text>
                <View style={styles.item22}> 
                  <Text style = {styles.label}>{this.state.orderParam && this.state.orderParam.status}</Text>
                  <Text style = {styles.labelZ}></Text>
                </View>
              </View> 
              </View>
           
              {this.dispayActionButton()}
              {this.state.orderParam && this.displayRatingButton()}
          </View>
        </ScrollView>
        {this.state.visible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
        }

<Modal
          isVisible={this.state.forgotVisible}
          onBackdropPress={() => {
            this.setState({ forgotVisible: false });
          }}
          height= {'100%'}
          width= {'100%'}
          style={styles.modal}
        >
          <View style={styles.forgotModalView}>
          <Text style = {styles.headerText7}>Delivery code</Text>
          <Text style = {styles.headerText8}>Kindly ask the client to provide his delivery code for this order.</Text>

          <Text style = {styles.label1}>Delivery code</Text>
            <TextInput
                        style={styles.input1}
                        onChangeText={(text) => this.setState({deliveryCode: text})}
                        underlineColorAndroid="transparent"
                        keyboardType={'numeric'}
                        value={this.state.deliveryCode}
                      />
          <TouchableOpacity onPress={() => this.deliverDispatch(this.state.orderParam)} style={styles.submitButton1}>
          <Text style={styles.submitButtonText}>Confirm & Deliver</Text>
          
        </TouchableOpacity>
          </View>
        </Modal>
        {/*
        {this.state.orderParam && this.state.orderParam.payment_status == "Pending"  && this.state.orderParam.status == "Rider accepted"  &&
          <ActivityIndicator style={styles.mLoading} size="small" color="#0B277F"
            textContent={'Wait while customer pays for request before going on transit...'}
            textStyle={styles.spinnerTextStyle}
          />
        }
        */}

        
      </View>
    )
  }
}

export default DispatchOrderDetails

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#f8f8f8",
  },
  cView: {
    minHeight: 1200,
    width: '95%',
    alignSelf: 'center',
    paddingBottom: 50,
  },
  header: {
    width: '100%',
    height: 110,
    backgroundColor: '#0B277F',
    flexDirection: 'row',
  },
  cartImage: {
    width: 21,
    height: 15,
    marginRight: 30,
    marginTop: 69,
  },
  descContent: {
    color: '#535871',
    textAlign: 'justify',
  },
  topic: {
    fontWeight: 'bold',
    paddingBottom: 10,
  },
 
  topic1: {
    fontWeight: 'bold',
    paddingBottom: 10,
    fontSize: 12,
  },
  item31: {
    flexDirection: 'row',
  },
  itemView: {
    width: '95%',
    marginTop: 15,
    alignContent: 'center',
    alignSelf: 'center', 
    padding: 10,
    
    
    backgroundColor: '#fff',
  },
  center: {
    alignSelf: 'center',
    alignContent: 'center',
    
  },
  itemView4: {
    width: '95%',
    backgroundColor: '#fff',
    marginTop: 30,
    padding: 10,
    alignContent: 'center',
    alignSelf: 'center',
    marginRight: 25,
    marginLeft: 30,
    
  },
  itemView1: {
    width: '95%',
    marginTop: 10,
    alignContent: 'flex-start',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    
    
    
    
  },
  item1: {
    width: '100%',
    flexDirection: 'row',
  },
  item11: {
    width: '100%',
    marginLeft: 30,
    alignSelf: 'center',
    marginBottom: 10,
    
    
  },
  item22: {
    flexDirection: 'row',
  },
  item2: {
    width: '100%',
    flexDirection: 'row',
  },
  item3: {
    width: '100%',
    marginTop: 15,
  },

  item36: {
    width: '50%',
    marginTop: 10,
  },

  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  addText1: {
    textAlign: 'center',
    fontSize: 16,
    color: '#0B277F',
  },
  addView5: {
    width: '98%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  center: {
    alignSelf: 'center',
    alignContent: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    
  },
  wait: {
    
    color: '#252969',
    fontSize: 12,
    paddingLeft: 10,
    paddingTop: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  addView: {
    width: '49%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
  },
  addView7: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  addGradient1: {
    width: '50%',
    paddingLeft: 10,
  },
  addGradient6: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#0B277F',
    borderRadius: 8,
    
    paddingTop: 7,
    marginTop: 40,
  },
  item: {
    width: '100%',
    marginLeft: 5,
    marginRight: 10,
    flexDirection: 'row',
  },
  contentCol1: {
    width: '60%',
    paddingRight: 9,
    overflow: 'hidden',
  },
  contentCol2: {
    width: '40%',
    overflow: 'hidden',
  },
  itemNameText: {
    paddingTop: 10,
    fontWeight: 'bold',
  },
  itemPriceText: {
    
    fontWeight: 'bold',
    color: '#585757',
  },
  itemBottom: {
    flexDirection: 'row',
    width: '100%',
  },
  itemVendorText: {
    color: '#0B277F',
    fontSize: 12,
    width: '75%',
  },
  itemRatingText: {
    width: '25%',
    fontSize: 12,
    color: '#585757',
    textAlign: 'right',
  },
  row: {
    width: '100%',
    alignSelf: 'center',
    
    flexDirection: 'row',
    marginTop: 20,
  },
  col1: {
    
    borderRadius: 18,
    textAlign: 'center',
  },
  col2: {
    
    borderRadius: 18,
    textAlign: 'center',
  
  },
  col3: {
    
    borderRadius: 18,
    textAlign: 'center',
  },
  col4: {
    
    borderRadius: 18,
    textAlign: 'center',
  },
  sView:{
    
  },
  bImage1: {
    width: '100%',
    height: 220,
    
    overflow: 'hidden',
    borderBottomEndRadius: 20, 
    borderBottomStartRadius: 20, 
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  menuImage: {
    marginLeft: 20,
    marginTop: 75,
  },
  counterView: {
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    borderColor: '#888888',
    flexDirection: 'row',
    width: 80,
    height: 27,
    paddingTop: 3,
    marginTop: 5,
  },
  minusText: {
    textAlign: 'center',
    width: '33%',
    fontSize: 13,
    
  },
  counterText: {
    textAlign: 'center',
    width: '34%',
    fontSize: 13,
  },
  plusText: {
    textAlign: 'center',
    width: '33%',
    fontSize: 13,
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: -60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 10,
    color: '#fff',
    marginTop: 73,
    width: '80%',
  },
  headerText1: {
    fontSize: 20,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: "bold",

  },
  card: {
    
    width: '100%',
    marginBottom: 4,
    
    borderWidth: 1,
    borderRadius: 9,
    elevation: 1,
    borderColor: '#fefefe',
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 7,
  },
  locationText: {
    color: '#0B277F',
    textAlign: 'right',
    paddingTop: 2,
    marginRight: 10,
    fontSize: 12,
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
  segmentText: {
    
    paddingRight: 10,
    marginRight: 10,
  },
  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#5D626A',
  },

  label10:{
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '60%',
  },
  label20:{ 
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '38%',
  },
  label40:{
    color: '#000',
    marginTop: 1,
    fontSize: 14,
    paddingBottom: 3,
    
  },
  label50:{
    color: '#454A65',
    marginTop: 3,
    fontSize: 12,
    fontWeight: 'bold',
  },
  label70: {
    fontWeight: 'bold',
    paddingBottom: 6,
  },
  label60:{
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '40%',
  },
  label88:{
    
    fontWeight: 'bold',
    marginTop: 1,
    fontSize: 12,
    width: '100%',
  },
  label:{
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '50%',
  },
  labelZ:{
    color: '#454A65',
    width: '50%',
    
    marginTop: 1,
    fontSize: 13,
  },
  labelZZ:{
    color: '#454A65',
    width: '50%',
    fontWeight: 'bold',
    marginTop: 1,
    fontSize: 13,
  },
  txt10: {
    color: '#3D3838',
    width: '60%',
    fontSize: 12,
  }, 
  txt20: {
    color: '#3D3838',
    width: '38%',
    fontSize: 12,
  },
  txt601: {
    color: '#888',
    width: '100%',
    paddingTop: 3,
  },
  txt60: {
    color: '#3D3838',
    width: '50%',
    fontSize: 12,
  },
  txt: {
    color: '#3D3838',
    fontSize: 12,
  },
  searchInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#Fefefe',
    borderWidth: 1,
    borderRadius: 18,
    elevation: 1,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#ccc',
  },
  input: {
    width: '94%',
    height: 40,
    backgroundColor: '#F9F9FB',
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
  locImageView: {
    marginTop: -14,
  },
  locImage: {
    
    width: 10,
    height: 10,
    width: 10,
    paddingRight: 4,
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
},
mLoading: {
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
},
spinnerTextStyle: {
  color: 'brown',
  textAlign: 'center'
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
  paddingRight: 20,
  fontSize: 12
},
headerText2: {
  color: '#fff',
  paddingLeft: 20,
  fontSize: 12,
  textAlign: 'right',
  marginRight: 30,
},
bottomView: {
  width: '85%',
  alignSelf: 'center',
  backgroundColor: '#fff',
  minHeight: '60%',
  borderBottomRightRadius: 32,
  borderTopLeftRadius: 32,
  marginTop: '-60%',
  zIndex: 99999
},
logoImage: {
  width: 75,
  height: 78,
  alignSelf: 'center',
  marginTop: 30,
  marginBottom: 20,
},
input: {
  width: '85%',
  height: 50,
  backgroundColor: 'rgba(126,83,191, 0.1)',
  borderRadius: 7,
  alignSelf: 'center',
  marginTop: 15,
  paddingLeft: 25,
  color: '#444'
},
input1: {
  width: '90%',
  height: 40,
  backgroundColor: 'rgba(126,83,191, 0.1)',
  borderRadius: 2,
  alignSelf: 'center',
  marginTop: 10,
  paddingLeft: 25,
  color: '#222'
},
forgotText: {
  textAlign: 'right',
  marginRight: 30,
  color: '#0B277F',
  fontSize: 12,
  marginTop: 10,
},
createText: {
  textAlign: 'center',
  color: '#0B277F',
  fontSize: 13,
  fontWeight: '600',
  marginTop: 10,
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