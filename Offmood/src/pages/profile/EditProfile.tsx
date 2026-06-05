import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
 
// AppContext: estado global de la app (perfil, usuario activo, etc.)
import { useAppContext } from '../../store/AppContext';
import type { ProfileData } from '../../types/profile';
import './editProfile.css';
 
// Cliente de Supabase — usado tanto para Storage (avatar) como para la DB (profiles)
import { supabase } from '../../supabaseClient/supabaseprincipal';
 
// ══════════════════════════════════════════════════════════════
//  SUB-COMPONENTE: AvatarSection
//  Muestra la foto de perfil actual y el botón "Change Profile Picture".
//  Al seleccionar un archivo:
//    1. Lo sube a Supabase Storage en el bucket "avatars".
//    2. Obtiene la URL pública del archivo subido.
//    3. Llama onChange(url) para que EditProfilePage actualice su estado.
// ══════════════════════════════════════════════════════════════
interface AvatarSectionProps {
  avatar: string;   // URL actual del avatar (puede ser vacía)
  name: string;     // Nombre del usuario (para mostrar la inicial si no hay avatar)
  onChange: (base64: string) => void; // Callback con la nueva URL pública
}
 
const AvatarSection: React.FC<AvatarSectionProps> = ({ avatar, name, onChange }) => {
  // ref al <input type="file"> oculto — se usa para abrirlo programáticamente
  const ref = useRef<HTMLInputElement>(null);
 
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
 
    // Extraer la extensión del archivo (jpg, png, gif, etc.)
    const fileExt = file.name.split('.').pop();
 
    // Nombre único para evitar colisiones en el bucket (timestamp como sufijo)
    const fileName = `avatar-${Date.now()}.${fileExt}`;
 
    // ── Subir a Supabase Storage ────────────────────────────
    // supabase.storage.from('avatars') → accede al bucket llamado "avatars"
    // .upload(fileName, file, { upsert: true }) → sube el archivo;
    //   upsert:true sobreescribe si ya existe un archivo con ese nombre
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });
 
    if (error) {
      console.error('Error uploading avatar:', error.message);
      return;
    }
 
    // ── Obtener la URL pública del archivo subido ───────────
    // getPublicUrl devuelve la URL accesible sin autenticación
    // (el bucket "avatars" debe tener política de acceso público)
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);
 
    // Notifica al padre con la URL pública para que actualice el estado y la vista
    onChange(urlData.publicUrl);
  };
 
  return (
    <div className="ep-field">
      <span className="ep-label">Profile Picture</span>
      <div className="ep-avatar-row">
        <div className="ep-avatar-ring">
          {/* Si tiene avatar muestra la imagen; si no, muestra la inicial del nombre */}
          {avatar
            ? <img src={avatar} alt={name} className="ep-avatar-img" />
            : <div className="ep-avatar-init">{name.charAt(0)}</div>
          }
        </div>
        <div className="ep-avatar-side">
          {/* Clic en este botón dispara el input de archivo oculto */}
          <button className="ep-change-btn" onClick={() => ref.current?.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Change Profile Picture
          </button>
          <p className="ep-avatar-hint">JPG, PNG or GIF. Max size 70MB</p>
 
          {/* Input de archivo oculto — solo se activa vía ref desde el botón de arriba */}
          <input
            ref={ref}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
        </div>
      </div>
    </div>
  );
};
 
// ══════════════════════════════════════════════════════════════
//  SUB-COMPONENTE: VisibilityPicker
//  Selector de privacidad del perfil con tres opciones en forma de "radio cards".
//  La card activa se resalta con borde y fondo de color primario.
// ══════════════════════════════════════════════════════════════
type Visibility = 'public' | 'followers' | 'private';
 
interface VisibilityPickerProps {
  value: Visibility;
  onChange: (v: Visibility) => void;
}
 
// Definición estática de las tres opciones de privacidad
const OPTIONS: { value: Visibility; label: string; desc: string }[] = [
  { value: 'public',    label: 'Public',        desc: 'Everyone can see your mood history' },
  { value: 'followers', label: 'Followers Only', desc: 'Only your followers can see your mood history' },
  { value: 'private',   label: 'Private',        desc: 'Only you can see your mood history' },
];
 
const VisibilityPicker: React.FC<VisibilityPickerProps> = ({ value, onChange }) => (
  <div className="ep-vis-group">
    {OPTIONS.map((opt) => (
      <label
        key={opt.value}
        // Agrega la clase "--active" a la card seleccionada para resaltarla visualmente
        className={`ep-vis-card ${value === opt.value ? 'ep-vis-card--active' : ''}`}
      >
        {/* Radio input oculto — el label envolvente lo activa al hacer clic en la card */}
        <input
          type="radio"
          name="visibility"
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
        />
        <div className="ep-vis-text">
          <span className="ep-vis-label">{opt.label}</span>
          <span className="ep-vis-desc">{opt.desc}</span>
        </div>
      </label>
    ))}
  </div>
);
 
// ══════════════════════════════════════════════════════════════
//  PÁGINA PRINCIPAL: EditProfilePage
//  Orquesta los sub-componentes y maneja el guardado.
// ══════════════════════════════════════════════════════════════
const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
 
  // state: contiene el perfil actual y el usuario activo
  // dispatch: envía acciones al AppContext para actualizar el estado global
  const { state, dispatch } = useAppContext();
  const profile = state.profile;
 
  // Estado local de cada campo editable — se inicializa con los valores actuales del perfil
  const [avatar,     setAvatar]     = useState(profile.avatar ?? '');
  const [name,       setName]       = useState(profile.name ?? '');
  const [bio,        setBio]        = useState(profile.bio ?? '');
  const [visibility, setVisibility] = useState<Visibility>(profile.moodVisibility ?? 'public');
 
  // ── handleSave: guardar cambios ───────────────────────────
  const handleSave = async () => {
    // Objeto con los campos modificados (solo los que el perfil puede tener)
    const updated: Partial<ProfileData> = { avatar, name, bio, moodVisibility: visibility };
 
    // 1. Actualizar el AppContext inmediatamente → la UI refleja el cambio al instante
    dispatch({ type: 'UPDATE_PROFILE', payload: updated });
 
    // 2. Persistir en Supabase: actualizar la fila del usuario en la tabla "profiles"
    //    getUser() obtiene el usuario autenticado actualmente en la sesión de Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({
          username: name,       // campo "username" en la tabla profiles
          avatar_url: avatar,   // campo "avatar_url" en la tabla profiles
        })
        .eq('id', user.id); // filtra por el UUID del usuario autenticado
    }
 
    // Redirige al perfil después de guardar
    navigate('/profile');
  };
 
  const handleCancel = () => navigate('/profile');
 
  // ── Render ────────────────────────────────────────────────
  return (
    <div className="ep-page">
      <div className="ep-container">
 
        {/* Botón para volver sin guardar */}
        <button className="ep-back" onClick={handleCancel}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Profile
        </button>
 
        <div className="ep-heading">
          <h1 className="ep-title">Edit Profile</h1>
          <p className="ep-subtitle">Update your profile information and preferences</p>
        </div>
 
        {/* Tarjeta principal: avatar, nombre y bio */}
        <div className="ep-card">
 
          {/* Sección de avatar — gestiona la subida a Supabase Storage internamente */}
          <AvatarSection avatar={avatar} name={profile.name} onChange={setAvatar} />
 
          <div className="ep-divider" />
 
          {/* Campo nombre */}
          <div className="ep-field">
            <label className="ep-label" htmlFor="ep-name">Name</label>
            <div className="ep-input-wrap">
              <svg className="ep-input-icon" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                id="ep-name"
                className="ep-input"
                type="text"
                placeholder="Your display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
 
          <div className="ep-divider" />
 
          {/* Campo bio con contador de caracteres (máximo 200) */}
          <div className="ep-field">
            <label className="ep-label" htmlFor="ep-bio">Bio</label>
            <textarea
              id="ep-bio"
              className="ep-textarea"
              placeholder="How are you feeling today?..."
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            {/* Contador en tiempo real: se actualiza con cada tecla */}
            <span className="ep-char">{bio.length}/200 characters</span>
          </div>
 
        </div>
 
        {/* Sección de privacidad */}
        <div className="ep-section-hd">
          <div>
            <h2 className="ep-section-title">Privacy Settings</h2>
            <p className="ep-section-sub">Control who can see your mood history</p>
          </div>
        </div>
 
        <div className="ep-card">
          <span className="ep-label">Mood Visibility</span>
          {/* Radio cards de privacidad */}
          <VisibilityPicker value={visibility} onChange={setVisibility} />
        </div>
 
        {/* Botones de acción */}
        <div className="ep-actions">
          <button className="ep-cancel" onClick={handleCancel}>Cancel</button>
          {/* handleSave actualiza AppContext + Supabase */}
          <button className="ep-save" onClick={handleSave}>Save changes</button>
        </div>
 
        <p className="ep-note">
          <strong>Note:</strong> Your profile information helps others connect with you.
          Choose settings that make you feel comfortable sharing your emotional journey.
        </p>
 
      </div>
    </div>
  );
};
 
export default EditProfilePage;