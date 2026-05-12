import { useAppContext } from '../store/AppContext';
import './Home.css';
import React, { useState, useEffect } from 'react';

const moodColors: Record<string, { bg: string; border: string; text: string }> = {
  anxious:   { bg: '#fce8f3', border: '#f4a7c3', text: '#c2547a' },
  angry:     { bg: '#fde8e4', border: '#f47c6a', text: '#c0392b' },
  happy:     { bg: '#fef6e0', border: '#f7d06e', text: '#b8860b' },
  disgusted: { bg: '#e6f4ea', border: '#6abf8a', text: '#2e7d32' },
  sad:       { bg: '#e3f0f8', border: '#7ab3d4', text: '#1565c0' },
};

const moodImgs: Record<string, string> = {
  anxious:   new URL('../assets/Ansioso.png',    import.meta.url).href,
  angry:     new URL('../assets/Enojado.png',    import.meta.url).href,
  happy:     new URL('../assets/Feliz.png',      import.meta.url).href,
  disgusted: new URL('../assets/Disgustado.png', import.meta.url).href,
  sad:       new URL('../assets/Triste.png',     import.meta.url).href,
};

const moodLabels: Record<string, string> = {
  anxious: 'Anxious', angry: 'Angry', happy: 'Happy', disgusted: 'Disgusted', sad: 'Sad',
};

const allMoods = ['anxious', 'angry', 'happy', 'disgusted', 'sad'];

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const Home: React.FC = () => {
  const { state, } = useAppContext();
  const [comments, setComments] = useState<Record<number, string>>({});
  const [postComments, setPostComments] = useState<Record<number, { user: string; text: string }[]>>(() => {
    try {
      const saved = localStorage.getItem('offmood-comments');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [likes, setLikes] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('offmood-likes');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
  localStorage.setItem('offmood-likes', JSON.stringify(likes));
}, [likes]);

useEffect(() => {
  localStorage.setItem('offmood-comments', JSON.stringify(postComments));
}, [postComments]);

  const handleLike = (id: number) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const handleComment = (id: number) => {
    const text = comments[id]?.trim();
    if (!text) return;
    setPostComments(prev => ({
      ...prev,
      [id]: [...(prev[id] ?? []), { user: state.currentUser?.name ?? 'Usuario', text }],
    }));
    setComments(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="home-page">

      {/* Mood selector */}
      <div className="home-card">
        <h3 className="home-mood-title">How are you <span className="home-italic">feeling</span> today?</h3>
        <div className="home-moods">
          {allMoods.map(m => (
            <button key={m} className="home-mood-btn">
              <img src={moodImgs[m]} alt={moodLabels[m]} className="home-mood-img" />
              <span>{moodLabels[m]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed de posts */}
      {state.posts.map(post => {
        const mood = moodColors[post.mood] ?? moodColors.happy;
        return (
          <div key={post.id} className="home-card home-post">

            {/* Header del post */}
            <div className="post-header">
              <div className="post-author">
                <img src={post.avatar} alt={post.user} className="post-avatar" />
                <div>
                  <span className="post-username">{post.user}</span>
                  <span className="post-time">{timeAgo(post.date)}</span>
                </div>
              </div>
              <div className="post-mood-badge" style={{ background: mood.bg, borderColor: mood.border, color: mood.text }}>
                <img src={moodImgs[post.mood]} alt={post.mood} className="post-mood-icon" />
                <span>{moodLabels[post.mood] ?? post.mood}</span>
              </div>
            </div>

            {/* Contenido */}
            <p className="post-content">{post.content}</p>

            {/* Imagen si tiene */}
            {post.image && <img src={post.image} alt="post" className="post-image" />}

            {/* Acciones */}
            <div className="post-actions">
              <button className="post-action-btn" onClick={() => handleLike(post.id)}>
                ♡ {likes[post.id] ?? 0}
              </button>
              <button className="post-action-btn">
                ○ {(postComments[post.id] ?? []).length}
              </button>
            </div>

            {/* Comentarios existentes */}
            {(postComments[post.id] ?? []).map((c, i) => (
              <div key={i} className="post-comment">
                <span className="post-comment-user">{c.user}</span>
                <span className="post-comment-text">{c.text}</span>
              </div>
            ))}

            {/* Input comentario */}
            <div className="post-comment-input">
              <img src={state.currentUser?.avatar} alt="avatar" className="post-avatar-sm" />
              <input
                type="text"
                placeholder="Write your comment..."
                value={comments[post.id] ?? ''}
                onChange={e => setComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') handleComment(post.id); }}
                className="post-input"
              />
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default Home;