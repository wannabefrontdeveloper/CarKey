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
import {launchImageLibrary} from 'react-native-image-picker';

const CameraScreen = ({navigation}) => {
  const navigateToBoard = () => {
    navigation.goBack();
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
        });
        console.log('Photo taken:', photo);
        setCapturedPhoto(photo); // 촬영된 사진 데이터를 상태에 저장
        navigateToAnalysisFirst({uri: 'file://' + photo.path}); // 촬영 후 AnalysisFirst 화면으로 이동
      } catch (error) {
        console.error('사진 촬영 중 오류 발생:', error);
      }
    }
  };

  const navigateToAnalysisFirst = photo => {
    navigation.navigate('AnalysisFirst', {photo});
  };

  const selectFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        console.log('Photo selected from gallery:', photo);
        setCapturedPhoto(photo); // 선택된 사진 데이터를 상태에 저장
        navigateToAnalysisFirst(photo); // 사진 선택 후 AnalysisFirst 화면으로 이동
      }
    } catch (error) {
      console.error('갤러리에서 사진 선택 중 오류 발생:', error);
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
          차량이 보이도록 차량의 손상 부위로부터{'\n'}
          세발자국 뒤로가서 촬영해주세요
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
        <TouchableOpacity style={styles.button} onPress={selectFromGallery}>
          <Icon name="photo-library" size={30} color="#ffffff" />
        </TouchableOpacity>
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
    top: '40%',
    left: '45%',
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    marginLeft: -121,
    marginTop: -160,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  button: {},
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#3f51b5',
  },
  iconContainer: {
    padding: 10,
  },
});

export default CameraScreen;
