import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = text => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = text => {
    setConfirmPassword(text);
  };

  const handleChangePassword = () => {
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

    // 비밀번호 변경 로직을 구현합니다.
    // 여기에 비밀번호 변경에 대한 실제 로직을 추가합니다.
    alert('비밀번호가 변경되었습니다.');
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
