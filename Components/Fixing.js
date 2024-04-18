import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const Fixing = () => {
  const navigation = useNavigation();
  const [isNicknameModalVisible, setIsNicknameModalVisible] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
  };

  const toggleNicknameModal = () => {
    setIsNicknameModalVisible(!isNicknameModalVisible);
  };

  const toggleEmailModal = () => {
    setIsEmailModalVisible(!isEmailModalVisible);
  };

  const togglePasswordModal = () => {
    setIsPasswordModalVisible(!isPasswordModalVisible);
  };

  const handleNicknameChange = text => {
    if (text.length <= 6) {
      setNicknameInput(text);
    } else {
      Alert.alert('알림', '닉네임은 최대 6글자입니다.');
    }
  };

  const NavBar = () => (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.iconContainer} onPress={navigateToMyPage}>
        <Icon name="arrow-back" size={30} color="#ffffff" />
      </TouchableOpacity>
      <Text style={styles.navbarText}>내 정보 수정</Text>
    </View>
  );

  const NickNameModalContent = ({title, toggleModal}) => (
    <View style={styles.modalOuterContainer}>
      <View style={styles.modalInnerContainer}>
        <Text style={styles.modalTitle}>{title}</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="새로운 닉네임을 입력하세요"
          value={nicknameInput}
          onChangeText={handleNicknameChange}
        />
        <TouchableOpacity
          style={styles.modalCheckButton}
          onPress={() => {
            /* TODO: 중복 확인 로직 처리 */
          }}>
          <Text style={styles.modalCheckButtonText}>중복 확인</Text>
        </TouchableOpacity>
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={toggleModal}>
            <Text style={styles.modalCancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalConfirmButton}
            onPress={() => {
              /* TODO: 닉네임 변경 로직 처리 */
            }}>
            <Text style={styles.modalConfirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const EmailModalContent = ({title, toggleModal}) => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
          <Text style={styles.closeButtonText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const PasswordModalContent = ({title, toggleModal}) => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
          <Text style={styles.closeButtonText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <NavBar />
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: 'https://w7.pngwing.com/pngs/753/432/png-transparent-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-people.png',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.label}>닉네임</Text>
        <TextInput style={styles.input} placeholder="giwonk" editable={false} />
        <TouchableOpacity style={styles.button} onPress={toggleNicknameModal}>
          <Text style={styles.buttonText}>변경</Text>
        </TouchableOpacity>
        <Modal
          visible={isNicknameModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleNicknameModal}>
          <NickNameModalContent
            title="닉네임 변경"
            toggleModal={toggleNicknameModal}
          />
        </Modal>

        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="hahahoho@gmail.com"
          editable={false}
        />
        <TouchableOpacity style={styles.button} onPress={toggleEmailModal}>
          <Text style={styles.buttonText}>변경</Text>
        </TouchableOpacity>
        <Modal
          visible={isEmailModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleEmailModal}>
          <EmailModalContent
            title="이메일 변경"
            toggleModal={toggleEmailModal}
          />
        </Modal>

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="ji******"
          secureTextEntry
          editable={false}
        />
        <TouchableOpacity style={styles.button} onPress={togglePasswordModal}>
          <Text style={styles.buttonText}>변경</Text>
        </TouchableOpacity>
        <Modal
          visible={isPasswordModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={togglePasswordModal}>
          <PasswordModalContent
            title="비밀번호 변경"
            toggleModal={togglePasswordModal}
          />
        </Modal>
      </View>
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
  navbarText: {
    color: '#ffffff',
    fontSize: 35,
    fontWeight: 'bold',
    marginRight: 200,
  },
  profileContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 200,
    backgroundColor: '#d9d9d9',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginTop: 10,
    fontSize: 30,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4d91da',
    padding: 10,
    width: '80%',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOuterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInnerContainer: {
    width: '90%', // 이미지에 맞게 조정
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#eeeeee', // 이 부분은 이미지를 기반으로 색을 조정하세요.
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexGrow: 1,
    marginRight: 10,
  },
  modalCancelButtonText: {
    textAlign: 'center',
    color: '#333333', // 이 부분은 이미지를 기반으로 색을 조정하세요.
    fontSize: 16,
  },
  modalConfirmButton: {
    backgroundColor: '#4d91da',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexGrow: 1,
  },
  modalConfirmButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
  },
  modalCheckButton: {
    backgroundColor: '#4d91da',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexGrow: 1,
    marginBottom: 10,
  },
  modalCheckButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
  },
});

export default Fixing;
