import React from 'react';
import { View } from 'react-native';

const CardSectionCol = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderColor: '#ddd',
    position: 'relative'
  }
};

export { CardSectionCol };
