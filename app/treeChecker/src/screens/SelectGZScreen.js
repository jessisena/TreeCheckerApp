/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import { geoZonesFetch, gzUpdate } from '../actions';
import { MySpinner } from '../components/common';
import { strings } from './strings.js';

class SelectGZScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${strings.regionOfInterest}`,
      headerRight: <Icon name='menu' size={30} color='#ffffff' iconStyle={{ padding: 4, marginRight: 5 }} onPress={() => navigation.navigate('menu') } />
    };
  };

  componentDidMount() {
    const { isConnected, token } = this.props;
    if (isConnected) this.props.geoZonesFetch(token);
  }

  onPressGoButton(currentGz) {
    this.props.gzUpdate(currentGz);
    this.props.navigation.navigate('aoiflow');
  }

  renderGZList() {
    if (this.props.loading) {
      return <MySpinner size="large" />;
    }

    return (
      <FlatList
        data={this.props.geozonesList}
        renderItem={({ item }) => {
          return (
            <Card
              title={item.name}
              titleStyle={styles.cardTitle}
              keyExtractor={(myitem) => myitem.key}
              image={{ uri: `file://${RNFS.ExternalDirectoryPath}/pictures/gz/${item.key}.png` }}
              imageStyle={{ height: 200 }}
            >
              <Text style={{ marginBottom: 10, fontSize: 20 }} />
              <Button
                iconRight
                icon={{ name: 'arrow-circle-right', type: 'font-awesome' }}
                backgroundColor='#8BC34A'
                onPress={this.onPressGoButton.bind(this, item)}
                disabled={!item.is_enabled}
                buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                title={strings.go} />
            </Card>
          );
        }}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Select your region of interest: </Text>
        {this.renderGZList()}
      </View>
    );
  }

  }

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: '#C8E6C9'
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    padding: 15
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18
  }
  });

  const mapStateToProps = ({ geoZonesData, network, auth }) => {
  const { loading, geozonesList } = geoZonesData;
  const { token } = auth;
  const { isConnected } = network;
  return { loading, geozonesList, isConnected, token };
  };

  const mySelectGZScreen = connect(mapStateToProps, {
    geoZonesFetch,
    gzUpdate
  })(SelectGZScreen);

  export { mySelectGZScreen as SelectGZScreen };
