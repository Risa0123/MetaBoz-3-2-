// src/components/Header.js

import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

const Header = () => {
  return (
    <View style={styles.container}>
      <Image source={require('./path/to/logo.png')} style={styles.logo} />
      <TouchableOpacity style={styles.backButton} onPress={() => console.log('Back pressed')}>
        {/* 戻るボタンのアイコンなど */}
      </TouchableOpacity>
      <Image source={require('./path/to/appLogo.png')} style={styles.appLogo} />
    </View>
  );
};

export default Header;

