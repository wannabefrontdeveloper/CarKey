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
import {useNavigation} from '@react-navigation/native';
import {useToken} from './TokenContext';
import axios from 'axios';

const Setting = () => {
  const navigation = useNavigation();
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기

  const navigateToPreviousScreen = () => {
    navigation.goBack();
  };

  const handleAppInfoPress = () => {
    Alert.alert(
      '어플리케이션 정보',
      '버전: 1.0\n\n개발자: 김지원, 신동민, 윤태영, 이규동 \n\n CarKey를 이용해주셔서 항상 감사합니다!',
      [{text: '확인', onPress: () => console.log('어플리케이션 정보 확인')}],
    );
  };

  const handleWithdrawalPress = () => {
    if (storedToken === null) {
      // 토큰값이 null인 경우 Alert를 띄웁니다.
      Alert.alert('알림', '회원만 가능한 메뉴입니다.', [{text: '확인'}], {
        cancelable: true,
      });
    } else {
      Alert.alert('회원 탈퇴', '정말로 회원 탈퇴를 하시겠어요?', [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: async () => {
            try {
              const response = await axios.delete(
                'http://localhost:8080/user/mypage/delete',
                {
                  headers: {
                    Authorization: `Bearer ${storedToken}`, // 헤더에 토큰값 추가
                  },
                },
              );
              if (response.data.success) {
                console.log('회원 탈퇴 확인');
                Alert.alert(
                  '탈퇴 완료',
                  '탈퇴가 완료되었습니다. \n\nCarKey를 이용해주셔서 감사합니다!',
                  [
                    {
                      text: '확인',
                      onPress: () => navigation.navigate('Login'), // Navigate to Login screen
                    },
                  ],
                );
              } else {
                // Handle error response
                console.error('회원 탈퇴 실패:', response.data.message);
              }
            } catch (error) {
              // Handle network error
              console.error('네트워크 에러:', error);
            }
          },
        },
      ]);
    }
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
              onPress={navigateToPreviousScreen}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>설정</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <TouchableOpacity onPress={handleAppInfoPress}>
            <Text style={styles.label}>어플리케이션 정보</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <TouchableOpacity onPress={handleWithdrawalPress}>
            <Text style={styles.label}>회원 탈퇴</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
      </ScrollView>
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

export default Setting;
