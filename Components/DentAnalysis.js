import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useResponse} from './ResponseContext'; // ResponseContext 추가

const DentAnalysis = () => {
  const navigation = useNavigation();
  const {responseData} = useResponse(); // ResponseContext 사용
  console.log('서버에서 받은 데이터:', responseData);

  const navigateToScratchAnalysis = () => {
    navigation.navigate('ScratchAnalysis');
  };

  const navigateToMoneyAnalysis = () => {
    navigation.navigate('MoneyAnalysis');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>덴트 분석 결과</Text>
      </View>
      <Image
        source={{
          uri: `http://localhost:8080/image/ai/crushed/${responseData.data.crushedImg}`,
        }}
        style={styles.mapImage}
      />
      <View style={styles.analysisSection}>
        <Icon name="child-care" size={60} color="#000" />
        <View style={styles.balloon}>
          <Text style={styles.analysisText}>
            빨간색 부위가 덴트를 뜻합니다!
            {'\n'}
            없다면 손상되지 않았다는 뜻이죠~!
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToScratchAnalysis}>
          <Text style={styles.buttonText}>이전 결과 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={navigateToMoneyAnalysis}>
          <Text style={styles.buttonText}>예상 수리비 보기</Text>
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
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4d91da',
    paddingHorizontal: 10,
    marginBottom: 100,
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 50,
    fontWeight: 'bold',
  },
  mapImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginLeft: 5,
    marginBottom: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#82888f',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  analysisSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
    marginBottom: 29,
  },
  analysisText: {
    marginLeft: 10,
    fontSize: 25,
    color: '#000',
  },
  balloon: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
});

export default DentAnalysis;
