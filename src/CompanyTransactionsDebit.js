import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import { SERVER_URL } from './config/server';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export class CompanyTransactionsDebit extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,
      forgotVisible: false,
      orders: false,
      displayOrders: false,
      email: '',
      password: '',
      sortStatus: 'All',
      total: false,
      email1: '',
      customer: false,
      cartItems: false,
      deliveryInfo: false,
      transactions: false,
      totalTransactions: false,
      fromInput: false,
      toInput: false,
      from: '',
      to: '',
    }
    this.getLoggedInUser();
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

  componentWillMount(){
    
  }
  componentDidMount() {
    
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  getTransactions(){
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_vendor_debit_transactions/${this.state.user.vendor_id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "orders");
       this.hideLoader();
       if(res.success){
          this.setState({
            transactions:  res.transactions,
            balance: res.balance,
            totalTransaction: res.transactions.reduce(function (a, b) { return parseFloat(a) + parseFloat(b.amount); }, 0)
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
         { text: "Refresh", onPress: () => this.getTransactions() }
       ],
       
     );
    });
  }

  filter(){
    if(this.state.from == '' || this.state.to == ''){
      this.showAlert("Info", "Kindly provide a start and end date")
      return;
    }
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_vendor_debit_transactions_filter/${this.state.user.vendor_id}/${this.state.from}/${this.state.to}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     this.hideLoader();
       if(res.success){
          this.setState({
            transactions:  res.transactions,
            totalTransaction: res.transactions.reduce(function (a, b) { return parseFloat(a) + parseFloat(b.amount); }, 0)
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
         { text: "Refresh", onPress: () => this.getTransactions() }
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
          user: JSON.parse(value)
        }, () => {
          this.getTransactions();
          this.setState({
            user_id: this.state.user.id
          })
        });
          
      }else{
        this.props.navigation.navigate('Login')
      }
    });
  }
displayRating(rating){
  if(rating < 3){
    return(
      <Text style={{color: '#f00'}}>{rating}* </Text>
    )
  }else{
    return(
      <Text style={{color: '#3EC628'}}>{rating}*</Text>
    )
  }
  
}

displayCategoryText(sortStatus){
  if(this.state.sortStatus == sortStatus){
    return (
      <Text style={[styles.segmentText, styles.linkHighlight ]}>{sortStatus}</Text>
    )
  }else{
    return (
    <Text style={[styles.segmentText]}>{sortStatus}</Text>
    )
  }
}

cashout(){
  if(this.state.user.bankName == null){
    Alert.alert(
      "Incomplete profile",
      "You must complete your profile before you can cashout",
      [
        {
          text: "Not now",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Complete profile", onPress: () => this.props.navigation.navigate('CompanyProfile') }
      ],
      
    );
  }
  this.showLoader();
  fetch(`${SERVER_URL}/mobile/request_vendor_cashout/${this.state.user.vendor_id}`, {
    method: 'GET'
 })
 .then((response) => response.json())
 .then((res) => {
   this.hideLoader();
     if(res.success){
        this.getTransactions();
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
       { text: "Refresh", onPress: () => this.cashout() }
     ],
     
   );
  });
}


gotoOrderDetails(order){
  this.props.navigation.navigate('MerchantOrderDetails', {
    orderDetails: order,
  });
}
gotoProductDetailsPage(review){
  this.props.navigation.navigate('ProductDetails', {
    merchantProduct: review.merchantProducts,
  });
}

executeSortStatus(){
  if(this.state.sortStatus == "All"){
  var result = this.state.orders;
  }else{
    var result = this.state.orders.filter(obj => {
      return obj.order_details_status === this.state.sortStatus
    }) 
  }
  
this.setState({
  displayOrders: result
})


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
  setFromDate = (event, date) => { this.setState({from: moment(date).format('YYYY-MM-DD'), fromInput: false})};
  setToDate = (event, date) => { this.setState({to: moment(date).format('YYYY-MM-DD'), toInput: false})}; 

  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
        <LinearGradient start={{x: 0, y: 0}} end={{x:0, y: 1}}  colors={['#0B277F', '#0B277F']} style={styles.header}>
        <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
        <Icon name="arrow-back" size={18} color="#fff"  style = {styles.menuImage}/>
        </TouchableOpacity>
          <Text style = {styles.headerText}>Cashout requests</Text>
        </LinearGradient>
        <View style={styles.linkRow}>
          <TouchableOpacity onPress={() => this.props.navigation.push('CompanyTransactions')} style={styles.linkCol1}>
            <Text style={styles.linkText1}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity  style={styles.linkCol2}>
            <Text style={styles.linkText2}>Cashout</Text>
          </TouchableOpacity>
        </View>
        {/*
        <View style={styles.itemView}>
          <View style={styles.item8}>
            <View style={styles.contentCola}>
              <Text style = {styles.label1}>From</Text>
              <TouchableOpacity onPress={() => {this.setState({fromInput: true})}} style={styles.input}>
                <Text>{this.state.from}</Text>
              </TouchableOpacity>
              {this.state.fromInput && 
                <RNDateTimePicker value={new Date()} onChange={this.setFromDate} /> 
              }
            </View>
            <View style={styles.contentColb}>
              <Text style = {styles.label1}>To</Text>
              <TouchableOpacity onPress={() => {this.setState({toInput: true})}} style={styles.input}>
              <Text>{this.state.to}</Text>
              </TouchableOpacity>
              {this.state.toInput && 
              <RNDateTimePicker value={new Date()} onChange={this.setToDate} />
              }
            </View>
          </View>
          <TouchableOpacity  onPress={() => this.filter()} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
            */}
        <View style={styles.itemView}>
          <View style={styles.item1}>
            <View style={styles.contentCol3}>
              <Text style = {styles.pName5}>Your wallet balance: ₦{parseFloat(this.state.balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} </Text>
            </View>
          </View>
        </View>
        <View style={styles.itemView}>
          <TouchableOpacity  onPress={() => this.cashout()} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Request Cashout</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
          {this.state.transactions && this.state.transactions.map((transaction, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => {/*this.gotoProductDetailsPage(review)*/} }>
              <View style={styles.itemView}>
                <View style={styles.item1}>
                  <View style={styles.contentCol3}>
                    <Text style = {styles.pName}>Status: {transaction.status} </Text>
                    <Text style = {styles.desc}>Amount: ₦{parseFloat(transaction.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} </Text>
                    <Text style = {styles.desc}>Description: {transaction.description}</Text>
                    <View style={{flexDirection: 'row', paddingTop: 5}}>
                      <Text style = {styles.date}><TimeAgo time={transaction.created_at} /></Text>
                      <Text style = {styles.label}>DEBIT </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
            
            
            
          </View>
        </ScrollView>


        <Modal
            isVisible={this.state.visible}
            onTouchOutside={() => {
              
            }}
            height= {'100%'}
            width= {'100%'}
            style={styles.modal}
          >
            <View style={styles.modalView}>
            <ActivityIndicator size="small" color="#ccc" />
            </View>
          </Modal>
      </View>
    )
  }
}

export default CompanyTransactionsDebit

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
  itemView: {
    width: '95%',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignSelf: 'center',
    
    
  },
  itemView4: {
    width: '90%',
    marginTop: 30,
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginRight: 25,
    marginLeft: 30,
    flexDirection: 'row',
  },
  itemView1: {
    width: '90%',
    marginTop: 10,
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginRight: 25,
    marginLeft: 30,
    
  },
  orderNumber: {
    color: '#000',
    marginBottom: 10,
  },
  pName: {
    color: '#000',
    width: '100%',
  },
  pName5: {
    color: '#000',
    width: '100%',
    textAlign: 'center',
    fontWeight: '700'
  },
  date: {
    width: '50%',
    color: '#e21515',
    
    
  },
  desc: {
    color: '#999',
    
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    paddingTop: 10,
  },
  item1: {
    width: '100%',
    flexDirection: 'row',
  },
  item11: {
    width: '100%',
    flexDirection: 'row'
  },
  item22: {
    flexDirection: 'row',
  },
  item2: {
    width: '100%',
    flexDirection: 'row'
  },
  item3: {
    width: '100%'
  },
  item8: {
    width: '100%',
    flexDirection: 'row',
  },
  contentCola: {
    width: '50%',
  },
  contentColb: {
    width: '50%',
  },

  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  addView: {
    width: '80%',
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
    width: '30%',
    overflow: 'hidden',
  },
  contentCol3: {
    width: '100%',
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
  itemImage: {
    width: 80,
    height: 80,
    
  },
  row: {
    width: '100%',
    alignSelf: 'center',
    
    flexDirection: 'row',
    marginTop: 20,
  },
  rowh: {
    width: '100%',
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginTop: 10,
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
    marginTop: 74,
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
  linkRow: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    marginTop: 15,
    
    
  },
  linkCol1: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    width: '50%',
    backgroundColor: '#fff',
  },
  linkText1: {
    color: '#333',
    textAlign: 'center',
    padding: 7,
  },
  linkCol2: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    width: '50%',
    backgroundColor: '#0B277F',
    
  },
  linkText2: {
    color: '#fff',
    textAlign: 'center',
    padding: 7,
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
    color: '#000',
  },
  linkHighlight: {
    color: '#0B277F',
  },
  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#5D626A',
  },


  label:{
    color: '#454A65',
    marginTop: 5,
    fontSize: 14,
    width: '50%',
    textAlign: 'right'
  },
  labelZ:{
    color: '#454A65',
    fontWeight: 'bold',
    marginTop: 1,
    fontSize: 13,
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
    paddingTop: 8,
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
submitButton: {
  marginTop: 20,
  backgroundColor: '#ED6315',
  borderRadius: 10,
  width: '100%',
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
}
  
})