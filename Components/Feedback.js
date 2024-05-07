import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useToken} from './TokenContext';

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [feedback, setFeedback] = useState('');
  const [image, setImage] = useState(null);
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기

  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      console.log('Response:', response); // 확인용 로그
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImage(selectedImage);
      }
    });
  };

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
  };

  const navigateToFinishFeedback = async () => {
    if (!title || !feedback || !image) {
      Alert.alert(
        '입력 필요',
        '제목, 사진 첨부, 의견 및 피드백을 모두 입력해주세요.',
      );
      return;
    }

    try {
      const formData = new FormData();

      // boardSaveRequestDto 데이터를 JSON 문자열로 추가
      const dto = {
        title,
        comment: feedback,
      };
      formData.append('feedbackSaveRequestDto', JSON.stringify(dto));

      // 이미지 데이터 추가
      formData.append('image', {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      });
      console.log(formData);

      const response = await axios.post(
        'http://localhost:8080/mypage/feedback/save',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );
      console.log('Response:', response.data);
      navigation.navigate('MyPage');
      Alert.alert('의견 감사합니다!', '신속히 읽고 반영하겠습니다!');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('오류', '글 작성 중 오류가 발생했습니다.');
    }
  };

  const viewImageFullScreen = () => {
    if (image) {
      navigation.navigate('ImageFullScreen', {imageUri: image.uri});
    }
  };

  const handleSubmitFeedback = () => {
    console.log('Title:', title);
    console.log('Feedback:', feedback);
    if (image) {
      console.log('Image URI:', image.uri);
    }
    setTitle('');
    setFeedback('');
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View>
            <View style={styles.navbar}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={navigateToMyPage}>
                <Icon name="arrow-back" size={30} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.navbarText}>의견 및 피드백</Text>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={navigateToFinishFeedback}>
                <Icon name="check" size={30} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
            />

            <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
              <Text style={styles.buttonText}>사진을 첨부하세요</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={viewImageFullScreen}>
              <Text style={styles.imageText}>첨부된 사진:</Text>
              {image && (
                <Image
                  source={{uri: image.uri}}
                  style={[styles.previewImage, {alignSelf: 'center'}]}
                />
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.inputfeedback}
              placeholder="의견이나 개선사항을 알려주세요!"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  navbar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4d91da',
    paddingHorizontal: 10,
  },
  username: {
    fontSize: 18,
    marginBottom: 10,
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
    width: 300, // 예: 원하는 너비
    height: 300, // 예: 원하는 높이
    marginBottom: 10,
  },
  inputfeedback: {
    width: '100%',
    height: 200,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  navbarText: {
    fontSize: 24, // 예: 24로 설정하여 텍스트 크기를 키웁니다.
    color: '#ffffff', // 원하는 색상 추가
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default FeedbackScreen;
