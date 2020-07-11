import React, { useState } from 'react';
import { AsyncStorage } from 'react-native';
import I18n from "../common/lang/config";
import * as Localization from 'expo-localization';

import MButton from '../components/MaterialButton';
import MMinimalButton from '../components/MaterialMinimalButton';
import MBackground from '../components/MaterialBackground';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { Feather, FontAwesome } from '@expo/vector-icons';

import { colors } from '../common/theme';

import * as firebase from 'firebase';

export default function AuthLogin(props) {
  const usertype = props.route.params.usertype;

  const [isSigning, setIsSigning] = useState(false);

  const [authInfo, setAuthInfo] = useState({
    email: '',
    password: '',
    secureTextEntryPassword: true,
    checkEmail: false,
    checkPassword: false,
  });

  const handleAuth = () => {
    setIsSigning(true);
    setTimeout(() => {
      firebase.auth().signInWithEmailAndPassword(authInfo.email, authInfo.password).catch(() => {
        setIsSigning(false);
      })
    }, 1000);
  }

  return (
    <View style={styles.container}>
      <MBackground source={require('../../assets/images/background-art.png')}>

        <Animatable.View animation="fadeInDownBig" style={styles.changeLang}>
          <MMinimalButton caption={I18n.t('change_service')} onPress={() => props.navigation.navigate('SelectServiceScreen')} />
        </Animatable.View>

        <View style={styles.header}>
          <Text style={styles.text_header}>{I18n.t('login_title')}{I18n.t(usertype)}!</Text>
        </View>

        <Animatable.View animation="fadeInUpBig" style={[styles.footer, { backgroundColor: "white" }]}>

          <Text style={[styles.text_footer, { marginTop: 35 }]}>{I18n.t('email')}</Text>
          <View style={styles.action}>
            <FontAwesome name="envelope-o" color="#05375a" size={20} />
            <TextInput
              placeholder={I18n.t('your_email')}
              keyboardType="email-address"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {
                const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                reg.test(val) ?
                  setAuthInfo({ ...authInfo, email: val, checkEmail: true })
                  :
                  setAuthInfo({ ...authInfo, email: '', checkEmail: false })
              }}
            />
            {
              authInfo.checkEmail ?
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
                :
                null
            }
          </View>

          <Text style={[styles.text_footer, { marginTop: 35 }]}>{I18n.t('password')}</Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder={I18n.t('your_password')}
              secureTextEntry={authInfo.secureTextEntryPassword}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={((val) => {
                val.length >= 6 ?
                  setAuthInfo({ ...authInfo, password: val, checkPassword: true })
                  :
                  setAuthInfo({ ...authInfo, password: '', checkPassword: false })
              })}
            />
            <TouchableOpacity onPress={() => setAuthInfo({ ...authInfo, secureTextEntryPassword: !authInfo.secureTextEntryPassword })}>
              {
                authInfo.secureTextEntryPassword ?
                  <Feather name="eye-off" size={20} color="grey" />
                  :
                  <Feather name="eye" color="grey" size={20} />
              }
            </TouchableOpacity>
            {
              authInfo.checkPassword ?
                <Animatable.View animation="bounceIn">
                  <Feather style={styles.validationIcon} name="check-circle" color="green" size={20} />
                </Animatable.View>
                :
                null
            }
          </View>

          <TouchableOpacity>
            <Text style={{ color: '#ee1280', marginTop: 15 }}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={styles.button}>
            <MButton buttonStyle="outlined" caption={I18n.t('sign_in')} onPress={() => {
              authInfo.checkPassword && authInfo.checkEmail ?
                handleAuth()
                :
                null
            }} />
            <MButton opaque={true} buttonStyle="solid" caption={I18n.t('sign_up')} onPress={() => props.navigation.navigate('RegisterScreen', { usertype: usertype })} />
          </View>
        </Animatable.View>
      </MBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    //backgroundColor: colors.PRIMARY_COLOR
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: colors.PRIMARY_COLOR,
  },
  signUp: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.PRIMARY_COLOR,
    marginTop: 16,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  changeLang: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationIcon: {
    marginLeft: 10,
  },
});
