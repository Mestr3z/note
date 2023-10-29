import React from 'react';
import './styles/NotesList.css';

interface Note {
  id: number;
  text: string;
  fontStyle: object;
  images: any[];
}

interface NotesListProps {
  notes: Note[];
  setActiveNote: (note: Note) => void;
  deleteNote: (id: number) => void;
  editNote: (note: Note) => void;
}

function NotesList({ notes, setActiveNote, deleteNote, editNote }: NotesListProps) {
  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note.id} className="note-item">
          <span onClick={() => setActiveNote(note)}>{note.text}</span>
          {note.text && (
            <>
              <button onClick={() => editNote(note)}>Редактировать</button>
              <button onClick={() => deleteNote(note.id)}>Удалить</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default NotesList;
