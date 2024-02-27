import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import IonIcon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { Image, View, Text } from 'react-native';
import { getStyles } from './styles';

interface Props {
  data: PhotoIdentifier[];
}

export const GalleryImage = ({ data }: Props) => {
  const styles = getStyles();

  return (
    <View style={styles.gallery}>
      {data.slice(0, 3).map((p, i) => (
        <View key={i} style={getStyles(i).imgGalleryContainer}>
          <Image source={{ uri: p.node.image.uri }} style={styles.imgGallery} />
          {p.node.type.match(/video.*/) && (
            <IonIcon
              name="play-circle-outline"
              color="#eeeeee7e"
              size={20}
              style={getStyles(i).playIcon}
            />
          )}
        </View>
      ))}
      <View style={styles.numberIcon}>
        {data.length > 99 ? (
          <IonIcon name="infinite" color="black" size={15} />
        ) : (
          <Text style={styles.numberIconText}>{data.length}</Text>
        )}
      </View>
    </View>
  );
};
