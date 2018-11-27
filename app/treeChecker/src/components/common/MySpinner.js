import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Spinner from 'react-native-spinkit';

const MySpinner = ({ type, color, mystyle }) => {
  return (
    <View style={[styles.spinnerStyle, mystyle]}>
      <Spinner name={type || 'wave'} color={color || '#8BC34A'}/>
    </View>
  );
};

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30
  }
};

export { MySpinner };
