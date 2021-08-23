import React, { Component } from 'react';
import { AppRegistry, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button, Platform, StyleSheet, Text, View, TouchableOpacity,AsyncStorage } from 'react-native';
import {name as appName} from './app.json';

import Initial from './src/Initial';
import Login from './src/Login';
import Register from './src/Register';
import RegisterCompany from './src/RegisterCompany';
import RegisterType from './src/RegisterType';
import IndividualRegisterType from './src/IndividualRegisterType';
import RiderRegisterType from './src/RiderRegisterType';
import Home from './src/Home';
import CompanyHome from './src/CompanyHome';
import ActiveOrders from './src/ActiveOrders';
import Reviews from './src/Reviews';
import CompanyReviews from './src/CompanyReviews';
import CompanyTransactions from './src/CompanyTransactions';
import CompanyTransactionsDebit from './src/CompanyTransactionsDebit';
import CompanyRiderTransactionsDebit from './src/TransactionsDebit';
import CompanyRiderTransactions from './src/CompanyRiderTransactions';
import Profile from './src/Profile';
import CompanyProfile from './src/CompanyProfile';
import RiderProfile from './src/RiderProfile';
import EditProfile from './src/EditProfile';
import CompanyEditProfile from './src/CompanyEditProfile';
import Welcome from './src/Welcome';
import Orders from './src/Orders';
import CompanyOrders from './src/CompanyOrders';
import CompanyRiderOrders from './src/CompanyRiderOrders';
import MerchantOrderDetails from './src/MerchantOrderDetails';
import CompanyMerchantOrderDetails from './src/CompanyMerchantOrderDetails';
import DispatchOrderDetails from './src/DispatchOrderDetails';
import CompanyDispatchOrderDetails from './src/CompanyDispatchOrderDetails';
import Transactions from './src/Transactions';
import RiderBalance from './src/RiderBalance';
import Help from './src/Help';
import License from './src/License';
import RideShareHome from './src/RideShareHome';
import RideOrders from './src/RideOrders';
import RideOrderDetails from './src/RideOrderDetails';
import Guarantor from './src/Guarantor';
import Riders from './src/Riders';
import AddRider from './src/AddRider';

console.disableYellowBox = true;


const MainNavigator = createStackNavigator({
  
  Initial: {screen: Initial},
  Welcome: {screen: Welcome},
  Home: {screen: Home},
  CompanyHome: {screen: CompanyHome},
  ActiveOrders: {screen: ActiveOrders},
  Profile: {screen: Profile},
  RiderProfile: {screen: RiderProfile},
  Reviews: {screen: Reviews},
  CompanyReviews: {screen: CompanyReviews},
  CompanyTransactions: {screen: CompanyTransactions},
  CompanyTransactionsDebit: {screen: CompanyTransactionsDebit},
  CompanyRiderTransactions: {screen: CompanyRiderTransactions},
  CompanyRiderTransactionsDebit: {screen: CompanyRiderTransactionsDebit},
  EditProfile: {screen: EditProfile},
  CompanyEditProfile: {screen: CompanyEditProfile},
  Orders: {screen: Orders},
  CompanyOrders: {screen: CompanyOrders},
  CompanyProfile: {screen: CompanyProfile},
  CompanyRiderOrders: {screen: CompanyRiderOrders},
  MerchantOrderDetails: {screen: MerchantOrderDetails},
  CompanyMerchantOrderDetails: {screen: CompanyMerchantOrderDetails},
  DispatchOrderDetails: {screen: DispatchOrderDetails},
  CompanyDispatchOrderDetails: {screen: CompanyDispatchOrderDetails},
  Transactions: {screen: Transactions},
  RiderBalance: {screen: RiderBalance},
  Help: {screen: Help},
  License: {screen: License},
  Guarantor: {screen: Guarantor},
  Login: {screen: Login},
  Register: {screen: Register},
  RegisterCompany: {screen: RegisterCompany},
  Riders: {screen: Riders},
  AddRider: {screen: AddRider},
  RegisterType: {screen: RegisterType},
  IndividualRegisterType: {screen: IndividualRegisterType},
  RiderRegisterType: {screen: RiderRegisterType},
  RideShareHome: {screen: RideShareHome},
  RideOrderDetails: {screen: RideOrderDetails},
  RideOrders: {screen: RideOrders}
  
  
   
});

const AppContainer = createAppContainer(MainNavigator);

export default class App extends Component {
  render () {
    return (
        /*<Provider store={store}>*/
          <AppContainer/>
        /*</Provider>*/
    )
  }
}