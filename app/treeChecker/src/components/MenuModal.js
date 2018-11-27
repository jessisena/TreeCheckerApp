import React from 'react';
import { Text, Modal } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { strings } from '../screens/strings.js';

const MenuModal = ({ visible, onClosed, toProfile }) => {

  return (
    <Modal
     style={styles.modal}
     visible={visible}
     onRequestClose={onClosed}
    >
      <Text>Show Modal</Text>
     <List>
       <ListItem
          key='1'
          title={strings.yourprof}
          leftIcon={{ name: 'user', type: 'font-awesome' }}
          onPress={toProfile}
       />
       <ListItem
         key='2'
         title={strings.tutorial}
         leftIcon={{ name: 'info-circle', type: 'font-awesome' }}
       />
       <ListItem
         key='3'
         title={strings.changeRegion}
         leftIcon={{ name: 'exchange', type: 'font-awesome' }}
       />
    </List>
   </Modal>
  );
};

const styles = {
  cardSelectionStyle: {
    justifyContent: 'center'
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40
  },
  containerStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    justifyContent: 'center'
  }
};

export { MenuModal };
