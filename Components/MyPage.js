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

const MyPage = () => {
  const navigation = useNavigation();
  const navigateToBoard = () => {
    navigation.navigate('Board');
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
          <Text style={styles.username}>giwonk</Text>
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
          <Text style={styles.label}>설정</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <TouchableOpacity onPress={navigateToFeedback}>
            <Text style={styles.label}>의견 보내기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <Text style={styles.label}>로그아웃</Text>
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
