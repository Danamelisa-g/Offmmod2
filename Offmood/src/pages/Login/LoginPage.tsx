import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import './LoginPage.css';
import { supabase } from '../../supabaseClient/supabaseprincipal';

import logoImg from '../../assets/Logo.png';

const charactersImg = new URL('../../assets/Frame 35.png', import.meta.url).href;

interface LoginForm {
    username: string;
    password: string;
}

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
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useAppContext();

    const [form, setForm] = useState<LoginForm>({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState<LoginErrors>({});

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

    const handleChange = (field: keyof LoginForm, value: string) => {
        setForm({
            ...form,
            [field]: value,
        });

        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: undefined,
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: form.username,
        password: form.password,
    });

    if (error) {
        setErrors({ username: 'Email or password incorrect.' });
        return;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', data.user.id)
        .single();

    dispatch({
        type: 'SET_USER',
        payload: {
            id: data.user.id,
            name: profile?.username ?? form.username,
            email: data.user.email ?? '',
            avatar: profile?.avatar_url ?? 'https://i.pravatar.cc/40?img=3',
        },
    });

    navigate('/feed');
    };

    return (
        <main className="login-page">

            <section className="login-left">

                <form className="login-form" onSubmit={handleSubmit}>

                    <header className="login-header">
                        <img src={logoImg} alt="offmood logo" className="login-logo" />

                        <h1>Welcome Back!</h1>

                        <p>
                            Sign in to continue your emotional journey
                        </p>
                    </header>

                    <div className="login-fields">

                        <div className="login-field">
                            <label>Username or email</label>

                            <div className={errors.username ? 'login-input-wrap login-input-wrap--error' : 'login-input-wrap'}>
                                <span className="login-input-icon">
                                    <IconUser />
                                </span>

                                <input
                                    type="text"
                                    placeholder="Add a nickname"
                                    value={form.username}
                                    onChange={(event) => handleChange('username', event.target.value)}
                                />
                            </div>

                            {errors.username && (
                                <span className="login-error">{errors.username}</span>
                            )}
                        </div>

                        <div className="login-field">
                            <label>Password</label>

                            <div className={errors.password ? 'login-input-wrap login-input-wrap--error' : 'login-input-wrap'}>
                                <span className="login-input-icon">
                                    <IconLock />
                                </span>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(event) => handleChange('password', event.target.value)}
                                />
                            </div>

                            {errors.password && (
                                <span className="login-error">{errors.password}</span>
                            )}
                        </div>

                        <button
                            type="button"
                            className="login-forgot"
                        >
                            Forgot your password?
                        </button>

                        <button type="submit" className="login-submit">
                            Log In
                        </button>

                        <p className="login-signup-text">
                            Don't have an account?{' '}
                            <button type="button" onClick={() => navigate('/signup')}>
                                Sign Up
                            </button>
                        </p>

                        <div className="login-divider">
                            <span></span>
                            <p>Or continue with</p>
                            <span></span>
                        </div>

                        <div className="login-socials">
                            <button type="button">
                                <GoogleIcon />
                            </button>

                            <button type="button">
                                <AppleIcon />
                            </button>
                        </div>

                    </div>

                </form>

            </section>

            <section className="login-right">


                <img
                    src={charactersImg}
                    alt="offmood emotions"
                    className="login-characters"
                />

            </section>

        </main>
    );
};

export default LoginPage;