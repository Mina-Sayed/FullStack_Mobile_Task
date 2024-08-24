import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, StyleSheet, Text } from 'react-native';

/**
 * Renders a photo gallery component.
 *
 * @returns The rendered photo gallery component.
 */
const PhotoGallery = () => {
  const [photos, setPhotos] = useState<any[]>([]); // Initially set to an empty array
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/photos/browse');
        if (!response.ok) {
          throw new Error('Failed to fetch photos.');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the response data

        if (Array.isArray(data.photos)) { // Ensure `photos` is an array
          setPhotos(data.photos);
        } else {
          throw new Error('Data format is incorrect.');
        }

        setError(null);
      } catch (err) {
        setError('An error occurred while fetching photos.');
        console.error('Fetch error:', err);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.photoContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {photos.map((photo) => (
          <Image
            key={photo.filename}
            source={{ uri: photo.url }}
            style={styles.photo}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photo: {
    width: '30%',
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default PhotoGallery;
