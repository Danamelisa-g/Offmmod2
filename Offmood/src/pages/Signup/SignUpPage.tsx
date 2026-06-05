import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../../components/SingUpForm';
import './SingUpPage.css';

const charactersImg = new URL('../../assets/Frame 35.png', import.meta.url).href;

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  // Se invoca desde SignUpForm cuando Supabase termina el registro sin errores.
  // username: el nombre que el usuario eligió en el formulario.
  const handleSuccess = (username: string) => {
     // Guarda el username para que LoginPage pueda pre-rellenar el campo si lo necesita
    localStorage.setItem('registeredUser', username);
    // Redirige al login para que el usuario inicie sesión con su nueva cuenta
    navigate('/login');
  };
  // Se invoca cuando el usuario hace clic en "Log in" dentro del formulario
  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="sup-page">
      <aside className="sup-left">
        <img
          src={charactersImg}
          alt="Personajes de emociones de offmood"
          className="sup-left__img"
        />
      </aside>

      <main className="sup-right">
        <SignUpForm
          onSuccess={handleSuccess}
          onGoToLogin={handleGoToLogin}
        />
      </main>
    </div>
  );
};

export default SignUpPage;