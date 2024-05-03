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

const ChangeEmail = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const isEmailValid = email => {
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

    // 이메일 변경이 성공적으로 완료되었음을 알림
    Alert.alert('성공', '이메일 변경이 성공적으로 완료되었습니다.', [
      {
        text: '확인',
        onPress: () => navigation.navigate('Fixing'),
      },
    ]);
  };

  const navigateToFixing = () => {
    navigation.navigate('Fixing');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log('뒤로 가기')}>
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
