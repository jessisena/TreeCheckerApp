/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';

class SettingsScreen extends Component {

  // static navigationOptions = {
  //   title: 'User settings',
  //   headerRight: <Button title="Info" />
  // }
  static navigationOptions = ({ navigation, screenProps }) => ({
    //title: navigation.state.params.name + "'s Profile!",
    //headerRight: <Button color={screenProps.tintColor} {...} />,
    title: navigation.state.params.user +' settings',
    tabBarVisible: false
  });

  render() {
    return (
      <View style={styles.container}>
        <Text>Im the SettingsScreen component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { SettingsScreen };
