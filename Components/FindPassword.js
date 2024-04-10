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

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); // useNavigation을 사용하여 navigation 객체를 가져옵니다.

  const isEmailValid = email => {
    // 이메일 형식을 검증하는 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFindPassword = () => {
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
    // 이메일이 올바른 경우에만 비밀번호 찾기 로직을 실행
    console.log(email);

    // ChangePassword 화면으로 이동
    navigation.navigate('ChangePassword');
  };

  return (
    <View style={styles.container}>
      {/* 뒤로 가기 버튼 (기능은 구현해야 함) */}
      <TouchableOpacity onPress={() => console.log('뒤로 가기')}>
        <Text style={styles.backButton}>{`이메일을 입력해주세요`}</Text>
      </TouchableOpacity>

      {/* 이메일 입력 필드 */}
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder=""
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleFindPassword}>
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    fontSize: 45,
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
});

export default FindPassword;
