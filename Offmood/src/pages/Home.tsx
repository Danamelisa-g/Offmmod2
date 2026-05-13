import { useAppContext } from '../store/AppContext';
import './Home.css';
import React, { useState } from 'react';
import MoodSelector from '../components/moods/MoodSelector';

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
  const { state, dispatch } = useAppContext();
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const handleLike = (id: number) => {
    const isLiked = state.likedPostIds.includes(id);
    const current = state.postLikes[id] ?? 0;
    dispatch({ type: 'TOGGLE_LIKE', payload: id });
    dispatch({ type: 'SET_POST_LIKES', payload: { id, count: isLiked ? current - 1 : current + 1 } });
  };

  const handleComment = (id: number) => {
    const text = commentInputs[id]?.trim();
    if (!text) return;
    const existing = state.postComments[id] ?? [];
    dispatch({
      type: 'SET_POST_COMMENT',
      payload: { id, comments: [...existing, { user: state.currentUser?.name ?? 'Usuario', text }] },
    });
    setCommentInputs(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="home-page">

    <MoodSelector />

      {/* Feed de posts */}
      {state.posts.map(post => {
        const mood = moodColors[post.mood] ?? moodColors.happy;
        const isLiked = state.likedPostIds.includes(post.id);
        const likeCount = state.postLikes[post.id] ?? 0;
        const comments = state.postComments[post.id] ?? [];
        const isCurrentUser = post.userId === state.currentUser?.id;
        const displayAvatar = isCurrentUser ? (state.currentUser?.avatar ?? post.avatar) : post.avatar;
        const displayName = isCurrentUser ? (state.currentUser?.name ?? post.user) : post.user;

        return (
          <div key={post.id} className="home-card home-post">

            {/* Header */}
            <div className="post-header">
              <div className="post-author">
                <img src={displayAvatar} alt={displayName} className="post-avatar" />
                <div>
                  <span className="post-username">{displayName}</span>
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

            {/* Imagen */}
            {post.image && <img src={post.image} alt="post" className="post-image" />}

            {/* Acciones */}
            <div className="post-actions">
              <button
                className="post-action-btn"
                onClick={() => handleLike(post.id)}
                style={{ color: isLiked ? '#e0345a' : undefined }}
              >
                {isLiked ? '♥' : '♡'} {likeCount}
              </button>
              <button className="post-action-btn">
                ○ {comments.length}
              </button>
            </div>

            {/* Comentarios */}
            {comments.map((c, i) => (
              <div key={i} className="post-comment">
                <span className="post-comment-user">{c.user}</span>
                <span className="post-comment-text"> {c.text}</span>
              </div>
            ))}

            {/* Input comentario */}
            <div className="post-comment-input">
              <img src={state.currentUser?.avatar} alt="avatar" className="post-avatar-sm" />
              <input
                type="text"
                placeholder="Write your comment..."
                maxLength={200}
                value={commentInputs[post.id] ?? ''}
                onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') handleComment(post.id); }}
                className="post-input"
              />
              <span style={{ fontSize: '0.75rem', color: '#bbb', textAlign: 'right' }}>
                {(commentInputs[post.id] ?? '').length}/200
              </span>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default Home;