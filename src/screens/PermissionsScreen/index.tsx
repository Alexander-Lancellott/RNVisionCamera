import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  ImageRequireSource,
  Linking,
  useColorScheme,
  Animated,
} from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { Routes } from '../../navigation';
import { getStyles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionItem } from '../../components';

interface Props extends NativeStackScreenProps<Routes, 'PERMISSIONS'> {}

const BANNER_CAM = require('../../assets/images/cam.png') as ImageRequireSource;
const BANNER_MIC = require('../../assets/images/mic.png') as ImageRequireSource;

export const PermissionsScreen = ({ navigation }: Props) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');

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
    const permission = await Camera.requestMicrophonePermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setMicrophonePermissionStatus(permission);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setCameraPermissionStatus(permission);
  }, []);

  const getPermissions = useCallback(async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestMicrophonePermission();
    setCameraPermissionStatus(cameraPermission);
    setMicrophonePermissionStatus(microphonePermission);
  }, []);

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  useEffect(() => {
    if (
      cameraPermissionStatus === 'granted' &&
      microphonePermissionStatus === 'granted'
    ) {
      navigation.replace('HOME');
    }
  }, [cameraPermissionStatus, microphonePermissionStatus, navigation]);

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
            isGranted={cameraPermissionStatus === 'granted'}
            requestPermission={requestCameraPermission}
            dark={isDarkMode}
          />
          <PermissionItem
            name="Microphone"
            isGranted={microphonePermissionStatus === 'granted'}
            requestPermission={requestMicrophonePermission}
            dark={isDarkMode}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
