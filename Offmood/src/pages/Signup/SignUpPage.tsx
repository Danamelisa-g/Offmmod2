import React, { useState } from 'react';
import SignUpForm from '../../components/SingUpForm';
import './SingUpPage.css';

// Aquí llame la imagen que tengo en assets no la quiten que es para el signup
const charactersImg = new URL('../../assets/Frame 35.png', import.meta.url).href;

const SignUpPage: React.FC = () => {

  const [, setRegisteredUser] = useState<string | null>(null);

  const handleSuccess = (username: string) => {
    setRegisteredUser(username);
  };

  // Este es para la navegación hacia el login, no funciona aún hasta que le hagamos router
  const handleGoToLogin = () => {
    console.log('TODO: navigate /login');
  };

  return (
    <div className="sup-page">

      {/* Panel izquierdo imagen */}
      <aside className="sup-left">


        {/* Imagen de personajes desde src/assets/ — no mover */}
        <img
          src={charactersImg}
          alt="Personajes de emociones de offmood"
          className="sup-left__img"
        />

        

      </aside>

      {/* Panel derecho: formulario */}
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