import React from 'react';
import { View } from 'react-native';

const MyListItem = (props) => {
  return (
    <View key={props.key} style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    borderBottomWidth: 1,
    padding: 15,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',

  }
};

export { MyListItem };
