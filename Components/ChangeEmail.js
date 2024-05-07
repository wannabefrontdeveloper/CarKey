import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useToken} from './TokenContext';

const ChangeEmail = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기

  const isEmailValid = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFindPassword = async () => {
    if (!isEmailValid(email)) {
      Alert.alert('경고', '올바르지 않은 이메일 형식입니다.');
      return;
    }

    try {
      // 이메일 중복 체크 API 호출
      const checkDuplicateResponse = await axios.post(
        'http://localhost:8080/user/loginId/exists',
        {loginId: email},
      );

      if (checkDuplicateResponse.data.success === 'false') {
        // 이메일 중복이 발생한 경우 알림 표시
        Alert.alert('알림', '이미 사용 중인 이메일입니다.');
      } else {
        // 이메일 중복이 없는 경우 이메일 변경 요청 API 호출
        const changeEmailResponse = await axios.put(
          'http://localhost:8080/user/mypage/infoChange/loginId',
          {newLoginId: email},
          {
            headers: {
              Authorization: `Bearer ${storedToken}`, // 헤더에 토큰값 추가
            },
          },
        );
        console.log('내가 보내는 데이터:', {email: email}); // 보낸 데이터 콘솔 출력
        console.log('서버에서 받은 데이터:', checkDuplicateResponse.data); // 받은 데이터 콘솔 출력

        if (changeEmailResponse.data.success === 'True') {
          // 이메일 변경 성공 알림 표시
          Alert.alert('성공', '이메일 변경이 성공적으로 완료되었습니다.', [
            {text: '확인', onPress: () => navigation.navigate('Fixing')},
          ]);
        } else {
          // 이메일 변경 실패 시 알림 표시
          Alert.alert('실패', '이메일 변경에 실패했습니다.');
        }
      }
    } catch (error) {
      // 네트워크 에러 발생 시 알림 표시
      console.error('네트워크 에러:', error);
      Alert.alert('에러', '네트워크 에러가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>{`새로운 이메일을 입력해주세요`}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder=""
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleFindPassword}>
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button2}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>뒤로 가기</Text>
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
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    fontSize: 38,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#151414',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 30,
    paddingHorizontal: 16,
    fontSize: 18,
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
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  button2: {
    width: '100%',
    height: 50,
    backgroundColor: '#0e0404',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default ChangeEmail;
