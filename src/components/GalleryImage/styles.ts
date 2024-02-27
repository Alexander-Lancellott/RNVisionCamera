import { StyleSheet } from 'react-native';
import { SAFE_AREA_PADDING } from '../../utils/constants';

export const getStyles = (i: number = 0) =>
  StyleSheet.create({
    gallery: {
      position: 'absolute',
      alignSelf: 'center',
      height: 80,
      left: SAFE_AREA_PADDING.paddingLeft * 2,
      bottom: SAFE_AREA_PADDING.paddingBottom * 3,
      justifyContent: 'center',
      alignContent: 'center',
      zIndex: 10,
    },
    imgGalleryContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: i * 5,
      marginLeft: i * 30,
      zIndex: -(i * 10),
      transform: [{ rotateZ: `${i * 20}deg` }],
    },
    imgGallery: {
      borderColor: 'white',
      borderRadius: 5,
      borderWidth: 2,
      width: 50,
      height: 80,
      position: 'absolute',
    },
    playIcon: { position: 'absolute', zIndex: -(i * 10) },
    numberIcon: {
      height: 24,
      width: 24,
      backgroundColor: 'white',
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
    numberIconText: {
      color: 'black',
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
