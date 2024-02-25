import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { getStyles } from './styles';
import IonIcon from 'react-native-vector-icons/Ionicons';

interface Props {
  name: string;
  dark: boolean;
  isGranted: boolean;
  requestPermission: () => Promise<void>;
}

export const PermissionItem = ({
  name,
  dark,
  isGranted,
  requestPermission,
}: Props) => {
  const styles = getStyles(dark, isGranted);

  return (
    <View style={styles.permission}>
      <View style={styles.iconContainer}>
        <IonIcon
          name={isGranted ? 'lock-open-outline' : 'lock-closed-outline'}
          color={isGranted ? 'green' : 'red'}
          size={20}
        />
      </View>
      <TouchableOpacity
        onPress={requestPermission}
        style={styles.button}
        disabled={isGranted}>
        <Text style={styles.bold}>{name} permission</Text>
        <IonIcon
          name="chevron-forward-outline"
          color={dark ? 'white' : 'black'}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};
