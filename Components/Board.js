import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const Board = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('경고!', '앱을 종료하시겠습니까?', [
        {
          text: '아니요',
          onPress: () => null,
          style: 'cancel',
        },
        {text: '네', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 한 페이지에 보여질 항목 수

  const items = [
    {
      id: '1',
      username: 'giwonk',
      date: '2024-04-10',
      text: '누가 긁고 갔네요.. 하',
    },
    {
      id: '2',
      username: '이규동',
      date: '2024-04-11',
      text: '백엔드 개하기 싫다',
    },
    {
      id: '3',
      username: '김지원',
      date: '2024-04-10',
      text: 'ViSCA BARCA',
    },
    {
      id: '4',
      username: '송지우',
      date: '2024-04-10',
      text: '이병문 자퇴해라',
    },
    {
      id: '5',
      username: '김지원',
      date: '2024-04-10',
      text: '오늘 기아 승 있냐?',
    },
    {
      id: '6',
      username: '김선호',
      date: '2024-04-10',
      text: '기아 화이팅~~~~',
    },
    {
      id: '7',
      username: '김준희',
      date: '2024-04-10',
      text: '기아 화이팅~~',
    },
    {
      id: '8',
      username: '신동민',
      date: '2024-04-10',
      text: 'AI 개빡세다',
    },
    {
      id: '9',
      username: 'giwonk',
      date: '2024-04-10',
      text: '누가 긁고 갔네요.. 하',
    },
    {
      id: '10',
      username: 'giwonk',
      date: '2024-04-10',
      text: '누가 긁고 갔네요.. 하',
    },
    {
      id: '11',
      username: 'giwonk',
      date: '2024-04-10',
      text: '누가 긁고 갔네요.. 하',
    },
    {
      id: '12',
      username: 'giwonk',
      date: '2024-04-10',
      text: '누가 긁고 갔네요.. 하',
    },
    {
      id: '13',
      username: 'giwonk',
      date: '2024-04-10',
      text: '누가 긁고 갔네요.. 하',
    },
    {
      id: '14',
      username: 'giwonk',
      date: '2024-04-10',
      text: '누가 긁고 갔네요.. 하',
    },
  ];

  // 현재 페이지에 해당하는 항목들만 가져오는 함수
  const getItemsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const navigateToBestBoard = () => {
    navigation.navigate('BestBoard');
  };

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
  };

  const navigateToNewPost = () => {
    navigation.navigate('NewPost');
  };

  const navigateToSetting = () => {
    navigation.navigate('Setting');
  };
  const navigateToDetail = () => {
    // DetailScreen으로 이동하고 게시글의 상세 정보를 params로 전달합니다.
    navigation.navigate('DetailScreen', {username, date, text});
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

  const ListItem = ({username, date, text}) => {
    // date를 JavaScript Date 객체로 파싱
    const parsedDate = new Date(date);

    // 년, 월, 일, 시간, 분 정보 얻기
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리 숫자로 포맷팅
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

    // 날짜와 시간을 문자열로 조합하여 포맷팅
    const formattedDate = `${year}-${month}-${day}-${hours}:${minutes}`;

    const navigateToDetail = () => {
      // DetailScreen으로 이동하고 게시글의 상세 정보를 params로 전달합니다.
      navigation.navigate('DetailScreen', {username, date, text});
    };

    return (
      <TouchableOpacity onPress={navigateToDetail}>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{text}</Text>
          <View style={styles.userInfoContainer}>
            <Text style={styles.listItemUsername}>{username}</Text>
            <Text style={styles.listItemDate}>{formattedDate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 페이지 버튼 생성 함수
  const renderPageButton = pageNumber => (
    <TouchableOpacity
      key={pageNumber}
      style={[
        styles.pageButton,
        currentPage === pageNumber && styles.currentPageButton,
      ]}
      onPress={() => setCurrentPage(pageNumber)}>
      <Text style={styles.pageButtonText}>{pageNumber}</Text>
    </TouchableOpacity>
  );

  // 페이지 버튼 리스트 생성
  const renderPageButtons = () => {
    const pageCount = Math.ceil(items.length / itemsPerPage);
    const pageButtons = [];
    for (let i = 1; i <= pageCount; i++) {
      pageButtons.push(renderPageButton(i));
    }
    return pageButtons;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={navigateToSetting}>
          <Icon name="settings" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.navbarText}>게시판</Text>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={navigateToNewPost}>
          <Icon name="create" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={getItemsForCurrentPage()}
        renderItem={({item}) => (
          <ListItem
            username={item.username}
            date={item.date}
            text={item.text}
          />
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles.pageButtonsContainer}>{renderPageButtons()}</View>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.button} onPress={navigateToBestBoard}>
          <Icon name="thumb-up-off-alt" size={40} color="#f7f4f4" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
          <Icon name="photo-camera" size={40} color="#f7f4f4" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToMyPage}>
          <Icon name="person" size={40} color="#f7f4f4" />
        </TouchableOpacity>
      </View>
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
  listItem: {
    padding: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#4d91da',
  },
  button: {},
  navbarText: {
    color: '#ffffff',
    fontSize: 35,
    fontWeight: 'bold',
  },
  iconContainer: {
    padding: 5,
  },
  listItemText: {
    fontSize: 20,
    flex: 1,
  },
  listItemUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listItemDate: {
    fontSize: 12,
    color: '#888888',
  },
  userInfoContainer: {
    alignItems: 'flex-end',
  },
  pageButton: {
    paddingHorizontal: 15, // 좌우 padding 추가
    paddingVertical: 8, // 상하 padding 추가
    marginHorizontal: 1, // 좌우 margin 추가
    backgroundColor: '#8fa1b4',
    borderRadius: 5,
    alignItems: 'center',
  },
  currentPageButton: {
    backgroundColor: '#4d91da', // 현재 페이지 버튼의 배경색 변경
  },
  pageButtonText: {
    fontSize: 16, // 버튼 텍스트 크기 조정
    color: '#f7f2f2',
  },
  pageButtonsContainer: {
    flexDirection: 'row', // 페이지 버튼들을 가로로 배열하기 위해 추가
    justifyContent: 'center', // 페이지 버튼들을 수평으로 중앙 정렬하기 위해 추가
    marginVertical: 20, // 상하 여백 추가
  },
});

export default Board;
