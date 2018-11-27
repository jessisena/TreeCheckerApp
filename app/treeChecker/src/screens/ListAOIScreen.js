/* @flow */

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Toast from 'react-native-toast-native';
import _ from 'lodash';

import { aoiListFetch, refreshSelectedAoi, deleteAOI, setLoadingMap, setMapAction } from '../actions';
import { MySpinner, MyListItem } from '../components/common';
import { strings } from './strings.js';


class ListAOIScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${strings.aoiList}`,
    headerRight: <Icon name='menu' size={30} color='#ffffff' iconStyle={{ padding: 4, marginRight: 5 }} onPress={() => navigation.navigate('menu') }/>
  });

  state = { showDeleteModal: false, key: '' };

  componentDidMount() {
    const { token, currentGzId, allAoisList } = this.props;
    this.props.aoiListFetch({ token, currentGzId, allAoisList });
  }

  onPressItem(item) {
    this.props.refreshSelectedAoi(item);
    this.props.setLoadingMap(true);
    this.props.setMapAction({ action: 'initMap' });
    this.props.navigation.navigate('mapflow');
  }

  onDeletePressed() {
    const { token } = this.props;
    const { key } = this.state;
    this.props.deleteAOI({ token, key });
    this.setState({ showDeleteModal: false, key: '' });
  }

  _renderItem({ item }) {
    return (
      <MyListItem keyExtractor={(item, index) => item.key}>
        <View style={styles.colName}>
            <Text
              style={styles.name}
              onPress={this.onPressItem.bind(this, item)}
            >
            {item.name}
            </Text>
        </View>
        <View style={styles.colActions}>
            <Icon
              style={styles.icon}
              name='map-marker'
              type='font-awesome'
            />
            <Text>:</Text>
            <Badge
              containerStyle={{ backgroundColor: '#388E3C' }}
              value={Object.keys(item.obs).length}
            />
        </View>
        <View style={styles.colActions}>
            <Icon
              style={styles.icon}
              name='trash-o'
              type='font-awesome'
              onPress={() => this.setState({ showDeleteModal: !this.state.showDeleteModal, key: item.key })}
            />
        </View>

        <View style={styles.colRight}>
            <Icon
              style={styles.icon}
              name='chevron-right'
              onPress={this.onPressItem.bind(this, item)}
            />
        </View>
      </MyListItem>
    );
  }

  renderDataList() {
    if (this.props.loading) {
      return <MySpinner size="large" />;
    }

    const { currentAoiList } = this.props;
    if (Object.keys(currentAoiList).length === 0) {
      return (
        <View style={styles.containerWarning}>
          <View style={styles.warning}>
            <Icon name='info' color='#757575' size={32} containerStyle={{ marginRight: 8 }} />
            <Text style={styles.name}>{strings.noAOIS}</Text>
          </View>
        </View>
      );
    }
    return (
      <FlatList
        data={_.values(currentAoiList)}
        renderItem={this._renderItem.bind(this)}
      />
    );
  }

  onNewButtonPress() {
    const message = strings.funcWithConnection;
    if (this.props.isConnected) {
      this.props.navigation.navigate('createaoi');
    } else {
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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>{strings.selectAOItitle}</Text>
        <ScrollView>
          {this.renderDataList()}
        </ScrollView>
        <View style={styles.row}>
          <Icon
            raised
            reverse
            name='add-to-list'
            type='entypo'
            color='#8BC34A'
            size={30}
            onPress={this.onNewButtonPress.bind(this)}/>
        </View>

        <ConfirmDialog
            title={strings.deleteAOI}
            message={strings.confirmDeleteMessage}
            visible={this.state.showDeleteModal}
            color='#8BC34A'
            onTouchOutside={() => this.setState({ showDeleteModal: false })}
            positiveButton={{
                title: strings.yes,
                onPress: () => this.onDeletePressed()
            }}
            negativeButton={{
                title: strings.no,
                onPress: () => this.setState({ showDeleteModal: false })
            }}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8E6C9'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    padding: 15,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    margin: 30,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  name: {
    fontSize: 18
  },
  colName: { flex: 2 },
  colRight: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  colActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  containerButton: {
    flex: 1,
    margin: 30,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
});

const mapStateToProps = ({ geoZonesData, auth, network }) => {
  const { loading, currentAoiList, currentGzId, allAoisList } = geoZonesData;
  const { isConnected } = network;
  const { token } = auth;
  return { isConnected, loading, currentAoiList, currentGzId, allAoisList, token };
};

const myListAOIScreen = connect(mapStateToProps, {
  aoiListFetch,
  refreshSelectedAoi,
  deleteAOI,
  setLoadingMap,
  setMapAction
})(ListAOIScreen);

export { myListAOIScreen as ListAOIScreen };
