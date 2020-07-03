import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import { colors } from '../common/theme';

function MaterialButton(props) {
  const buttonStyle =
    props.buttonStyle == 'solid' ? styles.solid
      :
      props.buttonStyle == 'outlined' ? styles.outlined : styles.solid;

  const captionStyle =
    props.buttonStyle == 'solid' ? styles.captionSolid
      :
      props.buttonStyle == 'outlined' ? styles.captionOutlined : styles.captionSolid;

  return (
    <TouchableOpacity
      style={[buttonStyle, styles.button, props.opaque ? {} : { backgroundColor: 'transarent' }]}
      onPress={() => { props.onPress() }}
    >
      <Text style={[captionStyle, styles.caption]}>{props.caption}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  solid: {
    backgroundColor: colors.PRIMARY_COLOR,
  },
  outlined: {
    borderColor: colors.PRIMARY_COLOR,
    backgroundColor: colors.WHITE,
    borderWidth: 3,
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderColor: colors.PRIMARY_COLOR,
    marginVertical: 8,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'bold',
    //fontFamily: "Roboto-Regular"
  },
  captionSolid: {
    color: colors.WHITE,
  },
  captionOutlined: {
    color: colors.PRIMARY_COLOR,
  }
});

export default MaterialButton;
