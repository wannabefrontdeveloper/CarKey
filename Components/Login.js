import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage import
import {useToken} from './TokenContext'; // TokenContext에서 useToken 가져오기

const Login = ({navigation}) => {
  const {storedToken, setStoredToken} = useToken(); // TokenContext에서 storedToken 가져오기
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userNickname, setUserNickname] = useState(null); // 추가: 사용자 닉네임 상태 추가

  useEffect(() => {
    // 컴포넌트가 마운트될 때 AsyncStorage에서 토큰을 가져와서 상태에 저장
    const getTokenFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setStoredToken(token); // AsyncStorage에서 가져온 토큰으로 상태 업데이트
        console.log('저장된 토큰:', token); // 토큰 콘솔에 출력
      } catch (error) {
        console.error('토큰 가져오기 실패:', error);
      }
    };

    getTokenFromStorage();
  }, []);

  const handleGuestLogin = () => {
    navigation.navigate('Board');
  };

  const handleForgotPassword = () => {
    navigation.navigate('FindPassword');
  };

  const onLogin = () => {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 패스워드를 모두 입력해주세요!');
      return;
    }

    axios
      .post('http://localhost:8080/user/login', {
        loginId: email,
        password: password,
      })
      .then(async response => {
        const {data} = response;
        console.log(data);
        if (data.success === 'True') {
          console.log('토큰:', data.data.accessToken);
          setStoredToken(data.data.accessToken); // TokenContext의 상태 업데이트
          // 로그인 성공 시 토큰을 AsyncStorage에 저장
          await AsyncStorage.setItem('token', data.data.accessToken);
          setStoredToken(data.data.accessToken); // 추가: 상태 업데이트
          setUserNickname(data.data.nickName); // 추가: 사용자 닉네임 상태 업데이트
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
    fontSize: 60,
    fontWeight: '900',
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
