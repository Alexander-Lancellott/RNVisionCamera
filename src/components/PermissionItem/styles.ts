import { StyleSheet } from 'react-native';

export const getStyles = (dark: boolean, isGranted: boolean) =>
  StyleSheet.create({
    permission: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      display: 'flex',
      width: 35,
      height: 35,
      borderColor: isGranted ? 'green' : 'red',
      marginRight: 20,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      marginVertical: 10,
    },
    bold: {
      fontSize: 20,
      marginRight: 20,
      marginLeft: 6,
      color: dark ? 'white' : 'black',
      fontWeight: 'bold',
    },
    button: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: '#3f4f9e',
      opacity: isGranted ? 0.5 : 1,
      borderWidth: 2,
      height: 35,
      paddingHorizontal: 5,
      borderRadius: 999,
    },
  });
