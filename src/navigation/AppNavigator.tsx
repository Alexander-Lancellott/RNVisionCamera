import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Routes } from './Routes';
import { styles } from './styles';
import {
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import { PermissionsScreen, CameraScreen } from '../screens';

const Stack = createNativeStackNavigator<Routes>();

export const AppNavigator = () => {
  const { hasPermission: cameraPermission } = useCameraPermission();
  const { hasPermission: microphonePermission } = useMicrophonePermission();

  const showPermissionsScreen = !cameraPermission || !microphonePermission;

  return (
    <NavigationContainer>
      <GestureHandlerRootView style={styles.root}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationTypeForReplace: 'push',
          }}
          initialRouteName={showPermissionsScreen ? 'PERMISSIONS' : 'CAMERA'}>
          <Stack.Screen name="CAMERA" component={CameraScreen} />
          <Stack.Screen name="PERMISSIONS" component={PermissionsScreen} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};
