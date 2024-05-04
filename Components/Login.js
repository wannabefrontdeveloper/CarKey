// Login.js

import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGuestLogin = () => {
    navigation.navigate('Board'); // 비회원 버튼을 누를 때 Board 화면으로 이동
  };

  const handleForgotPassword = () => {
    navigation.navigate('FindPassword'); // "패스워드를 잊으셨나요?" 를 눌렀을 때 FindPassword 화면으로 이동
  };

  const onLogin = () => {
    // 이메일과 패스워드가 비어 있는지 체크
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 패스워드를 모두 입력해주세요!');
      return;
    }

    axios
      .post('http://localhost:8080/user/login', {
        loginId: email,
        password: password,
      })
      .then(response => {
        const {data} = response;
        console.log(data); // 전체 응답 데이터를 로그로 출력
        if (data.success === 'True') {
          console.log('토큰:', data.data.accessToken); // 토큰 콘솔에 출력
          navigation.navigate('Board');
        } else {
          Alert.alert('로그인 실패', '아이디나 비밀번호가 올바르지 않습니다.');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          Alert.alert('로그인 실패', '아이디나 비밀번호가 올바르지 않습니다.');
        } else {
          Alert.alert('오류', '로그인에 실패했습니다.');
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CarKey</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="이메일을 입력하세요"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholder="패스워드를 입력하세요"
        placeholderTextColor="#A9A9A9"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonOutlineText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
        <Text style={styles.guestButtonText}>비회원</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>패스워드를 잊으셨나요?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 60, // 폰트 사이즈 변경
    fontWeight: '900', // 이미 가장 진하게 설정됨
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
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
  guestButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#d3d3d4f4',
    borderColor: '#007bff',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 32,
  },
  guestButtonText: {
    color: '#007bff',
    fontSize: 18,
  },
  buttonOutline: {
    width: '100%',
    height: 50,
    borderColor: '#007bff',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonOutlineText: {
    color: '#007bff',
    fontSize: 18,
  },
  forgotPassword: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 10,
  },
});

export default Login;
