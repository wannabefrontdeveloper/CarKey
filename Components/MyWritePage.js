import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useToken} from './TokenContext';
import axios from 'axios';

const MyWritePage = () => {
  const [boardData, setBoardData] = useState([]);
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 한 페이지에 보여질 항목 수
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기
  const [refreshing, setRefreshing] = useState(false);

  // 현재 페이지에 해당하는 항목들만 가져오는 함수
  const getItemsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return boardData.slice(startIndex, endIndex);
  };

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
  };

  useEffect(() => {
    // 서버에서 데이터를 가져오는 함수 호출
    fetchMyBoardData();
  }, []);

  // 서버에서 데이터를 가져오는 함수
  const fetchMyBoardData = async () => {
    try {
      console.log('Fetching board data...');
      const response = await axios.get(
        'http://ceprj.gachon.ac.kr:60020/user/mypage/boardList',
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
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

  const ListItem = ({title, username, date, text, boardId, recommendCount}) => {
    // date를 JavaScript Date 객체로 파싱
    const parsedDate = new Date(date);

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
        username,
        date,
        text,
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
            <Text style={styles.listItemUsername}>{username}</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={navigateToMyPage}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.navbarTextContainer}>
          <Text style={styles.navbarText}>내가 쓴 글</Text>
        </View>
      </View>
      <FlatList
        data={getItemsForCurrentPage()}
        renderItem={({item}) => (
          <ListItem
            title={item.title}
            username={item.nickName}
            date={item.postDate}
            text={item.text}
            recommendCount={item.recommendCount}
            boardId={item.boardId}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.pageButtonsContainer}>{renderPageButtons()}</View>
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
    backgroundColor: '#3f51b5', // 인디고 블루 네비게이션 바
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
    backgroundColor: '#3f51b5', // 인디고 블루 하단 네비게이션 바
  },
  button: {},
  navbarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  iconContainer: {
    padding: 5,
  },
  listItemText: {
    fontSize: 20,
    flex: 1,
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
  userInfoContainer: {
    alignItems: 'flex-end',
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 5,
    backgroundColor: '#3f51b5', // 인디고 블루 페이지 버튼
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 7,
  },
  currentPageButton: {
    backgroundColor: '#283593', // 더 짙은 인디고 블루 현재 페이지 버튼
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
  navbarTextContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
});

export default MyWritePage;
