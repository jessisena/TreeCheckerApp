import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import Slides from '../components/Slides.js';
import { strings } from './strings.js';


export const SLIDE_DATA = [
  {
    pageID: 0,
    title: `${strings.regionOfInterest}`,
    text: `${strings.regionOfInterestWTText}`,
    imgFile: require('./resources/img/selectGZ2.png')
  },
  { pageID: 1,
    title: `${strings.areaOfInterest}`,
    text: `${strings.areaOfInterestWTText}`,
    imgFile: require('./resources/img/aoiList2.png')
  },
  {
    pageID: 2,
    title: `${strings.createAOI1}`,
    text: `${strings.createAOI1WTText}`,
    imgFile: require('./resources/img/createAOI2.png')
  },
  {
    pageID: 3,
    title: `${strings.createAOI1}`,
    text: `${strings.createAOI2WTText}`,
    imgFile: require('./resources/img/nameAOI2.png')
  },
  {
  pageID: 4,
  title: `${strings.mapWTTitle}`,
  text: `${strings.mapWTText}`,
  imgFile: require('./resources/img/mapView2.png')
  },
  {
  pageID: 5,
  title: `${strings.dataWTTitle}`,
  text: `${strings.dataWTText}`,
  imgFile: require('./resources/img/dataView2.png')
  },
  {
  pageID: 6,
  title: `${strings.detailWTTitle}`,
  text: `${strings.detailWTText}`,
  imgFile: require('./resources/img/viewSD2.png')
  },
  {
  pageID: 7,
  title: `${strings.editWTTitle}`,
  text: `${strings.editWTText}`,
  imgFile: require('./resources/img/editSD2.png')
  },
  {
  pageID: 8,
  title: `${strings.menu}`,
	imgFile: require('./resources/img/menu2.png'),
  text: `${strings.menuWTText}`,
  }
];

class WalkthroughScreen extends Component {

	static navigationOptions = ({ navigation, screenProps }) => ({
		header: null,
    tabBarVisible: false
  });

	onSkipButtonPress() {
    console.log('onSkipButtonPress');
		this.props.navigation.navigate('gzflow');
  }

  render() {
		console.debug(SLIDE_DATA);
    return (
    <View style={styles.container}>
		  <Slides data={SLIDE_DATA} navigation={this.props.navigation} />
    </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { WalkthroughScreen };
