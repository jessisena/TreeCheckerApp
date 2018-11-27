/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { Card, ListItem, Button } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { strings } from './strings.js';
import { logout, resetState } from '../actions';


class ProfileScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: `${strings.menu}`,
    headerTintColor: '#ffffff',
    headerStyle: { backgroundColor: '#4CAF50'}
  });

  doLogout() {
    console.debug('doLogout');
    this.props.logout();
    this.props.resetState();
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'initflow' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
    // this.props.navigation.navigate('initflow');
  }

  render() {
    const { userData } = this.props;
    return (
      <View style={styles.container}>
        <Card
          title={strings.userInfo}
          titleStyle= {{fontSize: 20}}
          >

          <ListItem
            key='1'
            roundAvatar
            hideChevron
            title={userData.name}
            titleStyle= {styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            subtitle={strings.name}
            leftIcon={{name: 'user', type: 'font-awesome'}}
          />
          <ListItem
            key='2'
            roundAvatar
            hideChevron
            title={userData.email}
            subtitle={strings.email}
            titleStyle= {styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            leftIcon={{name: 'email'}}
          />
          <ListItem
            key='3'
            roundAvatar
            hideChevron
            title={userData.occupation}
            subtitle={strings.occupation}
            titleStyle= {styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            leftIcon={{name: 'work', font: 'material-icons'}}
          />
          <ListItem
            key='4'
            roundAvatar
            hideChevron
            title={userData.country.name}
            subtitle={strings.countryRegion}
            titleStyle= {styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            leftIcon={{name: 'directions', font: 'material-icons'}}
          />
        </Card>
        <Button
          iconRight
          icon={{name: 'exit-to-app', font: 'material-community'}}
          backgroundColor='#8BC34A'
          buttonStyle={{borderRadius: 0, marginTop: 10}}
          onPress={this.doLogout.bind(this)}
          title={strings.logout}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#C8E6C9'
  },
  subtitleStyle: {
    fontSize: 16
  },
  titleStyle: {
    fontSize: 18
  }
});

const mapStateToProps = ({ auth }) => {
const { token, userData } = auth;
return { userData, token };
};

const myProfileScreen = connect(mapStateToProps, {
  logout,
  resetState
})(ProfileScreen);

export { myProfileScreen as ProfileScreen };
