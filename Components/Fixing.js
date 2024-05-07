import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useIsFocused} from '@react-navigation/native'; // useIsFocused 추가
import axios from 'axios';
import {useToken} from './TokenContext'; // TokenContext에서 useToken 가져오기

const Fixing = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // 화면 포커스 여부 확인
  const [userInfo, setUserInfo] = useState(null);
  const {token} = useToken(); // TokenContext에서 token 가져오기
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기

  useEffect(() => {
    if (isFocused) {
      fetchUserInfo(); // 화면이 포커스를 얻었을 때만 사용자 정보를 가져옴
    }
  }, [isFocused]);
  console.log('토큰 값:', token); // 토큰 값 콘솔 출력
  useEffect(() => {
    fetchUserInfo(); // 컴포넌트가 마운트되면 사용자 정보를 가져옴
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/mypage/user/info',
        {
          headers: {
            Authorization: `Bearer ${storedToken}`, // 토큰을 헤더에 포함
          },
        },
      );

      const {data} = response;
      console.log('서버에서 받아온 데이터:', data); // 받아온 데이터 콘솔 출력
      if (data.success === 'True') {
        setUserInfo(data.data); // 사용자 정보 설정
      } else {
        Alert.alert('에러', '회원 정보를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error('에러:', error);
      Alert.alert('에러', '회원 정보를 가져오는 중에 오류가 발생했습니다.');
    }
  };

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
  };

  const navigateToFindPassword = () => {
    navigation.navigate('FindPassword');
  };

  const navigateToChangeEmail = () => {
    navigation.navigate('ChangeEmail');
  };

  const navigateToChangeNickname = () => {
    navigation.navigate('ChangeNickname');
  };

  const NavBar = () => (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.iconContainer} onPress={navigateToMyPage}>
        <Icon name="arrow-back" size={30} color="#ffffff" />
      </TouchableOpacity>
      <Text style={styles.navbarText}>내 정보 수정</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <NavBar />
      {userInfo && (
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: 'https://w7.pngwing.com/pngs/753/432/png-transparent-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-people.png',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            value={userInfo?.nickName} // 서버에서 받아온 이메일을 사용
            editable={false}
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={navigateToChangeNickname}>
            <Text style={styles.editButtonText}>수정하기</Text>
          </TouchableOpacity>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={userInfo?.loginId} // 서버에서 받아온 닉네임을 사용
            editable={false}
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={navigateToChangeEmail}>
            <Text style={styles.editButtonText}>수정하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4d91da',
    paddingHorizontal: 10,
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 35,
    fontWeight: 'bold',
    marginRight: 200,
  },
  profileContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 200,
    backgroundColor: '#d9d9d9',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginTop: 10,
    fontSize: 30,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: '#4d91da',
    padding: 10,
    width: '80%',
    borderRadius: 5,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Fixing;
