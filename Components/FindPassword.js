import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // useNavigation을 import 합니다.
import axios from 'axios';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); // useNavigation을 사용하여 navigation 객체를 가져옵니다.

  const isEmailValid = email => {
    // 이메일 형식을 검증하는 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFindPassword = async () => {
    const containsCom = email.includes('.com');
    const containsNet = email.includes('.net');

    if (
      !isEmailValid(email) ||
      (containsCom && containsNet) ||
      (!containsCom && !containsNet)
    ) {
      Alert.alert('경고', '올바르지 않은 이메일 형식입니다.');
      return;
    }

    try {
      // 백엔드로 POST 요청 보내기
      const response = await axios.post(
        'http://ceprj.gachon.ac.kr:60020/user/findpwd',
        {
          loginId: email, // 이메일을 보냅니다. loginId는 백엔드에서 필요한 필드 이름으로 바꿔주세요.
        },
      );

      // 응답 처리
      console.log(response.data); // 응답에 유용한 데이터가 있다고 가정합니다.
      // 필요한 경우 ChangePassword 화면으로 이동합니다.
      navigation.navigate('ChangePassword', {email: email}); // 여기에 코드 추가
    } catch (error) {
      Alert.alert('경고', '존재하지 않는 이메일입니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이메일을 입력해주세요</Text>

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="이메일"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity style={styles.button} onPress={handleFindPassword}>
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>뒤로 가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F2FD', // 인디고 블루 배경색
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    fontSize: 18,
    color: '#3f51b5', // 인디고 블루 색상
    fontWeight: 'bold',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#3f51b5', // 인디고 블루 테두리 색상
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: '#FFF',
    color: '#000',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3f51b5', // 인디고 블루 버튼 색상
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
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

export default FindPassword;
