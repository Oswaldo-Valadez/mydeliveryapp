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

//Start firebase conf
/*
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
firebase.initializeApp(firebaseConfig);*/
//End firebase conf

export default function App() {
  const [userToken, setUserToken] = useState({
    isLogin: false,
    uid: '',
    usertype: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLang, setIsLang] = useState(false);

  useEffect(() => {
    console.disableYellowBox = true;
    _userTokenAsync();
    _loadLangAsync();
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  _loadLangAsync = async () => {
    try {
      const asyncLang = await AsyncStorage.getItem('lang');
      if (asyncLang != null) {
        I18n.locale = asyncLang;
        setIsLang(true);
        console.log("Loading Lang: " + asyncLang);
      }
    } catch {
      console.log("Error Loading Lang");
    }
  };

  const authContext = useMemo(() => ({
    signIn: (uid, usertype) => {
      setUserToken({
        isLogin: true,
        uid: uid,
        usertype: usertype,
      });
      _setUserTokenAsync();
    },
    signOut: () => {
      setUserToken({
        isLogin: false,
        uid: '',
        usertype: '',
      });
      console.log('signIn after: ' + JSON.stringify(userToken));
      _removeUserTokenAsync();
    },
    setUserToken: () => {
      _setUserTokenAsync();
    },
    useIsLang: (islang) => {
      setIsLang(islang);
    }
  }));

  const _userTokenAsync = async () => {
    try {
      const stringify_value = await AsyncStorage.getItem('userToken');
      if (stringify_value != null) {
        const asyncUserToken = JSON.parse(stringify_value);
        setUserToken({
          isLogin: asyncUserToken.isLogin,
          uid: asyncUserToken.uid,
          usertype: asyncUserToken.usertype,
        });
        console.log('_asyncUserTokenAsync not null: ' + stringify_value);
      } else {
        console.log('_asyncUserTokenAsync null');
      }

    } catch {
      console.log('An error has ocurred');
    }
  }

  const _setUserTokenAsync = async () => {
    try {
      AsyncStorage.setItem('userToken', JSON.stringify(userToken));
      console.log('_setUserTokenAsync' + await AsyncStorage.getItem('userToken'));
    } catch {
      console.log('An error has ocurred');
    }
  }

  const _removeUserTokenAsync = async () => {
    try {
      AsyncStorage.removeItem('userToken');
      console.log('_removeUserTokenAsync: ' + await AsyncStorage.getItem('userToken'));
    } catch {
      console.log('An error has ocurred');
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.PRIMARY_COLOR} />
      <AuthContext.Provider value={authContext}>
        <AppContainer isLang={isLang} isLoading={isLoading} usertype={userToken.usertype} isLogin={userToken.isLogin} />
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
