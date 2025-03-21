import React from 'react';
import {Image, ImageProps, StyleSheet, ImageStyle, StyleProp} from 'react-native';

interface CustomImageProps extends Omit<ImageProps, 'source'> {
  source: any;
  size?: number;
  tintColor?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({
  source,
  size,
  style,
  tintColor,
  ...props
}) => {
  const imageStyle: StyleProp<ImageStyle> = [
    size && {width: size, height: size},
    tintColor && {tintColor},
    style,
  ].filter(Boolean);

  return <Image source={source} style={imageStyle} {...props} />;
};

export default CustomImage; 