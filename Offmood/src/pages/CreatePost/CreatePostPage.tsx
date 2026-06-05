import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/index';
import { createPost } from '../../store/slices/postsSlice';
import { useAppContext } from '../../store/AppContext';
import './CreatePost.css';

const moods = [
  { label: 'Anxious',   value: 'anxious',   img: new URL('../../assets/Ansioso.png',    import.meta.url).href },
  { label: 'Angry',     value: 'angry',     img: new URL('../../assets/Enojado.png',    import.meta.url).href },
  { label: 'Happy',     value: 'happy',     img: new URL('../../assets/Feliz.png',      import.meta.url).href },
  { label: 'Disgusted', value: 'disgusted', img: new URL('../../assets/Disgustado.png', import.meta.url).href },
  { label: 'Sad',       value: 'sad',       img: new URL('../../assets/Triste.png',     import.meta.url).href },
];

const moodColors: Record<string, string> = {
  anxious:   '#f4a7c3',
  angry:     '#f47c6a',
  happy:     '#f7d06e',
  disgusted: '#6abf8a',
  sad:       '#7ab3d4',
};

const CreatePostPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { state: appState } = useAppContext();
  const currentUserId = appState.currentUser?.id ?? '';

  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await dispatch(createPost({
      user_id: currentUserId,
      content,
      image_url: image,
      mood: mood ?? 'happy',
    }));
    navigate('/feed');
  };

  return (
    <div className="cp-page">

      {/* Header */}
      <div className="cp-header">
        <h2 className="cp-title">Share your <span className="cp-italic">feelings</span></h2>
        <p className="cp-subtitle">Express yourself in a safe and <span className="cp-subtitle-accent">supportive</span> space</p>
      </div>

      {/* Card principal */}
      <div className="cp-card">

        {/* Author */}
        <div className="cp-author">
          <span className="cp-username">Current User</span>
        </div>

        {/* Textarea */}
        <div className="cp-textarea-wrapper">
          <textarea
            className="cp-textarea"
            placeholder="How are you feeling today? Share your thoughts, emotions, or what's been on your mind..."
            value={content}
            onChange={e => { if (e.target.value.length <= 500) setContent(e.target.value); }}
            rows={5}
          />
          <div className="cp-textarea-footer">
            <span className="cp-hint">Be authentic and kind</span>
            <span className="cp-counter">{content.length}/500</span>
          </div>
        </div>

        {/* Mood selector */}
        <div className="cp-mood-section">
          <p className="cp-mood-label">How are you feeling?</p>
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

        {/* Upload imagen */}
        <div className="cp-image-section">
          <p className="cp-mood-label">Add an image <span className="cp-optional">Optional</span></p>
          <label className="cp-upload-area">
            {image
              ? <img src={image} alt="preview" className="cp-preview" />
              : <>
                  <span className="cp-upload-icon">🖼️</span>
                  <span className="cp-upload-text">Click to upload an image</span>
                </>
            }
            <input type="file" accept="image/*" onChange={handleImage} className="cp-file" />
          </label>
        </div>

        {/* Botones */}
        <div className="cp-actions">
          <button className="cp-cancel" onClick={() => navigate('/feed')}>Cancel</button>
          <button className="cp-submit" onClick={handleSubmit}>Publish Post</button>
        </div>

      </div>

      {/* Guidelines */}
      <div className="cp-guidelines">
        <p className="cp-guidelines-title">Guidelines for behavior</p>
        <ul className="cp-guidelines-list">
          <li>Be honest about your feelings</li>
          <li>Respect others' emotional experiences</li>
          <li>Share support and kindness</li>
          <li>Remember you're not alone</li>
        </ul>
      </div>

    </div>
  );
};

export default CreatePostPage;