import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const messages = [
  '약 10초 정도 소요가 됩니다...',
  'Tip. AI 분석으로 도출된 예측 수리비이므로 \n실제 수리비와는 차이가 있을 수 있습니다!',
  'Tip. 외제차는 분석된 수리비에 10만원을 더하면 됩니다!',
];

const images = [
  {
    source: require('../assets/pictogram.png'),
    description:
      'CarKey에서는 사용자분이 보내주신 \n 이미지를 통해 분석을 진행합니다!',
  },
  {
    source: require('../assets/OriginalImage.png'),
    description:
      'Carkey AI는 Unet 모델을 사용하여 \n 각 손상 유형 및 손상 범위를 분석하고 파악합니다!',
  },
  {
    source: require('../assets/ScratchImage.png'),
    description:
      'Carkey AI에서는 Segmentation을 통해 \n 픽셀별 손상 유형을 파악합니다!',
  },
  {
    source: require('../assets/crushedImage.png'),
    description:
      '이후 Carkey AI에서는 파악된 모든 손상을 Encoder-Decoder를 통해 \n 전체 손상 범위를 산출합니다!',
  },
  {
    source: require('../assets/pictogram2.png'),
    description:
      '이후에 Carkey AI는 RNN 가격 추출 모델을 통해 통합 수리비 및 예상 금액 범위를 산출합니다!',
  },
];

const Loading = () => {
  const navigation = useNavigation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessages, setShowMessages] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;
  const introFadeOutAnim = useRef(new Animated.Value(1)).current;
  const [showIntroText, setShowIntroText] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('ScratchAnalysis');
    }, 29000);

    return () => clearTimeout(timer);
  }, [navigation]);

  useEffect(() => {
    const introTextTimer = setTimeout(() => {
      Animated.timing(introFadeOutAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setShowIntroText(false); // 4초 후에 intro text를 숨김
      });
    }, 4000);

    const loadingTimer = setTimeout(() => {
      setShowLoading(true); // 21초 후에 로딩 아이콘과 텍스트를 보여줌
    }, 21000);

    return () => {
      clearTimeout(introTextTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  useEffect(() => {
    const imageTimer = setInterval(() => {
      fadeOut(() => {
        setCurrentImageIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % images.length;
          if (nextIndex === 0) {
            clearInterval(imageTimer);
            setShowMessages(true);
          } else {
            fadeIn();
          }
          return nextIndex;
        });
      });
    }, 4000);

    return () => clearInterval(imageTimer);
  }, []);

  useEffect(() => {
    if (showMessages) {
      const messageTimer = setInterval(() => {
        setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
      }, 3000);

      return () => clearInterval(messageTimer);
    }
  }, [showMessages]);

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = callback => {
    fadeOutAnim.setValue(1);
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      fadeOutAnim.setValue(1);
      callback();
    });
  };

  useEffect(() => {
    fadeIn();
  }, [currentImageIndex]);

  return (
    <View style={styles.container}>
      {showLoading && (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>분석중입니다...</Text>
        </>
      )}
      {showIntroText && (
        <Animated.Text style={[styles.introText, {opacity: introFadeOutAnim}]}>
          저희 CarKey는 이렇게 분석을 합니다!
        </Animated.Text>
      )}
      {!showMessages && (
        <Animated.View
          style={[
            styles.imageContainer,
            {opacity: Animated.multiply(fadeAnim, fadeOutAnim)},
          ]}>
          <Image
            source={images[currentImageIndex].source}
            style={styles.image}
          />
          <Text style={[styles.imageDescription, styles.descriptionText]}>
            {images[currentImageIndex].description}
          </Text>
        </Animated.View>
      )}
      {showMessages && (
        <Text style={styles.disclaimerText}>
          {messages[currentMessageIndex]}
        </Text>
      )}
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
    bottom: 150,
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 10,
    marginTop: 50,
  },
  imageDescription: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  descriptionText: {
    fontWeight: 'bold',
    fontSize: 20, // 스타일 추가 예시
    marginTop: 20,
  },
  initialText: {
    fontSize: 30,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  introText: {
    fontSize: 26,
    color: '#000',
    textAlign: 'center',
    marginHorizontal: 20,
    position: 'absolute',
    top: 150, // 화면 상단에 위치하도록 조정
    fontWeight: 'bold',
  },
});

export default Loading;
