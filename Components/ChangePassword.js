import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios'; // Axios를 가져옵니다.
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const {email} = useRoute().params;

  const handlePasswordChange = text => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = text => {
    setConfirmPassword(text);
  };

  const handleChangePassword = async () => {
    if (password.trim() === '' || confirmPassword.trim() === '') {
      Alert.alert('경고', '패스워드를 입력해주세요!');
      return;
    }

    // 정규식을 사용하여 패스워드의 유효성을 검사합니다.
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()-_+=])(?=.*[0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      Alert.alert(
        '경고',
        '비밀번호는 특수문자를 포함한 8글자 이상이어야 합니다.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('경고', '패스워드가 서로 다릅니다!');
      return;
    }

    try {
      // 이메일 값을 함께 보내기 위해 객체에 email 필드 추가
      const data = {
        newPassword: password, // 새 비밀번호
        loginId: email, // 이메일
      };

      console.log('보내는 데이터:', data);

      // 백엔드로 PUT 요청 보내기
      const response = await axios.put(
        'http://ceprj.gachon.ac.kr:60020/user/mypage/infoChange/password',
        data, // data 객체 전달
      );

      // 응답 처리
      console.log(response.data); // 응답에 유용한 데이터가 있다고 가정합니다.

      // 비밀번호 변경 성공 알림 후 로그인 화면으로 이동
      Alert.alert(
        '비밀번호 변경 성공!',
        '새로운 비밀번호로 로그인해주세요!',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('Login'), // Login.js 화면으로 이동
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      // 에러 처리
      console.error('에러:', error);
      Alert.alert('에러', '비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>새로운 패스워드를 입력해주세요!</Text>
      <TextInput
        style={styles.input}
        placeholder="패스워드"
        secureTextEntry
        onChangeText={handlePasswordChange}
        value={password}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="패스워드 확인"
        secureTextEntry
        onChangeText={handleConfirmPasswordChange}
        value={confirmPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>완료</Text>
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
  title: {
    fontSize: 30,
    marginBottom: 30,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#151414',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
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
    marginBottom: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default ChangePasswordScreen;
