
import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

const Header = ({ icon, headerText, mystyle }) => {
const { textStyle, viewStyle } = styles;

  return (
    <View style={[viewStyle, mystyle]}>
      <Text style={textStyle}>{headerText}</Text>
      <Icon name={icon} color='#ffffff'/>
    </View>
  );
};

const styles = {
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    height: 50,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    width: '100%'
  },
  textStyle: {
    fontSize: 18,
    color: '#ffffff'
  }
};

export { Header };
