import React, { useState } from 'react';
import type { Post } from '../types/profile';
 
// Define las props que recibe este componente: un solo post
interface ProfilePostProps {
  post: Post;
}
 
const ProfilePost: React.FC<ProfilePostProps> = ({ post }) => {
 
  // Estado local: si el usuario ya le dio like o no
  const [liked, setLiked] = useState(false);
  // Estado local: contador de likes (arranca con el valor que viene del mockData)
  const [likeCount, setLikeCount] = useState(post.likes);
 
  // Alterna el like: si ya tenía like lo quita, si no lo pone
  // También suma o resta 1 al contador según el estado anterior
  const toggleLike = () => {
    setLiked((p) => !p);
    setLikeCount((p) => (liked ? p - 1 : p + 1));
  };
 
  return (
    <article className="ppost">
 
      {/* ── Fila superior: avatar del autor + nombre + tiempo + tag de mood ── */}
      <div className="ppost-header">
 
        {/* Lado izquierdo: foto, nombre y hace cuánto se publicó */}
        <div className="ppost-author">
          <img src={post.authorAvatar} alt={post.authorName} className="ppost-avatar" />
          <div className="ppost-meta">
            <span className="ppost-name">{post.authorName}</span>
            <span className="ppost-sep">•</span>
            <span className="ppost-time">{post.timeAgo}</span>
          </div>
        </div>
 
        {/* Lado derecho: tag que muestra el mood del post
            - borderColor y color del texto vienen del mockData (moodColor)
            - cambia de color según la emoción (ej: amarillo para Happy, azul para Sad) */}
        <div className="ppost-mood" style={{ borderColor: post.moodColor }}>
          <img src={post.moodImage} alt={post.mood} className="ppost-mood-img" />
          <span className="ppost-mood-name" style={{ color: post.moodColor }}>
            {post.mood}
          </span>
        </div>
      </div>
 
      {/* ── Texto del post ── */}
      <p className="ppost-content">{post.content}</p>
 
      {/* ── Imagen del post (opcional) — solo se renderiza si existe en el mockData ── */}
      {post.image && (
        <div className="ppost-img-wrap">
          <img src={post.image} alt="post" className="ppost-img" />
        </div>
      )}
 
      {/* ── Botones de acción: like y comentarios ── */}
      <div className="ppost-actions">
 
        {/* Botón de like: cambia de color y se rellena cuando liked === true */}
        <button
          className={`ppost-action ${liked ? 'ppost-action--liked' : ''}`}
          onClick={toggleLike}
        >
          {/* Ícono de corazón: fill cambia entre 'none' y 'currentColor' según el estado */}
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likeCount}
        </button>
 
        {/* Botón de comentarios: solo muestra el conteo, no tiene acción por ahora */}
        <button className="ppost-action">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post.commentsCount}
        </button>
      </div>
 
      {/* ── Preview del último comentario (opcional) ──
          Solo aparece si el post tiene lastComment en el mockData */}
      {post.lastComment && (
        <div className="ppost-comment">
          <span className="ppost-comment-author">{post.lastComment.author}</span>
          <span className="ppost-comment-text"> {post.lastComment.text}</span>
        </div>
      )}
 
    </article>
  );
};
 
export default ProfilePost;