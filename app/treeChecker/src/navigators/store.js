import { compose, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import { createNetworkMiddleware } from 'react-native-offline';

import authMiddleware from '../actions/AuthActions';
import reducers from '../reducers';

export default function getStore() {
    const networkMiddleware = createNetworkMiddleware();

    const store = createStore(
      reducers,
      {},
      compose(applyMiddleware(networkMiddleware, authMiddleware, ReduxThunk),
      autoRehydrate())
    );

    persistStore(store, { storage: AsyncStorage, blacklist: ['obsData', 'mapData', 'network'] }, () => { /*log*/ });

    return store;
}
