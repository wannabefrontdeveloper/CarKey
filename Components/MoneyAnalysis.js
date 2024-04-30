import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 확대경 아이콘을 위해 MaterialIcons 사용
import {useNavigation} from '@react-navigation/native';

const MoneyAnalysis = () => {
  const [isSaved, setIsSaved] = useState(false); // 저장 상태를 관리하는 상태 변수

  // 이미지나 텍스트에 대한 이벤트 핸들러를 필요에 따라 여기에 정의합니다.
  const navigation = useNavigation();

  const navigateToBoard = () => {
    navigation.navigate('Board');
  };

  const handleSaveAnalysis = () => {
    // 분석 내역 저장하기 버튼을 눌렀을 때의 동작을 정의합니다.
    Alert.alert(
      '저장 성공',
      '저장이 완료되었습니다! \n\n저장하신 내역은 마이페이지 내 분석 내역 조회 메뉴에서 조회 가능합니다. ',
      [
        {
          text: '확인',
          onPress: () => {
            setIsSaved(true); // 저장이 완료되면 버튼을 비활성화합니다.
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
        source={require('../assets/Dent2.png')} // 올바른 이미지 경로로 교체하세요.
        style={styles.mapImage}
      />
      {/* 아이콘과 설명을 추가하는 섹션 시작 */}
      <View style={styles.analysisSection}>
        <Icon name="child-care" size={60} color="#000" />
        <View style={styles.balloon}>
          <Text style={styles.analysisText}>
            예상 수리비는 3400000원 입니다!
          </Text>
        </View>
      </View>
      {/* 아이콘과 설명을 추가하는 섹션 끝 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isSaved && styles.disabledButton, // 저장되었으면 disabled 스타일을 적용합니다.
          ]}
          onPress={handleSaveAnalysis}
          disabled={isSaved} // 저장되었으면 버튼을 비활성화합니다.
        >
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
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
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
    alignSelf: 'stretch', // 컨테이너의 너비를 화면 너비에 맞춥니다.
    marginBottom: 20, // 컨테이너 하단에 여백 추가
  },
  button: {
    backgroundColor: '#8c10eb',
    padding: 15,
    borderRadius: 5,
    flex: 1, // 컨테이너 내에서 동일한 비율로 공간을 차지하도록 설정합니다.

    justifyContent: 'center',
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flex: 1, // 컨테이너 내에서 동일한 비율로 공간을 차지하도록 설정합니다.
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
    marginTop: -40, // 버튼과의 간격을 위해 추가
    marginBottom: 29,
  },
  analysisText: {
    marginLeft: 10, // 아이콘과 텍스트 사이의 간격을 위해 추가
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
    backgroundColor: '#ccc', // 비활성화된 버튼의 배경색
  },
});

export default MoneyAnalysis;
