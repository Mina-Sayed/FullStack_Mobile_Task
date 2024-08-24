import React from 'react';
import { View, StyleSheet } from 'react-native';
import PhotoUpload from '../components/PhotoUpload';
import PhotoGallery from '../components/PhotoGallery';

export default function App() {
  return (
    <View style={styles.container}>
      <PhotoUpload />
      <PhotoGallery />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});