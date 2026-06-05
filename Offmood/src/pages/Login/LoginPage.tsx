import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// AppContext: contexto global propio de la app (usuario activo, ruta activa, etc.)
import { useAppContext } from '../../store/AppContext';
// useDispatch de Redux — permite lanzar thunks asíncronos al store de Redux
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/index';
// Thunks de Redux: cada uno hace una llamada a Supabase y guarda el resultado en Redux
import { fetchPosts } from '../../store/slices/postsSlice'; // trae todos los posts
import { fetchAllLikes, fetchUserLikes } from '../../store/slices/likesSlice';// likes globales y del usuario
import { fetchFollowing } from '../../store/slices/followersSlice';// lista de usuarios que sigue el usuario
import './LoginPage.css';
// Cliente de Supabase: conexión configurada con la URL y la API key del proyecto
import { supabase } from '../../supabaseClient/supabaseprincipal';
import logoImg from '../../assets/Logo.png';

const charactersImg = new URL('../../assets/Frame 35.png', import.meta.url).href;
// Estructura de los campos del formulario
interface LoginForm {
    username: string;// en realidad se usa como email al llamar a Supabase
    password: string;
}
// Mensajes de error por campo
interface LoginErrors {
    username?: string;
    password?: string;
}

const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
);

const IconLock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
    </svg>
);
// Iconos de proveedores OAuth (Google / Apple) — aún sin implementar
const GoogleIcon = () => (
    <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="login-social-icon"
    />
);

const AppleIcon = () => (
    <img
        src="https://www.svgrepo.com/show/473543/apple.svg"
        alt="Apple"
        className="login-social-icon"
    />
);
//Componente principal 
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    // dispatch del AppContext actualiza el estado global propio (usuario logueado)
    const { dispatch } = useAppContext();
     // dispatch de Redux lanza thunks que cargan datos en el store de Redux
    const reduxDispatch = useDispatch<AppDispatch>();
  // Estado local del formulario y de los errores de validación
    const [form, setForm] = useState<LoginForm>({
        username: '',
        password: '',
    });
 // Estado local de errores de validación
    const [errors, setErrors] = useState<LoginErrors>({});
 // Valida que ningún campo esté vacío; devuelve un objeto con los errores encontrados
    const validateForm = () => {
        const newErrors: LoginErrors = {};
        if (form.username.trim() === '') {
            newErrors.username = 'Username or email is required.';
        }
        if (form.password.trim() === '') {
            newErrors.password = 'Password is required.';
        }
        return newErrors;
    };
 // Actualiza el campo modificado y borra su error en tiempo real mientras el usuario escribe
    const handleChange = (field: keyof LoginForm, value: string) => {
        setForm({ ...form, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };
 // handleSubmit: flujo completo de login
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // evita que el formulario recargue la página
// 1. Validación del lado del cliente
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;// detiene el flujo si hay errores
        }
 // 2. Autenticación con Supabase Auth
        //    signInWithPassword compara email + contraseña con los usuarios registrados en Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: form.username, // el campo se llama "username" pero Supabase usa email
            password: form.password,
        });
 // Si las credenciales son incorrectas, Supabase devuelve un error
        if (error) {
            setErrors({ username: 'Email or password incorrect.' });
            return;
        }
  // 3. Obtener el perfil del usuario desde la tabla "profiles" de Supabase
        //    La tabla "profiles" extiende la tabla auth.users con datos extra (username, avatar)
        const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', data.user.id)// filtra por el ID del usuario autenticado
            .single();    // espera exactamente un registro
// 4. Guardar el usuario en el AppContext (estado global de la app)
        //    Esto hace que la Navbar, Sidebar, etc. muestren el nombre y avatar correctos
        dispatch({
            type: 'SET_USER',
            payload: {
                id: data.user.id,
                name: profile?.username ?? form.username, // fallback al email si no hay username
                email: data.user.email ?? '',
                avatar: profile?.avatar_url ?? 'https://i.pravatar.cc/40?img=3',
            },
        });
 // 5. Pre-cargar datos en Redux para que el Feed esté listo al llegar
        //    Cada reduxDispatch lanza un thunk asíncrono que llama a Supabase internamente
        reduxDispatch(fetchPosts());
        reduxDispatch(fetchAllLikes());
        reduxDispatch(fetchUserLikes(data.user.id));
        reduxDispatch(fetchFollowing(data.user.id));
  // 6. Redirigir al feed tras el login exitoso
        navigate('/feed');
    };

    return (
        <main className="login-page">
            <section className="login-left">
                <form className="login-form" onSubmit={handleSubmit}>
                    <header className="login-header">
                        <img src={logoImg} alt="offmood logo" className="login-logo" />
                        <h1>Welcome Back!</h1>
                        <p>Sign in to continue your emotional journey</p>
                    </header>

                    <div className="login-fields">
                        <div className="login-field">
                            <label>Username or email</label>
                            <div className={errors.username ? 'login-input-wrap login-input-wrap--error' : 'login-input-wrap'}>
                                <span className="login-input-icon"><IconUser /></span>
                                <input
                                    type="text"
                                    placeholder="Add a nickname"
                                    value={form.username}
                                    onChange={(event) => handleChange('username', event.target.value)}
                                />
                            </div>
                            {errors.username && <span className="login-error">{errors.username}</span>}
                        </div>

                        <div className="login-field">
                            <label>Password</label>
                            <div className={errors.password ? 'login-input-wrap login-input-wrap--error' : 'login-input-wrap'}>
                                <span className="login-input-icon"><IconLock /></span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(event) => handleChange('password', event.target.value)}
                                />
                            </div>
                            {errors.password && <span className="login-error">{errors.password}</span>}
                        </div>

                        <button type="button" className="login-forgot">Forgot your password?</button>

                        <button type="submit" className="login-submit">Log In</button>

                        <p className="login-signup-text">
                            Don't have an account?{' '}
                            <button type="button" onClick={() => navigate('/signup')}>Sign Up</button>
                        </p>

                        <div className="login-divider">
                            <span></span>
                            <p>Or continue with</p>
                            <span></span>
                        </div>

                        <div className="login-socials">
                            <button type="button"><GoogleIcon /></button>
                            <button type="button"><AppleIcon /></button>
                        </div>
                    </div>
                </form>
            </section>

            <section className="login-right">
                <img src={charactersImg} alt="offmood emotions" className="login-characters" />
            </section>
        </main>
    );
};

export default LoginPage;