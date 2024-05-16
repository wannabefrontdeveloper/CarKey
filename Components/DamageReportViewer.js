import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useToken} from './TokenContext'; // TokenContext에서 useToken 가져오기

// ImageFullScreen 화면 import
import ImageFullScreen from './ImageFullScreen';

const DamageReportView = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태
  const [distinctAnalyzeDates, setDistinctAnalyzeDates] = useState([]);
  const {token} = useToken(); // TokenContext에서 token 가져오기
  const {storedToken} = useToken(); // TokenContext에서 토큰 가져오기
  console.log('토큰 값:', storedToken); // 토큰 값 콘솔 출력
  const [analysisData, setAnalysisData] = useState([]); // 분석 내역 데이터 상태 추가
  // 모달 상태
  const [modalVisible, setModalVisible] = useState(false);
  // 선택된 이미지의 URI
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 서버로부터 데이터 가져오기
    fetchDistinctAnalyzeDates();
  }, []);

  const fetchDistinctAnalyzeDates = async () => {
    try {
      const response = await axios.get(
        'http://ceprj.gachon.ac.kr:60020/user/mypage/analyze',
        {
          headers: {
            Authorization: `Bearer ${storedToken}`, // 토큰을 헤더에 포함
          },
        },
      );
      // 서버에서 받은 데이터의 구조에 따라 상태 업데이트
      setDistinctAnalyzeDates(response.data.data.analyzeDates);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAnalysisListForDate = async date => {
    try {
      const response = await axios.post(
        'http://ceprj.gachon.ac.kr:60020/user/mypage/analyze/list',
        {
          analyzeDate: date, // 선택된 날짜 전송
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`, // 토큰을 헤더에 포함
          },
        },
      );
      // 날짜 정보를 추가하여 상태 설정
      const enrichedData = response.data.data.map(item => ({
        ...item,
        date: date,
      }));
      setAnalysisData(enrichedData);
      console.log('분석 리스트:', response.data);
    } catch (error) {
      console.error('Error fetching analysis list:', error);
    }
  };

  console.log('analysisData:', analysisData);

  const getAnalysisForSelectedDate = () => {
    // analysisData가 비어있지 않은 경우 해당 날짜 데이터 검색
    if (analysisData.length > 0) {
      return analysisData.find(data => data.date === selectedDate);
    }
    return {}; // 데이터가 없는 경우 빈 객체 반환
  };

  // 날짜를 누를 때 발생하는 이벤트 핸들러
  const handleDatePress = date => {
    // 선택된 날짜를 상태에 저장하고 해당 날짜에 대한 분석 리스트를 가져옴
    setSelectedDate(date);
    fetchAnalysisListForDate(date);
  };

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
  };

  const analysisForSelectedDate = getAnalysisForSelectedDate();

  const getMarkedDates = () => {
    const markedDates = {};

    distinctAnalyzeDates.forEach(date => {
      // 분석이 수행된 날짜를 markedDates 객체에 추가
      markedDates[date] = {marked: true, dotColor: 'red'};
    });

    return markedDates;
  };

  // 이미지를 클릭했을 때 모달을 열고 이미지 URI를 설정하는 함수
  const handleImageClick = uri => {
    setSelectedImageUri(uri);
    // ImageFullScreen 화면으로 이동
    navigation.navigate('ImageFullScreen', {imageUri: uri});
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setSelectedImageUri(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={navigateToMyPage}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.navBarTitle}>분석 내역 조회</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <Calendar
          style={styles.calendar}
          current={new Date().toISOString().split('T')[0]} // 현재 날짜로 설정
          markedDates={getMarkedDates()} // getMarkedDates 함수로 마킹된 날짜들 가져오기
          onDayPress={day => handleDatePress(day.dateString)} // onDayPress 이벤트 핸들러 추가
        />
        {selectedDate && analysisForSelectedDate && (
          <>
            {analysisData.map((analysis, index) => (
              <View key={index}>
                <Text
                  style={[
                    styles.text,
                    styles.centerText,
                    {
                      backgroundColor: '#4d91da',
                      color: 'white',
                      borderRadius: 10,
                    },
                  ]}>
                  분석 날짜: {analysis.analyzeDatetime}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleImageClick(
                      `http://ceprj.gachon.ac.kr:60020/image/ai/image/${analysis.naturalImg}`,
                    )
                  }>
                  <Image
                    source={{
                      uri: `http://ceprj.gachon.ac.kr:60020/image/ai/image/${analysis.naturalImg}`,
                    }}
                    style={styles.image}
                  />
                </TouchableOpacity>
                <Text style={[styles.text, styles.centerText]}>
                  예상 수리비 : {analysis.totalPrice}원
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  navBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4d91da',
    paddingHorizontal: 10,
  },
  navBarTitle: {
    color: 'white',
    fontSize: 24,
    marginRight: 230,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  calendar: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200, // 원하는 높이로 조절
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginVertical: 10,
  },
  centerText: {
    textAlign: 'center',
  },
});

export default DamageReportView;
