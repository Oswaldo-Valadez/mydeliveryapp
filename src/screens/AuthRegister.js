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

import ServiceTypes from '../components/ServiceTypes';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

import MButton from '../components/MaterialButton';
import MBackground from '../components/MaterialBackground';

import * as Animatable from 'react-native-animatable';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';

import { colors } from '../common/theme';

import CountryPicker from 'react-native-country-picker-modal';

import * as firebase from 'firebase';

import GenerateVerificationCode from '../components/GenerateVerificationCode';

import { cloud_function_server_url } from '../common/serverUrl';

import MyModal from '../components/MyModal';

export default function AuthRegister(props) {
  const usertype = props.route.params.usertype;

  const [step, setStep] = useState('fill-form');

  const [finalVerificationCode, setFinalVerificationCode] = useState(GenerateVerificationCode());

  const [registerInfo, setRegisterInfo] = useState({
    username: '',
    full_name: '',
    email: '',
    phone: '',
    password: '',
    country: 'US',
    callingCode: 1,
    verificationCode: '',
    checkUsername: false,
    checkFullname: false,
    checkEmail: false,
    checkPhone: false,
    checkPassword: false,
    checkConfirmPassword: false,
    secureTextEntryPassword: true,
    secureTextEntryConfirmPassword: true,
    checkAlert: false,
  });

  const [myModalVisibility, setMyModalVisibility] = useState({
    signupFailedModal: false,
  });

  const [services, setServices] = useState({
    car: false,
    bus: false,
    pickup: false,
    truck: false
  });

  const [usertypeReg, setUsertypeReg] = useState(usertype);

  const handleServices = (name, value) => {
    setServices({
      ...services,
      [name]: value,
    })
  }

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
    fetch(cloud_function_server_url + 'sendMail', {
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
    const regData = {
      username: registerInfo.username,
      full_name: registerInfo.full_name,
      email: registerInfo.email,
      phone: '+' + registerInfo.callingCode + registerInfo.phone,
      country: registerInfo.country,
      usertype: usertypeReg,
      services: usertypeReg == "provider" ? services : null,
    }
    setTimeout(() => {
      firebase.auth().createUserWithEmailAndPassword(registerInfo.email, registerInfo.password).then(() => {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/').set(regData).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        setMyModalVisibility({
          signupFailedModal: true,
        });
        setStep('fill-form');
        setRegisterInfo({
          username: '',
          full_name: '',
          email: '',
          phone: '',
          password: '',
          country: 'US',
          callingCode: 1,
          verificationCode: '',
          checkUsername: false,
          checkFullname: false,
          checkEmail: false,
          checkPhone: false,
          checkPassword: false,
          checkConfirmPassword: false,
          secureTextEntryPassword: true,
          secureTextEntryConfirmPassword: true,
          checkAlert: false,
        });
        setServices({
          car: false,
          bus: false,
          pickup: false,
          truck: false,
        });
        setFinalVerificationCode(GenerateVerificationCode());
      });
    }, 2000);
  }

  return (
    <View style={styles.container}>
      <MBackground source={require('../../assets/images/background-art-services.png')}>
        <View style={styles.header}>
          <Text style={styles.text_header}>{I18n.t('register_now')}</Text>
        </View>

        <Animatable.View animation="fadeInUpBig" style={[styles.footer, { backgroundColor: colors.WHITE.default }]}>
          {
            step == 'email-verification' ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ flex: 1, textAlignVertical: 'center', textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginHorizontal: 32 }}>
                  {I18n.t('we_have_sent_the_verification_code_to_your_email')}
                </Text>
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
                </View>
                <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 32 }}>
                  <MButton buttonStyle="outlined" caption={I18n.t('verify')} onPress={() => { registerInfo.verificationCode == finalVerificationCode ? changeStep('') : console.log("False") }} />
                </View>
              </View>
              : step == 'fill-form' ?
                <ScrollView>
                  <View style={styles.footerMargin}>
                    <View style={styles.div}></View>

                    <View style={styles.services}>
                      <TouchableOpacity style={[styles.service, usertypeReg == 'provider' ? { backgroundColor: colors.PRIMARY_COLOR } : null]}
                        onPress={() => {
                          setUsertypeReg('provider');
                        }}
                      >
                        <Text style={[{ fontFamily: 'Pacifico-Regular', fontSize: 18 }, usertypeReg == 'provider' ? { color: colors.WHITE.default } : null]}>
                          {I18n.t('provider')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.service, usertypeReg == 'requester' ? { backgroundColor: colors.PRIMARY_COLOR } : null]}
                        onPress={() => {
                          setUsertypeReg('requester');
                        }}
                      >
                        <Text style={[{ fontFamily: 'Pacifico-Regular', fontSize: 18 }, usertypeReg == 'requester' ? { color: colors.WHITE.default } : null]}>
                          {I18n.t('requester')}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.div}></View>

                    <Text style={styles.text_footer}>{I18n.t('username')}</Text>
                    <View style={styles.action}>
                      <FontAwesome name="user-o" color={colors.PRIMARY_COLOR} size={20} />
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

                    <Text style={[styles.text_footer, { marginTop: 20 }]}>{I18n.t('full_name')}</Text>
                    <View style={styles.action}>
                      <FontAwesome name="user-o" color={colors.PRIMARY_COLOR} size={20} />
                      <TextInput placeholder={I18n.t('your_full_name')} style={styles.textInput} autoCapitalize="none"
                        onChangeText={(val) => {
                          setRegisterInfo({ ...registerInfo, full_name: val, checkFullname: true })
                        }} />
                      {
                        registerInfo.checkFullname ?
                          <Animatable.View animation="bounceIn">
                            <Feather name="check-circle" color="green" size={20} />
                          </Animatable.View>
                          :
                          null
                      }
                    </View>
                    {
                      !registerInfo.checkFullname && registerInfo.checkAlert ?
                        <Text style={styles.textValidation}>{I18n.t('check_full_name')}*</Text> : null
                    }

                    <Text style={[styles.text_footer, { marginTop: 20 }]}>{I18n.t('email')}</Text>
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

                    <Text style={[styles.text_footer, { marginTop: 20 }]}>{I18n.t('phone_number')}</Text>
                    <View style={styles.action}>
                      <CountryPicker
                        withCallingCode
                        withFlagButton
                        withCallingCodeButton
                        withAlphaFilter
                        withFilter
                        countryCode={registerInfo.country}
                        onSelect={(country) => { setRegisterInfo({ ...registerInfo, callingCode: country.callingCode, country: country.cca2 }) }}
                      />
                      <TextInput
                        placeholder={I18n.t('your_phone_number')}
                        keyboardType="phone-pad"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => {
                          const reg = /^[0-9]{8,15}$/;
                          reg.test(val) ?
                            setRegisterInfo({ ...registerInfo, phone: val.toString(), checkPhone: true })
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

                    <Text style={[styles.text_footer, { marginTop: 20 }]}>{I18n.t('password')}</Text>
                    <View style={styles.action}>
                      <Feather name="lock" color={colors.PRIMARY_COLOR} size={20} />
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
                            <Feather name="eye-off" size={20} color={colors.TRANSPARENCY.BLACK.medium} />
                            :
                            <Feather name="eye" color={colors.TRANSPARENCY.BLACK.medium} size={20} />
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

                    <Text style={[styles.text_footer, { marginTop: 20 }]}>{I18n.t('confirm_your_password')}</Text>
                    <View style={styles.action}>
                      <Feather name="lock" color={colors.PRIMARY_COLOR} size={20} />
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

                    {/*
                      usertypeReg == 'provider' ?
                        <View>
                          <Text style={[styles.text_footer, { marginTop: 20 }]}>{I18n.t('select_service_type')}</Text>
                          <ServiceTypes withPricing services={services} onPress={(name, value) => handleServices(name, value)} />
                          {
                            !(services.car || services.bus || services.pickup || services.truck) && registerInfo.checkAlert ?
                              <Text style={styles.textValidation}>{I18n.t('you_must_select_at_least_one_service')}*</Text> : null
                          }
                        </View>
                        : null
                        */}

                    <View style={styles.textPrivate}>
                      <Text style={styles.color_textPrivate}>{I18n.t('agree')}</Text>
                      <Text style={[styles.color_textPrivate, { fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center' }]}>{I18n.t('privacy_policy')}{}</Text>
                      <Text style={[styles.color_textPrivate, { fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center' }]}>{I18n.t('terms_of_service')}</Text>
                    </View>

                    <View>
                      <MButton opaque={true} buttonStyle="solid" caption={I18n.t('sign_up')} onPress={() => {
                        registerInfo.checkConfirmPassword && registerInfo.checkPassword && registerInfo.checkUsername && registerInfo.checkPhone && registerInfo.checkEmail && registerInfo.checkFullname ?
                          changeStep('email-verification')
                          :
                          setRegisterInfo({ ...registerInfo, checkAlert: true })
                      }} />
                      <MButton buttonStyle="outlined" caption={I18n.t('sign_in')} onPress={() => props.navigation.navigate('LoginScreen')} />
                    </View>
                  </View>
                </ScrollView>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size='large' color={colors.PRIMARY_COLOR} />
                </View>
          }
        </Animatable.View>
      </MBackground>
      {
        <MyModal
          isVisible={myModalVisibility.signupFailedModal}
          onRequestClose={() => setMyModalVisibility({ ...myModalVisibility, signupFailedModal: false })}
          headerCaption={I18n.t('modal_error_message')}
        >
          <Text style={styles.unavailable}>{I18n.t('the_email_address_is_already_in_use_by_another_account')}</Text>
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
  },
  unavailable: {
    color: colors.TRANSPARENCY.BLACK.medium,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  services: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
  },
  service: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: colors.WHITE.default,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 10
  },
  footerMargin: {
    paddingHorizontal: 20,
  },
  text_header: {
    color: colors.WHITE.default,
    fontSize: 34,
    fontFamily: 'Pacifico-Regular'
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
  textPrivate: {
    marginTop: 20
  },
  color_textPrivate: {
    color: 'grey'
  },
  div: {
    paddingVertical: 5
  },
  validationIcon: {
    marginLeft: 10,
  },
  textValidation: {
    color: colors.RED
  }
});
