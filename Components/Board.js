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
  const itemsPerPage = 6; // 페이지당 항목 수
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기
  const [notice, setNotice] = useState({
    title: '5월 19일 공지사항',
    content: '클린한 게시판 이용 부탁드립니다.',
    date: '2024-05-19', // 임의의 날짜 추가
  });
  console.log('게시판에서의 토큰 값:', storedToken); // 토큰 값 콘솔 출력

  // 화면 포커스 시 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      fetchBoardData();
      fetchNoticeData();
    }, []),
  );

  useEffect(() => {
    fetchBoardData();
    fetchNoticeData(); // 공지사항 데이터 가져오기 함수 호출
  }, []);

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

  const fetchNoticeData = async () => {
    try {
      console.log('Fetching notice data...');
      const response = await axios.get(
        'http://ceprj.gachon.ac.kr:60020/user/notice/first',
      );
      console.log('Notice data fetched successfully:', response.data);
      const noticeData = response.data.data;
      setNotice({
        title: noticeData.title,
        content: noticeData.comment,
        date: noticeData.createdDate,
      });
    } catch (error) {
      console.error('Error fetching notice data:', error);
    }
  };

  const items = [];

  const Notice = ({title, content, date}) => {
    const navigation = useNavigation();

    // Date 객체로 변환
    const parsedDate = new Date(date);

    // 년, 월, 일, 시간, 분 정보 얻기
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리 숫자로 포맷팅
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

    // 날짜와 시간을 문자열로 조합하여 포맷팅
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    const navigateToAnnouncement = () => {
      navigation.navigate('Announcement', {
        title,
        content,
        date: formattedDate,
      });
    };

    return (
      <TouchableOpacity onPress={navigateToAnnouncement}>
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>📢 {title}</Text>
          <Text style={styles.noticeContent}>{content}</Text>
          <Text style={styles.noticeDate}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
          onPress={() => navigation.navigate('Menu')}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.navbarText}>게시판</Text>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={navigateToNewPost}>
          <Icon name="create" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <Notice
        title={notice.title}
        content={notice.content}
        date={notice.date}
      />
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              fetchBoardData();
              fetchNoticeData();
            }}
          />
        }
      />
      <View style={styles.pageButtonsContainer}>{renderPageButtons()}</View>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.button} onPress={navigateToBestBoard}>
          <Icon name="thumb-up-off-alt" size={35} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
          <Icon name="photo-camera" size={35} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToMyPage}>
          <Icon name="person" size={35} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1', // 밝은 회색 배경
  },
  navbar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3f51b5', // 인망블루 네비게이션 바
    paddingHorizontal: 15,
    marginBottom: 3,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginHorizontal: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#3f51b5', // 인망블루 하단 네비게이션 바
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  listItemText: {
    fontSize: 18,
    flex: 1,
    color: '#2c3e50', // 짙은 회색 텍스트
  },
  userInfoContainer: {
    alignItems: 'flex-end',
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50', // 짙은 회색 제목
  },
  listItemUsername: {
    fontSize: 14,
    color: '#7f8c8d', // 중간 회색 사용자 이름
  },
  listItemDate: {
    fontSize: 12,
    color: '#bdc3c7', // 밝은 회색 날짜
    marginTop: 3,
  },
  listItemRecommend: {
    fontSize: 14,
    color: '#e74c3c', // 밝은 빨간색 추천수
    marginTop: 3,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 5,
    backgroundColor: '#3f51b5', // 인망블루 페이지 버튼
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  currentPageButton: {
    backgroundColor: '#283593', // 더 짙은 인망블루 현재 페이지 버튼
  },
  pageButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  pageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  iconContainer: {
    padding: 10,
  },
  button: {
    alignItems: 'center',
  },
  noticeContainer: {
    padding: 5,
    backgroundColor: '#d4e67b', // 밝은 노란색 배경
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50', // 짙은 회색 제목
    flexDirection: 'row', // 아이콘과 텍스트를 한 줄로 정렬
    alignItems: 'center', // 아이템을 수직 가운데 정렬
    marginBottom: 5,
  },
  noticeContent: {
    fontSize: 15,
    color: 'black', // 중간 회색 내용
  },
  noticeDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'right',
  },
});

export default Board;
