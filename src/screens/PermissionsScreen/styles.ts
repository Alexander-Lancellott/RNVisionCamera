import { StyleSheet } from 'react-native';
import { CONTENT_SPACING } from '../../utils/constants';

export const getStyles = (dark: boolean) =>
  StyleSheet.create({
    welcome: {
      color: dark ? 'white' : 'black',
      fontSize: 38,
      fontWeight: 'bold',
      maxWidth: '80%',
    },
    bannerMic: {
      width: '100%',
      height: 600,
      position: 'absolute',
      bottom: -160,
      left: 100,
    },
    bannerCamera: {
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
    container: {
      flex: 1,
      backgroundColor: dark ? '#222222' : '#F3F3F3',
    },
    main: {
      flex: 1,
      paddingHorizontal: 20,
    },
    permissionsContainer: {
      marginTop: CONTENT_SPACING * 2,
    },
    permission: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    permissionText: {
      fontSize: 20,
      color: dark ? 'white' : 'black',
      marginBottom: 10,
    },
    hyperlink: {
      color: '#007aff',
      fontWeight: 'bold',
    },
    bold: {
      fontSize: 20,
      marginRight: 20,
      marginLeft: 6,
      color: dark ? 'white' : 'black',
      fontWeight: 'bold',
    },
  });
