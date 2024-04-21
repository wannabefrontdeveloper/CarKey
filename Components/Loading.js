// Loading.js
import React, {useEffect} from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Loading = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('ScratchAnalysis');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>분석중입니다...</Text>
      <Text style={styles.disclaimerText}>
        AI 분석으로 도출된 예측 수리비이므로{'\n'}
        실제 수리비와는 차이가 있을 수 있습니다!
      </Text>
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
