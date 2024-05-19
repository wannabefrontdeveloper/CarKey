import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useResponse} from './ResponseContext';

const ScratchAnalysis = () => {
  const navigation = useNavigation();
  const {responseData} = useResponse();

  useEffect(() => {
    console.log('Analysis Data:', responseData);
  }, [responseData]);

  const navigateToCameraScreen = () => {
    navigation.navigate('CameraScreen');
  };

  const navigateToDentAnalysis = () => {
    navigation.navigate('DentAnalysis');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>스크래치 분석 결과</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `http://ceprj.gachon.ac.kr:60020/image/ai/scratch/${responseData.data.scratchImg}`,
          }}
          style={styles.mapImage}
        />
      </View>
      <View style={styles.analysisSection}>
        <Icon name="sentiment-very-satisfied" size={60} color="#131212" />
        <View style={styles.balloon}>
          <Text style={styles.analysisText}>
            빨간색 부위가 스크래치를 뜻합니다!
            {'\n'}
            없다면 손상되지 않았다는 뜻이죠~!
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToCameraScreen}>
          <Text style={styles.buttonText}>다시 촬영하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={navigateToDentAnalysis}>
          <Text style={styles.buttonText}>덴트 분석 보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  analysisSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  analysisText: {
    marginLeft: 10,
    fontSize: 20,
    color: '#000',
  },
  balloon: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#9e9fa8',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  button2: {
    backgroundColor: '#3f51b5',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScratchAnalysis;
