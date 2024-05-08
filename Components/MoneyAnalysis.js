import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useResponse} from './ResponseContext';
import {useState} from 'react';

const MoneyAnalysis = () => {
  const navigation = useNavigation();
  const {responseData} = useResponse(); // ResponseContext 사용
  console.log('서버에서 받은 데이터:', responseData);

  const [isSaved, setIsSaved] = useState(false);

  const navigateToBoard = () => {
    navigation.navigate('Board');
  };

  const handleSaveAnalysis = () => {
    Alert.alert(
      '저장 성공',
      '저장이 완료되었습니다! \n\n저장하신 내역은 마이페이지 내 분석 내역 조회 메뉴에서 조회 가능합니다. ',
      [
        {
          text: '확인',
          onPress: () => {
            setIsSaved(true);
            console.log('저장 완료');
          },
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>수리비 분석 결과</Text>
      </View>
      <Image
        source={{
          uri: `http://localhost:8080/image/ai/original/${responseData.data.originalImg}`,
        }}
        style={styles.mapImage}
      />
      <View style={styles.analysisSection}>
        <Icon name="child-care" size={60} color="#000" />
        <View style={styles.balloon}>
          <Text style={styles.analysisText}>
            예상 수리비는 {responseData.data.totalPrice}원 입니다!
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isSaved && styles.disabledButton]}
          onPress={handleSaveAnalysis}
          disabled={isSaved}>
          <Text style={styles.buttonText}>분석 내역 저장하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={navigateToBoard}>
          <Text style={styles.buttonText}>홈으로 이동</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4d91da',
    paddingHorizontal: 10,
    marginBottom: 100,
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 50,
    fontWeight: 'bold',
  },
  mapImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginLeft: 5,
    marginBottom: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8c10eb',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  analysisSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
    marginBottom: 29,
  },
  analysisText: {
    marginLeft: 10,
    fontSize: 25,
    color: '#000',
  },
  balloon: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default MoneyAnalysis;
