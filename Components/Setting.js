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

const Setting = () => {
  const navigation = useNavigation();

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
  };

  const handleAppInfoPress = () => {
    Alert.alert(
      '어플리케이션 정보',
      '버전: 1.0\n\n개발자: 김지원, 신동민, 윤태영, 이규동 \n\n CarKey를 이용해주셔서 항상 감사합니다!',
      [{text: '확인', onPress: () => console.log('어플리케이션 정보 확인')}],
    );
  };

  const handleWithdrawalPress = () => {
    Alert.alert('회원 탈퇴', '정말로 회원 탈퇴를 하시겠어요?', [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        onPress: () => {
          console.log('회원 탈퇴 확인');
          // Navigate to Login screen after withdrawal confirmation
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
        },
      },
    ]);
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
              onPress={navigateToMyPage}
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
