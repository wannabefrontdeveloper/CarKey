import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const DetailScreen = ({route}) => {
  const {username, date, text} = route.params;
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View>
      <Text>{username}</Text>
      <Text>{date}</Text>
      <Text>{text}</Text>
      <TouchableOpacity onPress={handleGoBack}>
        <Text>뒤로 가기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailScreen;
