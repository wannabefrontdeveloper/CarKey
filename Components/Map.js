import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';

const Map = () => {
  const navigation = useNavigation();
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          getCurrentLocation();
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 정보 권한',
            message:
              '이 앱은 근처 자동차 정비소 정보를 보여주기 위해 위치 정보 권한이 필요합니다.',
            buttonNeutral: '나중에 묻기',
            buttonNegative: '취소',
            buttonPositive: '확인',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('위치 정보 권한 거부됨');
        }
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log('현재 위치:', latitude, longitude); // 위치 정보 콘솔에 출력
          setCurrentPosition({lat: latitude, lng: longitude});
        },
        error => {
          console.log('Geolocation error:', error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    requestLocationPermission();
  }, []);

  const html = currentPosition
    ? `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=fdcb399d7134dcaf0208cb8a0eb587a9&libraries=services"></script>
      </head>
      <body>
        <div id="map" style="width:100%;height:100%;"></div>
        <script type="text/javascript">
          (function () {
            const container = document.getElementById('map');
            const options = {
              center: new kakao.maps.LatLng(${currentPosition.lat}, ${currentPosition.lng}),
              level: 3
            };
            const map = new kakao.maps.Map(container, options);
            
            // 현재 위치에 빨간색 마커 추가
            const currentMarker = new kakao.maps.Marker({
              map: map,
              position: new kakao.maps.LatLng(${currentPosition.lat}, ${currentPosition.lng}),
              title: '현재 위치',
              image: new kakao.maps.MarkerImage(
                'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                new kakao.maps.Size(44, 49),
                {offset: new kakao.maps.Point(27, 69)}
              )
            });

            const ps = new kakao.maps.services.Places(map);
            ps.keywordSearch('자동차 정비소', placesSearchCB, {location: new kakao.maps.LatLng(${currentPosition.lat}, ${currentPosition.lng})});

            function placesSearchCB(data, status, pagination) {
              if (status === kakao.maps.services.Status.OK) {
                for (let i = 0; i < data.length; i++) {
                  displayMarker(data[i]);
                }
              }
            }

            function displayMarker(place) {
              const marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
              });

              kakao.maps.event.addListener(marker, 'click', function() {
                const infowindow = new kakao.maps.InfoWindow({zIndex:1});
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, marker);
              });
            }
          })();
        </script>
      </body>
    </html>
  `
    : '<div>위치 정보를 가져오는 중…</div>';

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>주위 카센터 보기</Text>
      </View>
      <WebView
        style={styles.map}
        source={{html}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.buttonText}>메뉴 화면으로 이동하기</Text>
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
  navbar: {
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
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
    backgroundColor: '#3f51b5',
    padding: 15,
    borderRadius: 10,
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
});

export default Map;
