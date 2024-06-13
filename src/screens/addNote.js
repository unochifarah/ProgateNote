import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import CustomButton from '../components/customButton';

const AddNote = ({ setCurrentPage, addNote, labelColors }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);

  const toggleLabel = label => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(l => l !== label));
    } else {
      if (selectedLabels.length < 2) {
        setSelectedLabels([...selectedLabels, label]);
      } else {
        alert('You can only select up to 2 labels');
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim() && !desc.trim()) {
      return;
    }
  
    addNote(title, desc, selectedLabels);
    setCurrentPage('home');
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.descInput]}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={desc}
        onChangeText={setDesc}
      />
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>Labels:</Text>
        <TouchableOpacity
          style={[
            styles.labelButton,
            selectedLabels.includes('urgent') && { backgroundColor: labelColors['urgent'] }
          ]}
          onPress={() => toggleLabel('urgent')}
        >
          <Text style={styles.labelButtonText}>Urgent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.labelButton,
            selectedLabels.includes('notUrgent') && { backgroundColor: labelColors['notUrgent'] }
          ]}
          onPress={() => toggleLabel('notUrgent')}
        >
          <Text style={styles.labelButtonText}>Not Urgent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.labelButton,
            selectedLabels.includes('important') && { backgroundColor: labelColors['important'] }
          ]}
          onPress={() => toggleLabel('important')}
        >
          <Text style={styles.labelButtonText}>Important</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.labelButton,
            selectedLabels.includes('notImportant') && { backgroundColor: labelColors['notImportant'] }
          ]}
          onPress={() => toggleLabel('notImportant')}
        >
          <Text style={styles.labelButtonText}>Not Important</Text>
        </TouchableOpacity>
      </View>
      <CustomButton
        backgroundColor="#4CAF50"
        color="#fff"
        text="Add Note"
        width="100%"
        onPress={handleSubmit}
      />
      <View style={styles.spacerTop}>
        <CustomButton
          backgroundColor="#DDDDDD"
          color="#203239"
          text="Kembali ke Home"
          width="100%"
          onPress={() => setCurrentPage('home')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  descInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  labelText: {
    fontSize: 16,
    marginRight: 10,
  },
  labelButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    marginRight: 10,
    backgroundColor: '#DDD',
  },
  labelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  spacerTop: {
    marginTop: 30,
  },
});

export default AddNote;
