import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AnalysisFirst = ({route}) => {
  const {photo} = route.params;
  const navigation = useNavigation();
  useEffect(() => {
    console.log('전달된 사진 데이터:', photo);
    console.log('이미지 경로:', photo.path);
  }, [photo]);

  if (!photo || !photo.path) {
    // photo.uri 에서 photo.path로 수정
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>이미지를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const navigateToCameraScreen = () => {
    navigation.navigate('CameraScreen');
  };

  const navigateToLoading = () => {
    navigation.navigate('Loading');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={styles.text}>해당 사진으로 분석을 진행할까요?</Text>
        <Image source={{uri: 'file://' + photo.path}} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToLoading}>
          <Text style={styles.buttonText}>분석하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={navigateToCameraScreen}>
          <Text style={styles.buttonText}>다시 촬영하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 400,
  },
  text: {
    fontSize: 35, // 이미지와 텍스트 사이의 간격 조절
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  button2: {
    width: '100%',
    height: 50,
    backgroundColor: '#808682f4',
    borderColor: '#f0f2f5',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 32,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AnalysisFirst;
