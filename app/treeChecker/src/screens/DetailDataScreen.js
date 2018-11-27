import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  ViewPagerAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import RNFS from 'react-native-fs';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { NavigationActions } from 'react-navigation';

import { CardSection } from '../components/common';
import { strings } from './strings.js';
import { deleteObsLocal, deleteObsServer, setLoadingMap, setMapAction } from '../actions';

class DetailDataScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarVisible: false
  });

state = { showDeleteModal: false, item: {}, currentSlide: 0 };

  onPressEdit() {
    this.props.navigation.navigate('editdata');
  }

  async onPressDeleteObs() {
    const { currentObs, currentAoiId, token, currentGzId } = this.props;
    this.setState({ showDeleteModal: false })
    await this.props.deleteObsLocal(currentObs.key, currentAoiId);
    this.props.deleteObsServer(`deleted_${currentObs.key}`, currentObs.name, currentGzId, currentAoiId, token, false);

    const backAction = NavigationActions.back({
      key: 'listdata'
    })
    this.props.navigation.dispatch(backAction);
    this.props.navigation.goBack(null);
  }

  renderButtons (currentObs) {
    return (
      <View style={styles.rowButtons}>
            <Button
              iconRight
              buttonStyle={{ borderColor: '#D32F2F', borderWidth: 1 }}
              backgroundColor='#ffffff'
              color='#D32F2F'
              onPress={() => this.setState({ showDeleteModal: !this.state.showDeleteModal })}
              icon={{ name: 'trash', type: 'font-awesome', color: '#D32F2F' }}
              title={strings.delete} />

              <Button
                iconRight
                buttonStyle={{ borderColor: '#8BC34A', borderWidth: 1 }}
                backgroundColor='#ffffff'
                color='#8BC34A'
                onPress={this.onPressEdit.bind(this)}
                icon={{ name: 'edit', color: '#8BC34A' }}
                title={strings.edit} />

            <Button
              iconRight
              backgroundColor='#8BC34A'
              onPress={() => this.goToMap(currentObs)}
              icon={{ name: 'map', type: 'font-awesome' }}
              title={strings.goto} />
      </View>
    );
  }

  goToMap(currentObs) {
    this.props.setLoadingMap(true);
    this.props.setMapAction({ action: 'goTo', latitude: currentObs.position.latitude, longitude: currentObs.position.longitude });
    const resetAction = NavigationActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({ routeName: 'gzflow' }),
        NavigationActions.navigate({ routeName: 'aoiflow' }),
        NavigationActions.navigate({ routeName: 'mapflow' })
      ]
    })
    this.props.navigation.dispatch(resetAction);
  }

  renderComment(comment) {
    if (comment !== null && comment !== '') {
      return (
        <CardSection>
          <Text style={styles.valueName}>{comment}</Text>
        </CardSection>
      );
    }
  }

  renderData(currentObs) {
    return (
        <ScrollView>
          <CardSection>
            <Text style={styles.labelName}>{strings.treeSpecies}</Text>
            <Text style={styles.valueName}>{currentObs.tree_specie.name}</Text>
          </CardSection>
          <CardSection>
            <Text style={styles.labelName}>{strings.crown}</Text>
            <Text style={styles.valueName}>{currentObs.crown_diameter.name}</Text>
          </CardSection>
          <CardSection>
            <Text style={styles.labelName}>{strings.canopy}</Text>
            <Text style={styles.valueName}>{currentObs.canopy_status.name}</Text>
          </CardSection>
          {this.renderComment(currentObs.comment)}
        </ScrollView>

    );
  }

  renderImg(img) {
    const imgUri = (img.uri ? img.uri : `file://${RNFS.ExternalDirectoryPath}/pictures${img.url}` );
    return (
      <View
        keyExtractor={(myimg) => myimg.key}
        style={styles.imgContStyle}
      >
        <Image style={styles.imgStyle} source={{ uri: imgUri }} />
      </View>
    );
  }

  renderImages() {
    const { images } = this.props.currentObs;

    if (images.length === 0) {
      return (
        <View style={styles.imgContStyle}>
          <Image style={styles.imgStyle} source={require('./resources/img/noimage4.png')} />
        </View>
      );
    }

		return images.map((img) =>
			this.renderImg(img)
		);
	}

  updatePagination(e) {
		if (e.nativeEvent.position === (this.props.currentObs.images.length - 1)) this.setState({ currentSlide: e.nativeEvent.position });
		else this.setState({ currentSlide: e.nativeEvent.position });
	}

  renderPagination() {
		const pages = [];
		const size = this.props.currentObs.images.length;

		for (let i = 0; i < size; i++) {
			if (i === this.state.currentSlide) {
				pages.push(<View style={{ backgroundColor: '#ffffff', borderRadius: 10, width: 10, height: 10, marginRight: 1, marginLeft: 1 }} />);
			} else {
				pages.push(<View style={{ backgroundColor: '#8BC34A', borderRadius: 10, width: 10, height: 10, marginRight: 1, marginLeft: 1 }} />);
			}
		}

		return (
			<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 2, marginTop: 2 }}>
				{pages}
			</View>
		);
	}

  render() {
    const { currentObs } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <ViewPagerAndroid
            initialPage={0}
            style={styles.ContPager}
            onPageSelected={this.updatePagination.bind(this)}
          >
            {this.renderImages()}
          </ViewPagerAndroid>
          {this.renderPagination()}

          <Text style={styles.labelHeader}>{currentObs.name}</Text>
        </View>

        <View style={styles.containerBottom}>
          {this.renderData(currentObs)}
          {this.renderButtons(currentObs)}
        </View>

        <ConfirmDialog
            title={strings.deleteObservation}
            message={strings.confirmDeleteMessage}
            visible={this.state.showDeleteModal}
            onTouchOutside={() => this.setState({ showDeleteModal: false })}
            positiveButton={{
                title: strings.yes,
                onPress: () => this.onPressDeleteObs()
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  containerTop: {
    flex: 1,
    width: '100%',
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 75,
    borderBottomLeftRadius: 75,
    borderWidth: 1,
    borderColor: '#8BC34A'
  },
  containerBottom: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  ContPager: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
  imgContStyle: {
		padding: 5,
    alignItems: 'center',
	},
  imgStyle: {
    width: '80%',
    flex: 1,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  labelHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#ffffff',
    padding: 2
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginTop: 10
  },
  labelName: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'justify',
  },
  valueName: {
    flex: 2,
    fontSize: 18,
    textAlign: 'justify',
  }
});


const mapStateToProps = ({ mapData, auth, geoZonesData }) => {
  const { token } = auth;
  const { currentObs, currentAoiId } = mapData;
  const { currentGzId } = geoZonesData;
  return { currentObs, currentAoiId, token, currentGzId };
};

const myDetailDataScreen = connect(mapStateToProps, {
  deleteObsLocal,
  deleteObsServer,
  setLoadingMap,
  setMapAction
})(DetailDataScreen);

export { myDetailDataScreen as DetailDataScreen };
