import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  BackHandler,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useToken} from './TokenContext'; // TokenContext에서 useToken 가져오기

const Board = () => {
  const [boardData, setBoardData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 관리할 상태(State) 추가
  const itemsPerPage = 7; // 페이지당 항목 수
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기
  console.log('게시판에서의 토큰 값:', storedToken); // 토큰 값 콘솔 출력

  // 화면 포커스 시 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      fetchBoardData();
    }, []),
  );

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

  useEffect(() => {
    // 서버에서 데이터를 가져오는 함수 호출
    fetchBoardData();
  }, []);

  // 서버에서 데이터를 가져오는 함수
  const fetchBoardData = async () => {
    try {
      console.log('Fetching board data...');
      const response = await axios.get(
        'http://ceprj.gachon.ac.kr:60020/board/list',
      );
      console.log('Board data fetched successfully:', response.data);
      // 서버에서 받아온 데이터를 state에 설정
      setBoardData(response.data.data);
      setRefreshing(false); // 새로고침 완료 후 상태 변경
    } catch (error) {
      console.error('Error fetching board data:', error);
      // 오류 처리
      setRefreshing(false); // 새로고침 완료 후 상태 변경
    }
  };

  const items = [];

  // 현재 페이지에 해당하는 항목들만 가져오는 함수 수정
  const getItemsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return boardData.slice(startIndex, endIndex);
  };

  const navigateToBestBoard = () => {
    navigation.navigate('BestBoard');
  };

  const navigateToMyPage = () => {
    // 여기서 토큰값을 확인하고 그에 따른 동작을 수행합니다.

    if (storedToken === null) {
      // 토큰값이 null인 경우 Alert를 띄웁니다.
      Alert.alert('알림', '회원만 가능한 메뉴입니다.', [{text: '확인'}], {
        cancelable: true,
      });
    } else {
      // 토큰값이 존재하는 경우 마이페이지로 이동합니다.
      navigation.navigate('MyPage');
    }
  };

  const navigateToNewPost = () => {
    if (storedToken === null) {
      // 토큰값이 null인 경우 Alert를 띄웁니다.
      Alert.alert('알림', '회원만 가능한 메뉴입니다.', [{text: '확인'}], {
        cancelable: true,
      });
    } else {
      // 토큰값이 존재하는 경우 마이페이지로 이동합니다.
      navigation.navigate('NewPost');
    }
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

  const ListItem = ({title, nickName, postDate, boardId, recommendCount}) => {
    // date를 JavaScript Date 객체로 파싱
    const parsedDate = new Date(postDate);

    // 년, 월, 일, 시간, 분 정보 얻기
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리 숫자로 포맷팅
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

    // 날짜와 시간을 문자열로 조합하여 포맷팅
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    const navigateToDetail = () => {
      // DetailScreen으로 이동하고 게시글의 상세 정보를 params로 전달합니다.
      navigation.navigate('DetailScreen', {
        title,
        nickName,
        postDate,
        boardId,
        recommendCount,
      });
      console.log('Clicked on boardId:', boardId);
    };

    return (
      <TouchableOpacity onPress={navigateToDetail}>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>{title}</Text>
          <View style={styles.userInfoContainer}>
            <Text style={styles.listItemUsername}>{nickName}</Text>
            <Text style={styles.listItemDate}>{formattedDate}</Text>
            <Text style={styles.listItemRecommend}>
              추천수: {recommendCount}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 페이지 버튼 렌더링 함수
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
    const pageCount = Math.ceil(boardData.length / itemsPerPage);
    const pageButtons = [];
    for (let i = 1; i <= pageCount; i++) {
      pageButtons.push(renderPageButton(i));
    }
    return pageButtons;
  };

  // 수정된 부분: ScrollView 대신 FlatList로 변경
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
        data={getItemsForCurrentPage()} // 현재 페이지에 맞는 데이터만 렌더링
        renderItem={({item}) => (
          <ListItem
            title={item.title}
            nickName={item.nickName}
            postDate={item.postDate}
            boardId={item.boardId}
            recommendCount={item.recommendCount}
          />
        )}
        keyExtractor={item => item.boardId.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchBoardData} />
        }
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
    padding: 16,
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
  navbarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listItemText: {
    fontSize: 20,
    flex: 1,
  },
  userInfoContainer: {
    alignItems: 'flex-end',
  },
  listItemTitle: {
    fontSize: 20,
  },
  pageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 1,
    backgroundColor: '#8fa1b4',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  currentPageButton: {
    backgroundColor: '#4d91da',
  },
  pageButtonText: {
    fontSize: 16,
    color: '#f7f2f2',
  },
  pageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  picture: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
});

export default Board;
