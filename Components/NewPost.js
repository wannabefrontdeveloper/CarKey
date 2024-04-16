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

const NewPost = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [repairCost, setRepairCost] = useState('');

  const handleChoosePhoto = () => {
    // 사진을 첨부하기 전에 Alert를 표시
    Alert.alert(
      '알림',
      '사고 부위가 잘 나온 사진으로 첨부해주세요!',
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
    if (title || content || image || repairCost) {
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

  const viewImageFullScreen = () => {
    if (image) {
      navigation.navigate('ImageFullScreen', {imageUri: image.uri});
    }
  };

  const handleSubmit = () => {
    if (!title || !image || !repairCost || !content) {
      Alert.alert('입력 필요', '모든 항목을 입력해주세요.');
      return;
    }

    navigation.navigate('Board');
  };

  const handleCheckIconPress = () => {
    Alert.alert(
      '글 작성 완료',
      '글 작성을 완료하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: '확인', onPress: handleSubmit},
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
              onPress={navigateToBoard}>
              <Icon name="arrow-back" size={35} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.navbarText}>새 글 쓰기</Text>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={handleCheckIconPress}>
              <Icon name="check" size={35} color="#ffffff" />
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

          <View style={styles.repairCostContainer}>
            <TextInput
              style={[styles.input, styles.repairCostInput]}
              placeholder="수리비는 얼마가 나왔나요?"
              value={repairCost}
              onChangeText={setRepairCost}
              keyboardType="numeric"
            />
            <Text style={styles.currencyText}>원</Text>
          </View>

          <TextInput
            style={[styles.input, styles.multiLineInput]}
            value={content}
            onChangeText={setContent}
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
    backgroundColor: '#4d91da',
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

export default NewPost;