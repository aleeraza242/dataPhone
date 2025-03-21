import React, {useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {images} from '../assets';

type RootStackParamList = {
  Splash: undefined;
  Conversations: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Navigate to Conversations screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Conversations');
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={images.logo}
        style={[styles.logo, {opacity: fadeAnim}]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '70%',
    height: 50,
  },
});

export default SplashScreen; 