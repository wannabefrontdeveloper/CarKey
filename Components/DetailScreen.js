import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert, // Alert 추가
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native'; // useIsFocused 추가
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {useToken} from './TokenContext'; // TokenContext에서 useToken 가져오기
import {useFocusEffect} from '@react-navigation/native';

const DetailScreen = ({route}) => {
  const {title, username, date, text, picture, boardId} = route.params;
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기
  console.log('boardId:', boardId);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  // DetailScreen 컴포넌트 내에서 Menu 아이콘 및 상태 추가
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isFocused = useIsFocused(); // 화면의 포커스 여부 확인
  // 나머지 코드 생략
  useEffect(() => {
    if (isFocused) {
      fetchBoard(); // 화면이 다시 포커스를 받을 때마다 데이터 새로고침
    }
  }, [isFocused]); // isFocused 상태가 변경될 때마다 실행

  // 삭제 기능 함수
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/board/${boardId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );
      if (response.data.success) {
        // 삭제 성공
        Alert.alert('알림', '게시글이 삭제되었습니다.');
        // 삭제 후 이전 화면으로 돌아가기
        navigateToPreviousScreen();
      } else {
        // 삭제 실패
        Alert.alert('알림', '게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 중 오류 발생:', error);
      Alert.alert('오류', '게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = () => {
    // 수정 화면으로 이동하고 현재 게시글 데이터를 전달할 수 있습니다.
    navigation.navigate('EditScreen', {boardId, imageUrl: boardData.imgPath});
  };

  const [boardData, setBoardData] = useState(null); // 서버에서 받은 게시판 데이터를 저장할 상태

  const fetchBoard = async () => {
    try {
      const url = `http://localhost:8080/board/${boardId}`;
      const response = await axios.get(url);
      setBoardData(response.data.data); // 서버에서 받은 데이터를 boardData에 저장
      console.log('서버에서 받은 데이터:', response.data);
    } catch (error) {
      console.error('데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchBoard();
    }, [boardId]),
  );

  const navigation = useNavigation();
  const scrollViewRef = useRef(null); // ScrollView에 대한 ref 생성

  const navigateToPreviousScreen = () => {
    navigation.goBack();
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const dummyComments = [];
    setComments(dummyComments);
  }, []);

  const viewImageFullScreen = () => {
    setModalVisible(true);
  };

  const handleImageLoad = () => {
    setIsLoadingImage(false);
  };

  const handleCommentSubmit = () => {
    if (comment.trim() === '') {
      // 입력된 댓글이 없는 경우
      Alert.alert('알림', '댓글을 입력해주세요!');
    } else {
      console.log('댓글 전송:', comment);
      setComment('');
      Keyboard.dismiss(); // 댓글 작성 후 키보드 숨기기
    }
  };

  const scrollToBottom = () => {
    // ScrollView의 스크롤을 최하단으로 이동
    scrollViewRef.current.scrollToEnd({animated: true});
  };
  const handleRecommend = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`, // 토큰을 Authorization 헤더에 포함
        },
      };

      const response = await axios.post(
        `http://localhost:8080/board/${boardId}/recommend`,
        null,
        config,
      );

      if (response.data.success) {
        // 백엔드에서 true를 반환한 경우
        Alert.alert('알림', '감사합니다!');
        // 추천 요청이 성공하면 화면을 다시 그림
        fetchBoard();
      } else {
        // 백엔드에서 false를 반환한 경우
        Alert.alert('알림', '게시글 추천을 취소하셨습니다!');
      }
    } catch (error) {
      console.error('추천 요청 중 오류 발생:', error);
      Alert.alert('오류', '추천 요청 중 오류가 발생했습니다.');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={navigateToPreviousScreen}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.navbarText}>
          {/* title이 8글자보다 길면 8글자까지만 잘라서 표시 */}
          {title.length > 6 ? `${title.substring(0, 6)}...` : title}
        </Text>
        <TouchableOpacity style={styles.menuContainer} onPress={toggleMenu}>
          <Icon name="more-vert" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
      {isMenuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.menuItem}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.menuItem}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef} // ScrollView에 ref 연결
        style={styles.content}
        contentContainerStyle={{paddingBottom: 100}}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -250}>
          <TextInput
            style={styles.input}
            value={`작성자: ${boardData ? boardData.nickName : ''}`} // 작성자 이름을 표시
            autoCapitalize="none"
            placeholderTextColor="#0e0d0d"
            editable={false}
          />
          {/* 시간까지 표시되도록 수정 */}
          <TextInput
            style={styles.input}
            value={`작성 시간: ${boardData ? boardData.postDate : ''}`}
            autoCapitalize="none"
            placeholderTextColor="#0e0d0d"
            editable={false}
          />
          <TouchableOpacity onPress={viewImageFullScreen}>
            {boardData && boardData.imgPath && (
              <Image
                source={{
                  uri: `http://localhost:8080/image/boardImages/${boardData.imgPath}`,
                }}
                style={styles.picture}
              />
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={`수리 비용: ${boardData ? boardData.cost : ''}`} // 작성자 이름을 표시
            autoCapitalize="none"
            placeholderTextColor="#0e0d0d"
            editable={false}
          />
          <TextInput
            style={[styles.input, styles.textInput]}
            placeholder={text}
            autoCapitalize="none"
            placeholderTextColor="#0a0a0a"
            value={`${boardData ? boardData.comment : ''}`}
            editable={false}
            multiline={true}
            numberOfLines={10}
          />
          <TouchableOpacity
            style={styles.recommendButton}
            onPress={handleRecommend}>
            <Text style={styles.recommendButtonText}>
              유용한 정보였다면 터치! 👍 (
              {boardData ? boardData.recommendCount : ''})
            </Text>
          </TouchableOpacity>
          <Text style={styles.Comment}>댓글</Text>
          {comments.map(item => (
            <View
              key={item.id}
              style={[styles.commentContainer, styles.commentItem]}>
              <Text style={styles.commentAuthor}>{item.author}</Text>
              <Text style={styles.commentContent}>{item.content}</Text>
            </View>
          ))}
        </KeyboardAvoidingView>
      </ScrollView>
      <TextInput
        style={[styles.input, styles.commentInput]}
        placeholder="댓글을 입력하세요"
        value={comment}
        onChangeText={setComment}
        autoCapitalize="none"
        placeholderTextColor="#0a0a0a"
        onFocus={scrollToBottom} // TextInput이 포커스를 받으면 화면 최하단으로 이동
      />
      <TouchableOpacity
        style={styles.commentButton}
        onPress={handleCommentSubmit}>
        <Text style={styles.commentButtonText}>댓글 달기</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            {boardData && boardData.imgPath ? (
              <Image
                source={{
                  uri: `http://localhost:8080/image/boardImages/${boardData.imgPath}`,
                }}
                style={styles.modalImage}
              />
            ) : null}
          </TouchableWithoutFeedback>
        </View>
      </Modal>
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
    alignItems: 'center',
    backgroundColor: '#4d91da',
    marginBottom: 0,
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  iconContainer: {
    padding: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 18,
    marginTop: 10,
    color: 'black',
  },
  content: {
    padding: 20,
  },
  textInput: {
    height: 150,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  picture: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: Dimensions.get('window').width - 10,
    height: Dimensions.get('window').height - 10,
    resizeMode: 'contain',
  },
  Comment: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginTop: 80,
  },
  commentInput: {
    marginBottom: 0,
    width: 320,
    height: 52,
  },
  commentButton: {
    backgroundColor: '#4d91da',
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: -20,
    marginRight: -15,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentContent: {
    marginLeft: 20,
  },
  commentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    paddingBottom: 10,
    marginBottom: 10,
  },
  recommendButton: {
    backgroundColor: '#4d91da',
    position: 'absolute',
    bottom: 80,
    right: 90,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  recommendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  // 메뉴 스타일
  menu: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    zIndex: 1,
  },
  menuItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuContainer: {
    position: 'absolute',
    top: 10,
    right: 25,
  },
});

export default DetailScreen;
