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
      const data = {
        newPassword: password, // 새 비밀번호
        loginId: email, // 이메일
      };

      console.log('보내는 데이터:', data);

      const response = await axios.put(
        'http://ceprj.gachon.ac.kr:60020/user/mypage/infoChange/password',
        data,
      );

      console.log(response.data);

      Alert.alert(
        '비밀번호 변경 성공!',
        '새로운 비밀번호로 로그인해주세요!',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('Login'),
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
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
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.input}
        placeholder="패스워드 확인"
        secureTextEntry
        onChangeText={handleConfirmPasswordChange}
        value={confirmPassword}
        autoCapitalize="none"
        placeholderTextColor="#A9A9A9"
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
    backgroundColor: '#E3F2FD', // 인디고 블루 배경색
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#1A237E', // 인디고 블루 테두리 색상
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
