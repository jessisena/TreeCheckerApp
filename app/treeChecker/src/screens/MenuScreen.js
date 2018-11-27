/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { strings } from './strings.js';

class MenuScreen extends Component {

  goToGZFlow() {

    this.props.navigation.navigate('gzflow');

    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'gzflow' })
    //   ]
    // })
    // this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View style={styles.container}>

       <List>
         <ListItem
            key='1'
            title={strings.yourprof}
            titleStyle={{fontSize: 20}}
            containerStyle={styles.listItem}
            leftIcon={{name: 'user', type: 'font-awesome'}}
            onPress={() => this.props.navigation.navigate('profile')}
             />
         <ListItem
           key='2'
           title={strings.tutorial}
           titleStyle={{fontSize: 20}}
           containerStyle={styles.listItem}
           leftIcon={{name: 'info-circle', type: 'font-awesome'}}
           onPress={() => this.props.navigation.navigate('walkthrough')}
             />
         <ListItem
           key='3'
           title={strings.changeRegion}
           titleStyle={{fontSize: 20}}
           containerStyle={styles.listItem}
           leftIcon={{name: 'exchange', type: 'font-awesome'}}
           onPress={() => this.goToGZFlow()}
             />
      </List>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#C8E6C9'
  },
  listItem: {
    marginTop: 0, padding: 10, height: 75, justifyContent: 'center'
  }
});

export { MenuScreen };
