import React, { useState } from 'react';
import I18n from "../common/lang/config";

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
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';

import { colors } from '../common/theme';

import * as firebase from 'firebase';

import MyModal from '../components/MyModal';

export default function AuthLogin(props) {
  const usertype = props.route.params.usertype;

  const [isSigning, setIsSigning] = useState(false);

  const [authInfo, setAuthInfo] = useState({
    email: '',
    password: '',
    secureTextEntryPassword: true,
    checkEmail: false,
    checkPassword: false,
    checkAlert: false,
  });

  const [myModalVisibility, setMyModalVisibility] = useState({
    signinFailedModal: false,
  });

  const handleAuth = () => {
    setIsSigning(true);
    setTimeout(() => {
      firebase.auth().signInWithEmailAndPassword(authInfo.email, authInfo.password).catch((error) => {
        setIsSigning(false);
        setMyModalVisibility({
          signinFailedModal: true,
        });
      })
    }, 1500);
  }

  return (
    <View style={styles.container}>
      <MBackground source={require('../../assets/images/background-art.png')}>

        <Animatable.View animation="fadeInDownBig" style={styles.changeLang}>
          <MMinimalButton caption={I18n.t('change_service')} onPress={() => props.navigation.navigate('SelectServiceScreen')} />
        </Animatable.View>

        <View style={styles.header}>
          <Text style={styles.text_header}>{I18n.t('login_title')}</Text>
        </View>
        <ScrollView>
          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            {
              !isSigning ?
                <View style={{ flex: 1 }}>
                  <Text style={[styles.text_footer, { marginTop: 35 }]}>{I18n.t('email')}</Text>
                  <View style={styles.action}>
                    <FontAwesome name="envelope-o" color={colors.PRIMARY_COLOR} size={20} />
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
                  {
                    !authInfo.checkEmail && authInfo.checkAlert ?
                      <Text style={styles.textValidation}>{I18n.t('check_email')}*</Text> : null
                  }

                  <Text style={[styles.text_footer, { marginTop: 35 }]}>{I18n.t('password')}</Text>
                  <View style={styles.action}>
                    <Feather name="lock" color={colors.PRIMARY_COLOR} size={20} />
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
                  {
                    !authInfo.checkPassword && authInfo.checkAlert ?
                      <Text style={styles.textValidation}>{I18n.t('check_password')}*</Text> : null
                  }

                  <TouchableOpacity>
                    <Text style={{ color: colors.TRANSPARENCY.BLACK.medium, marginTop: 15 }}>{I18n.t('forgot_password')}</Text>
                  </TouchableOpacity>

                  <View style={styles.button}>
                    <MButton buttonStyle="outlined" caption={I18n.t('sign_in')} onPress={() => {
                      authInfo.checkPassword && authInfo.checkEmail ?
                        handleAuth()
                        :
                        setAuthInfo({ ...authInfo, checkAlert: true });
                    }} />
                    <MButton opaque={true} buttonStyle="solid" caption={I18n.t('sign_up')} onPress={() => props.navigation.navigate('RegisterScreen', { usertype: usertype })} />
                  </View>
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size='large' color={colors.PRIMARY_COLOR} />
                </View>
            }
          </Animatable.View>
        </ScrollView>
      </MBackground>
      {
        <MyModal
          isVisible={myModalVisibility.signinFailedModal}
          onRequestClose={() => setMyModalVisibility({ ...myModalVisibility, signinFailedModal: false })}
          headerCaption={I18n.t('modal_error_message')}
          action={() => {
            setMyModalVisibility({ ...myModalVisibility, signinFailedModal: false });
            props.navigation.navigate('RegisterScreen', { usertype: usertype });
          }}
          actionCaption={I18n.t('register_now')}
        >
          <Text style={styles.unavailable}>{I18n.t('credentials_are_incorrect_or_your_account_does_not_exist')}</Text>
          <MaterialIcons name="error" color={colors.TRANSPARENCY.BLACK.medium} size={64}
            style={{ margin: 18 }}
          />
        </MyModal>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    //backgroundColor: colors.PRIMARY_COLOR
  },
  unavailable: {
    color: colors.TRANSPARENCY.BLACK.medium,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
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
    backgroundColor: colors.WHITE.default,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: colors.WHITE.default,
    fontSize: 34,
    fontFamily: 'Pacifico-Regular',
  },
  text_footer: {
    color: colors.BLACK,
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.TRANSPARENCY.BLACK.small,
    padding: 3
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -4,
    paddingLeft: 10,
    color: colors.BLACK,
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
  textValidation: {
    color: colors.RED,
  }
});
