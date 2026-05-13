import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../../components/SingUpForm';
import './SingUpPage.css';

const charactersImg = new URL('../../assets/Frame 35.png', import.meta.url).href;

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (username: string) => {
    localStorage.setItem('registeredUser', username);
    navigate('/login');
  };

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