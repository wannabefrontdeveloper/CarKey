import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useToken} from './TokenContext';
import {useResponse} from './ResponseContext';

const AnalysisFirst = ({route}) => {
  const {photo} = route.params;
  const navigation = useNavigation();
  const {storedToken} = useToken();
  const {updateResponseData} = useResponse();

  useEffect(() => {
    console.log('전달된 사진 데이터:', photo);
    console.log('이미지 경로:', photo.uri); // uri 속성을 사용하여 경로 출력
  }, [photo]);

  const handleAnalysis = async () => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri, // photo.uri를 사용하여 uri 속성 전달
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      console.log('Request Data:', formData);
      navigation.navigate('Loading');
      const response = await axios.post(
        'http://ceprj.gachon.ac.kr:60020/user/analyze/cost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Response:', response.data);

      if (response.data.success === 'False') {
        Alert.alert(
          '분석 실패',
          'AI가 분석에 실패하였습니다. 다시 촬영해주세요!',
          [
            {
              text: '홈으로 이동',
              onPress: () => navigation.navigate('Board'),
              style: 'cancel',
            },
            {
              text: '다시 촬영',
              onPress: () => navigation.navigate('CameraScreen'),
            },
          ],
        );
        navigation.navigate('Board');
      } else {
        updateResponseData(response.data);
      }
    } catch (error) {
      console.error('Error during analysis:', error);
    }
  };

  const navigateToCameraScreen = () => {
    navigation.navigate('CameraScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={styles.text}>해당 사진으로 분석을 진행할까요?</Text>
        <Image source={{uri: photo.uri}} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAnalysis}>
          <Text style={styles.buttonText}>분석하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
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
    backgroundColor: '#f5f5f5',
    paddingTop: 100, // 컨텐츠를 아래로 이동
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 15,
    borderWidth: 2,
  },
  text: {
    fontSize: 32,
    color: '#0f0f0f',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '5%',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3f51b5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 12,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: '#757de8',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AnalysisFirst;
