import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      console.log('Fetching announcements data...');
      const response = await axios.get(
        'http://ceprj.gachon.ac.kr:60020/user/notice/list',
      );
      console.log('Announcements data fetched successfully:', response.data);
      setAnnouncements(response.data.data); // 서버에서 받아온 데이터를 상태에 설정
    } catch (error) {
      console.error('Error fetching announcements data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.navbarTextContainer}>
          <Text style={styles.navbarText}>공지사항 목록</Text>
        </View>
        <TouchableOpacity style={styles.iconContainer} />
      </View>
      <ScrollView style={styles.contentContainer}>
        {announcements.map(announcement => (
          <Notice
            key={announcement.noticeId} // 공지사항의 고유 ID를 key로 설정
            title={announcement.title}
            content={announcement.comment} // 닉네임을 content로 설정
            date={announcement.createdDate}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const Notice = ({title, content, date}) => {
  // Date 객체로 변환
  const parsedDate = new Date(date);

  // 년, 월, 일, 시간, 분 정보 얻기
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리 숫자로 포맷팅
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const hours = String(parsedDate.getHours()).padStart(2, '0');
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

  // 날짜와 시간을 문자열로 조합하여 포맷팅
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return (
    <View style={styles.noticeContainer}>
      <Text style={styles.noticeTitle}>📢 {title}</Text>
      <Text style={styles.noticeContent}>{content}</Text>
      <Text style={styles.noticeDate}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  navbar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    paddingHorizontal: 5,
    marginBottom: 3,
  },
  navbarTextContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 50,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  noticeContainer: {
    padding: 5,
    backgroundColor: '#d4e67b',
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  noticeContent: {
    fontSize: 15,
    color: 'black',
  },
  noticeDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'right',
  },
});

export default Announcement;
