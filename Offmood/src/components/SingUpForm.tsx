import React, { useState } from 'react';
import './SingUpForm.css';
 
// Logo real desde la carpeta assets
import logoImg from '../assets/Logo.png';
 
// Aqui definimos como se ve el formulario por dentro
// cada campo tiene su valor y sus errores
interface FormState {
  username: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}
 
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  acceptTerms?: string;
}
 
// Esta funcion revisa que todo este bien antes de enviar el formulario
function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
 
  // El nombre de usuario es obligatorio
  if (form.username.trim() === '') {
    errors.username = 'Username is required.';
  }
 
  // El email es obligatorio y debe tener formato correcto
  if (form.email.trim() === '') {
    errors.email = 'Email is required.';
  } else if (!form.email.includes('@') || !form.email.includes('.')) {
    errors.email = 'Enter a valid email (e.g. name@domain.com).';
  }
 
  // Lista de caracteres especiales validos
  const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*'];
 
  // Revisa si la contraseña contiene al menos uno de esos caracteres
  const hasSpecialChar = specialCharacters.some(char => form.password.includes(char));
 
  // La contraseña debe tener minimo 8 caracteres y un caracter especial
  if (form.password === '') {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Must be at least 8 characters.';
  } else if (!hasSpecialChar) {
    errors.password = 'Must contain at least one special character (!@#$%^&*).';
  }
 
  // Debe aceptar los terminos
  if (form.acceptTerms === false) {
    errors.acceptTerms = 'You must accept the terms to continue.';
  }
 
  return errors;
}
 
// Iconos sencillos para los inputs
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>
);
 
// Icono de email
const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 9l10 6 10-6" strokeLinecap="round" />
  </svg>
);
 
// Icono de candado
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
  </svg>
);
 
// Logo real de offmood
const OffmoodLogo = () => (
  <img src={logoImg} alt="offmood logo" width={64} height={48} />
);
 
// Props que le llegan a este componente desde SignUpPage
interface SignUpFormProps {
  onSuccess?: (username: string) => void;
  onGoToLogin?: () => void;
}
 
// Componente principal del formulario
const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onGoToLogin }) => {
 
  // Estado del formulario — guarda lo que el usuario escribe
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    acceptTerms: false,
  });
 
  // Estado de errores se llena cuando el usuario hace click en Sign Up
  // Si no llena un campo le aparece un mensaje diciendole que lo debe llenar
  const [errors, setErrors] = useState<FormErrors>({});
 
  // Estado de carga para el proceso de registro simulado
  const [loading, setLoading] = useState(false);
 
  // Actualiza el valor de un campo cuando el usuario escribe
  function handleChange(field: string, value: string) {
    setForm({ ...form, [field]: value });
 
    // Limpia el error de ese campo mientras el usuario corrige
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  }
 
  // Actualiza el checkbox de terminos
  function handleTerms(checked: boolean) {
    setForm({ ...form, acceptTerms: checked });
    if (errors.acceptTerms) {
      setErrors({ ...errors, acceptTerms: undefined });
    }
  }
 
  // Se ejecuta cuando el usuario hace click en Sign Up
  async function handleSubmit() {
    // Primero validamos todo
    const formErrors = validateForm(form);
 
    // Si hay errores los mostramos y no continuamos proque hay una condicion de error
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
 
    // Si todo esta bien simulamos el registro
    setLoading(true);
 
    try {
      // Simulamos una llamada al servidor (1.2 segundos)
      // Cuando tengas backend real reemplaza esta linea
      await new Promise(resolve => setTimeout(resolve, 1200));
 
      // Le avisamos a la pagina padre que el registro fue exitoso
      if (onSuccess) {
        onSuccess(form.username);
      }
 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Si algo sale mal mostramos un mensaje de error
      setErrors({ email: 'Something went wrong. Please try again.' });
 
    } finally {
      // Pase lo que pase, quitamos el estado de carga
      setLoading(false);
    }
  }
 
  return (
    <div className="suf">
 
      {/* Logo y titulo */}
      <div className="header">
        <OffmoodLogo />
        <h1 className="suf__title">Join offmood</h1>
        <p className="suf__subtitle">
          Create your account and start sharing how you <em>feel</em>
        </p>
      </div>
 
      {/* Campos del formulario */}
      <div className="inputs">
 
        {/* Campo username */}
        <div className="inputs__groups">
          <label className="inputs_label">Username</label>
          <div className={errors.username ? 'suf__input-wrap suf__input-wrap--error' : 'suf__input-wrap'}>
            <span className="suf__input-icon"><IconUser /></span>
            <input
              className="suf__input"
              type="text"
              name="username"
              placeholder="Add a nickname"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              autoComplete="off"
            />
          </div>
          {errors.username && <span className="suf__error">{errors.username}</span>}
        </div>
 
        {/* Campo email */}
        <div className="suf__field-group">
          <label className="suf__label">Email</label>
          <div className={errors.email ? 'suf__input-wrap suf__input-wrap--error' : 'suf__input-wrap'}>
            <span className="suf__input-icon"><IconEmail /></span>
            <input
              className="suf__input"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoComplete="off"
            />
          </div>
          {errors.email && <span className="suf__error">{errors.email}</span>}
        </div>
 
        {/* Campo password */}
        <div className="suf__field-group">
          <label className="suf__label">Password</label>
          <div className={errors.password ? 'suf__input-wrap suf__input-wrap--error' : 'suf__input-wrap'}>
            <span className="suf__input-icon"><IconLock /></span>
            <input
              className="suf__input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>
          {!errors.password && (
            <span className="suf__hint">Must be at least 8 caracters & contain especial caracters</span>
          )}
          {errors.password && <span className="suf__error">{errors.password}</span>}
        </div>
 
        {/* Checkbox de terminos */}
        <div className="suf__terms">
          <label className="suf__checkbox-label">
            <input
              type="checkbox"
              className="suf__checkbox"
              checked={form.acceptTerms}
              onChange={(e) => handleTerms(e.target.checked)}
            />
            <span className="suf__checkbox-custom" />
            <span className="suf__checkbox-text">
              I agree to the{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>terms of service</a>
              {' '}and{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>private policy</a>
            </span>
          </label>
          {errors.acceptTerms && (
            <span className="suf__error suf__error--terms">{errors.acceptTerms}</span>
          )}
        </div>
 
      </div>
 
      {/* Boton Sign Up */}
      <button
        className="suf__btn-primary"
        type="button"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
 
      {/* Link para ir al login */}
      <p className="suf__login-hint">
        Already have an account?{' '}
        {/* Cuando tengas React Router reemplaza este button por Link to="/login" */}
        <button type="button" className="suf__login-link" onClick={onGoToLogin}>
          Log in
        </button>
      </p>
 
      {/* Linea divisoria */}
      <div className="suf__divider">
        <span className="suf__divider-line" />
        <span className="suf__divider-text">Or continue with</span>
        <span className="suf__divider-line" />
      </div>
 
      {/* Botones de Google y Apple */}
      <div className="suf__social">
        <button type="button" className="suf__btn-social" onClick={() => console.log('Google OAuth')}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={22} height={22} />
        </button>
        <button type="button" className="suf__btn-social" onClick={() => console.log('Apple OAuth')}>
          <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.39.07 2.35.74 3.15.8 1.19-.24 2.33-.93 3.61-.84 1.54.12 2.7.72 3.44 1.88-3.19 1.88-2.43 5.9.54 7.05-.45 1.29-1.04 2.57-2.74 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
        </button>
      </div>
 
    </div>
  );
};
 
export default SignUpForm;