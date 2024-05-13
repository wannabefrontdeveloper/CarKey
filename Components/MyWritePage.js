import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
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

  const items = [];

  // 현재 페이지에 해당하는 항목들만 가져오는 함수
  const getItemsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
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
    const formattedDate = `${year}-${month}-${day}-${hours}:${minutes}`;

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
          <Text style={styles.listItemText}>{title}</Text>
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
        <TouchableOpacity style={styles.iconContainer}>
          <Icon
            name="arrow-back"
            size={30}
            onPress={navigateToMyPage}
            color="#ffffff"
          />
        </TouchableOpacity>
        <View style={styles.navbarTextContainer}>
          <Text style={styles.navbarText}>내가 쓴 글</Text>
        </View>
      </View>
      <FlatList
        data={boardData}
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
  navbarTextContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
});

export default MyWritePage;
