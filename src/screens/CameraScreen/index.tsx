import React from 'react';
import { useRef, useState, useCallback, useMemo } from 'react';
import {
  Alert,
  GestureResponderEvent,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  CameraProps,
  CameraRuntimeError,
  PhotoFile,
  useCameraDevice,
  useCameraFormat,
  VideoFile,
} from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import {
  MAX_ZOOM_FACTOR,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../utils/constants';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useIsForeground } from '../../hooks/useIsForeground';
import {
  StatusBarBlurBackground,
  CaptureButton,
  GalleryImage,
} from '../../components';
import { PressableOpacity } from 'react-native-pressable-opacity';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import {
  useCameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import { styles } from './styles';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;

export const CameraScreen = () => {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [gallery, setGallery] = useState<PhotoIdentifier[]>([]);
  const zoom = useSharedValue(1);
  const isPressingButton = useSharedValue(false);

  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );

  const [enableHdr, setEnableHdr] = useState(false);
  const [enableAudio, setEnableAudio] = useState(true);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableNightMode, setEnableNightMode] = useState(false);

  const device = useCameraDevice(cameraPosition);

  const [targetFps, setTargetFps] = useState(60);

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;

  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ]);

  const [photos, getPhotos, save] = useCameraRoll();

  const fps = Math.min(format?.maxFps ?? 1, targetFps);

  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = format?.supportsPhotoHdr;
  const supports60Fps = useMemo(() => fps >= 60, [fps]);
  const canToggleNightMode = device?.supportsLowLightBoost ?? false;

  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton],
  );
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  const hasAndroidPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android' || Platform.Version >= 33) return true;

    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    if (permission == null) return false;
    let hasPermission = await PermissionsAndroid.check(permission);
    if (!hasPermission) {
      const permissionRequestResult = await PermissionsAndroid.request(
        permission,
      );
      hasPermission = permissionRequestResult === 'granted';
    }
    return hasPermission;
  };

  const onMediaCaptured = useCallback(
    async (media: PhotoFile | VideoFile, type: 'photo' | 'video') => {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        Alert.alert(
          'Permission denied!',
          'Vision Camera does not have permission to save the media to your camera roll.',
        );
        return;
      }
      await save(`file://${media.path}`, {
        type: type,
      });
      await getPhotos();
    },
    [getPhotos, save],
  );
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, []);

  const onFocusTap = useCallback(
    ({ nativeEvent: event }: GestureResponderEvent) => {
      if (!device?.supportsFocus) return;
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      });
    },
    [device?.supportsFocus],
  );
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);

  useEffect(() => {
    zoom.value = device?.neutralZoom ?? 1;
  }, [zoom, device]);

  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startZoom?: number }
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP,
      );
    },
  });

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
        : undefined;
    console.log(`Camera: ${device?.name} | Format: ${f}`);
  }, [device?.name, format, fps]);

  useEffect(() => {
    const getGallery = async () => {
      await getPhotos();
    };
    getGallery();
  }, [getPhotos, isActive]);

  useEffect(() => {
    if (photos.edges.length !== 0) {
      setGallery(
        photos.edges.filter(p => p.node.image.uri.match(/.*mrousavy.*/)),
      );
    }
  }, [photos]);

  return (
    <View style={styles.container}>
      {device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View
            onTouchEnd={onFocusTap}
            style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                ref={camera}
                onInitialized={onInitialized}
                onError={onError}
                onStarted={() => 'Camera started!'}
                onStopped={() => 'Camera stopped!'}
                format={format}
                fps={fps}
                photoHdr={format?.supportsPhotoHdr && enableHdr}
                videoHdr={format?.supportsVideoHdr && enableHdr}
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                photo={true}
                video={true}
                audio={enableAudio}
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}

      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
      />

      <StatusBarBlurBackground />

      <View style={styles.rightButtonRow}>
        <PressableOpacity
          style={styles.button}
          onPress={onFlipCameraPressed}
          disabledOpacity={0.4}>
          <IonIcon name="camera-reverse" color="white" size={24} />
        </PressableOpacity>
        {supportsFlash && (
          <PressableOpacity
            style={styles.button}
            onPress={onFlashPressed}
            disabledOpacity={0.4}>
            <IonIcon
              name={flash === 'on' ? 'flash' : 'flash-off'}
              color="white"
              size={24}
            />
          </PressableOpacity>
        )}
        {supports60Fps && (
          <PressableOpacity
            style={styles.button}
            onPress={() => setTargetFps(t => (t === 30 ? 60 : 30))}>
            <Text style={styles.text}>{`${targetFps}\nFPS`}</Text>
          </PressableOpacity>
        )}
        {supportsHdr && (
          <PressableOpacity
            style={styles.button}
            onPress={() => setEnableHdr(h => !h)}>
            <MaterialIcon
              name={enableHdr ? 'hdr' : 'hdr-off'}
              color="white"
              size={24}
            />
          </PressableOpacity>
        )}
        {canToggleNightMode && (
          <PressableOpacity
            style={styles.button}
            onPress={() => setEnableNightMode(!enableNightMode)}
            disabledOpacity={0.4}>
            <IonIcon
              name={enableNightMode ? 'moon' : 'moon-outline'}
              color="white"
              size={24}
            />
          </PressableOpacity>
        )}
        <PressableOpacity
          style={styles.button}
          onPress={() => setEnableAudio(!enableAudio)}>
          <IonIcon
            name={enableAudio ? 'volume-high-outline' : 'volume-mute-outline'}
            color="white"
            size={24}
          />
        </PressableOpacity>
      </View>
      {gallery.length !== 0 && <GalleryImage data={gallery} />}
    </View>
  );
};
