import React, {useState} from 'react';
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
import {useToken} from './TokenContext'; // TokenContext에서 useToken 가져오기

const MoneyAnalysis = () => {
  const navigation = useNavigation();
  const {responseData} = useResponse(); // ResponseContext 사용
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기
  console.log('토큰 값:', storedToken); // 토큰 값 콘솔 출력
  console.log('서버에서 받은 데이터:', responseData);

  const [isSaved, setIsSaved] = useState(false);

  const navigateToBoard = () => {
    navigation.navigate('Board');
  };

  const handleSaveAnalysis = () => {
    if (storedToken === null) {
      // 토큰값이 null인 경우 Alert를 띄웁니다.
      Alert.alert('알림', '회원만 가능한 메뉴입니다.', [{text: '확인'}], {
        cancelable: true,
      });
    } else {
      // 서버로 전송할 데이터 생성
      const analysisData = {
        // 이 부분은 실제 서버에서 요구하는 필드에 맞춰서 수정해야 합니다.
        originalImg: responseData.data.originalImg,
        scratchImg: responseData.data.scratchImg,
        crushedImg: responseData.data.crushedImg,
        totalPrice: responseData.data.totalPrice,
        // 필요한 다른 데이터 필드 추가
      };

      console.log('서버로 전송되는 데이터:', analysisData);

      fetch('http://ceprj.gachon.ac.kr:60020/user/analyze/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(analysisData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success === 'True') {
            Alert.alert(
              '저장 성공',
              '저장이 완료되었습니다! \n\n저장하신 내역은 마이페이지 내 분석 내역 조회 메뉴에서 조회 가능합니다.',
              [
                {
                  text: '확인',
                  onPress: () => {
                    setIsSaved(true);
                    console.log('저장 완료:', data);
                  },
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          } else {
            // 실패 처리
            Alert.alert('저장 실패', '저장에 실패했습니다. 다시 시도해주세요.');
          }
        })
        .catch(error => {
          console.error('저장 오류:', error);
          Alert.alert('저장 오류', '저장 과정에서 오류가 발생했습니다.');
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>수리비 분석 결과</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `http://ceprj.gachon.ac.kr:60020/image/ai/original/${responseData.data.originalImg}`,
          }}
          style={styles.mapImage}
        />
      </View>
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
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4d91da',
    paddingHorizontal: 10,
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
    marginVertical: 50,
  },
  mapImage: {
    width: '80%',
    height: '80%',
    transform: [{rotate: '90deg'}], // Rotate the image by 90 degrees
  },
  analysisSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  analysisText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  balloon: {
    backgroundColor: '#fff',
    padding: 10,
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
    backgroundColor: '#8c10eb',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default MoneyAnalysis;
