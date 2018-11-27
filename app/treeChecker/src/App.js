import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { withNetworkConnectivity } from 'react-native-offline';
import { StackNavigator } from 'react-navigation';
import Routes from './navigators/routes';
import getStore from './navigators/store';

class App extends Component {

  render() {
		const store = getStore();

		let HomeNav = StackNavigator(Routes, {
			headerMode: 'none'
		});

		HomeNav = withNetworkConnectivity({
			withRedux: true
		})(HomeNav);

    return (
      <Provider store={store}>
				<HomeNav navigation={this.props.navigation} />
      </Provider>
    );
  }
}

export default App;
