import React, { useState } from 'react';
import I18n from "../common/lang/config";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';

import MButton from '../components/MaterialButton';
import MBackground from '../components/MaterialBackground';

import * as Animatable from 'react-native-animatable';
import { Feather, FontAwesome } from '@expo/vector-icons';

import { colors } from '../common/theme';

import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';

export default function AuthRegister(props) {
  const [registerInfo, setRegisterInfo] = useState({
    username: '',
    password: '',
    email: '',
    confirm_password: '',
    check_textInputChange: false,
    check_textInputChangeEmail: false,
    check_textInputChangePassword: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });

  return (
    <View style={styles.container}>
      <MBackground source={require('../../assets/images/background-art-services.png')}>
        <View style={styles.header}>
          <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View
          animation="fadeInUpBig"
          style={styles.footer}
        >
          <ScrollView>

            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#05375a"
                size={20}
              />
              <TextInput
                placeholder="Your Username"
                style={styles.textInput}
                autoCapitalize="none"
              />
              {setRegisterInfo.check_textInputChange ?
                <Animatable.View
                  animation="bounceIn"
                >
                  <Feather
                    name="check-circle"
                    color="green"
                    size={20}
                  />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>E-mail</Text>
            <View style={styles.action}>
              <CountryPicker
                withCallingCode
                withFlagButton
                withCallingCodeButton
                countryCode={'US'}
              //onSelect={(country => { this.setState({ code: country.cca2 }) })}
              />
              <TextInput
                placeholder="Your E-mail"
                keyboardType="email-address"
                style={styles.textInput}
                autoCapitalize="none"
              />
              {setRegisterInfo.check_textInputChangeEmail ?
                <Animatable.View
                  animation="bounceIn"
                >
                  <Feather
                    name="check-circle"
                    color="green"
                    size={20}
                  />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
              <Feather
                name="lock"
                color="#05375a"
                size={20}
              />
              <TextInput
                placeholder="Your Password"
                secureTextEntry={setRegisterInfo.secureTextEntry ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
              />
              <TouchableOpacity
              >
                {setRegisterInfo.secureTextEntry ?
                  <Feather
                    name="eye-off"
                    color="grey"
                    size={20}
                  />
                  :
                  <Feather
                    name="eye"
                    color="grey"
                    size={20}
                  />
                }
              </TouchableOpacity>
            </View>

            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>Confirm Password</Text>
            <View style={styles.action}>
              <Feather
                name="lock"
                color="#05375a"
                size={20}
              />
              <TextInput
                placeholder="Confirm Your Password"
                secureTextEntry={setRegisterInfo.confirm_secureTextEntry ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
              />
              <TouchableOpacity
              >
                {setRegisterInfo.confirm_secureTextEntry ?
                  <Feather
                    name="eye-off"
                    color="grey"
                    size={20}
                  />
                  :
                  <Feather
                    name="eye"
                    color="grey"
                    size={20}
                  />
                }
              </TouchableOpacity>
            </View>

            <View style={styles.textPrivate}>
              <Text style={styles.color_textPrivate}>
                By signing up you agree to our
                      </Text>
              <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
              <Text style={styles.color_textPrivate}>{" "}and</Text>
              <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
            </View>
            <View style={styles.button}>
              <MButton opaque={true} buttonStyle="solid" caption="Register" onPress={() => props.navigation.navigate('RegisterScreen')} />
              <MButton buttonStyle="outlined" caption="Back" onPress={() => props.navigation.navigate('RegisterScreen')} />
            </View>
          </ScrollView>
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
    flex: Platform.OS === 'ios' ? 3 : 5,
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
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
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
    borderRadius: 10,
    backgroundColor: colors.PRIMARY_COLOR,
  },
  signUp: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.PRIMARY_COLOR,
    marginTop: 16,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20
  },
  color_textPrivate: {
    color: 'grey'
  },
});
