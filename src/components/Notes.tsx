import React, { useState, useEffect, useRef } from 'react';
import './styles/Notes.css';

interface Note {
  id: number;
  text: string;
  fontStyle: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: string;
  };
  images: string[];
}

const defaultNoteStyle = {
  fontFamily: 'Arial',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStyle: 'normal'
};

const defaultNote: Note = {
  id: Date.now(),
  text: 'Приветствую!',
  fontStyle: defaultNoteStyle,
  images: [],
};

function Notes() {
  const [notes, setNotes] = useState<Note[]>([defaultNote]);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [text, setText] = useState<string>('');
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);
  const [font, setFont] = useState<string>('Arial');
  const [size, setSize] = useState<string>('16px');
  const [images, setImages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const noteEditorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeNote = notes.find(note => note.id === activeNoteId);
    if (activeNote) {
      setText(activeNote.text);
      setBold(activeNote.fontStyle.fontWeight === 'bold');
      setItalic(activeNote.fontStyle.fontStyle === 'italic');
      setFont(activeNote.fontStyle.fontFamily);
      setSize(activeNote.fontStyle.fontSize);
      setImages(activeNote.images);
      setIsEditing(true);
      if (noteEditorRef.current) {
        noteEditorRef.current.innerHTML = activeNote.text;
      }
    } else {
      setIsEditing(false);
      if (noteEditorRef.current) {
        noteEditorRef.current.innerHTML = '';
      }
    }
  }, [activeNoteId, notes]);

  useEffect(() => {
    if (noteEditorRef.current) {
      noteEditorRef.current.style.fontFamily = font;
      noteEditorRef.current.style.fontSize = size;
      noteEditorRef.current.style.fontWeight = bold ? 'bold' : 'normal';
      noteEditorRef.current.style.fontStyle = italic ? 'italic' : 'normal';
    }
  }, [bold, italic, font, size]);

  const handleTextChange = () => {
    if (noteEditorRef.current) {
      setText(noteEditorRef.current.innerHTML);
    }
  };

  const handleAddNote = () => {
    if (!text.trim()) return;

    const newNoteStyle = {
      fontFamily: font,
      fontSize: size,
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
    };

    const newNote: Note = {
      id: Date.now(),
      text,
      fontStyle: newNoteStyle,
      images,
    };

    setNotes([...notes, newNote]);
    resetFields();
  };

  const handleSaveNote = () => {
    if (!text.trim() || activeNoteId == null) return;

    const updatedNoteStyle = {
      fontFamily: font,
      fontSize: size,
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
    };

    const updatedNotes = notes.map(note =>
      note.id === activeNoteId ? { ...note, text, fontStyle: updatedNoteStyle, images } : note
    );

    setNotes(updatedNotes);
    resetFields();
  };

  const handleEditNote = (id: number) => {
    setActiveNoteId(id);
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNoteId === id) {
      resetFields();
    }
  };

  const handleBoldToggle = () => {
    setBold(!bold);
  };

  const handleItalicToggle = () => {
    setItalic(!italic);
  };

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(event.target.value);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(event.target.value);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImages([...images, e.target.result]);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const resetFields = () => {
    setText('');
    setBold(false);
    setItalic(false);
    setImages([]);
    setActiveNoteId(null);
    setIsEditing(false);
    if (noteEditorRef.current) {
      noteEditorRef.current.innerHTML = '';
    }
  };

  return (
    <div className="notes-container">
      <div 
        ref={noteEditorRef} 
        className="note-editor" 
        contentEditable={true} 
        onInput={handleTextChange}
        style={{ fontFamily: font, fontSize: size, fontWeight: bold ? 'bold' : 'normal', fontStyle: italic ? 'italic' : 'normal' }}
        suppressContentEditableWarning={true}
      />
      <div className="format-options">
        <button onClick={handleBoldToggle} style={{ fontWeight: bold ? 'bold' : 'normal' }}>B</button>
        <button onClick={handleItalicToggle} style={{ fontStyle: italic ? 'italic' : 'normal' }}>I</button>
        <select onChange={handleFontChange} value={font}>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
        <select onChange={handleSizeChange} value={size}>
          <option value="12px">12px</option>
          <option value="16px">16px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
        </select>
        <input type="file" onChange={handleImageUpload} />
        {isEditing ? (
          <button onClick={handleSaveNote}>Сохранить</button>
        ) : (
          <button onClick={handleAddNote}>Добавить</button>
        )}
      </div>
      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note">
            <div 
              className="note-text" 
              style={{ 
                fontFamily: note.fontStyle.fontFamily, 
                fontSize: note.fontStyle.fontSize, 
                fontWeight: note.fontStyle.fontWeight, 
                fontStyle: note.fontStyle.fontStyle, 
              }}
              onClick={() => handleEditNote(note.id)}
              dangerouslySetInnerHTML={{ __html: note.text }}
            />
            {note.images.map((image, index) => (
              <img key={index} src={image} alt="uploaded" style={{ maxWidth: '100%' }} />
            ))}
            <button onClick={() => handleDeleteNote(note.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
