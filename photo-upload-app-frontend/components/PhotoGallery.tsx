import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';

/**
 * Renders a photo gallery component.
 *
 * @returns The rendered photo gallery component.
 */
const PhotoGallery = () => {
  const [photos, setPhotos] = useState<any[]>([]); // Initially set to an empty array
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/photos/browse?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch photos.');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the response data

        if (Array.isArray(data.photos)) { // Ensure `photos` is an array
          setPhotos(data.photos);
          setTotal(data.total);
        } else {
          throw new Error('Data format is incorrect.');
        }

        setError(null);
      } catch (err) {
        setError('An error occurred while fetching photos.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [page]);

  const deletePhoto = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/photos/${filename}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.filename !== filename));
        Alert.alert('Success', 'Photo deleted successfully!');
      } else {
        throw new Error('Failed to delete photo.');
      }
    } catch (err) {
      setError('An error occurred while deleting the photo.');
      console.error('Delete error:', err);
    }
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality here
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search photos..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.photoContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          photos.map((photo) => (
            <View key={photo.filename} style={styles.photoWrapper}>
              <Image
                source={{ uri: photo.url }}
                style={styles.photo}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePhoto(photo.filename)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handlePreviousPage}
          disabled={page === 1}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>{page}</Text>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handleNextPage}
          disabled={page * limit >= total}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoWrapper: {
    width: '30%',
    marginBottom: 10,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhotoGallery;
