import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import { colors } from '../common/theme';

function BottomButton(props) {

  return (
    <TouchableOpacity
      style={[styles.button, props.style]}
      onPress={() => { props.onPress() }}
    >
      <Text style={[styles.caption, props.captionStyle]}>{props.caption}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caption: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
});

export default BottomButton;
