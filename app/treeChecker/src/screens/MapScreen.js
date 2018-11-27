/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview-messaging/WebView';
import { connect } from 'react-redux';
import { MySpinner } from '../components/common';
import { obsCreate, refreshSelectedAoiByIndex, setLoadingMap } from '../actions';
import { strings } from './strings.js';

class MapScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: `${strings.mapTabName}`,
    headerRight: <Button icon={{ name: 'menu' }} onPress={() => console.log('onPress Menu')} />,
  });

  componentDidMount() {
    this.initServer();

    if (this.props.mapAction.action === 'goTo') {
      this.goto = {
        latitude: this.props.mapAction.latitude,
        longitude: this.props.mapAction.longitude
      };
    }

    const { messagesChannel } = this.webview;
    messagesChannel.on('json', json => {
      this.processMapAction(json);
    });
  }

  componentDidUpdate() {
    this.sendDataToMap();
  }

  processMapAction(json) {
    switch (json.action) {

      case 'addObservation':
        const pos = {
          latitude: json.latitude,
          longitude: json.longitude
        };
        this.props.obsCreate(pos, Object.keys(this.props.currentAoi.obs).length + 1);
        this.props.navigation.navigate('createdata');
        return;

      case 'info':
        this.props.refreshSelectedAoiByIndex(json.id);
        this.props.navigation.navigate('detaildata', { originScreen: 'mapscreen' })
        return;

      case 'webInit':
        if (this.goto) {
          this.initMapaByCenter(this.goto, this.props.currentAoi.obs, this.offlineURL);
        } else {
          this.initMapaByBbox(this.props.currentAoi.bbox, this.props.currentAoi.obs, this.offlineURL);
        }
        this.goto = null;
        return;

      default:
        return console.debug('Map action not controlled: ', json);
    }
  }

  initMapaByBbox(bbox, obs, url) {
    this.props.setLoadingMap(false);
    this.webview.sendJSON({ bbox, obs, url });
  }

  initMapaByCenter(point, obs, url) {
    this.props.setLoadingMap(false);
    this.webview.sendJSON({ latitude: point.latitude, longitude: point.longitude, obs, url });
  }

  sendDataToMap() {
    this.props.setLoadingMap(false);
    if (this.props.mapAction.action === 'goTo') {
      const goto = {
        latitude: this.props.mapAction.latitude,
        longitude: this.props.mapAction.longitude
      };
      this.webview.sendJSON({ latitude: goto.latitude, longitude: goto.longitude });
    }
    this.webview.sendJSON({ obs: this.props.currentAoi.obs });
  }

  initServer() {
    const myserver = new StaticServer(8080, RNFS.ExternalDirectoryPath);
    myserver.start().then((url) => {
      this.offlineURL = url;
    });
  }

  stopServer() {
    this.props.server.stop();
  }

  _refWebView = (webview) => {
    this.webview = webview;
  }

renderSpinner() {
  if (this.props.loadingMap) {
    return (
      <MySpinner mystyle={{ position: 'absolute', zIndex: 1, marginTop: 50 }} size="large" />
    );
  }
}

  render() {
    return (
      <View style={styles.container}>
        {this.renderSpinner()}
        <View style={{ width: '100%', height: '100%' }}>
          <WebView
            source={{ uri: 'file:///android_asset/web/baseMap.html' }}
            ref={this._refWebView}
            style={{ flex: 1, borderBottomWidth: 1, padding: 20 }}
          />
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

const mapStateToProps = ({ auth, mapData }) => {
  const { token } = auth;
  const { currentAoi, loadingMap, mapAction } = mapData;
  return { token, currentAoi, loadingMap, mapAction };
};

const myMapScreen = connect(mapStateToProps, {
  setLoadingMap,
  obsCreate,
  refreshSelectedAoiByIndex
})(MapScreen);

export { myMapScreen as MapScreen };
