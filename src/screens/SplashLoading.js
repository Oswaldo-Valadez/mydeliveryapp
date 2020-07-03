import React from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { colors } from '../common/theme';
import * as Animatable from 'react-native-animatable';
import MBackground from '../components/MaterialBackground';

const { height, width } = Dimensions.get('window');

export default function SplashLoading() {

    return (
      <View style={styles.container}>
        <MBackground source={require('../../assets/images/background-art-splash.png')}>
          <Animatable.View animation="fadeInDownBig" style={styles.header}>
            <Avatar.Icon backgroundColor={colors.PRIMARY_COLOR} size={94} icon="package-variant-closed" />
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
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
