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
  Alert,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {useToken} from './TokenContext';
import {useFocusEffect} from '@react-navigation/native';
import {useImage} from './ImageContext';

const DetailScreen = ({route}) => {
  const {title, username, date, text, picture, boardId} = route.params;
  const {storedToken} = useToken();
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {setImageUri} = useImage();
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [replyId, setReplyId] = useState(null);

  useEffect(() => {
    setImageUri(boardData?.imgPath);
  }, [boardData]);

  const toggleMenu = () => {
    if (storedToken === null) {
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
      fetchBoard();
    }
  }, [isFocused]);

  const handleDelete = async () => {
    try {
      const checkResponse = await axios.get(
        `http://ceprj.gachon.ac.kr:60020/board/${boardId}/check`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            boardId,
          },
        },
      );

      if (checkResponse.data.success === 'True') {
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
                  const response = await axios.delete(
                    `http://ceprj.gachon.ac.kr:60020/admin/board/${boardId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${storedToken}`,
                      },
                    },
                  );

                  if (response.data.success) {
                    Alert.alert('알림', '게시글이 삭제되었습니다.');
                    navigateToPreviousScreen();
                  } else {
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
        Alert.alert('알림', '게시글을 삭제할 수 있는 권한이 없습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 권한 확인 중 오류 발생:', error);
      Alert.alert('오류', '게시글 삭제 권한 확인 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = async () => {
    try {
      const checkResponse = await axios.get(
        `http://ceprj.gachon.ac.kr:60020/board/${boardId}/check`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      console.log('토큰 값:', storedToken);
      console.log('서버 응답:', checkResponse.data);

      if (checkResponse.data.success === 'True') {
        navigation.navigate('EditScreen', {
          boardId,
          imageUrl: boardData.imgPath
            ? `http://ceprj.gachon.ac.kr:60020/image/boardImages/${boardData.imgPath}`
            : null,
        });
      } else {
        Alert.alert('알림', '게시글을 수정할 수 있는 권한이 없습니다.');
      }
    } catch (error) {
      console.error('게시글 수정 권한 확인 중 오류 발생:', error);
      Alert.alert('오류', '게시글 수정 권한 확인 중 오류가 발생했습니다.');
    }
  };

  const [boardData, setBoardData] = useState(null);

  const fetchBoard = async () => {
    try {
      const url = `http://ceprj.gachon.ac.kr:60020/board/${boardId}`;
      const response = await axios.get(url);
      setBoardData(response.data.data);
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
  const scrollViewRef = useRef(null);

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
    if (storedToken === null) {
      Alert.alert(
        '알림',
        '로그인한 회원만 댓글을 달 수 있습니다.',
        [{text: '확인'}],
        {
          cancelable: true,
        },
      );
    } else {
      if (comment.trim() === '') {
        Alert.alert('알림', '댓글을 입력해주세요!');
      } else {
        try {
          const response = await axios.post(
            `http://ceprj.gachon.ac.kr:60020/replies/${boardId}`,
            {comment: comment},
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            },
          );
          if (response.data.success) {
            Alert.alert('알림', '댓글 작성을 완료했습니다.');
            console.log(response.data);
            const newComment = response.data.data;
            setComments(prevComments => [...prevComments, newComment]);
            fetchBoard();
          } else {
            Alert.alert('알림', '댓글 작성에 실패했습니다.');
          }
        } catch (error) {
          console.error('댓글 작성 중 오류 발생:', error);
          Alert.alert('오류', '댓글 작성 중 오류가 발생했습니다.');
        }
        setComment('');
        Keyboard.dismiss();
      }
    }
  };

  const handleCommentOptions = async comment => {
    if (storedToken === null) {
      Alert.alert('알림', '회원만 가능한 메뉴입니다.', [{text: '확인'}], {
        cancelable: true,
      });
    } else {
      console.log('선택한 댓글 ID값:', comment.replyId);
      console.log('댓글 정보:', comment);

      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const response = await axios.get(
          `http://ceprj.gachon.ac.kr:60020/replies/${comment.replyId}/check`,
          {
            headers: headers,
          },
        );
        const data = response.data;

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
                  openModal(comment.id, comment.comment, comment.replyId);
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
          Alert.alert('알림', '댓글을 수정하거나 삭제할 권한이 없습니다.');
        }
      } catch (error) {
        console.error('댓글 옵션 처리 중 오류 발생:', error);
      }
    }
  };

  const openModal = (id, commentText, replyId) => {
    setEditCommentId(id);
    setEditCommentText(commentText);
    setReplyId(replyId);
  };

  const editComment = comment => {
    console.log('수정할 댓글:', comment);
  };

  const deleteComment = replyId => {
    axios
      .delete(`http://ceprj.gachon.ac.kr:60020/replies/${replyId}`)
      .then(response => {
        fetchBoard();
        console.log(response.data);
      })
      .catch(error => {
        console.error('댓글 삭제 실패:', error);
      });
  };

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({animated: true});
  };

  const submitEditComment = async () => {
    if (!editCommentText.trim()) {
      Alert.alert('알림', '댓글을 입력해주세요!');
      return;
    }
    if (!replyId) {
      Alert.alert('오류', '댓글의 ID가 제공되지 않았습니다.');
      return;
    }
    try {
      console.log('수정할 댓글의 replyId:', replyId);
      const response = await axios.post(
        `http://ceprj.gachon.ac.kr:60020/replies/${replyId}/edit`,
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
    if (storedToken === null) {
      Alert.alert('알림', '회원만 추천을 할 수 있습니다.', [{text: '확인'}], {
        cancelable: true,
      });
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        };

        const response = await axios.post(
          `http://ceprj.gachon.ac.kr:60020/board/${boardId}/recommend`,
          null,
          config,
        );

        if (response.data.success) {
          Alert.alert('알림', '감사합니다!');
          fetchBoard();
        } else {
          Alert.alert('알림', '게시글 추천을 취소하셨습니다!');
        }
      } catch (error) {
        console.error('추천 요청 중 오류 발생:', error);
        Alert.alert('오류', '추천 요청 중 오류가 발생했습니다.');
      }
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
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={{paddingBottom: 100}}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -250}>
          <TextInput
            style={styles.input}
            value={`작성자: ${boardData ? boardData.nickName : ''}`}
            autoCapitalize="none"
            placeholderTextColor="#0e0d0d"
            editable={false}
          />
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
                  uri: `http://ceprj.gachon.ac.kr:60020/image/boardImages/${boardData.imgPath}`,
                }}
                style={styles.picture}
              />
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={`수리 비용: ${boardData ? boardData.cost : ''}`}
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
        onFocus={scrollToBottom}
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
                  uri: `http://ceprj.gachon.ac.kr:60020/image/boardImages/${boardData.imgPath}`,
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
              style={{backgroundColor: '#3f51b5', padding: 10, borderRadius: 5}}
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
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
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
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ffffff',
  },
  picture: {
    width: 250,
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
    backgroundColor: '#ffffff',
  },
  commentButton: {
    backgroundColor: '#3f51b5',
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
    backgroundColor: '#3f51b5',
    position: 'absolute',
    marginTop: 630,
    alignSelf: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  recommendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    width: '80%',
  },
  modalTextInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default DetailScreen;
