import _ from 'lodash';
import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Picker,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { FormLabel, FormInput, Card as CardNative, Button, Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import RNSimpleCompass from 'react-native-simple-compass';
import RNFS from 'react-native-fs';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Autocomplete from 'react-native-autocomplete-input';

import { CardSectionCol } from '../components/common';
import { obsUpdate } from '../actions';
import { strings } from '../screens/strings.js';


class EditDataForm extends Component {

  state = {
    showModal: false,
    item: {},
    treeList: Object.values(this.props.treeSpeciesList), //[]
  };

  componentDidMount() {
    this.props.obsUpdate({ prop: 'tmp_treeSpecieName', value: this.props.treeSpeciesList[this.props.tree_specie].name });
  }

  onPressDeleteImage() {
    const { item } = this.state;
    // console.debug('deleteimage item', item);
    const imgArray = [...this.props.images];
    _.remove(imgArray, item);
    this.props.obsUpdate({ prop: 'images', value: imgArray })
    this.setState({ showModal: false });
  }

  _renderImageItem = ({ item }) => {
    const img_uri = (item.uri ? item.uri : `file://${RNFS.ExternalDirectoryPath}/pictures${item.url}` );
    return (
    <CardNative
      containerStyle={{ elevation: 0, borderWidth: 0, backgroundColor: '#ffffff', paddingTop: 0, marginTop: 0 }}
      image={{ uri: img_uri }}
      imageStyle={{ paddingTop: 0, marginTop: 0 }}
      >
      <Button
        buttonStyle={{ borderColor: '#D32F2F', borderWidth: 1 }}
        backgroundColor='#ffffff'
        color='#D32F2F'
        onPress={() => this.setState({ showModal: !this.state.showModal, item })}
        iconRight
        icon={{ name: 'trash', type: 'font-awesome', color: '#D32F2F' }}
        title={strings.delete}/>
    </CardNative>
    );
  }

  async addPicture() {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
        noData: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        //console.debug('User cancelled image picker');
      } else if (response.error) {
        //console.debug('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        //console.debug('User tapped custom button: ', response.customButton);
      } else {
        RNSimpleCompass.start(3, (degree) => {
          RNSimpleCompass.stop();
          const imgArray = [...this.props.images];
          imgArray.push({
            url: response.path,
            uri: response.uri,
            key: `new_${response.fileName}`,
            compass: degree,
            type: response.type
          });
          this.props.obsUpdate({ prop: 'images', value: imgArray })
        }, err => console.debug('error compass', err));
      }
    });
  }

  renderImagesSection() {
    return (
      <CardSectionCol >
        <View style={styles.row}>
          <Text style={styles.labelName}>{strings.photo}</Text>
          <Icon
            raised
            reverse
            size={20}
            color='#8BC34A'
            name='add-a-photo'
            type='material-icons'
            onPress={this.addPicture.bind(this)} />
        </View>
        <FlatList
          data={this.props.images}
          extraData={this.props.images}
          horizontal
          keyExtractor={(item) => item.key}
          renderItem={this._renderImageItem}
        />
      </CardSectionCol>
    );
  }

  renderPicker(list, propLabel, selectedVal) {
    const pick = [];
    for (let [key, item] of Object.entries(list)) {
      pick.push(<Picker.Item key={item.key} label={item.name} value={item.key} />);
    }

    return (
      <Picker
        style={{ flex: 1 }}
        selectedValue={selectedVal}
        onValueChange={value => this.props.obsUpdate({ prop: propLabel, value })}
      >
      { pick }
      </Picker>
    );
  }

  onPressTreeSpecie(key, name) {
    this.props.obsUpdate({ prop: 'tree_specie', value: key });
    this.props.obsUpdate({ prop: 'tmp_treeSpecieName', value: name });
    this.setState({ treeName: name })
  }

  findTreeSpecie(treeName) {
    if (treeName === '') {
      return [];
    }
    const { treeList } = this.state;
    const regex = new RegExp(`${treeName.trim()}`, 'i');
    return treeList.filter(tree => tree.name.search(regex) >= 0);
  }

  onChangeTextTreeSpecie(text) {
    this.props.obsUpdate({ prop: 'tmp_treeSpecieName', value: text });
    this.setState({ treeName: text })
  }

  renderForm() {
    const treeName = this.props.tmp_treeSpecieName;
    const treeList = this.findTreeSpecie(treeName);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return(
      <View style={{ width: '100%' }}>

            <CardSectionCol style={{ flex: 1 }}>
              <FormLabel labelStyle={styles.labelName}>{strings.name}</FormLabel>
              <FormInput
                underlineColorAndroid='#8BC34A'
                value={this.props.name}
                onChangeText={value => this.props.obsUpdate({ prop: 'name', value })}
              />
            </CardSectionCol>

            <CardSectionCol style={{ flex: 1, paddingRight: 10, paddingLeft: 25 }}>
                <Text style={styles.labelName}>{strings.treeSpecie}</Text>
                  <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    defaultValue={treeName}
                    containerStyle={styles.autocompleteContainer}
                    inputContainerStyle={{ borderWidth: 0}}
                    listContainerStyle={{ zIndex: 1 }}
                    data={treeList.length === 1 && comp(treeName, treeList[0].name) ? [] : treeList}
                    onChangeText={text => this.onChangeTextTreeSpecie(text)}
                    renderItem={({ key, name }) => (
                     <TouchableOpacity onPress={() => this.onPressTreeSpecie(key, name)}>
                       <Text >
                         {name}
                       </Text>
                     </TouchableOpacity>
                   )}
                  />
            </CardSectionCol>

            <View style={{ flexDirection: 'row', paddingRight: 10, paddingLeft: 25 }}>
              <CardSectionCol style={{ flex: 1 }}>
                <Text style={styles.labelName}>{strings.crown}</Text>
                {this.renderPicker(this.props.crownList, 'crown_diameter', this.props.crown_diameter)}
              </CardSectionCol>

              <CardSectionCol style={{ flex: 1 }}>
                <Text style={styles.labelName}>{strings.canopy}</Text>
                {this.renderPicker(this.props.canopyList, 'canopy_status', this.props.canopy_status)}
              </CardSectionCol>
            </View>

            <CardSectionCol style={{ flex: 1 }}>
              <FormLabel labelStyle={styles.labelName} >{strings.comment}</FormLabel>
              <FormInput
                multiline
                underlineColorAndroid='#8BC34A'
                returnKeyLabel='done'
                autogrow
                value={this.props.comment}
                onChangeText={value => this.props.obsUpdate({ prop: 'comment', value })}
              />
            </CardSectionCol>
            {this.renderImagesSection()}
      </View>
    );
  }

  onDecline() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <View>
        <ScrollView keyboardShouldPersistTaps='always' style={styles.containerScroll}>
          {this.renderForm()}
        </ScrollView>
        <ConfirmDialog
            title={strings.deleteImage}
            message={strings.confirmDeleteMessage}
            visible={this.state.showModal}
            onTouchOutside={() => this.setState({ showModal: false })}
            positiveButton={{
                title: strings.yes,
                onPress: () => this.onPressDeleteImage()
            }}
            negativeButton={{
                title: strings.no,
                onPress: () => this.setState({ showModal: false })
            }}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  containerScroll: {
    marginBottom: 2,
    flex: 1
  },
  paddingCol: {
    paddingRight: 10,
    paddingLeft: 25
  },
  labelName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#86939e'
  },
  valueName: {
    fontSize: 18
  },
  pickerTextStyle: {
    fontSize: 18,
    paddingLeft: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25
  },
  autocompleteContainer: {
    flex: 1,
    zIndex: 1
  }
});


const mapStateToProps = ({ obsData, selectFormData }) => {
  const { canopyList, crownList, treeSpeciesList } = selectFormData;
  const { name, tree_specie, tmp_treeSpecieName, crown_diameter, canopy_status, comment, position, images } = obsData;

  return { canopyList, crownList, treeSpeciesList, name, tree_specie, tmp_treeSpecieName, crown_diameter, canopy_status, comment, position, images };
};

export default connect(mapStateToProps, { obsUpdate })(EditDataForm);
