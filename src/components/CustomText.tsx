import React from 'react';
import {Text, TextProps, StyleSheet, TextStyle, StyleProp} from 'react-native';

interface CustomTextProps extends TextProps {
  variant?: 'header' | 'title' | 'body' | 'caption';
  color?: string;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  variant = 'body',
  style,
  color,
  ...props
}) => {
  const textStyle: StyleProp<TextStyle> = [
    styles[variant],
    color && {color},
    style,
  ].filter(Boolean);

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    color: '#666666',
  },
});

export default CustomText; 