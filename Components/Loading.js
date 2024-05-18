import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const messages = [
  'AI 분석으로 도출된 예측 수리비이므로 \n실제 수리비와는 차이가 있을 수 있습니다!',
  '약 30초 정도 소요가 됩니다.',
  '수리비 예측을 위해 AI가 열심히 계산 중입니다.',
  '외제차는 분석된 수리비에 10만원을 더하시면 됩니다!',
];

const Loading = () => {
  const navigation = useNavigation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('ScratchAnalysis');
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigation]);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 5000); // 5초마다 문구 변경

    return () => clearInterval(messageTimer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>분석중입니다...</Text>
      <Text style={styles.disclaimerText}>{messages[currentMessageIndex]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 30,
    color: '#000',
  },
  disclaimerText: {
    position: 'absolute',
    fontSize: 20,
    textAlign: 'center',
    bottom: 100,
    width: '100%',
  },
});

export default Loading;
