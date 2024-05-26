import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';

const MyComponent = ({navigation}) => {
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
          console.log('현재 위치:', latitude, longitude);
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
    <style>
      .infowindow-content {
        padding: 5px;
        font-size: 12px;
        line-height: 1.5;
      }
      .infowindow-title {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .infowindow-phone {
        color: #555;
      }
    </style>
  </head>
  <body>
    <div id="map" style="width:100%;height:100%;"></div>
    <script type="text/javascript">
      function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = callback;
        script.onerror = function() {
          console.error('Failed to load script:', url);
        };
        document.head.appendChild(script);
      }

      loadScript("https://dapi.kakao.com/v2/maps/sdk.js?appkey=6b124de30e330a89fffdbab91f49f0ba&libraries=services&autoload=false", function() {
        new Promise(function(resolve) {
          kakao.maps.load(resolve);
        }).then(function() {
          var mapContainer = document.getElementById('map');
          var mapOption = {
            center: new kakao.maps.LatLng(${currentPosition.lat}, ${currentPosition.lng}),
            level: 4
          };

          var map = new kakao.maps.Map(mapContainer, mapOption);

          var currentMarker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(${currentPosition.lat}, ${currentPosition.lng}),
            title: '현재 위치',
            image: new kakao.maps.MarkerImage(
              'https://img.icons8.com/ios-filled/50/f10909/marker.png', // 파란색 점 아이콘
              new kakao.maps.Size(33, 33),
              { offset: new kakao.maps.Point(22, 49) }
            )
          });

          var currentInfowindow = null;

          fetch('https://dapi.kakao.com/v2/local/search/keyword.json?query=자동차 정비소&x=${currentPosition.lng}&y=${currentPosition.lat}&radius=5000', {
            headers: {
              Authorization: 'KakaoAK 6b124de30e330a89fffdbab91f49f0ba',
              'KA': 'sdk/1.0.0 os/javascript origin/http://ceprj.gachon.ac.kr'
            }
          })
          .then(response => response.json())
          .then(data => {
            console.log('Places search result:', JSON.stringify(data, null, 2));
            if (data.documents && data.documents.length > 0) {
              data.documents.forEach(place => {
                var marker = new kakao.maps.Marker({
                  map: map,
                  position: new kakao.maps.LatLng(place.y, place.x),
                  title: place.place_name
                });
                var infowindow = new kakao.maps.InfoWindow({
                  content: '<div class="infowindow-content">' +
                           '<div class="infowindow-title">' + place.place_name + '</div>' +
                           '<div class="infowindow-phone">전화번호: ' + (place.phone || '정보 없음') + '</div>' +
                           '</div>'
                });
                kakao.maps.event.addListener(marker, 'click', function() {
                  if (currentInfowindow) {
                    currentInfowindow.close();
                    if (currentInfowindow === infowindow) {
                      currentInfowindow = null;
                      return;
                    }
                  }
                  infowindow.open(map, marker);
                  currentInfowindow = infowindow;
                });
              });
            } else {
              console.log('Places search failed with status:', JSON.stringify(data, null, 2));
            }
          })
          .catch(error => {
            console.log('Fetch error:', error);
          });
        });
      });
    </script>
  </body>
</html>
`
    : `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
      }
      .loading {
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="loading">
      <p>위치 정보를 가져오는 중…</p>
    </div>
  </body>
</html>
`;

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
        onMessage={event => {
          console.log('웹뷰에서 받은 메시지:', event.nativeEvent.data);
        }}
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
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyComponent;
