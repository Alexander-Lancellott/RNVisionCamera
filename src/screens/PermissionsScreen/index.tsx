import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Text,
  View,
  ImageRequireSource,
  Linking,
  useColorScheme,
  Animated,
} from 'react-native';
import {
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import { Routes } from '../../navigation';
import { getStyles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionItem } from '../../components';

interface Props extends NativeStackScreenProps<Routes, 'PERMISSIONS'> {}

const BANNER_CAM = require('../../assets/images/cam.png') as ImageRequireSource;
const BANNER_MIC = require('../../assets/images/mic.png') as ImageRequireSource;

export const PermissionsScreen = ({ navigation }: Props) => {
  const { hasPermission: cameraPermission, requestPermission: requestCamera } =
    useCameraPermission();

  const {
    hasPermission: microphonePermission,
    requestPermission: requestMicrophone,
  } = useMicrophonePermission();

  const isDarkMode = useColorScheme() === 'dark';

  const opacityCam = useRef<Animated.Value>(new Animated.Value(1)).current;
  const opacityMic = useRef<Animated.Value>(new Animated.Value(0)).current;

  const timing = (
    value: Animated.Value,
    toValue: Animated.TimingAnimationConfig['toValue'],
  ) => {
    return Animated.timing(value, {
      toValue,
      duration: 5500,
      useNativeDriver: true,
    });
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        timing(opacityCam, 0),
        timing(opacityMic, 1),
        timing(opacityMic, 0),
        timing(opacityCam, 1),
      ]),
    ).start();
  }, [opacityCam, opacityMic]);

  const requestMicrophonePermission = useCallback(async () => {
    const permission = await requestMicrophone();

    if (!permission) {
      await Linking.openSettings();
    }
  }, [requestMicrophone]);

  const requestCameraPermission = useCallback(async () => {
    const permission = await requestCamera();

    if (!permission) {
      await Linking.openSettings();
    }
  }, [requestCamera]);

  useEffect(() => {
    if (cameraPermission && microphonePermission) {
      setTimeout(() => navigation.replace('CAMERA'), 500);
    }
  }, [cameraPermission, microphonePermission, navigation]);

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <View style={styles.main}>
        <Animated.Image
          source={BANNER_CAM}
          style={[{ opacity: opacityCam }, styles.bannerCamera]}
        />
        <Animated.Image
          source={BANNER_MIC}
          style={[{ opacity: opacityMic }, styles.bannerMic]}
        />
        <Text style={styles.welcome}>Welcome to{'\n'}Vision Camera.</Text>
        <View style={styles.permissionsContainer}>
          <Text style={styles.permissionText}>Vision Camera needs:</Text>
          <PermissionItem
            name="Camera"
            isGranted={cameraPermission}
            requestPermission={requestCameraPermission}
            dark={isDarkMode}
          />
          <PermissionItem
            name="Microphone"
            isGranted={microphonePermission}
            requestPermission={requestMicrophonePermission}
            dark={isDarkMode}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
