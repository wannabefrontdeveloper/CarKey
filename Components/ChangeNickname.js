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

const ChangeNickname = () => {
  const [nickname, setNickname] = useState('');
  const navigation = useNavigation();

  const handleNicknameChange = text => {
    // 특수 문자나 공백이 있는지 검사하는 정규식
    const regex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]*$/;

    // 닉네임이 6글자를 초과하는 경우 알림 표시
    if (text.length > 6) {
      Alert.alert('알림', '닉네임은 최대 6글자입니다');
    } else if (!regex.test(text)) {
      // 특수 문자나 공백이 있는 경우 알림 표시
      Alert.alert('알림', '닉네임에 특수 문자 및 공백은 사용할 수 없습니다');
    } else {
      // 조건에 부합하면 닉네임 업데이트
      setNickname(text);
    }
  };

  const handleNicknameUpdate = () => {
    // 닉네임 업데이트 성공 알림
    Alert.alert('알림', '닉네임이 성공적으로 변경되었습니다!', [
      {text: '확인', onPress: () => navigation.navigate('Fixing')},
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log('뒤로 가기')}>
        <Text style={styles.backButton}>{`새로운 닉네임을 입력해주세요`}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={handleNicknameChange}
        value={nickname}
        placeholder=""
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleNicknameUpdate}>
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

export default ChangeNickname;
