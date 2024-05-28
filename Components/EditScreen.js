import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {useToken} from './TokenContext';
import axios from 'axios';

const EditScreen = ({route}) => {
  // route에서 params를 받아옴
  const {boardId, closerImageUrl, entireImageUrl} = route.params; // route.params에서 boardId, closerImageUrl, entireImageUrl를 추출
  console.log('boardId:', boardId);
  console.log('closerImageUrl:', closerImageUrl); // closerImageUrl 확인용
  console.log('entireImageUrl:', entireImageUrl); // entireImageUrl 확인용
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image1, setImage1] = useState(
    closerImageUrl ? {uri: closerImageUrl} : null,
  ); // 초기 이미지 상태 설정
  const [image2, setImage2] = useState(
    entireImageUrl ? {uri: entireImageUrl} : null,
  ); // 초기 이미지 상태 설정
  const [repairCost, setRepairCost] = useState('');
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기
  const [boardData, setBoardData] = useState(null); // 서버에서 받은 게시판 데이터를 저장할 상태
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [boardRepairCost, setBoardRepairCost] = useState('');

  const fetchBoard = async () => {
    try {
      const url = `http://ceprj.gachon.ac.kr:60020/board/${boardId}`;
      const response = await axios.get(url);
      setBoardData(response.data.data); // 서버에서 받은 데이터를 boardData에 저장
      console.log('서버에서 받은 데이터:', response.data);
    } catch (error) {
      console.error('데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    // 서버에서 받아온 데이터가 있다면 해당 데이터로 상태 초기화
    if (boardData) {
      setBoardTitle(boardData.title);
      setBoardContent(boardData.comment);
      setBoardRepairCost(boardData.cost);
    }
  }, [boardData]);

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const handleChoosePhoto = setImage => {
    // 사진을 첨부하기 전에 Alert를 표시
    Alert.alert(
      '알림',
      '사고 부위가 확대된 사진으로 첨부해주세요!',
      [
        {text: '취소', onPress: () => console.log('사진 첨부 취소')},
        {
          text: '확인',
          onPress: () =>
            launchImageLibrary({noData: true}, response => {
              console.log('Response:', response);
              if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                setImage(selectedImage);
              }
            }),
        },
      ],
      {cancelable: false},
    );
  };

  const handleChoosePhoto2 = setImage => {
    // 사진을 첨부하기 전에 Alert를 표시
    Alert.alert(
      '알림',
      '차량이 손상부위와 함께 전체적으로 나온 사진을 올려주세요!',
      [
        {text: '취소', onPress: () => console.log('사진 첨부 취소')},
        {
          text: '확인',
          onPress: () =>
            launchImageLibrary({noData: true}, response => {
              console.log('Response:', response);
              if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                setImage(selectedImage);
              }
            }),
        },
      ],
      {cancelable: false},
    );
  };

  const navigateToBoard = () => {
    if (title || content || image1 || image2 || repairCost) {
      // 작성 중인 내용이 있을 경우에만 Alert 표시
      Alert.alert(
        '작성 중인 내용이 있습니다.',
        '정말로 나가시겠습니까?',
        [
          {text: '취소', style: 'cancel'},
          {text: '나가기', onPress: () => navigation.navigate('Board')},
        ],
        {cancelable: false},
      );
    } else {
      navigation.navigate('Board');
    }
  };

  const viewImageFullScreen = imageUri => {
    if (imageUri) {
      navigation.navigate('ImageFullScreen', {imageUri: imageUri});
    }
  };

  const handleCheckIconPress = async () => {
    // 수정 완료 여부를 사용자에게 확인
    Alert.alert(
      '수정 완료',
      '수정을 완료하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              // 이미지가 선택되지 않았을 때 기존 이미지를 사용
              const selectedImage1 = image1 ? image1 : {uri: closerImageUrl};
              const selectedImage2 = image2 ? image2 : {uri: entireImageUrl};

              // 쉼표(,)를 제거한 수리비 값
              const cleanedRepairCost = boardRepairCost.replace(/,/g, '');

              const formData = new FormData();
              formData.append(
                'boardDto',
                JSON.stringify({
                  title: boardTitle,
                  cost: cleanedRepairCost,
                  comment: boardContent,
                }),
              );

              // 첫 번째 이미지가 있는 경우 추가
              if (selectedImage1.uri) {
                formData.append('image', {
                  uri: selectedImage1.uri,
                  name: selectedImage1.fileName || 'closerImage.jpg',
                  type: selectedImage1.type || 'image/jpeg',
                });
              }

              // 두 번째 이미지가 있는 경우 추가
              if (selectedImage2.uri) {
                formData.append('image', {
                  uri: selectedImage2.uri,
                  name: selectedImage2.fileName || 'entireImage.jpg',
                  type: selectedImage2.type || 'image/jpeg',
                });
              }

              console.log('보낼 데이터:', formData); // 데이터 확인용 로그

              const response = await axios.put(
                `http://ceprj.gachon.ac.kr:60020/board/${boardId}/edit`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${storedToken}`,
                  },
                },
              );

              console.log('Response:', response.data);
              navigation.navigate('Board'); // 게시판 화면으로 이동
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('오류', '게시글 수정 중 오류가 발생했습니다.');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.navbar}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={35} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.navbarText}>게시글 수정</Text>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={handleCheckIconPress}>
              <Icon name="check" size={35} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="제목을 입력하세요 (최대 15글자)"
            value={boardTitle}
            onChangeText={text => {
              // 입력된 텍스트에서 공백을 제거하고 15글자까지 자르기
              const trimmedText = text.trim().substring(0, 15);
              if (trimmedText.length > 15) {
                // 제목이 15글자를 초과하는 경우 Alert를 띄워주기
                Alert.alert(
                  '입력 제한',
                  '제목은 최대 15글자까지 입력 가능합니다.',
                );
              } else {
                setBoardTitle(trimmedText);
              }
            }}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChoosePhoto(setImage1)}>
            <Text style={styles.buttonText}>
              자세한 손상 부위 사진을 첨부하세요
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => viewImageFullScreen(image1?.uri)}>
            <Text style={styles.imageText}>자세한 손상 부위 사진:</Text>
            {image1 && (
              <Image
                source={{uri: image1.uri}}
                style={[styles.previewImage, {alignSelf: 'center'}]}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChoosePhoto2(setImage2)}>
            <Text style={styles.buttonText}>전체 차량 사진을 첨부하세요</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => viewImageFullScreen(image2?.uri)}>
            <Text style={styles.imageText}>전체 차량 사진:</Text>
            {image2 && (
              <Image
                source={{uri: image2.uri}}
                style={[styles.previewImage, {alignSelf: 'center'}]}
              />
            )}
          </TouchableOpacity>
          <View style={styles.repairCostContainer}>
            <TextInput
              style={[styles.input, styles.repairCostInput]}
              placeholder="수리비는 얼마가 나왔나요?"
              value={boardRepairCost}
              onChangeText={setBoardRepairCost}
              keyboardType="numeric"
            />
            <Text style={styles.currencyText}>원</Text>
          </View>

          <TextInput
            style={[styles.input, styles.multiLineInput]}
            value={boardContent}
            onChangeText={setBoardContent}
            placeholder="내용을 입력하세요"
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: '#3f51b5',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 35,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flexGrow: 1,
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
  },
  multiLineInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
    backgroundColor: '#DDDDDD',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  previewImage: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageText: {
    fontSize: 20,
    marginBottom: 10,
  },
  repairCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 수평으로 가운데 정렬
    marginBottom: 16, // 조정 필요
  },
  repairCostInput: {
    width: 200, // 조정 필요
    height: 50, // 조정 필요
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
  },
  currencyText: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default EditScreen;
