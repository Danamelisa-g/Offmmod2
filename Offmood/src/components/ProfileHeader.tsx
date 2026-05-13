import React from 'react';
//useNavigate es el "GPS" de la app le dice al navegador a qué página ir.
import { useNavigate } from 'react-router-dom';
import type { ProfileData } from '../types/profile';
//mport type ProfileData importa solo el tipo TypeScript 
//interface es como un contrato define qué datos DEBE recibir el componente. 
// Si le pasas algo incorrecto, TypeScript te avisa antes de correr el código.
interface ProfileHeaderProps {
  profile: ProfileData;
}//
// le dice a React que este es un componente funcional que recibe exactamente esas props.
//componente de arriba 
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {//desestructuración. En lugar de escribir props.profile cada vez, lo extrae directo.
  const navigate = useNavigate();

  return (
    <section className="ph-card">
      {/*  Fila superior: avatar + datos */}
      <div className="ph-top">
        <div className="ph-avatar-wrap">
          <img
            src={profile.avatar}//las llaves "aquí va JavaScript"Le pasa el valor real del avatar que viene del mockData.
            alt={profile.name}
            className="ph-avatar"
          />
        </div>

        <div className="ph-info">
          <div className="ph-name-row">
            <h1 className="ph-name">{profile.name}</h1>
            <button
              className="ph-edit-btn"
              onClick={() => navigate('/profile/edit')}//navegacion hacia la pagina de editar
            >{/*aqui va el dieno del boton*/}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="ph-edit-label">Edit Profile</span>
            </button>
          </div>
          {/* Biografía del usuario — viene directo del mockData */}
          <p className="ph-bio">{profile.bio}</p>
          {/* Contenedor de las 3 estadísticas */}
          <div className="ph-stats">
            <div className="ph-stat">
              <span className="ph-stat-num">{profile.stats.posts}</span>
              <span className="ph-stat-lbl">Posts</span>
            </div>
            <div className="ph-stat">
              <span className="ph-stat-num">{profile.stats.comments}</span>
              <span className="ph-stat-lbl">Comments</span>
            </div>
            <div className="ph-stat">
              <span className="ph-stat-num">{profile.stats.followers}</span>
              <span className="ph-stat-lbl">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sección completa de moods semanales ── */}
      <div className="ph-moods">
        <p className="ph-moods-label">
          This week's <em className="ph-moods-accent">moods</em>
        </p>
{/* Fila horizontal que contiene las 7 burbujas (sun, mon, tue...) */}
        <div className="ph-moods-row">
            {/* .map() recorre el array de 7 días del mockData y crea una burbuja por cada uno */}
          {profile.weekMoods.map((item) => (
            //{/* Contenedor de cada día: burbuja + nombre del día debajo */}      
            // {/* key={item.day} — React necesita un ID único por cada elemento del map */}
            <div key={item.day} className="ph-mood-item">
              <div
                className="ph-mood-bubble"
                title={item.mood ?? 'No mood'}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.mood ?? ''}
                    className="ph-mood-img"
                  />
                ) : (
                  <span className="ph-mood-empty" />
                )}
              </div>
              <span className="ph-mood-day">{item.day}</span>
            </div>
          ))}
        </div>

        <p className="ph-moods-hint">Track your emotional patterns over the week</p>
      </div>
    </section>
  );
};

export default ProfileHeader;