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
import axios from 'axios'; // axios 라이브러리를 가져옵니다.

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
    if (!isEmailChecked || !isNicknameChecked) {
      Alert.alert('중복 확인', '이메일과 닉네임 중복확인을 해주세요!');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('경고', '패스워드를 입력해주세요!');
      return;
    }

    const passwordPattern =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z0-9]).{8,}$/;
    if (!passwordPattern.test(password)) {
      Alert.alert(
        '경고',
        '패스워드는 특수문자를 포함하여 8글자 이상이어야 합니다.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('경고', '비밀번호가 서로 다릅니다.');
      return;
    }

    axios
      .post('http://ceprj.gachon.ac.kr:60020/user/signup', {
        loginId: email,
        password: password,
        nickName: nickname,
      })
      .then(response => {
        console.log('회원가입 성공, 서버 응답:', response);
        Alert.alert('회원가입 완료', '회원가입 성공! 로그인을 해주세요!', [
          {text: '확인', onPress: () => navigation.navigate('Login')},
        ]);
      })
      .catch(error => {
        console.error('회원가입 실패, 에러:', error);
        Alert.alert('오류', '회원가입에 실패했습니다. 다시 시도해주세요.');
      });
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  const handleCheckEmail = () => {
    if (!email.trim()) {
      Alert.alert('경고', '이메일을 입력해주세요!');
      return;
    }

    const atSymbolCount = email.split('@').length - 1;
    const isEmailValid = email.includes('.com') || email.includes('.net');

    if (atSymbolCount !== 1 || !isEmailValid) {
      Alert.alert('오류', '올바르지 않은 이메일 형식입니다.');
    } else {
      axios
        .post('http://ceprj.gachon.ac.kr:60020/user/loginId/exists', {
          loginId: email,
        })
        .then(response => {
          const {data} = response;
          if (data.success === 'true') {
            setEmailChecked(true);
            setEmailCheckButtonText('확인 완료');
            Alert.alert('중복 확인', '중복 확인 완료!');
          } else {
            Alert.alert('중복 확인', '이미 사용 중인 이메일입니다.');
          }
        })
        .catch(error => {
          console.error('Error checking email duplication:', error);
          Alert.alert('오류', '이메일 중복 확인에 실패했습니다.');
        });
    }
  };

  const handleCheckNickname = () => {
    if (nickname.trim() === '') {
      Alert.alert('경고', '닉네임을 입력해주세요!');
    } else if (!/^[가-힣a-zA-Z]+$/.test(nickname)) {
      Alert.alert('경고', '닉네임에 특수문자 및 공백은 허용되지 않습니다.');
    } else {
      axios
        .post('http://ceprj.gachon.ac.kr:60020/user/nickName/exists', {
          nickName: nickname,
        })
        .then(response => {
          const {data} = response;
          if (data.success === 'true') {
            setNicknameChecked(true);
            setNicknameCheckButtonText('확인 완료');
            Alert.alert('중복 확인', '중복 확인 완료!');
          } else {
            Alert.alert('중복 확인', '이미 사용 중인 닉네임입니다.');
          }
        })
        .catch(error => {
          console.error('Error checking nickname duplication:', error);
          Alert.alert('오류', '닉네임 중복 확인에 실패했습니다.');
        });
    }
  };

  const handleNicknameChange = newNickname => {
    if (newNickname.length > 6) {
      Alert.alert('경고', '닉네임은 최대 6글자입니다.');
    } else {
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
          editable={!isEmailChecked}
          placeholderTextColor="#A9A9A9"
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
        autoCapitalize="none"
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.singleInput}
        placeholder="패스워드 확인"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor="#A9A9A9"
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="닉네임(최대 6자, 특수문자 X)"
          onChangeText={handleNicknameChange}
          value={nickname}
          editable={!isNicknameChecked}
          placeholderTextColor="#A9A9A9"
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
    backgroundColor: '#E3F2FD',
  },
  title: {
    fontSize: 60,
    fontWeight: '900',
    marginBottom: 40,
    color: '#3f51b5',
    textShadowColor: '#BBDEFB',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: '80%',
    borderColor: '#3f51b5',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginRight: 10,
    color: '#000',
  },
  singleInput: {
    width: '80%',
    height: 60,
    borderColor: '#3f51b5',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 25,
    backgroundColor: '#FFF',
    color: '#000',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  checkButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#3f51b5',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  checkButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#3f51b5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
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
  signInText: {
    color: '#3f51b5',
    fontSize: 16,
    marginTop: 10,
  },
  checkButtonDisabled: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Register;
