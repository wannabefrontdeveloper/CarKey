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
import axios from 'axios';
import {useToken} from './TokenContext';

const ChangeNickname = () => {
  const [nickname, setNickname] = useState('');
  const navigation = useNavigation();
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기
  console.log('닉네임 변경 페이지 토큰 값:', storedToken);

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

  const handleNicknameUpdate = async () => {
    if (!nickname.trim()) {
      // 닉네임이 비어있을 경우 알림 표시
      Alert.alert('알림', '닉네임을 입력해주세요!');
      return;
    }

    try {
      // 닉네임 중복 체크 API 호출
      const checkDuplicateResponse = await axios.post(
        'http://ceprj.gachon.ac.kr:60020/user/nickName/exists',
        {nickName: nickname},
      );
      console.log('닉네임 중복 체크 데이터:', {nickName: nickname});
      console.log('닉네임 중복 체크 응답:', checkDuplicateResponse.data);

      if (checkDuplicateResponse.data.success === 'false') {
        // 닉네임 중복이 발생한 경우 알림 표시
        Alert.alert('알림', '이미 사용 중인 닉네임입니다.');
      } else {
        // 닉네임 중복이 없는 경우 닉네임 변경 요청 API 호출
        const changeNicknameResponse = await axios.put(
          'http://ceprj.gachon.ac.kr:60020/user/mypage/infoChange/nickName',
          {nickName: nickname},
          {
            headers: {
              Authorization: `Bearer ${storedToken}`, // 헤더에 토큰값 추가
            },
          },
        );
        console.log('토큰 값:', storedToken);
        console.log('닉네임 변경 요청 데이터:', {nickName: nickname});
        console.log('닉네임 변경 응답:', changeNicknameResponse.data); // 변경 요청 응답 확인
        if (changeNicknameResponse.data.success === 'True') {
          // 닉네임 변경 성공 알림 표시
          Alert.alert('알림', '닉네임이 성공적으로 변경되었습니다!', [
            {text: '확인', onPress: () => navigation.navigate('Fixing')},
          ]);
        } else {
          // 닉네임 변경 실패 시 알림 표시
          Alert.alert('알림', '닉네임 변경에 실패했습니다.');
        }
      }
    } catch (error) {
      // 네트워크 에러 발생 시 알림 표시
      Alert.alert('알림', '네트워크 에러가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log('뒤로 가기')}>
        <Text style={styles.backButton}>{`새로운 닉네임을 입력해주세요!`}</Text>
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
    backgroundColor: '#E3F2FD', // 페이지 배경색
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    fontSize: 35,
    fontWeight: '600',
    color: '#151516',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#3f51b5', // 테두리 색상
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 30,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3f51b5', // 버튼 배경색
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button2: {
    width: '100%',
    height: 50,
    backgroundColor: '#797c8f', // 버튼 배경색
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default ChangeNickname;
