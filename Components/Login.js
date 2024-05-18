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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToken} from './TokenContext';

const Login = ({navigation}) => {
  const {storedToken, setStoredToken} = useToken();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userNickname, setUserNickname] = useState(null);

  useEffect(() => {
    const getTokenFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setStoredToken(token);
      } catch (error) {
        console.error('토큰 가져오기 실패:', error);
      }
    };

    getTokenFromStorage();
  }, []);

  const handleGuestLogin = async () => {
    try {
      const response = await axios.get(
        'http://ceprj.gachon.ac.kr:60020/user/nonUsers',
      );
      if (response.status === 200) {
        console.log('Response data:', response.data);
        const accessToken = response.data.data.accessToken;

        if (accessToken === null) {
          console.log('Access Token is null, proceeding with guest login.');
          await AsyncStorage.removeItem('token');
          setStoredToken(null);
          navigation.navigate('Menu');
        } else {
          await AsyncStorage.setItem('token', accessToken);
          setStoredToken(accessToken);
          navigation.navigate('Menu');
        }
      } else {
        console.error('Error fetching data: ', response.status);
      }
    } catch (error) {
      console.error('Error during guest login: ', error);
    }
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
      .post('http://ceprj.gachon.ac.kr:60020/user/login', {
        loginId: email,
        password: password,
      })
      .then(async response => {
        const {data} = response;
        console.log(data);
        if (data.success === 'True') {
          console.log('토큰:', data.data.accessToken);
          setStoredToken(data.data.accessToken);
          await AsyncStorage.setItem('token', data.data.accessToken);
          setStoredToken(data.data.accessToken);
          setUserNickname(data.data.nickName);
          navigation.navigate('Menu');
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
    backgroundColor: '#E3F2FD', // 인디고 블루 배경색
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 60,
    fontWeight: '900',
    marginBottom: 40,
    color: '#3f51b5', // 인디고 블루 색상
    textShadowColor: '#BBDEFB',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#3f51b5', // 인디고 블루 테두리 색상
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: '#FFF', // 입력 필드 배경색
    color: '#000', // 입력 텍스트 색상
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
    marginBottom: 12,
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
  guestButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#C5CAE9', // 연한 인디고 블루 배경색
    borderColor: '#3f51b5', // 인디고 블루 테두리 색상
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  guestButtonText: {
    color: '#3f51b5', // 인디고 블루 텍스트 색상
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonOutline: {
    width: '100%',
    height: 50,
    borderColor: '#3f51b5', // 인디고 블루 테두리 색상
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonOutlineText: {
    color: '#3f51b5', // 인디고 블루 텍스트 색상
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#3f51b5', // 인디고 블루 텍스트 색상
    fontSize: 16,
    marginTop: 10,
  },
});

export default Login;
