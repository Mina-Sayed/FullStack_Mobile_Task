import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

interface PhotoDetailsProps {
  photo: {
    filename: string;
    description: string;
  };
  onSave: (updatedPhoto: { filename: string; description: string }) => void;
  onCancel: () => void;
}

const PhotoDetails: React.FC<PhotoDetailsProps> = ({ photo, onSave, onCancel }) => {
  const [description, setDescription] = useState(photo.description);

  const handleSave = () => {
    if (description.trim() === '') {
      Alert.alert('Error', 'Description cannot be empty.');
      return;
    }
    onSave({ ...photo, description });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filename:</Text>
      <Text style={styles.value}>{photo.filename}</Text>
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} />
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PhotoDetails;
