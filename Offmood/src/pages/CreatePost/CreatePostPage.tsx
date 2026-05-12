import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import './CreatePost.css';

const moods = [
  { label: 'Ansioso',    value: 'anxious',   img: new URL('../../assets/Ansioso.png',    import.meta.url).href },
  { label: 'Enojado',    value: 'angry',     img: new URL('../../assets/Enojado.png',    import.meta.url).href },
  { label: 'Feliz',      value: 'happy',     img: new URL('../../assets/Feliz.png',      import.meta.url).href },
  { label: 'Disgustado', value: 'disgusted', img: new URL('../../assets/Disgustado.png', import.meta.url).href },
  { label: 'Triste',     value: 'sad',       img: new URL('../../assets/Triste.png',     import.meta.url).href },
];

const moodColors: Record<string, string> = {
  anxious:   '#f4a7c3',
  angry:     '#f47c6a',
  happy:     '#f7d06e',
  disgusted: '#6abf8a',
  sad:       '#7ab3d4',
};

const CreatePostPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [mood, setMood] = useState('happy');
  const [image, setImage] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    dispatch({
      type: 'ADD_POST',
      payload: {
        id: Date.now(),
        user: state.currentUser?.name ?? 'Usuario',
        avatar: state.currentUser?.avatar ?? '',
        content,
        image,
        date: new Date().toISOString().split('T')[0],
        mood,
      },
    });
    navigate('/feed');
  };

  return (
    <div className="cp-page">

      {/* Card de mood */}
      <div className="cp-card">
        <h2 className="cp-question">How are you <span className="cp-italic">feeling</span> today?</h2>
        <div className="cp-moods">
          {moods.map(m => (
            <button
              key={m.value}
              className={`cp-mood-btn ${mood === m.value ? 'active' : ''}`}
              style={mood === m.value ? { borderColor: moodColors[m.value], background: moodColors[m.value] + '33' } : {}}
              onClick={() => setMood(m.value)}
            >
              <img src={m.img} alt={m.label} className="cp-mood-img" />
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Card de post */}
      <div className="cp-card">
        <div className="cp-author">
          <img src={state.currentUser?.avatar} alt="avatar" className="cp-avatar" />
          <span className="cp-username">{state.currentUser?.name}</span>
        </div>

        <textarea
          className="cp-textarea"
          placeholder="Write your comment..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
        />

        <div className="cp-footer">
          <label className="cp-file-label">
            📎 Imagen
            <input type="file" accept="image/*" onChange={handleImage} className="cp-file" />
          </label>
          {image && <img src={image} alt="preview" className="cp-preview" />}
          <button className="cp-submit" onClick={handleSubmit}>
            Publicar
          </button>
        </div>
      </div>

    </div>
  );
};

export default CreatePostPage;