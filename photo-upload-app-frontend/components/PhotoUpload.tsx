import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, ProgressBarAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * Component for uploading and displaying photos.
 */
const PhotoUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const successResult = result as ImagePicker.ImagePickerSuccessResult;
        setImage(successResult.assets[0].uri);
        setError(null);
        setSuccess(null);
      }
    } catch (err) {
      setError('Failed to pick image.');
      console.error(err);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    Alert.alert(
      'Confirm Upload',
      'Are you sure you want to upload this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Upload',
          onPress: async () => {
            const formData = new FormData();
            formData.append('photo', {
              uri: image,
              name: 'photo.jpg',
              type: 'image/jpeg',
            } as any);

            setLoading(true);
            setUploadProgress(0);
            try {
              const response = await fetch('http://localhost:5000/api/photos/upload', {
                method: 'POST',
                body: formData,
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                  const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  setUploadProgress(progress);
                },
              });

              if (response.ok) {
                Alert.alert('Success', 'Photo uploaded successfully!');
                setImage(null);
                setError(null);
                setSuccess('Photo uploaded successfully!');
              } else {
                setError('Failed to upload photo.');
              }
            } catch (err) {
              setError('An error occurred while uploading the photo.');
              console.error(err);
            } finally {
              setLoading(false);
              setUploadProgress(0);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo Upload</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image from camera roll</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && (
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {loading && <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={uploadProgress / 100} />}
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
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
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

export default PhotoUpload;
