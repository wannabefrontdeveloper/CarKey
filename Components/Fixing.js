import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const Fixing = () => {
  const navigation = useNavigation();

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
  };

  const navigateToFindPassword = () => {
    navigation.navigate('FindPassword');
  };

  const navigateToChangeEmail = () => {
    navigation.navigate('ChangeEmail');
  };

  const navigateToChangeNickname = () => {
    navigation.navigate('ChangeNickname');
  };

  const NavBar = () => (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.iconContainer} onPress={navigateToMyPage}>
        <Icon name="arrow-back" size={30} color="#ffffff" />
      </TouchableOpacity>
      <Text style={styles.navbarText}>내 정보 수정</Text>
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
        <TouchableOpacity
          style={styles.editButton}
          onPress={navigateToChangeNickname}>
          <Text style={styles.editButtonText}>수정하기</Text>
        </TouchableOpacity>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="hahahoho@gmail.com"
          editable={false}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={navigateToChangeEmail}>
          <Text style={styles.editButtonText}>수정하기</Text>
        </TouchableOpacity>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="ji******"
          secureTextEntry
          editable={false}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={navigateToFindPassword}>
          <Text style={styles.editButtonText}>수정하기</Text>
        </TouchableOpacity>
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
  editButton: {
    alignItems: 'center',
    backgroundColor: '#4d91da',
    padding: 10,
    width: '80%',
    borderRadius: 5,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Fixing;
