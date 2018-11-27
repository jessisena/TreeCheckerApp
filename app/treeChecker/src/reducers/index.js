import { combineReducers } from 'redux';
import { reducer as network } from 'react-native-offline';
import AuthReducer from './AuthReducer';
import GeoZonesReducer from './GeoZonesReducer';
import MapDataReducer from './MapDataReducer';
import DataFormReducer from './DataFormReducer';
import SelectFormReducer from './SelectFormReducer';


export default combineReducers({
	auth: AuthReducer,
	geoZonesData: GeoZonesReducer,
	mapData: MapDataReducer,
	obsData: DataFormReducer,
	selectFormData: SelectFormReducer,
	network
});

// // import { NavigationActions } from 'react-navigation';
//
// import { AppNavigator } from '../navigators/AppNavigator';
//
// // Start with two routes: The Main screen, with the Login screen on top.
// // const firstAction = AppNavigator.router.getActionForPathAndParams('welcome');
// // const tempNavState = AppNavigator.router.getStateForAction(firstAction);
// // const secondAction = AppNavigator.router.getActionForPathAndParams('Login');
// // const initialNavState = AppNavigator.router.getStateForAction(
// //   secondAction,
// //   tempNavState
// // );
//
// // function nav(state, action) {
// //   let nextState;
// //   switch (action.type) {
// //     // case 'Login':
// //     //   nextState = AppNavigator.router.getStateForAction(
// //     //     NavigationActions.back(),
// //     //     state
// //     //   );
// //     //   break;
// //     // case 'Logout':
// //     //   nextState = AppNavigator.router.getStateForAction(
// //     //     NavigationActions.navigate({ routeName: 'Login' }),
// //     //     state
// //     //   );
// //     //   break;
// //     default:
// //       nextState = AppNavigator.router.getStateForAction(action, state);
// //       break;
// //   }
// //
// //   // Simply return the original `state` if `nextState` is null or undefined.
// //   return nextState || state;
// // }
//
// // const initialAuthState = { isLoggedIn: false };
// //
// // function auth(state = initialAuthState, action) {
// //   switch (action.type) {
// //     case 'Login':
// //       return { ...state, isLoggedIn: true };
// //     case 'Logout':
// //       return { ...state, isLoggedIn: false };
// //     default:
// //       return state;
// //   }
// // }
//
// const navReducer = (state, action) => {
//     const newState = AppNavigator.router.getStateForAction(action, state);
//     return newState || state;
// };
//
// const AppReducer = combineReducers({
//   nav: navReducer,
// 	auth: AuthReducer,
// 	geoZonesData: GeoZonesReducer,
// 	mapData: MapDataReducer,
// 	obsData: DataFormReducer,
// 	selectFormData: SelectFormReducer,
// 	network
// });
//
// export default AppReducer;
