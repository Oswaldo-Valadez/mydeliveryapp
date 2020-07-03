import React, { useContext } from 'react';
import { Dimensions } from 'react-native';
import I18n from "../common/lang/config";
import { StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { colors } from '../common/theme';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../common/context';

import MButton from '../components/MaterialButton';
import MMinimalButton from '../components/MaterialMinimalButton';
import MBackground from '../components/MaterialBackground';

const { height, width } = Dimensions.get('window');

export default function SelectLanguage(props) {
  const { useIsLang } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <MBackground source={require('../../assets/images/background-art-services.png')} style={styles.image}>
        <Animatable.View animation="fadeInDownBig" style={styles.changeLang}>
          <MMinimalButton caption={I18n.t('change_language')} onPress={() => useIsLang(false)} />
        </Animatable.View>
        <Animatable.View animation="fadeInDownBig" style={styles.header}>
          <Avatar.Icon backgroundColor={colors.PRIMARY_COLOR} size={94} icon="account-supervisor" />
        </Animatable.View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <MButton opaque={true} buttonStyle="outlined" caption={I18n.t('requester')} onPress={() => props.navigation.navigate('LoginScreen', { usertype: 'requester' })} />
          <MButton opaque={true} buttonStyle="outlined" caption={I18n.t('provider')} onPress={() => props.navigation.navigate('LoginScreen', { usertype: 'provider' })} />
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
  footer: {
    flex: 1,
    backgroundColor: colors.PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  header: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeLang: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
