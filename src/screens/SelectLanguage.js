import React, { useEffect, useState, useContext } from 'react';
import { AsyncStorage, Dimensions } from 'react-native';
import I18n from "../common/lang/config";
import { StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { colors } from '../common/theme';
import * as Animatable from 'react-native-animatable';
import MButton from '../components/MaterialButton';
import MBackground from '../components/MaterialBackground';
import { AuthContext } from '../common/context';

const { height, width } = Dimensions.get('window');

export default function SelectLanguage(props) {
  const { useIsLang } = useContext(AuthContext);

  const [lang, setLang] = useState('');

  useEffect(() => {
    if (lang != '') {
      _setLangAsync();
    }
  });

  _setLangAsync = async () => {
    try {
      AsyncStorage.setItem('lang', lang);
      I18n.locale = await AsyncStorage.getItem('lang');
      useIsLang(true);
    } catch {
      console.log("Error Setting Lang");
    }
  };

  return (
    <View style={styles.container}>
      <MBackground source={require('../../assets/images/background-art-lang.png')}>
        <Animatable.View animation="fadeInDownBig" style={styles.header}>
          <Avatar.Icon backgroundColor={colors.PRIMARY_COLOR} size={94} icon="translate" />
        </Animatable.View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <MButton opaque={true} buttonStyle="outlined" caption="English" onPress={() => setLang('en')} />
          <MButton opaque={true} buttonStyle="outlined" caption="اَلْعَرَبِيَّةُ" onPress={() => setLang('ar')} />
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
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
