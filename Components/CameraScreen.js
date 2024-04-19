import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CameraScreen = ({navigation}) => {
  const navigateToBoard = () => {
    navigation.navigate('Board');
  };

  const cameraRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const devices = useCameraDevices(); // 사용 가능한 카메라 디바이스 목록

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        const audioPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );

        setCameraPermissionGranted(
          cameraPermission === PermissionsAndroid.RESULTS.GRANTED,
        );
        setAudioPermissionGranted(
          audioPermission === PermissionsAndroid.RESULTS.GRANTED,
        );
      } catch (error) {
        console.error('권한 요청 중 오류 발생:', error);
      }
    };
    const checkPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();

      switch (cameraPermission) {
        case 'authorized':
          // 카메라 권한이 있을 때 실행할 로직
          break;

        case 'not-determined':
          // 아직 권한 요청을 하지 않은 상태로 권한 요청하기
          const newCameraPermission = await Camera.requestCameraPermission();
          if (newCameraPermission === 'denied') {
            // 권한 요청을 했지만 거부됐을 때 실행할 로직
            await Linking.openSettings();
          }
          break;

        case 'denied':
          // 권한 요청을 했지만 거부됐을 때 실행할 로직
          await Linking.openSettings();
          break;
      }
    };

    requestPermissions();
    checkPermission();
  }, []);

  useEffect(() => {
    console.log(
      '사용 가능한 카메라 디바이스 상태:',
      devices.map(device => ({id: device.id, position: device.position})),
    );
  }, [devices]);

  const switchCamera = () => {
    setCurrentDeviceIndex(
      currentDeviceIndex === devices.length - 1 ? 0 : currentDeviceIndex + 1,
    );
  };

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      const photo = await cameraRef.current.takePhoto({
        quality: 'high',
      });
      console.log('Photo taken:', photo);
    }
  };

  if (!cameraPermissionGranted || !audioPermissionGranted) {
    return (
      <Text style={styles.errorText}>카메라 및 마이크 권한이 필요합니다.</Text>
    );
  }

  return (
    <View style={styles.container}>
      {devices.length > 0 && (
        <Camera
          style={{flex: 1}}
          ref={cameraRef}
          device={devices[currentDeviceIndex]}
          photo={true}
          isActive={true}
          onInitialized={() => setIsCameraReady(true)}
        />
      )}
      <View style={styles.yellowFrame}>
        <View style={styles.yellowFrameBorder} />
        <Text style={styles.instructionText}>
          테두리 안에 손상부위를 촬영해주세요!
        </Text>
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={navigateToBoard}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Icon name="panorama-fish-eye" size={30} color="#ffffff" />
        </TouchableOpacity>
        {devices.length > 1 && (
          <TouchableOpacity style={styles.button} onPress={switchCamera}>
            <Icon name="cached" size={30} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  navbar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4d91da',
    paddingHorizontal: 10,
  },
  navbarText: {
    color: '#ffffff',
    fontSize: 35,
    fontWeight: 'bold',
    marginRight: 230,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  yellowFrame: {
    position: 'absolute',
    top: '50%', // 테두리의 상단을 화면의 세로 중앙으로 조정합니다.
    left: '50%', // 테두리의 왼쪽을 화면의 가로 중앙으로 조정합니다.
    transform: [{translateX: -128}, {translateY: -128}], // 테두리를 가운데로 이동시킵니다.
    width: 256,
    height: 256,
    borderRadius: 10,
    // overflow: 'hidden', // 이 줄은 삭제합니다.
  },
  yellowFrameBorder: {
    flex: 1,
    borderColor: 'yellow',
    borderWidth: 2,
  },
  instructionText: {
    position: 'absolute',
    top: '50%', // 텍스트의 상단을 화면의 세로 중앙으로 조정합니다.
    left: '50%', // 텍스트의 왼쪽을 화면의 가로 중앙으로 조정합니다.
    textAlign: 'center', // 텍스트를 가운데 정렬합니다.
    color: 'white',
    fontSize: 20,
    marginLeft: -121,
    marginTop: -160, // 텍스트를 왼쪽으로 이동하여 테두리 외부에 위치시킵니다.
    backgroundColor: '#0d0d0e', // 텍스트의 배경색을 설정합니다.
  },
  button: {},

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#4d91da',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  tabText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default CameraScreen;
