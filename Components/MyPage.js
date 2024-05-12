import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useToken} from './TokenContext'; // TokenContext에서 useToken 가져오기
import {useEffect} from 'react';
import {useState} from 'react';
import axios from 'axios';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const {token} = useToken(); // TokenContext에서 token 가져오기
  const {storedToken, removeToken} = useToken(); // TokenContext에서 storedToken과 removeToken 가져오기
  const isFocused = useIsFocused(); // 화면 포커스 여부 확인
  const navigation = useNavigation();
  const navigateToBoard = () => {
    navigation.navigate('Board');
  };

  useEffect(() => {
    fetchUserInfo(); // 컴포넌트가 마운트되면 사용자 정보를 가져옴
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchUserInfo(); // 화면이 포커스를 얻었을 때만 사용자 정보를 가져옴
    }
  }, [isFocused]);

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

  // 내가 쓴 글 메뉴를 눌렀을 때 내비게이션 설정
  const navigateToMyWritePage = () => {
    navigation.navigate('MyWritePage');
  };

  const navigateToFeedback = () => {
    navigation.navigate('Feedback');
  };

  const navigateToDamageReportViewer = () => {
    navigation.navigate('DamageReportViewer');
  };

  const navigateToFixing = () => {
    navigation.navigate('Fixing');
  };

  const navigateToSetting = () => {
    navigation.navigate('Setting');
  };

  const handleCameraPress = () => {
    Alert.alert(
      '알림',
      '\n저희 CarKey에서 파손 부위는 부품 교체가 필요하다고 \n판단해 수리비용이 측정되지 않습니다! \n\n\n스크래치나 찍힘 부위를 촬영해주세요!',
      [
        {text: '뒤로가기'},
        {
          text: '촬영하기',
          onPress: () => {
            navigation.navigate('CameraScreen');
          },
        },
      ],
      {cancelable: true}, // Alert 외부를 터치해도 Alert가 닫히도록 설정
    );
  };

  const handleLogoutPress = () => {
    Alert.alert(
      '로그아웃',
      '로그아웃하시겠어요?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: () => {
            // 토큰 삭제 함수를 호출하여 토큰값을 null로 설정하여 로그아웃 상태로 변경합니다.
            removeToken();
            // 로그아웃 후 로그인 화면으로 이동합니다.
            navigation.navigate('Login');
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon
              name="arrow-back"
              size={30}
              color="white"
              onPress={navigateToBoard}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>마이 페이지</Text>
        </View>

        <View style={styles.profileContainer}>
          <Icon name="person-outline" size={50} color="#BDBDBD" />
          <Text style={styles.username}>{userInfo?.nickName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <TouchableOpacity onPress={navigateToFixing}>
            <Text style={styles.label}>내 정보 수정</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <TouchableOpacity onPress={navigateToMyWritePage}>
            <Text style={styles.label}>내가 쓴 글</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <TouchableOpacity onPress={navigateToDamageReportViewer}>
            <Text style={styles.label}>분석 내역 조회</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <TouchableOpacity onPress={navigateToSetting}>
            <Text style={styles.label}>설정</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <TouchableOpacity onPress={navigateToFeedback}>
            <Text style={styles.label}>의견 보내기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <TouchableOpacity onPress={handleLogoutPress}>
            <Text style={styles.label}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
          <Icon name="photo-camera" size={40} color="#f7f4f4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    marginBottom: 60, // 하단 버튼의 높이만큼 마진을 줍니다.
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4d91da',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  username: {
    marginLeft: 10,
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  menuItem: {
    padding: 16,
  },
  label: {
    fontSize: 25,
  },
  cameraButton: {
    backgroundColor: '#4d91da',
    borderRadius: 25,
    padding: 15,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#4d91da',
  },
});

export default MyPage;
