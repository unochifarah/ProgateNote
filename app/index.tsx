import React, { useState } from 'react';
import Home from '../src/screens/home';
import AddNote from '../src/screens/addNote';
import EditNote from '../src/screens/editNote';

const labelColors = {
  urgent: '#D32F2F', // Red
  notUrgent: '#388E3C', // Green
  important: '#1976D2', // Blue
  notImportant: '#FFC107', // Yellow
};

const CurrentPageWidget = ({ currentPage, noteList, setNoteList, setCurrentPage, addNote, editNote, deleteNote, setCurrentNote, currentNote, searchQuery, setSearchQuery, togglePin }) => {
  switch (currentPage) {
    case 'home':
      return <Home noteList={noteList} setNoteList={setNoteList} setCurrentPage={setCurrentPage} deleteNote={deleteNote} setCurrentNote={setCurrentNote} searchQuery={searchQuery} setSearchQuery={setSearchQuery} labelColors={labelColors} togglePin={togglePin} />;
    case 'add':
      return <AddNote setCurrentPage={setCurrentPage} addNote={addNote} labelColors={labelColors} />;
    case 'edit':
      return <EditNote setCurrentPage={setCurrentPage} editNote={editNote} currentNote={currentNote} labelColors={labelColors} />;
    default:
      return <Home noteList={noteList} setNoteList={setNoteList} setCurrentPage={setCurrentPage} deleteNote={deleteNote} setCurrentNote={setCurrentNote} searchQuery={searchQuery} setSearchQuery={setSearchQuery} labelColors={labelColors} togglePin={togglePin} />;
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [noteList, setNoteList] = useState([
    {
      id: 1,
      title: 'Note pertama',
      desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry',
      labels: ['urgent', 'important'], // Example labels
    },
  ]);

  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const addNote = (title, desc, labels) => {
    const id = noteList.length > 0 ? noteList[noteList.length - 1].id + 1 : 1;
    setNoteList([...noteList, { id, title, desc, labels }]);
  };

  const editNote = (id, title, desc, labels) => {
    setNoteList(noteList.map(note => note.id === id ? { id, title, desc, labels } : note));
  };

  const deleteNote = id => {
    setNoteList(noteList.filter(note => note.id !== id));
  };

  const setCurrentNote = id => {
    setCurrentPage('edit');
    setCurrentNoteId(id);
  };

  const togglePin = (id) => {
    setNoteList(noteList.map(note => 
      note.id === id ? {...note, pinned: !note.pinned} : note
    ));
  };

  return (
    <CurrentPageWidget
      currentPage={currentPage}
      noteList={noteList}
      setNoteList={setNoteList}
      setCurrentPage={setCurrentPage}
      addNote={addNote}
      editNote={editNote}
      deleteNote={deleteNote}
      setCurrentNote={setCurrentNote}
      currentNote={noteList.find(note => note.id === currentNoteId)}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      togglePin={togglePin}
    />
  );
};

export default App;
