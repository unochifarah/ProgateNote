import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import CustomButton from '../components/customButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const labelColors = {
  urgent: '#D32F2F', // Red
  notUrgent: '#388E3C', // Green
  important: '#1976D2', // Blue
  notImportant: '#FFC107', // Yellow
};

const NoteCard = ({ item, setDeleteNoteId, setCurrentNote, labelColors, togglePin }) => {
  const wordCount = item.desc.split(/\s+/).length;
  const descriptionLines = item.desc.split('\n');
  const limitedDescription = descriptionLines.slice(0, 3).join('\n');

  return (
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
    <Text style={styles.cardDesc}>{limitedDescription}{descriptionLines.length > 3 ? '...' : ''}</Text>
    <Text style={styles.wordCount}>Word count: {wordCount}</Text>
    <Text style={styles.lastEdited}>Last edited: {moment(item.lastEdited).format('LLL')}</Text>
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
}


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
    if (!title.trim() && !desc.trim()) {
      return;
    }

    addNote({
      id: noteList.length + 1,
      title: title,
      desc: desc,
      labels: selectedLabels,
    });

    setTitle('');
    setDesc('');
    setSelectedLabels([]);

    setCurrentPage('home');
  };

  const togglePin = (id) => {
    setNoteList(prevNoteList => {
      const pinnedNotesCount = prevNoteList.filter(note => note.pinned).length;
      return prevNoteList.map(note =>
        note.id === id ? {...note, pinned: note.pinned ? !note.pinned : (pinnedNotesCount < 3 ? true : note.pinned)} : note
      ).sort((a, b) => b.pinned - a.pinned);
    });
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
        data={filteredNotes.sort((a, b) => b.pinned - a.pinned)}
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
    position: 'relative',
  },
  pinButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  label: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
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
    maxHeight: 60,
    overflow: 'hidden',
    lineHeight: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
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
  noteCount: {
    marginBottom: 10,
    fontSize: 16,
    color: '#555',
  },
  addNoteContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
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
});

export default Home;
