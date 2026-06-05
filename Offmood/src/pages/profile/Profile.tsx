import React, { useState } from 'react';
 
// useSelector: hook de Redux que lee datos del store sin necesidad de props
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/index';
 
// AppContext: estado global propio de la app (usuario activo, perfil, ruta activa)
import { useAppContext } from '../../store/AppContext';
 
// Sub-componentes de UI del perfil
import ProfileHeader from '../../components/ProfileHeader';   // cabecera con avatar, nombre y stats
import ProfileTabs, { type TabId } from '../../components/ProfileTabs'; // pestañas "Posts" / "Liked"
import ProfilePost from '../../components/ProfilePost';        // tarjeta de cada post
 
import type { Post } from '../../types/profile';
import "./Profile.css"; 
// Mapa de nombre de mood en inglés → nombre del archivo de imagen en assets
// Permite construir la ruta de la imagen del mood para cada post
const moodImgMap: Record<string, string> = {
  anxious: 'Ansioso',
  angry:   'Enojado',
  happy:   'Feliz',
  disgusted: 'Disgustado',
  sad:     'Triste',
};
 
const Profile: React.FC = () => {
  // AppContext: datos del usuario activo y su perfil
  const { state: appState } = useAppContext();
 
  // ── Lectura del store de Redux ────────────────────────────
  // posts: lista de todos los posts del feed (cargados en el login con fetchPosts)
  const { posts } = useSelector((state: RootState) => state.posts);
 
  // userLikes: los posts a los que el usuario actual les dio like (cargados con fetchUserLikes)
  // allLikes: todos los likes de todos los usuarios (para calcular el conteo total por post)
  const { userLikes, allLikes } = useSelector((state: RootState) => state.likes);
 
  // ID del usuario autenticado — se usa para filtrar sus posts
  const currentUserId = appState.currentUser?.id ?? '';
 
  // Controla qué pestaña está activa: 'posts' | 'liked'
  const [activeTab, setActiveTab] = useState<TabId>('posts');
 
  // ── Filtrado de posts propios ─────────────────────────────
  // Filtra los posts cuyo user_id coincide con el usuario actual
  // Luego los mapea al tipo Post que esperan los sub-componentes de UI
  const myPosts: Post[] = posts
    .filter(p => p.user_id === currentUserId)
    .map(p => ({
      id: typeof p.id === 'string' ? parseInt(p.id, 10) : p.id,
      authorName:   appState.currentUser?.name   ?? p.user_id,  // nombre del AppContext o fallback al ID
      authorAvatar: appState.currentUser?.avatar ?? '',
      timeAgo:      p.created_at,
      content:      p.content,
      image:        p.image_url,
      // Capitaliza la primera letra del mood (ej: "happy" → "Happy")
      mood: p.mood ? p.mood.charAt(0).toUpperCase() + p.mood.slice(1) : 'Happy',
      // Ruta de la imagen del mood usando el mapa definido arriba
      moodImage: `/src/assets/${moodImgMap[p.mood ?? 'happy'] ?? 'Feliz'}.png`,
      moodColor: '',
      // Cuenta cuántos likes tiene este post cruzando allLikes con el ID del post
      likes: allLikes.filter((l: { post_id: string }) => l.post_id === p.id).length,
      commentsCount: 0,
      lastComment: null,
    }));
 
  // ── Filtrado de posts con like ────────────────────────────
  // Extrae los IDs de los posts que el usuario ha likeado
  const likedPostIds = userLikes.map((l: { post_id: string }) => l.post_id);
 
  // Filtra el listado global de posts para quedarse solo con los likeados
  const likedPosts: Post[] = posts
    .filter(p => likedPostIds.includes(p.id))
    .map(p => ({
      id: typeof p.id === 'string' ? parseInt(p.id, 10) : p.id,
      // Para posts ajenos, el nombre viene de la relación profiles (join de Supabase)
      authorName:   p.profiles?.username ?? p.user_id,
      authorAvatar: '',
      timeAgo:      p.created_at,
      content:      p.content,
      image:        p.image_url,
      mood: p.mood ? p.mood.charAt(0).toUpperCase() + p.mood.slice(1) : 'Happy',
      moodImage: `/src/assets/${moodImgMap[p.mood ?? 'happy'] ?? 'Feliz'}.png`,
      moodColor: '',
      likes: allLikes.filter((l: { post_id: string }) => l.post_id === p.id).length,
      commentsCount: 0,
      lastComment: null,
    }));
 
  // ── Perfil enriquecido con estadísticas ───────────────────
  // Combina el perfil base del AppContext con el conteo real de posts
  const profileWithStats = {
    ...appState.profile,
    // Sobreescribe nombre y avatar con los del usuario autenticado (siempre actualizados)
    name:   appState.currentUser?.name   ?? appState.profile.name,
    avatar: appState.currentUser?.avatar ?? appState.profile.avatar,
    stats: {
      ...appState.profile.stats,
      posts: myPosts.length, // número real de posts calculado desde Redux
      comments:  appState.profile.stats.comments,
      followers: appState.profile.stats.followers,
    },
  };
 
  // Elige qué lista mostrar según la pestaña activa
  const displayPosts = activeTab === 'posts' ? myPosts : likedPosts;
 
  // Logs de depuración — se pueden eliminar en producción
  console.log('userLikes:', userLikes);
  console.log('likedPostIds:', likedPostIds);
  console.log('posts ids:', posts.map(p => p.id));
 
  // ── Render ────────────────────────────────────────────────
  return (
    <div className="profile-page">
 
      {/* Cabecera: avatar, nombre, bio y estadísticas */}
      <ProfileHeader profile={profileWithStats} />
 
      {/* Pestañas "Posts" / "Liked" — onChange actualiza activeTab */}
      <ProfileTabs active={activeTab} onChange={setActiveTab} />
 
      {/* Lista de posts de la pestaña activa */}
      <div className="profile-feed">
        {displayPosts.length === 0
          // Mensaje vacío diferente según la pestaña
          ? <p style={{ textAlign: 'center', color: '#aaa', padding: '32px' }}>
              {activeTab === 'posts' ? 'No posts yet.' : 'No liked posts yet.'}
            </p>
          // Un ProfilePost por cada post en la lista filtrada
          : displayPosts.map(post => <ProfilePost key={post.id} post={post} />)
        }
      </div>
 
    </div>
  );
};
 
export default Profile;