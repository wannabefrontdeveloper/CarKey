import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const Board = () => {
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
      username: 'giwonk',
      date: '2024-04-10',
      text: '3중 추돌 후기',
    },
    {
      id: '3',
      username: 'giwonk',
      date: '2024-04-10',
      text: '3중 추돌 후기',
    },
    {
      id: '4',
      username: 'giwonk',
      date: '2024-04-10',
      text: '3중 추돌 후기',
    },
    {
      id: '5',
      username: 'giwonk',
      date: '2024-04-10',
      text: '3중 추돌 후기',
    },
    {
      id: '6',
      username: 'giwonk',
      date: '2024-04-10',
      text: '3중 추돌 후기',
    },
    {
      id: '7',
      username: 'giwonk',
      date: '2024-04-10',
      text: '3중 추돌 후기',
    },
    {
      id: '8',
      username: 'giwonk',
      date: '2024-04-10',
      text: '3중 추돌 후기',
    },
    {
      id: '9',
      username: 'giwonk',
      date: '2024-04-10',
      text: '3중 추돌 후기',
    },
    {
      id: '10',
      username: 'giwonk',
      date: '2024-04-10',
      text: '3중 추돌 후기',
    },
  ];

  // 현재 페이지에 해당하는 항목들만 가져오는 함수
  const getItemsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
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

    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>{text}</Text>
        <View style={styles.userInfoContainer}>
          <Text style={styles.listItemUsername}>{username}</Text>
          <Text style={styles.listItemDate}>{formattedDate}</Text>
        </View>
      </View>
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

export default Board;
