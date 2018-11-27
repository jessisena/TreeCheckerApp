import { TabNavigator, StackNavigator } from 'react-navigation';
import {
	LoginScreen,
	WelcomeScreen,
	WalkthroughScreen,
	SelectGZScreen,
	ListAOIScreen,
	CreateAOIScreen,
	MapScreen,
	ListDataScreen,
	CreateDataScreen,
	EditDataScreen,
	DetailDataScreen,
	MenuScreen,
	ProfileScreen
} from '../screens';
import { strings } from '../screens/strings.js';

const InitFlow = StackNavigator({
	login: { screen: LoginScreen }
});

const gzFlow = StackNavigator({
	selectgz: { screen: SelectGZScreen }
}, {
	navigationOptions: {
		headerTintColor: '#ffffff',
		headerStyle: { backgroundColor: '#4CAF50' },
		headerTitleStyle: { width: '80%' },
	}
});

const aoiFlow = StackNavigator({
	listaoi: { screen: ListAOIScreen },
	createaoi: { screen: CreateAOIScreen }
}, {
	navigationOptions: {
		headerTintColor: '#ffffff',
		headerStyle: { backgroundColor: '#4CAF50' },
		headerTitleStyle: { width: '80%' },
	}
});

const MapFlow = TabNavigator({
	map: { screen: MapScreen },
	listdata: { screen: ListDataScreen }
}, {
	animationEnabled: true,
	swipeEnabled: false,
	tabBarVisible: true,
	tabBarPosition: 'top',
	tabBarOptions: {
		indicatorStyle: {
			backgroundColor: '#b2ff59'
		},
		activeTintColor: '#ffffff',
		activeBackgroundColor: '#4CAF50',
		inactiveTintColor: '#C8E6C9',
		inactiveBackgroundColor: '#C8E6C9',
		labelStyle: {
			fontSize: 16,
		},
		style: {
			backgroundColor: '#4CAF50',
		}
	}
});

const Menu = StackNavigator({
	menu: { screen: MenuScreen }
}, {
	mode: 'modal',
	navigationOptions: {
		title: `${strings.menu}`,
		headerTintColor: '#ffffff',
		headerStyle: { backgroundColor: '#4CAF50' },
		headerTitleStyle: { width: '80%' },
	}
});

const Routes = {
  welcome: { screen: WelcomeScreen },
  initflow: { screen: InitFlow },
	walkthrough: { screen: WalkthroughScreen },
  gzflow: { screen: gzFlow },
	aoiflow: { screen: aoiFlow },
  mapflow: { screen: MapFlow },
	detaildata: { screen: DetailDataScreen },
	editdata: { screen: EditDataScreen },
	createdata: { screen: CreateDataScreen },
	menu: { screen: Menu },
	profile: { screen: ProfileScreen }
};

export default Routes;
