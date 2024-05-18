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
                'http://ceprj.gachon.ac.kr:60020/user/delete',
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={navigateToPreviousScreen}
          style={styles.backButton}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleAppInfoPress}>
            <Icon
              name="info"
              size={24}
              color="#3f51b5"
              style={styles.menuIcon}
            />
            <Text style={styles.label}>어플리케이션 정보</Text>
            <Icon
              name="arrow-forward-ios"
              size={24}
              color="#3f51b5"
              style={styles.menuIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleWithdrawalPress}>
            <Icon
              name="delete"
              size={24}
              color="#e74c3c"
              style={styles.menuIcon}
            />
            <Text style={styles.label}>회원 탈퇴</Text>
            <Icon
              name="arrow-forward-ios"
              size={24}
              color="#3f51b5"
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#3f51b5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuContainer: {
    marginTop: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuIcon: {
    marginRight: 16,
  },
  label: {
    flex: 1,
    fontSize: 18,
    color: '#2c3e50',
  },
});

export default Setting;
