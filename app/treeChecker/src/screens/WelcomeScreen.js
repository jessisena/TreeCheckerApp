import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { strings } from './strings.js';


class WelcomeScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarVisible: false
  });

  initApp() {
    const { navigation, token } = this.props;
    if (token !== -1) {
      navigation.navigate('gzflow');
    } else {
      navigation.navigate('initflow');
    }
  }

  render() {
    const src = require('./resources/img/tree3.jpg');

    return (
      <Image source={src} style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Canhemon App</Text>
          <Text style={styles.subtitle}>{strings.Welcome}</Text>
              <Button
                buttonStyle={styles.button}
                iconRight
                icon={{ name: 'replay' }}
                onPress={this.initApp.bind(this)}
                backgroundColor='#388E3C'
                title={strings.start} />
        </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#C8E6C9'
  },
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%'
  },
  subtitle: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%'
  },
  button: {
    marginTop: 50
  }
});

const mapStateToProps = ({ auth }) => {
const { token } = auth;
return { token };
};

const myWelcomeScreen = connect(mapStateToProps, {
  // checkToken
})(WelcomeScreen);

export { myWelcomeScreen as WelcomeScreen };
