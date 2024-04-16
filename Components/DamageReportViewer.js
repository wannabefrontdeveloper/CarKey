import React, {useState} from 'react';
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

const DamageReportView = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태

  const navigateToMyPage = () => {
    navigation.navigate('MyPage');
  };

  // 날짜를 누를 때 발생하는 이벤트 핸들러
  const handleDatePress = date => {
    // 선택된 날짜를 상태에 저장합니다.
    setSelectedDate(date);
  };

  // 분석 내역 데이터 예시
  const analysisData = [
    {
      id: 1,
      date: '2024-03-18',
      time: '오전 10시 50분',
      imageUrl: 'https://t1.daumcdn.net/cfile/blog/99D6D3425BC4C86C27',
      estimatedCost: '340000원',
    },
    // 다른 분석 내역 데이터들...
  ];

  // 선택된 날짜에 해당하는 분석 내역을 가져오는 함수
  const getAnalysisForSelectedDate = () => {
    return analysisData.find(data => data.date === selectedDate);
  };

  const analysisForSelectedDate = getAnalysisForSelectedDate();

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
          current={'2024-04-15'}
          markedDates={{
            '2024-03-18': {marked: true, dotColor: 'red'}, // 분석 내역이 존재하는 날짜에 빨간색 점 추가
            // 다른 날짜들의 마킹...
          }}
          onDayPress={day => handleDatePress(day.dateString)} // onDayPress 이벤트 핸들러 추가
        />
        {analysisForSelectedDate && ( // 선택된 날짜에 분석 내역이 있을 경우에만 보여줍니다.
          <>
            <Text style={[styles.text, styles.centerText]}>
              {selectedDate} {analysisForSelectedDate.time}
            </Text>
            <Image
              source={{uri: analysisForSelectedDate.imageUrl}}
              style={styles.image}
            />
            <Text style={[styles.text, styles.centerText]}>
              예상 수리비 : {analysisForSelectedDate.estimatedCost}
            </Text>
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
