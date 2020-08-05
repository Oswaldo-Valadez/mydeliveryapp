import React, { useState, useContext } from 'react';
import I18n from "../common/lang/config";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';

import {
  ActivityIndicator
} from 'react-native-paper';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

import MButton from '../components/MaterialButton';
import MBackground from '../components/MaterialBackground';

import * as Animatable from 'react-native-animatable';
import { Feather, FontAwesome } from '@expo/vector-icons';

import { colors } from '../common/theme';

import CountryPicker from 'react-native-country-picker-modal';

import * as firebase from 'firebase';

import GenerateVerificationCode from '../components/GenerateVerificationCode';

export default function AuthRegister(props) {
  const usertype = props.route.params.usertype;

  const [step, setStep] = useState('fill-form');

  const [finalVerificationCode, setFinalVerificationCode] = useState(GenerateVerificationCode());

  const [registerInfo, setRegisterInfo] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    country: 'US',
    callingCode: 1,
    usertype: usertype,
    verificationCode: '',
    checkUsername: false,
    checkEmail: false,
    checkPhone: false,
    checkPassword: false,
    checkConfirmPassword: false,
    secureTextEntryPassword: true,
    secureTextEntryConfirmPassword: true,
    checkAlert: false,
  });

  const changeStep = (step) => {
    setStep('');
    setTimeout(() => {
      if (step == 'email-verification') {
        setStep(step);
        sendMail();
      }
      else {
        setStep('');
        handleRegister();
      }
    }, 1000);
  }

  const sendMail = () => {
    fetch('https://us-central1-my-delivery-app-go.cloudfunctions.net/sendMail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: registerInfo.email,
        verification_code: finalVerificationCode,
        username: registerInfo.username
      })
    });
  }

  const handleRegister = () => {
    console.log("Handle register start");
    const regData = {
      username: registerInfo.username,
      email: registerInfo.email,
      phone: registerInfo.phone,
      country: registerInfo.country,
      usertype: registerInfo.usertype,
    }
    setTimeout(() => {
      firebase.auth().createUserWithEmailAndPassword(registerInfo.email, registerInfo.password).then(() => {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/').set(regData).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
    }, 2000);
  }

  return (
    <View style={styles.container}>
      <MBackground source={require('../../assets/images/background-art-services.png')}>
        <View style={styles.header}>
          <Text style={styles.text_header}>{I18n.t('register_title')}{I18n.t(usertype)}!</Text>
        </View>

        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          {
            step == 'email-verification' ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{I18n.t('enter_your_code_below')}</Text>
                <SmoothPinCodeInput
                  cellStyle={{
                    borderBottomWidth: 2,
                    borderColor: 'gray',
                  }}
                  cellStyleFocused={{
                    borderColor: 'black',
                  }}
                  value={registerInfo.verificationCode}
                  onTextChange={code => setRegisterInfo({ ...registerInfo, verificationCode: code })}
                />
                <MButton buttonStyle="outlined" caption={I18n.t('verify')} onPress={() => { registerInfo.verificationCode == finalVerificationCode ? handleRegister() : console.log("False") }} />
              </View>
              : step == 'fill-form' ?
                <ScrollView>
                  <View style={styles.div}></View>

                  <Text style={styles.text_footer}>{I18n.t('username')}</Text>
                  <View style={styles.action}>
                    <FontAwesome name="user-o" color="#05375a" size={20} />
                    <TextInput placeholder={I18n.t('your_username')} style={styles.textInput} autoCapitalize="none"
                      onChangeText={(val) => {
                        val.length >= 6 && val.length <= 15 ?
                          setRegisterInfo({ ...registerInfo, username: val, checkUsername: true })
                          :
                          setRegisterInfo({ ...registerInfo, username: '', checkUsername: false })
                      }} />
                    {
                      registerInfo.checkUsername ?
                        <Animatable.View animation="bounceIn">
                          <Feather name="check-circle" color="green" size={20} />
                        </Animatable.View>
                        :
                        null
                    }
                  </View>
                  {
                    !registerInfo.checkUsername && registerInfo.checkAlert ?
                      <Text style={styles.textValidation}>{I18n.t('check_username')}*</Text> : null
                  }

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
                          setRegisterInfo({ ...registerInfo, email: val, checkEmail: true })
                          :
                          setRegisterInfo({ ...registerInfo, email: '', checkEmail: false })
                      }}
                    />
                    {
                      registerInfo.checkEmail ?
                        <Animatable.View animation="bounceIn">
                          <Feather name="check-circle" color="green" size={20} />
                        </Animatable.View>
                        :
                        null
                    }
                  </View>
                  {
                    !registerInfo.checkEmail && registerInfo.checkAlert ?
                      <Text style={styles.textValidation}>{I18n.t('check_email')}*</Text> : null
                  }

                  <Text style={[styles.text_footer, { marginTop: 35 }]}>{I18n.t('phone_number')}</Text>
                  <View style={styles.action}>
                    <CountryPicker
                      withCallingCode
                      withFlagButton
                      withCallingCodeButton
                      withAlphaFilter
                      withFilter
                      countryCode={registerInfo.country}
                      onSelect={(country) => setRegisterInfo({ ...registerInfo, callingCode: country.callingCode, country: country.cca2 })}
                    />
                    <TextInput
                      placeholder={I18n.t('your_phone_number')}
                      keyboardType="phone-pad"
                      style={styles.textInput}
                      autoCapitalize="none"
                      onChangeText={(val) => {
                        const reg = /^[0-9]{8,15}$/;
                        reg.test(val) ?
                          setRegisterInfo({ ...registerInfo, phone: '+' + registerInfo.callingCode + val.toString(), checkPhone: true })
                          :
                          setRegisterInfo({ ...registerInfo, phone: '', checkPhone: false })
                      }}
                    />
                    {
                      registerInfo.checkPhone ?
                        <Animatable.View animation="bounceIn">
                          <Feather name="check-circle" color="green" size={20} />
                        </Animatable.View>
                        :
                        null
                    }
                  </View>
                  {
                    !registerInfo.checkPhone && registerInfo.checkAlert ?
                      <Text style={styles.textValidation}>{I18n.t('check_phone')}*</Text> : null
                  }

                  <Text style={[styles.text_footer, { marginTop: 35 }]}>{I18n.t('password')}</Text>
                  <View style={styles.action}>
                    <Feather name="lock" color="#05375a" size={20} />
                    <TextInput
                      placeholder={I18n.t('your_password')}
                      secureTextEntry={registerInfo.secureTextEntryPassword}
                      style={styles.textInput}
                      autoCapitalize="none"
                      onChangeText={((val) => {
                        val.length >= 6 ?
                          setRegisterInfo({ ...registerInfo, password: val, checkPassword: true })
                          :
                          setRegisterInfo({ ...registerInfo, password: '', checkPassword: false })
                      })}
                    />
                    <TouchableOpacity onPress={() => setRegisterInfo({ ...registerInfo, secureTextEntryPassword: !registerInfo.secureTextEntryPassword })}>
                      {
                        registerInfo.secureTextEntryPassword ?
                          <Feather name="eye-off" size={20} color="grey" />
                          :
                          <Feather name="eye" color="grey" size={20} />
                      }
                    </TouchableOpacity>
                    {
                      registerInfo.checkPassword ?
                        <Animatable.View animation="bounceIn">
                          <Feather style={styles.validationIcon} name="check-circle" color="green" size={20} />
                        </Animatable.View>
                        :
                        null
                    }
                  </View>
                  {
                    !registerInfo.checkPassword && registerInfo.checkAlert ?
                      <Text style={styles.textValidation}>{I18n.t('check_password')}*</Text> : null
                  }

                  <Text style={[styles.text_footer, { marginTop: 35 }]}>{I18n.t('confirm_your_password')}</Text>
                  <View style={styles.action}>
                    <Feather name="lock" color="#05375a" size={20} />
                    <TextInput
                      placeholder={I18n.t('your_password')}
                      secureTextEntry={registerInfo.secureTextEntryConfirmPassword}
                      style={styles.textInput}
                      autoCapitalize="none"
                      onChangeText={((val) => {
                        val == registerInfo.password ?
                          setRegisterInfo({ ...registerInfo, checkConfirmPassword: true })
                          :
                          setRegisterInfo({ ...registerInfo, checkConfirmPassword: false })
                      })}
                    />
                    <TouchableOpacity onPress={() => setRegisterInfo({ ...registerInfo, secureTextEntryConfirmPassword: !registerInfo.secureTextEntryConfirmPassword })}>
                      {
                        registerInfo.secureTextEntryConfirmPassword ?
                          <Feather name="eye-off" color="grey" size={20} />
                          :
                          <Feather name="eye" color="grey" size={20} />
                      }
                    </TouchableOpacity>
                    {
                      registerInfo.checkConfirmPassword ?
                        <Animatable.View animation="bounceIn">
                          <Feather style={styles.validationIcon} name="check-circle" color="green" size={20} />
                        </Animatable.View>
                        :
                        null
                    }
                  </View>
                  {
                    !registerInfo.checkConfirmPassword && registerInfo.checkAlert ?
                      <Text style={styles.textValidation}>{I18n.t('check_confirm_password')}*</Text> : null
                  }

                  <View style={styles.textPrivate}>
                    <Text style={styles.color_textPrivate}>{I18n.t('agree')}</Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}{I18n.t('terms_of_service')}</Text>
                    <Text style={styles.color_textPrivate}>{" "}{I18n.t('and')}</Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{""}{I18n.t('privacy_policy')}</Text>
                  </View>

                  <View>
                    <MButton opaque={true} buttonStyle="solid" caption={I18n.t('sign_up')} onPress={() => {
                      registerInfo.checkConfirmPassword && registerInfo.checkPassword && registerInfo.checkUsername && registerInfo.checkPhone && registerInfo.checkEmail ?
                        changeStep('email-verification')
                        :
                        setRegisterInfo({ ...registerInfo, checkAlert: true })
                    }} />
                    <MButton buttonStyle="outlined" caption={I18n.t('sign_in')} onPress={() => props.navigation.navigate('LoginScreen')} />
                  </View>

                </ScrollView>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size='large' color={colors.PRIMARY_COLOR} />
                </View>
          }
        </Animatable.View>
      </MBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10
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
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -4,
    paddingLeft: 10,
    color: '#05375a',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20
  },
  color_textPrivate: {
    color: 'grey'
  },
  div: {
    paddingVertical: 10
  },
  validationIcon: {
    marginLeft: 10,
  },
  textValidation: {
    color: 'red'
  }
});
