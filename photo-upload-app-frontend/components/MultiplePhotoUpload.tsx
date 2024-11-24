import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MultiplePhotoUpload = () => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const successResult = result as ImagePicker.ImagePickerSuccessResult;
        setImages(successResult.assets.map(asset => asset.uri));
        setError(null);
        setSuccess(null);
      }
    } catch (err) {
      setError('Failed to pick images.');
      console.error(err);
    }
  };

  const uploadImages = async () => {
    if (images.length === 0) return;

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('photos', {
        uri: image,
        name: `photo${index}.jpg`,
        type: 'image/jpeg',
      } as any);
    });

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Photos uploaded successfully!');
        setImages([]);
        setError(null);
        setSuccess('Photos uploaded successfully!');
      } else {
        setError('Failed to upload photos.');
      }
    } catch (err) {
      setError('An error occurred while uploading the photos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiple Photo Upload</Text>
      <TouchableOpacity style={styles.button} onPress={pickImages}>
        <Text style={styles.buttonText}>Pick images from camera roll</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </View>
      {images.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={uploadImages}>
          <Text style={styles.buttonText}>Upload Images</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
  },
});

export default MultiplePhotoUpload;
