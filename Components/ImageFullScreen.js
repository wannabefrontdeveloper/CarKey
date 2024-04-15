import React from 'react';
import {View, Image} from 'react-native';

const ImageFullScreen = ({route}) => {
  const {imageUri} = route.params;

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <Image
        source={{uri: imageUri}}
        style={{flex: 1, resizeMode: 'contain'}}
      />
    </View>
  );
};

export default ImageFullScreen;
