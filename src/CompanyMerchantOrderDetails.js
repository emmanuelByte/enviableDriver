import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import TimeAgo from 'react-native-timeago';
import { SERVER_URL } from './config/server';
export class CompanyMerchantOrderDetails extends Component {
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
      customer: false,
      cartItems: false,
      deliveryInfo: false,
      orderParam: false,
      orderDetails: false,
      trn_ref: false,
    }
    this.getLoggedInUser();
  }

  componentWillMount(){
    this.setState({
      orderParam: this.props.navigation.state.params.order,
    }, () => {
      this.setState({
        trn_ref: this.state.orderParam.order_number+Math.floor(1000 + Math.random() * 9000)
      })
      this.getOrderDetails(this.state.orderParam.id);
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

  getOrderDetails(order_id){
    fetch(`${SERVER_URL}/mobile/get_order_details/${order_id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "orderDetails");
       //this.hideLoader();
       if(res.success){
          this.setState({
            orderDetails:  res.order_details
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
       //{ cancelable: false }
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

  payWithWallet(){
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/pay_errand`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user_id: this.state.customer.id,
          order_number: this.state.orderParam.order_number,
          amount: this.state.orderParam.grand_total,
          payment_method: "Pay with wallet",
      })
    }).then((response) => response.json())
        .then((res) => {
          console.log(res);
          this.hideLoader();
          if(res.success){
            this.showAlert("success", res.success);
            this.setState(prevState => ({
              orderParam: {
                ...prevState.orderParam,           // copy all other key-value pairs of food object
                payment_status: "Completed",
                payment_method: "Pay with wallet",
              }
            }))
          }else{
            this.showAlert("Error", res.error)
          }
  }).done();
}

payWithCard(){
  this.showLoader();
  
  fetch(`${SERVER_URL}/mobile/pay_errand_card`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user_id: this.state.customer.id,
        order_number: this.state.orderParam.order_number,
        trn_ref: this.state.trn_ref,
        amount: this.state.orderParam.grand_total,
        payment_method: "Pay with card",
    })
  }).then((response) => response.json())
      .then((res) => {
        console.log(res);
        this.hideLoader();
        if(res.success){
          this.showAlert("success", res.success);
          this.setState(prevState => ({
            orderParam: {
              ...prevState.orderParam,           // copy all other key-value pairs of food object
              payment_status: "Completed",
              payment_method: "Pay with card",
            }
          }))
        }else{
          this.showAlert("Error", res.error)
        }
}).done();
}


  displayButton(){
    if(this.state.orderParam.payment_status == "Pending"){
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
           paystackKey="pk_test_b1f00843f8c3d01ee3c16317fc6d72c542e04157"
           amount={Math.floor(this.state.orderParam.delivery_fee)}
           billingEmail="paystackwebview@something.com"
           billingMobile={this.state.customer.phone1}
           billingName={this.state.customer.first_name}
           refNumber={this.state.trn_ref}
          ActivityIndicatorColor="green"
          handleWebViewMessage={(e) => {
            // handle the message
            console.log(e);
          }}
          onCancel={(e) => {
            // handle response here
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
  displayMC(status){
    if(status == "Rider confirmed"){
      return (
        <Text style={{color: 'red'}}>Wait for merchant's confirmation</Text>
      )
    }
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
          this.gotoOrderDetails(order);
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {
      console.error(error);
      this.showAlert("Error", "An unexpected error occured")
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
          this.gotoOrderDetails(order);
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
    this.props.navigation.push('MerchantOrderDetails', {
      order: order,
    });
  }
  dispayActionButton(){
    if(this.state.orderParam.status == "Pending"){
      return(
        <TouchableOpacity style={styles.addView5} onPress={() => this.acceptDispatch(this.state.orderParam) }>
          <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
            <Text style={styles.addText}>Accept order</Text>
          </LinearGradient>
        </TouchableOpacity>
      )
    }
  }

  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
        <LinearGradient start={{x: 0, y: 0}} end={{x:0, y: 1}}  colors={['#0B277F', '#0B277F']} style={styles.header}>
        <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
        <Icon name="arrow-back" size={18} color="#fff"  style = {styles.menuImage}/>
        </TouchableOpacity>
          <Text style = {styles.headerText}>Order summary</Text>
          <Image source = {require('./imgs/cart.png')} style = {styles.cartImage} />
        </LinearGradient>
         
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
            <View style={styles.itemView4}>
              <View style={styles.item31}>
                <Text style = {styles.label60}>Order No</Text>
                <Text style = {styles.txt60}>#{this.state.orderParam.order_number}</Text>
              </View> 
              <Text style = {styles.txt601}><TimeAgo time={this.state.orderParam.created_at}/></Text>
            </View>
            <View style={styles.itemView}> 
              <Text style = {styles.topic}>Delivery information</Text>
              <View style={styles.item1}>
                <Text style = {styles.label10}>Contact Person</Text>
                <Text style = {styles.label20}>Phone</Text>
              </View>
              <View style={styles.item2}>
                <Text style = {styles.txt10}>{this.state.orderParam.contact_person}</Text>
                <Text style = {styles.txt20}>{this.state.orderParam.contact_phone}</Text>
              </View>
              <View style={styles.item3}>
                <Text style = {styles.label}>Address</Text>
                <Text style = {styles.txt}>{this.state.orderParam.address}</Text>
              </View>
            </View>
            <View style={styles.itemView}> 
              <Text style = {styles.topic}>Pickup information</Text>
              <View style={styles.item1}>
                <Text style = {styles.label10}>Merchant</Text>
                {/*<Text style = {styles.label20}>Phone</Text>*/}
              </View>
              <View style={styles.item2}>
                <Text style = {styles.txt10}>{this.state.orderParam.merchant_name}</Text>
                {/*<Text style = {styles.txt20}>{this.state.orderParam.contact_phone}</Text>*/}
              </View>
              <View style={styles.item3}>
                <Text style = {styles.label}>Address</Text>
                <Text style = {styles.txt}>{this.state.orderParam.merchant_address}</Text>
              </View>
            </View>
            
            
            <View style={styles.itemView1}>
              <Text style = {styles.topic1}>Items in this order</Text>
              {!this.state.orderDetails &&
              <ActivityIndicator style={styles.loading1} size="small" color="#ccc" />
              }
              {this.state.orderDetails && this.state.orderDetails.map((orderDetail, index) => (
                <View style={styles.item11}>
                <Text style = {styles.label40}>{orderDetail.merchant_product_name} X {orderDetail.order_detail_quantity}</Text>
                <Text style = {styles.label}>{orderDetail.merchant_product_description.substring(0,50)}</Text>
                <Text style = {styles.label50}>₦{orderDetail.order_detail_price * orderDetail.order_detail_quantity}</Text>
                </View>
              ))}
              
            </View>

            <View style={styles.itemView}>
              <View style={styles.item3}>
                <Text style = {styles.label70}>Payment information</Text>
                <View style={styles.item22}>
                  <Text style = {styles.label}>Items Total</Text>
                  <Text style = {styles.labelZ}>₦{parseFloat(this.state.orderParam.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                </View>
                <View style={styles.item22}>
                  <Text style = {styles.label}>Shipping fee</Text>
                  <Text style = {styles.label}>₦{parseFloat(this.state.orderParam.delivery_fee).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                </View>
                <View style={styles.item22}>
                  <Text style = {styles.label}>Total</Text>
                  <Text style = {styles.labelZZ}>₦{parseFloat(this.state.orderParam.grand_total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.item36}>
                  <Text style = {styles.label88}>Payment status</Text>
                  <Text style = {styles.txt}>{this.state.orderParam.payment_status}</Text>
                </View>
                <View style={styles.item36}>
                  <Text style = {styles.label88}>Payment method</Text>
                  <Text style = {styles.txt}>{this.state.orderParam.payment_method}</Text>
                </View>
              </View>
            </View>
            <View style={styles.itemView}>
              <View style={styles.item3}>
                <Text style = {styles.label70}>Order status</Text>
                <View style={styles.item22}> 
                  <Text style = {styles.label}>{this.state.orderParam.status}</Text>
                  <Text style = {styles.labelZ}>{this.displayMC(this.state.orderParam.status)}</Text>
                </View>
              </View> 
            </View>
            <View style={styles.itemView}> 
              <Text style = {styles.topic}>Driver information</Text>
              <View style={styles.item1}>
                <Text style = {styles.label10}>Name</Text>
                <Text style = {styles.label20}>Phone</Text>
              </View>
              <View style={styles.item2}>
                <Text style = {styles.txt10}>{this.state.orderParam.rider_first_name} {this.state.orderParam.rider_last_name}</Text>
                <Text style = {styles.txt20}>{this.state.orderParam.rider_phone}</Text>
              </View>
              
            </View>
            {/*
              <TouchableOpacity style={styles.addView} onPress={() => {Alert.alert("info", "Coming soon")}}>
                <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
                  <Text style={styles.addText}>Reorder</Text>
                </LinearGradient>
              </TouchableOpacity>
            */}
          </View>
        </ScrollView>
        {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }

        
      </View>
    )
  }
}

export default CompanyMerchantOrderDetails

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
    //marginRight: 20,
    //flexDirection: 'row',
    backgroundColor: '#fff',
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
    //flexDirection: 'row',
  },
  itemView1: {
    width: '95%',
    marginTop: 10,
    alignContent: 'flex-start',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    //marginRight: 25,
    //marginLeft: 30,
    
    //flexDirection: 'row',
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
    marginTop: 40,
  },
  addView: {
    width: '49%',
    height: 40,
    alignSelf: 'center',
    marginTop: 40,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
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
    //backgroundColor: 'green',
    paddingTop: 7,
    marginTop: 40,
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
    //padding: 10,
    //flexDirection: 'row'
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
    marginTop: 10,
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
    //paddingTop: 4,
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
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  col2: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  
  },
  col3: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  col4: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  sView:{
    
  },
  bImage1: {
    width: '100%',
    height: 220,
    //opacity: 0.6,
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
    //flexDirection: 'row',
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
    //textAlign: 'center',
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
    //fontWeight: 'bold',
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
    //color: '#454A65',
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
    //fontWeight: 'bold',
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
  }, 
  txt20: {
    color: '#3D3838',
    width: '38%',
  },
  
  txt601: {
    color: '#888',
    width: '100%',
    paddingTop: 3,
  },
  txt60: {
    color: '#3D3838',
    width: '50%'
  },
  txt: {
    color: '#3D3838',
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
    //marginTop: -7,
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