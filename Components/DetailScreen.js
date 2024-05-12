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
import {useImage} from './ImageContext';
import {Button} from 'react-native';

const DetailScreen = ({route}) => {
  const {title, username, date, text, picture, boardId} = route.params;
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기
  console.log('boardId:', boardId);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  // DetailScreen 컴포넌트 내에서 Menu 아이콘 및 상태 추가
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {setImageUri} = useImage();
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [replyId, setReplyId] = useState(null);

  useEffect(() => {
    setImageUri(boardData?.imgPath);
  }, [boardData]);

  // 메뉴 토글 함수
  const toggleMenu = () => {
    if (storedToken === null) {
      // 토큰값이 null인 경우 Alert를 띄웁니다.
      Alert.alert('알림', '회원만 가능한 메뉴입니다.', [{text: '확인'}], {
        cancelable: true,
      });
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchBoard(); // 화면이 다시 포커스를 받을 때마다 데이터 새로고침
    }
  }, [isFocused]); // isFocused 상태가 변경될 때마다 실행

  const handleDelete = async () => {
    try {
      // 해당 게시글이 현재 사용자의 것인지 확인하는 요청을 보냄
      const checkResponse = await axios.get(
        `http://localhost:8080/board/${boardId}/check`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            boardId,
          },
        },
      );

      if (checkResponse.data.success === 'True') {
        // 권한이 있을 경우 삭제 확인 다이얼로그를 표시
        Alert.alert(
          '삭제 확인',
          '정말 삭제하시겠어요?',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '삭제',
              onPress: async () => {
                try {
                  // 삭제 요청 보내기
                  const response = await axios.delete(
                    `http://localhost:8080/admin/board/${boardId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${storedToken}`,
                      },
                    },
                  );

                  if (response.data.success) {
                    // 삭제 성공 알림 표시
                    Alert.alert('알림', '게시글이 삭제되었습니다.');
                    // 삭제 후 이전 화면으로 돌아가기
                    navigateToPreviousScreen();
                  } else {
                    // 삭제 실패 알림 표시
                    Alert.alert('알림', '게시글 삭제에 실패했습니다.');
                  }
                } catch (error) {
                  console.error('게시글 삭제 중 오류 발생:', error);
                  Alert.alert('오류', '게시글 삭제 중 오류가 발생했습니다.');
                }
              },
            },
          ],
          {cancelable: true},
        );
      } else {
        // 권한이 없을 경우 알림 표시
        Alert.alert('알림', '게시글을 삭제할 수 있는 권한이 없습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 권한 확인 중 오류 발생:', error);
      Alert.alert('오류', '게시글 삭제 권한 확인 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = async () => {
    try {
      // 해당 게시글이 현재 사용자의 것인지 확인하는 요청을 보냄
      const checkResponse = await axios.get(
        `http://localhost:8080/board/${boardId}/check`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      console.log('토큰 값:', storedToken);

      console.log('서버 응답:', checkResponse.data); // 서버 응답을 콘솔에 출력

      if (checkResponse.data.success === 'True') {
        // 서버에서 True를 반환한 경우에만 수정 화면으로 이동
        navigation.navigate('EditScreen', {
          boardId, // 수정할 게시글의 boardId 전달
          imageUrl: boardData.imgPath
            ? `http://localhost:8080/image/boardImages/${boardData.imgPath}`
            : null,
        });
      } else {
        // 서버에서 False를 반환한 경우에는 알림을 표시
        Alert.alert('알림', '게시글을 수정할 수 있는 권한이 없습니다.');
      }
    } catch (error) {
      console.error('게시글 수정 권한 확인 중 오류 발생:', error);
      Alert.alert('오류', '게시글 수정 권한 확인 중 오류가 발생했습니다.');
    }
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

  // DetailScreen 컴포넌트 내에서 useFocusEffect 추가
  useFocusEffect(
    React.useCallback(() => {
      fetchBoard(); // 화면이 포커스를 받을 때마다 데이터 새로고침
    }, [boardId]), // boardId가 변경될 때마다 실행
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
    if (boardData && boardData.replies) {
      setComments(boardData.replies);
    }
  }, [boardData]);

  const viewImageFullScreen = () => {
    setModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() === '') {
      // 입력된 댓글이 없는 경우
      Alert.alert('알림', '댓글을 입력해주세요!');
    } else {
      try {
        const response = await axios.post(
          `http://localhost:8080/replies/${boardId}`,
          {comment: comment}, // 댓글 내용을 서버로 전송
          {
            headers: {
              Authorization: `Bearer ${storedToken}`, // 토큰을 Authorization 헤더에 포함
            },
          },
        );
        if (response.data.success) {
          // 서버에서 true를 반환한 경우
          Alert.alert('알림', '댓글 작성을 완료했습니다.');
          console.log(response.data);
          // 서버로부터 반환된 댓글 데이터를 받아와 상태에 추가
          const newComment = response.data.data; // 서버로부터 반환된 댓글 데이터
          setComments(prevComments => [...prevComments, newComment]); // 상태에 새로운 댓글 추가

          // 댓글을 추가한 후에 데이터를 다시 불러와서 화면을 업데이트
          fetchBoard();
        } else {
          // 서버에서 false를 반환한 경우
          Alert.alert('알림', '댓글 작성에 실패했습니다.');
        }
      } catch (error) {
        console.error('댓글 작성 중 오류 발생:', error);
        Alert.alert('오류', '댓글 작성 중 오류가 발생했습니다.');
      }
      setComment(''); // 댓글 입력 창 초기화
      Keyboard.dismiss(); // 키보드 숨기기
    }
  };

  const handleCommentOptions = async comment => {
    if (storedToken === null) {
      // 토큰값이 null인 경우 Alert를 띄웁니다.
      Alert.alert('알림', '회원만 가능한 메뉴입니다.', [{text: '확인'}], {
        cancelable: true,
      });
    } else {
      console.log('선택한 댓글 ID값:', comment.replyId);
      console.log('댓글 정보:', comment);

      try {
        // 헤더에 토큰값 추가
        const headers = {
          Authorization: `Bearer ${storedToken}`, // 토큰값을 여기에 넣어주세요
        };

        // replyUserCheck API를 호출하여 댓글 소유자인지 확인합니다.
        const response = await axios.get(
          `http://localhost:8080/replies/${comment.replyId}/check`,
          {
            headers: headers,
          },
        );
        const data = response.data;

        // 댓글 소유자인 경우에만 수정 및 삭제 옵션을 제공합니다.
        if (data.success === 'True') {
          console.log(response.data);
          Alert.alert(
            '댓글 옵션',
            '원하시는 메뉴를 선택해주세요!',
            [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '수정',
                onPress: () => {
                  openModal(comment.id, comment.comment, comment.replyId); // 여기에 필요한 인자 전달
                },
              },
              {
                text: '삭제',
                onPress: () => {
                  Alert.alert(
                    '삭제 확인',
                    '정말 삭제하시겠어요?',
                    [
                      {
                        text: '아니요',
                        style: 'cancel',
                      },
                      {
                        text: '예',
                        onPress: () => deleteComment(comment.replyId),
                      },
                    ],
                    {cancelable: false},
                  );
                },
              },
            ],
            {cancelable: true},
          );
        } else {
          // 댓글 소유자가 아닌 경우, 메시지를 표시합니다.
          Alert.alert('알림', '댓글을 수정하거나 삭제할 권한이 없습니다.');
        }
      } catch (error) {
        // API 호출 중 오류가 발생한 경우, 알맞은 에러 처리를 해줍니다.
        // 예를 들어, 네트워크 오류 등에 대한 메시지를 사용자에게 알려줄 수 있습니다.
      }
    }
  };

  const openModal = (id, commentText, replyId) => {
    setEditCommentId(id);
    setEditCommentText(commentText);
    setReplyId(replyId); // 모달 열 때 replyId 전달
  };

  const editComment = comment => {
    // 댓글 수정 로직 구현
    console.log('수정할 댓글:', comment);
    // 여기에 수정 로직 추가
  };

  const deleteComment = replyId => {
    axios
      .delete(`http://localhost:8080/replies/${replyId}`)
      .then(response => {
        // 삭제 요청이 성공했을 때 실행할 코드
        fetchBoard();
        console.log(response.data); // 서버로부터의 응답 데이터
        // 여기에 추가적인 로직을 작성할 수 있습니다.
      })
      .catch(error => {
        // 삭제 요청이 실패했을 때 실행할 코드
        console.error('댓글 삭제 실패:', error);
      });
  };
  const scrollToBottom = () => {
    // ScrollView의 스크롤을 최하단으로 이동
    scrollViewRef.current.scrollToEnd({animated: true});
  };
  const submitEditComment = async () => {
    if (!editCommentText.trim()) {
      // trim()을 사용하여 빈 공백을 제거하고 댓글이 비어 있는지 확인합니다.
      Alert.alert('알림', '댓글을 입력해주세요!');
      return; // 댓글이 비어 있으면 함수를 종료합니다.
    }
    if (!replyId) {
      Alert.alert('오류', '댓글의 ID가 제공되지 않았습니다.');
      return;
    }
    try {
      console.log('수정할 댓글의 replyId:', replyId);
      const response = await axios.post(
        `http://localhost:8080/replies/${replyId}/edit`,
        {comment: editCommentText},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );
      if (response.data.success) {
        Alert.alert('알림', '댓글이 수정되었습니다.');
        fetchBoard();
        setEditCommentId(null);
        setEditCommentText('');
      } else {
        Alert.alert('알림', '댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
      Alert.alert('오류', '댓글 수정 중 오류가 발생했습니다.');
    }
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
              <View style={styles.commentRow}>
                <Text style={styles.commentAuthor}>{item.nickName}</Text>
                <View style={styles.commentContentContainer}>
                  <Text style={styles.commentContent}>{item.comment}</Text>
                </View>
                <TouchableOpacity onPress={() => handleCommentOptions(item)}>
                  <Icon name="more-vert" size={24} color="black" />
                </TouchableOpacity>
              </View>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={editCommentId !== null}
        onRequestClose={() => {
          setEditCommentId(null);
          setEditCommentText('');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={[
                styles.modalHeaderText,
                {
                  fontSize: 30,
                  textAlign: 'center',
                  marginBottom: 20,
                  fontWeight: 'bold',
                  color: 'black',
                },
              ]}>
              댓글 수정
            </Text>

            <TextInput
              style={[
                styles.modalTextInput,
                {
                  width: '100%',
                  height: 100,
                  textAlignVertical: 'top',
                  fontSize: 18,
                },
              ]}
              onChangeText={setEditCommentText}
              value={editCommentText}
            />
            <TouchableOpacity
              style={{backgroundColor: '#4d91da', padding: 10, borderRadius: 5}}
              onPress={submitEditComment}>
              <Text style={{color: '#fff', textAlign: 'center', fontSize: 18}}>
                수정 완료
              </Text>
            </TouchableOpacity>
            <View style={{marginBottom: 20, width: '100%'}} />
            <TouchableOpacity
              style={{backgroundColor: '#4d4f52', padding: 10, borderRadius: 5}}
              onPress={() => {
                setEditCommentId(null);
                setEditCommentText('');
              }}>
              <Text style={{color: '#fff', textAlign: 'center', fontSize: 18}}>
                닫기
              </Text>
            </TouchableOpacity>
          </View>
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
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentContentContainer: {
    flex: 1,
    marginLeft: 10,
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
  // recommendButton 스타일 수정
  recommendButton: {
    backgroundColor: '#4d91da',
    position: 'absolute',
    marginTop: 630,
    alignSelf: 'center', // 가로 중앙 정렬
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경색 및 투명도 조절
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%', // 모달의 너비를 80%로 고정
  },
  modalTextInput: {
    width: '100%', // TextInput의 너비를 100%로 설정
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default DetailScreen;
