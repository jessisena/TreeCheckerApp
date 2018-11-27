/* @flow */

import _ from 'lodash';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { WebView } from 'react-native-webview-messaging/WebView';
import RNFS from 'react-native-fs';
import StaticServer from 'react-native-static-server';
import { NavigationActions } from 'react-navigation';

import { strings } from './strings.js';
import EditDataForm from '../components/EditDataForm.js';
import { obsUpdate, obsUpdateSaveServer, obsUpdateSaveLocal, addNewTreeSpecie } from '../actions';
import { CardSection, Header, MySpinner } from '../components/common';


class EditDataScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarVisible: false
    // headerRight: <Button icon={{ name: 'menu' }} onPress={() => console.log('onPress Menu')} />,
  });

  componentWillMount() {
    _.each(this.props.currentObs, (value, prop) => {
      if (prop.includes('_')) {
        this.props.obsUpdate({ prop, value: value.key });
      } else {
        this.props.obsUpdate({ prop, value });
      }
    });
  }

  componentDidMount() {
    this.isInitialized = false;
    this.subscribeMessages();
    this.initServer();
  }

  setWebView(webview) {
    this.webview = webview;
  }

  sendInitParams() {
    const { position } = this.props;
    this.webview.sendJSON({ pos: position });
  }

  receiveServerData(json) {
    if (json.webInit) {
      this.sendInitParams();
      this.isInitialized = true;
    } else if (this.isInitialized) {
      this.props.obsUpdate({ prop: 'position', value: { latitude: json.center.lat, longitude: json.center.lng } });
    }
  }

  subscribeMessages() {
    const { messagesChannel } = this.webview;
    messagesChannel.on('json', (json) => this.receiveServerData(json));
  }

  initServer() {
    const myserver = new StaticServer(8080, RNFS.ExternalDirectoryPath);
    myserver.start().then((url) => {
      this.webview.sendJSON({ urlOffline: url });
    });
  }

  goBackDetailData() {
    const backAction = NavigationActions.back({
      key: 'detaildata'
    })
    this.props.navigation.dispatch(backAction);
    this.props.navigation.goBack(null);
  }

  async addNewTreeSpecie() {
    const item = { key: `new_${Date.now()}`, name: this.props.tmp_treeSpecieName };
    this.props.addNewTreeSpecie(item);
    return item;
  }

  async checkTreeSpecieValue() {
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    if (comp(this.props.treeSpeciesList[this.props.tree_specie].name, this.props.tmp_treeSpecieName)) {
      return this.props.treeSpeciesList[this.props.tree_specie];
    }

    let treeItem = _.find(this.props.treeSpeciesList, ['name', this.props.tmp_treeSpecieName.toLowerCase().trim()]);
    if (treeItem !== undefined) {
      return treeItem;
    }

    treeItem = await this.addNewTreeSpecie();
    return treeItem;
  }

  async sendUpdateSave() {

    const canopyItem = this.props.canopyList[this.props.canopy_status];
    const crownItem = this.props.crownList[this.props.crown_diameter];
    const treeItem = await this.checkTreeSpecieValue();

    await this.props.obsUpdateSaveLocal(
      this.props.currentObs,
      this.props.currentAoiId,
      this.props.name,
      treeItem,
      canopyItem,
      crownItem,
      this.props.comment,
      this.props.position,
      this.props.images
    );

    await this.props.obsUpdateSaveServer(
      this.props.currentObs.key,
      this.props.currentAoiId,
      this.props.currentGzId,
      this.props.name,
      treeItem,
      canopyItem,
      crownItem,
      this.props.comment,
      this.props.position,
      this.props.images,
      this.props.currentObs.compass,

      this.props.token,
      false
    );
    this.goBackDetailData();
  }

  renderButtons() {
    if (this.props.isSaving) {
      return (
        <MySpinner size="large" mystyle={{ paddingBottom: 20 }} />
      );
    }

    return (
      <View style={styles.rowButtons}>
        <Button
          iconRight
          buttonStyle={{ borderColor: '#8BC34A', borderWidth: 1 }}
          backgroundColor='#ffffff'
          color='#8BC34A'
          onPress={this.goBackDetailData.bind(this)}
          icon={{ name: 'close', type: 'font-awesome', color: '#8BC34A' }}
          title={strings.cancel} />

        <Button
          iconRight
          backgroundColor='#8BC34A'
          onPress={this.sendUpdateSave.bind(this)}
          icon={{ name: 'save', type: 'font-awesome' }}
          title={strings.save} />
      </View>
    );
  }

  renderMap() {
    return (
      <View style={styles.containerMap}>
        <CardSection style={{ backgroundColor: '#8BC34A' }}>
        <Text>{strings.moveMap}</Text>
        </CardSection>
        <WebView
          source={{ uri: 'file:///android_asset/web/centerPin.html' }}
          ref={(webview) => { this.setWebView(webview); }}
          style={{ flex: 1, borderBottomWidth: 1, padding: 20 }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header headerText={strings.editData} icon='edit' mystyle={{ borderBottomLeftRadius:40, borderBottomRightRadius: 40, paddingBottom: 20 }}/>
        <View style={styles.containerForm}>
          <EditDataForm />
        </View>
        {this.renderMap()}
        {this.renderButtons()}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff'
  },
  containerButtons: {
    paddingTop: 15,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginTop: 10
  },
  containerMap: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flex: 2,
    justifyContent: 'center'
  },
  containerForm: {
    flex: 4,
  },
  spinner: {
    marginBottom: 50
  }
});

const mapStateToProps = ({ mapData, obsData, auth, selectFormData, geoZonesData }) => {
  const { canopyList, crownList, treeSpeciesList } = selectFormData;
  const { currentObs, currentAoiId } = mapData;
  const { currentGzId } = geoZonesData;
  const { token } = auth;
  const { name, tree_specie, tmp_treeSpecieName, crown_diameter, canopy_status, comment, position, images, isSaving } = obsData;

  return {
    token,
    currentObs,
    currentAoiId,
    currentGzId,
    name,
    tree_specie,
    tmp_treeSpecieName,
    crown_diameter,
    canopy_status,
    comment,
    position,
    images,
    isSaving,
    canopyList,
    crownList,
    treeSpeciesList };
};

const myEditDataScreen = connect(mapStateToProps, {
  obsUpdate,
  obsUpdateSaveServer,
  obsUpdateSaveLocal,
  addNewTreeSpecie
})(EditDataScreen);

export { myEditDataScreen as EditDataScreen };
