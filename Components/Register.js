import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

const Register = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isEmailChecked, setEmailChecked] = useState(false);
  const [isNicknameChecked, setNicknameChecked] = useState(false);
  const [emailCheckButtonText, setEmailCheckButtonText] = useState('중복 확인');
  const [nicknameCheckButtonText, setNicknameCheckButtonText] =
    useState('중복 확인');
  const handleSignUp = () => {
    // 이메일 또는 닉네임 중 하나라도 중복 확인을 하지 않은 경우
    if (!isEmailChecked || !isNicknameChecked) {
      Alert.alert('중복 확인', '이메일과 닉네임 중복확인을 해주세요!');
      return; // 함수 실행 중단
    }

    // 패스워드 입력 여부 확인
    if (!password || !confirmPassword) {
      Alert.alert('경고', '패스워드를 입력해주세요!');
      return; // 함수 실행 중단
    }

    // 패스워드 길이 및 특수문자 포함 여부 확인
    const passwordPattern =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z0-9]).{8,}$/;
    if (!passwordPattern.test(password)) {
      Alert.alert(
        '경고',
        '패스워드는 특수문자를 포함하여 8글자 이상이어야 합니다.',
      );
      return; // 함수 실행 중단
    }

    // 패스워드와 패스워드 확인이 서로 다른지 확인
    if (password !== confirmPassword) {
      Alert.alert('경고', '비밀번호가 서로 다릅니다.');
      return; // 함수 실행 중단
    }

    // 여기서부터는 회원가입 처리 로직을 추가할 수 있습니다.

    // 회원가입이 완료되었음을 알리는 알림창을 띄웁니다.
    Alert.alert('회원가입 완료', 'CarKey에 오신것을 환영합니다!', [
      {text: '확인', onPress: () => navigation.navigate('Board')},
    ]);
  };

  const handleSignIn = () => {
    // 로그인 화면으로 이동
    navigation.navigate('Login');
  };

  const handleCheckEmail = () => {
    // 이메일이 비어 있는지 확인
    if (!email.trim()) {
      Alert.alert('경고', '이메일을 입력해주세요!');
      return; // 이메일이 비어 있으면 함수 종료
    }

    const atSymbolCount = email.split('@').length - 1;
    // Check if the email contains ".com" or ".net"
    const isEmailValid = email.includes('.com') || email.includes('.net');
    if (atSymbolCount !== 1 || !isEmailValid) {
      Alert.alert('오류', '올바르지 않은 이메일 형식입니다.');
    } else {
      // 중복 확인 완료 후 버튼 비활성화
      setEmailChecked(true);
      Alert.alert('중복 확인', '중복 확인 완료!');
      setEmailChecked(true); // 이메일 중복 확인 완료 상태를 true로 설정
      setEmailCheckButtonText('확인 완료'); // 버튼 텍스트를 "확인 완료"로 변경
    }
  };

  const handleCheckNickname = () => {
    if (nickname.trim() === '') {
      Alert.alert('경고', '닉네임을 입력해주세요!');
    } else if (!/^[가-힣a-zA-Z]+$/.test(nickname)) {
      // 영어 및 한글만 가능한 정규 표현식 검사에 실패한 경우
      Alert.alert('경고', '닉네임에 특수문자 및 공백은 허용되지 않습니다.');
    } else {
      // 닉네임 중복 확인 로직
      setNicknameChecked(true);
      Alert.alert('중복 확인', '중복 확인 완료!');
      setNicknameCheckButtonText('확인 완료');
    }
  };

  const handleNicknameChange = newNickname => {
    if (newNickname.length > 6) {
      // 6글자를 초과하는 경우 경고창을 띄웁니다.
      Alert.alert('경고', '닉네임은 최대 6글자입니다.');
    } else {
      // 그렇지 않은 경우 닉네임 상태를 업데이트합니다.
      setNickname(newNickname);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Text style={styles.title}>CarKey</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="이메일을 입력하세요"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isEmailChecked} // 중복 확인 후 수정 불가능하도록 설정
        />
        <TouchableOpacity
          disabled={isEmailChecked}
          style={
            isEmailChecked ? styles.checkButtonDisabled : styles.checkButton
          }
          onPress={handleCheckEmail}>
          <Text style={styles.checkButtonText}>{emailCheckButtonText}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.singleInput}
        placeholder="패스워드를 입력하세요"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none" // 이 부분을 추가하세요
      />
      <TextInput
        style={styles.singleInput}
        placeholder="패스워드 확인"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="닉네임(최대 6자, 특수문자 X)"
          onChangeText={handleNicknameChange}
          value={nickname}
          editable={!isNicknameChecked} // 중복 확인 후 수정 불가능하도록 설정
        />
        <TouchableOpacity
          disabled={isNicknameChecked}
          style={
            isNicknameChecked ? styles.checkButtonDisabled : styles.checkButton
          }
          onPress={handleCheckNickname}>
          <Text style={styles.checkButtonText}>{nicknameCheckButtonText}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignIn}>
        <Text style={styles.signInText}>로그인</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 60,
    fontWeight: '900',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  singleInput: {
    width: '80%',
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  checkButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  checkButtonText: {
    color: 'white',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  signInText: {
    color: 'blue',
    fontSize: 16,
  },
  checkButtonDisabled: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ccc', // 예시 색상
  },
});

export default Register;
