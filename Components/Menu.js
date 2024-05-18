import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useToken} from './TokenContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 아이콘 가져오기

const Menu = ({navigation}) => {
  const {storedToken, setStoredToken} = useToken();

  const menuItems = [
    {key: '1', title: '게시판', icon: 'forum', screen: 'Board'},
    {key: '2', title: '마이페이지', icon: 'person', screen: 'MyPage'},
    {
      key: '3',
      title: '수리비 예측하기',
      icon: 'analytics',
      screen: 'CameraScreen',
    },
    {
      key: '4',
      title: '내 분석 내역 조회',
      icon: 'history',
      screen: 'DamageReportViewer',
    },
  ];

  const handlePress = item => {
    if (storedToken === null) {
      if (item.key !== '1' && item.key !== '3') {
        // 토큰값이 null이고 메뉴가 게시판이나 수리비 예측하기가 아닌 경우
        Alert.alert('알림', '회원만 가능한 메뉴입니다.', [{text: '확인'}], {
          cancelable: true,
        });
        return;
      }
    }

    if (item.key === '3') {
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
        {cancelable: true},
      );
    } else {
      navigation.navigate(item.screen);
    }
  };

  const renderItem = item => (
    <TouchableOpacity
      key={item.key}
      style={styles.menuItem}
      onPress={() => handlePress(item)}>
      <Icon name={item.icon} size={40} color="#1A237E" />
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>어떤 메뉴로 이동하시겠어요?</Text>
      <View style={styles.menuContainer}>{menuItems.map(renderItem)}</View>
    </View>
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
    fontSize: 35,
    fontWeight: '900',
    marginBottom: 20,
    color: '#1A237E',
    textAlign: 'center', // 중앙 정렬
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    margin: 10,
    padding: 20,
    width: 120,
    height: 120,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItemText: {
    marginTop: 10,
    fontSize: 18,
    color: '#1A237E',
    fontWeight: 'bold',
    textAlign: 'center', // 중앙 정렬
  },
  logoutButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#C5CAE9',
    borderColor: '#1A237E',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#1A237E',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Menu;
