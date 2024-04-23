import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ImageFullScreen = ({route}) => {
  const {imageUri} = route.params;
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <TouchableOpacity
        style={{position: 'absolute', top: 20, left: 20, zIndex: 1}}
        onPress={handleGoBack}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <Image
        source={{uri: imageUri}}
        style={{flex: 1, resizeMode: 'contain'}}
      />
    </View>
  );
};

export default ImageFullScreen;
