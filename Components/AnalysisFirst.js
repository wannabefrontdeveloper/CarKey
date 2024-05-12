import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useToken} from './TokenContext';
import {useResponse} from './ResponseContext';
import {Alert} from 'react-native';

const AnalysisFirst = ({route}) => {
  const {photo} = route.params;
  const navigation = useNavigation();
  const {storedToken} = useToken();
  console.log('현재 토큰값:', storedToken);
  const {updateResponseData} = useResponse(); // ResponseContext 사용

  useEffect(() => {
    console.log('전달된 사진 데이터:', photo);
    console.log('이미지 경로:', photo.path);
  }, [photo]);

  const handleAnalysis = async () => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: 'file://' + photo.path,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      console.log('Request Data:', formData);
      navigation.navigate('Loading');
      const response = await axios.post(
        'http://localhost:8080/user/analyze/cost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      console.log('Response:', response.data);

      if (response.data.success === 'False') {
        // 분석 실패 시 알림창 띄우기
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
        // 성공적으로 분석이 완료된 경우
        // 서버 응답 값을 ResponseProvider를 통해 공유
        updateResponseData(response.data);
        // 분석 결과에 따라 다음 화면으로 이동하거나 작업 수행
      }
    } catch (error) {}
  };

  const navigateToCameraScreen = () => {
    navigation.navigate('CameraScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={styles.text}>해당 사진으로 분석을 진행할까요?</Text>
        <Image source={{uri: 'file://' + photo.path}} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAnalysis}>
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
    fontSize: 35,
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
