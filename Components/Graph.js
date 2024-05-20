import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useResponse} from './ResponseContext'; // ResponseContext 추가

const Graph = () => {
  const navigation = useNavigation();
  const {responseData} = useResponse(); // ResponseContext 사용
  const data = responseData?.data; // 서버에서 받은 데이터
  console.log('서버에서 받은 데이터:', responseData);

  const navigateToScratchAnalysis = () => {
    navigation.navigate('DentAnalysis');
  };

  const navigateToMoneyAnalysis = () => {
    navigation.navigate('MoneyAnalysis');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>가격 상세 분석</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageSection}>
          {data && (
            <>
              <View style={styles.textContainer}>
                <Text style={styles.text1}>가격 분포도</Text>
              </View>
              <View style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: `http://ceprj.gachon.ac.kr:60020/image/ai/price_analyze/${data.priceImage}`,
                  }}
                  style={styles.analysisImage}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>가격 정확도</Text>
              </View>
              <View style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: `http://ceprj.gachon.ac.kr:60020/image/ai/price_analyze/${data.r2Image}`,
                  }}
                  style={styles.analysisImage1}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>스크래치 덴트 비율</Text>
              </View>
              <View style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: `http://ceprj.gachon.ac.kr:60020/image/ai/price_analyze/${data.pixelPerformanceImage}`,
                  }}
                  style={styles.analysisImage}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToScratchAnalysis}>
          <Text style={styles.buttonText}>이전 결과 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={navigateToMoneyAnalysis}>
          <Text style={styles.buttonText}>최종 수리비 보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingTop: 50, // Ensure space for fixed navbar
    paddingBottom: 100, // Ensure space for fixed buttons
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1, // Ensure navbar is above other content
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageSection: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  analysisImage1: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  analysisImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  imageWrapper: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    backgroundColor: '#9e9fa8',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  button2: {
    backgroundColor: '#3f51b5',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    alignSelf: 'flex-start',
    width: '100%',
  },
  text1: {
    color: 'black',
    fontSize: 25,
    marginBottom: 10,
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  text: {
    color: 'black',
    fontSize: 25,
    marginBottom: 10,
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default Graph;
