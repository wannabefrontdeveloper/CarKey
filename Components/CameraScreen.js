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
  const devices = useCameraDevices();
  const [capturedPhoto, setCapturedPhoto] = useState(null);

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
      try {
        const photo = await cameraRef.current.takePhoto({
          quality: 'high',
          width: 256,
          height: 256,
        });
        console.log('Photo taken:', photo);
        setCapturedPhoto(photo); // 촬영된 사진 데이터를 상태에 저장
        navigateToAnalysisFirst(photo); // 촬영 후 AnalysisFirst 화면으로 이동
      } catch (error) {
        console.error('사진 촬영 중 오류 발생:', error);
      }
    }
  };

  const navigateToAnalysisFirst = photo => {
    navigation.navigate('AnalysisFirst', {photo});
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
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  yellowFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -128}, {translateY: -128}],
    width: 256,
    height: 256,
    borderRadius: 10,
  },
  yellowFrameBorder: {
    flex: 1,
    borderColor: 'yellow',
    borderWidth: 2,
  },
  instructionText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    marginLeft: -121,
    marginTop: -160,
    backgroundColor: '#0d0d0e',
  },
  button: {},
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#4d91da',
  },
});

export default CameraScreen;
