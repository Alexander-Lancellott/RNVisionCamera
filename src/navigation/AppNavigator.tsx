import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Routes } from './Routes';
import { styles } from './styles';
import { Camera } from 'react-native-vision-camera';
import { PermissionsScreen, HomeScreen } from '../screens';

const Stack = createNativeStackNavigator<Routes>();

export const AppNavigator = () => {
  const cameraPermission = Camera.getCameraPermissionStatus();
  const microphonePermission = Camera.getMicrophonePermissionStatus();

  const showPermissionsScreen =
    cameraPermission !== 'granted' || microphonePermission !== 'granted';

  return (
    <NavigationContainer>
      <GestureHandlerRootView style={styles.root}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationTypeForReplace: 'push',
          }}
          initialRouteName={showPermissionsScreen ? 'PERMISSIONS' : 'HOME'}>
          <Stack.Screen name="HOME" component={HomeScreen} />
          <Stack.Screen name="PERMISSIONS" component={PermissionsScreen} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};
