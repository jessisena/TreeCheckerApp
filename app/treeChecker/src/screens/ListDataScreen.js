import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import Toast from 'react-native-toast-native';
import { ProgressDialog } from 'react-native-simple-dialogs';

import { strings } from './strings.js';
import { refreshSelectedObs, obsUpdateSaveServer, obsCreateSaveServer, deleteObsServer } from '../actions';
import { MyListItem } from '../components/common';

class ListDataScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: `${strings.dataTabName}`,
    headerRight: <Button icon={{ name: 'menu' }} onPress={() => console.log('onPress Menu')} />,
  });

  state = { showSyncDialog: false };

  onPressFile(item) {
    this.props.refreshSelectedObs(item);
    this.props.navigation.navigate('detaildata', { originScreen: 'listdata' });
  }

  onPressSync(item) {
    if (this.props.isConnected && item.toSync) {
      const key = item.key.toString();
      if (key.startsWith('new_')) {
        this.props.obsCreateSaveServer(
          item.key,
          this.props.currentAoi.key,
          this.props.currentGzId,
          item.name,
          item.tree_specie,
          item.canopy_status,
          item.crown_diameter,
          item.comment,
          item.position,
          item.images,
          item.compass,
          this.props.token,
          true
        );
      } else if (key.startsWith('deleted_')) {
        this.props.deleteObsServer(
          item.key,
          item.name,
          this.props.currentAoi.key,
          this.props.currentGzId,
          this.props.token,
          true
        );
      } else {
        this.props.obsUpdateSaveServer(
          item.key,
          this.props.currentAoi.key,
          this.props.currentGzId,
          item.name,
          item.tree_specie,
          item.crown_diameter,
          item.canopy_status,
          item.comment,
          item.position,
          item.images,
          item.compass,
          this.props.token,
          true
        );
      }
    } else {
      const message = (!item.toSync ? strings.itemAlreadySync : strings.funcWithConnection);
      const style = {
        backgroundColor: '#dd8BC34A',
        color: '#ffffff',
        fontSize: 15,
        borderWidth: 5,
        borderRadius: 80,
        fontWeight: 'bold'
      }
      Toast.show(message, Toast.LONG, Toast.CENTER, style);
    }
  }

  goToPressed(item) {
    this.props.navigation.navigate('map', { action: 'goTo', latitude: item.position.latitude, longitude: item.position.longitude });
  }

  _renderItem({ item }) {
    let colorSync = '#c2c2c2';
    let textStyle = styles.labelName;
    let colActions = [];
    colActions.push(<Icon name='file-text-o' type='font-awesome' key={`${item.key}_file`} onPress={this.onPressFile.bind(this, item)} />);
    colActions.push(<Icon name='map-marker' type='font-awesome' key={`${item.key}_marker`} onPress={this.goToPressed.bind(this, item)}/> );

    if (item.toSync && item.toSync === true) {
      const key = item.key.toString();
      if (key.startsWith('deleted_')) {
        colorSync = '#D32F2F';
        textStyle = styles.labelNameDeleted;
        colActions = [];
      } else {
        colorSync = '#8BC34A';
        textStyle = styles.labelNameToSync;
      }
    }

    return (
      <MyListItem keyExtractor={(myitem, myindex) => myitem.key}>
        <View style={styles.colName}>
          <Text style={textStyle} onPress={this.onPressFile.bind(this, item)}> {item.name} </Text>
        </View>
        <View style={styles.colActions}>
        {colActions}
        </View>
        <View style={styles.colSync}>
          <Icon
            name='sync'
            color={colorSync}
            size={28}
            onPress={this.onPressSync.bind(this, item)}
          />
        </View>
      </MyListItem>
    );
  }

  isEmpty(obj) {
      for (let key in obj) {
          if (obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }

  renderDataList() {
    if (this.isEmpty(this.props.currentAoi.obs)) {
      return (
        <View style={styles.containerWarning}>
          <View style={styles.warning}>
            <Icon name='info' color='#757575' size={32} containerStyle={{ marginRight: 8 }} />
            <Text style={styles.labelName}>{strings.infoAddMessage}</Text>
          </View>
        </View>
      );
    }
    return (
      <FlatList
        data={_.values(this.props.currentAoi.obs)}
        renderItem={this._renderItem.bind(this)}
      />
    );
  }

  render() {
    console.debug('render Data Screen', this.props.currentAoi );
    return (
      <View style={styles.container}>

        <Text style={styles.headerText}>{strings.myObservations}</Text>
        {this.renderDataList()}

        <ProgressDialog
            visible={this.props.synchronizing}
            title={strings.progressDialog}
            message={strings.syncMessage}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: '#C8E6C9'
  },
  containerWarning: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  warning: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    width: '75%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row'
  },
  row: {
    justifyContent: 'center'
  },
  labelName: {
    fontSize: 18,
  },
  labelNameDeleted: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  labelNameToSync: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8BC34A'
  },
  flex2: { flex: 2 },
  flex1: { flex: 1 },

  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 15,
    textAlign: 'center',
  },
  colName: { flex: 2 },
  colSync: { flex: 1, alignItems: 'flex-end', paddingRight: 2 },
  colActions: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' }
});

const mapStateToProps = ({ auth, mapData, geoZonesData, network }) => {
  const { isConnected } = network;
  const { token } = auth;
  const { currentGzId } = geoZonesData;
  const { currentAoi, currentObs, synchronizing } = mapData;
  return { token, currentAoi, currentObs, currentGzId, synchronizing, isConnected };
};

const myListDataScreen = connect(mapStateToProps, {
  refreshSelectedObs,
  obsUpdateSaveServer,
  obsCreateSaveServer,
  deleteObsServer
})(ListDataScreen);

export { myListDataScreen as ListDataScreen };
