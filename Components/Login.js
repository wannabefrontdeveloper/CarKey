import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleGuestLogin = () => {
    console.log('비회원으로 로그인');
  };
  const handleForgotPassword = () => {
    navigation.navigate('FindPassword'); // "패스워드를 잊으셨나요?" 를 눌렀을 때 FindPassword 화면으로 이동합니다.
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => onLogin(email, password)}>
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
