import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import CustomButton from '../components/customButton';
import Icon from 'react-native-vector-icons/FontAwesome';

const labelColors = {
  urgent: '#D32F2F', // Red
  notUrgent: '#388E3C', // Green
  important: '#1976D2', // Blue
  notImportant: '#FFC107', // Yellow
};

const NoteCard = ({ item, setDeleteNoteId, setCurrentNote, labelColors, togglePin, pinnedNotesCount }) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.pinButton} onPress={() => togglePin(item.id)}>
      <Icon name={item.pinned ? "thumb-tack" : "thumb-tack"} size={20} color={item.pinned ? "#D82148" : "#ccc"} />
    </TouchableOpacity>
    <View style={styles.labelContainer}>
      {item.labels && item.labels.map(label => (
        <View key={label} style={[styles.label, { backgroundColor: labelColors[label] || '#ccc' }]}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      ))}
    </View>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardDesc}>{item.desc}</Text>
    <View style={styles.buttons}>
      <CustomButton
        backgroundColor="#FFC300"
        color="#151D3B"
        text="Ubah"
        fontSize={12}
        width={100}
        onPress={() => {
          setCurrentNote(item.id);
        }}
      />
      <CustomButton
        backgroundColor="#D82148"
        color="#fff"
        text="Hapus"
        fontSize={12}
        width={100}
        onPress={() => {
          setDeleteNoteId(item.id);
        }}
      />
    </View>
  </View>
);

const Home = ({ noteList, setNoteList, setCurrentPage, deleteNote, setCurrentNote, searchQuery, setSearchQuery }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);

  const confirmDelete = () => {
    deleteNote(deleteNoteId);
    setDeleteNoteId(null);
    setModalVisible(false);
  };

  const filteredNotes = noteList.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.labels && note.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleSubmit = () => {
    // Check if title or description is empty
    if (!title.trim() && !desc.trim()) {
      // Simply return without doing anything
      return;
    }

    addNote({
      id: noteList.length + 1,
      title: title,
      desc: desc,
      labels: selectedLabels,
    });

    // Clear fields after submission
    setTitle('');
    setDesc('');
    setSelectedLabels([]);

    // Navigate back to home or perform other actions
    setCurrentPage('home');
  };

  const togglePin = (id) => {
    const pinnedNotesCount = noteList.filter(note => note.pinned).length;
    setNoteList(noteList.map(note => 
      note.id === id ? {...note, pinned: note.pinned ? !note.pinned : (pinnedNotesCount < 3 ? true : note.pinned)} : note
    ));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Cari notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.noteCount}>Total Notes: {noteList.length}</Text>
      <CustomButton
        backgroundColor="#4CAF50"
        color="#fff"
        text="Tambahkan Note"
        width="100%"
        onPress={() => {
          setCurrentPage('add');
        }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredNotes}
        renderItem={({ item }) => (
          <NoteCard
            item={item}
            setCurrentPage={setCurrentPage}
            deleteNote={deleteNote}
            setCurrentNote={setCurrentNote}
            setDeleteNoteId={id => {
              setDeleteNoteId(id);
              setModalVisible(true);
            }}
            labelColors={labelColors}
            togglePin={togglePin}
            pinnedNotesCount={noteList.filter(note => note.pinned).length}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Konfirmasi Hapus</Text>
            <Text style={styles.modalText}>Apakah anda yakin ingin menghapus note ini?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}>
                <Text style={styles.modalButtonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Note Modal or Section */}
      {setCurrentPage === 'add' && (
        <View style={styles.addNoteContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
          />
          {/* Add logic for selecting labels if needed */}
          <CustomButton
            backgroundColor="#4CAF50"
            color="#fff"
            text="Simpan Note"
            width="100%"
            onPress={handleSubmit}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  card: {
    padding: 15,
    marginVertical: 10,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    position: 'relative', // to position the pin button
  },
  pinButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10, // Add some margin at the bottom for spacing
  },
  label: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5, // Add some margin between labels
    marginBottom: 5, // Add some margin between rows of labels
  },
  labelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontWeight: '700',
    color: '#203239',
    fontSize: 18,
    marginBottom: 10,
  },
  cardDesc: {
    color: '#555',
    fontSize: 14,
    marginBottom: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    paddingVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#D82148',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addNoteContainer: {
    // Add styles for the add note section/modal if needed
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  noteCount: {
    fontWeight: '700',
    color: '#203239',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Home;
