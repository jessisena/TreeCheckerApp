import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { ConnectivityRenderer } from 'react-native-offline';

import { usernameChanged, passwordChanged, loginUser } from '../actions';
import { MySpinner, CardSection } from '../components/common';
import { strings } from './strings.js';


class LoginScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    //title: 'Log In',
    //headerRight: <Button color={screenProps.tintColor} {...} />,
    header: null
  });

  onUsernameChanged(text) {
    this.props.usernameChanged(text);
  }

  onPasswordChanged(text) {
	//console.log(text);
	this.props.passwordChanged(text);
  }

  onButtonPress() {
    const { username, password, navigation } = this.props;
    console.log(username);
    console.log(password);
    this.props.loginUser({ username, password, navigation });
  }

  renderButton() {
    if (this.props.loading) {
      return <MySpinner size="large" mystyle={styles.ContButtonStyle} />;
    }

    return (
      <Button
        containerViewStyle={styles.ContButtonStyle}
        backgroundColor='#8BC34A'
        title={strings.login}
        underlayColor='#c2c2c2'
        // iconRight
        // icon={{ name: 'login', font: 'simple-line-icon' }}
        onPress={this.onButtonPress.bind(this)}
      />
    );
  }

  render() {
    const src = require('./resources/img/tree3.jpg');
    return (
      <Image source={src} style={styles.container}>
      <View style={styles.containerForm}>
        <FormLabel labelStyle={styles.labelStyle}>{strings.Username}</FormLabel>
        <FormInput
          underlineColorAndroid='#8BC34A'
          placeholder={strings.username}
          onChangeText={this.onUsernameChanged.bind(this)}
          value={this.props.username}
        />

        <FormLabel labelStyle={styles.labelStyle}>{strings.Password}</FormLabel>
        <FormInput
          secureTextEntry
          placeholder={strings.password}
          onChangeText={this.onPasswordChanged.bind(this)}
          value={this.props.password}
        />
        <FormValidationMessage labelStyle={styles.errorTextStyle}>{this.props.error}</FormValidationMessage>
        <ConnectivityRenderer>
          {isConnected => (
            isConnected ? (
              this.renderButton()
            ) : (
              <CardSection>
                <Icon name='warning' color='#757575' size={32} containerStyle={{ marginRight: 8 }}/>
                <Text style={styles.labelName}>{strings.connectionNeeded}</Text>
              </CardSection>
            )
          )}
        </ConnectivityRenderer>
      </View>
      </Image>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
  },
  containerForm: {
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: 2,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 10,
      marginBottom: 10,
  },
  containerWarning: {
    flex: 1,
    flexDirection: 'column',

  },
  warning: {
    flexDirection: 'row'
  },
  labelName: {
    fontSize: 18,
    color: '#D32F2F'
  },
  errorTextStyle: {
    marginTop: 5,
    fontSize: 16,
    alignSelf: 'center',
    color: '#D32F2F'
  },
  labelStyle: {
    fontSize: 20
  },
  ContButtonStyle: {
    margin: 30
  }
};

const mapStateToProps = ({ auth, network }) => {
  const { username, password, error, loading } = auth;
  const { isConnected } = network;

  return { username, password, error, loading, isConnected };
};

const myLoginScreen = connect(mapStateToProps, {
  usernameChanged,
  passwordChanged,
  loginUser
})(LoginScreen);

export { myLoginScreen as LoginScreen };
