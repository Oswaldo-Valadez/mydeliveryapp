import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StatusBar,
  AsyncStorage,
  StyleSheet
} from 'react-native';
import { colors } from './src/common/theme';
import AppContainer from './src/navigation/AppContainer';
import { AuthContext } from './src/common/context';
import I18n from './src/common/lang/config';
import GetPushToken from './src/common/GetPushToken';

//Start firebase conf
import * as firebase from 'firebase';
var firebaseConfig = {
  apiKey: "AIzaSyD36l4xUFMqbXxNTdzJqr0L2-LSncmAr04",
  authDomain: "my-delivery-app-go.firebaseapp.com",
  databaseURL: "https://my-delivery-app-go.firebaseio.com",
  projectId: "my-delivery-app-go",
  storageBucket: "my-delivery-app-go.appspot.com",
  messagingSenderId: "27390925284",
  appId: "1:27390925284:web:c7cd30087299c715a08ff1",
  measurementId: "G-FL6W6YT424"
};
firebase.initializeApp(firebaseConfig);
//End firebase conf

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [usertype, setUsertype] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLang, setIsLang] = useState(false);

  useEffect(() => {
    console.disableYellowBox = true;
    _fetchUserToken();
    _loadLangAsync();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const authContext = useMemo(() => ({
    useIsLang: (islang) => {
      setIsLang(islang);
    }
  }));

  const _loadLangAsync = async () => {
    try {
      const asyncLang = await AsyncStorage.getItem('lang');
      if (asyncLang != null) {
        I18n.locale = asyncLang;
        setIsLang(true);
      }
    } catch {
      console.log("Error Loading Lang");
    }
  };

  const _fetchUserToken = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userData = firebase.database().ref('users/' + user.uid);
        userData.on('value', data => {
          const usertype = data.val().usertype;
          GetPushToken();
          setIsLogin(true);
          setUsertype(usertype);
        });
      } else {
        setIsLogin(false);
        setUsertype('');
      }
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.PRIMARY_COLOR} />
      <AuthContext.Provider value={authContext}>
        <AppContainer isLang={isLang} isLoading={isLoading} usertype={usertype} isLogin={isLogin} />
      </AuthContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
