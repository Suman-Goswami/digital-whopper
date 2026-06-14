import { useState } from 'react';
import { motion } from 'framer-motion';
import { authRequest } from '../api/client';

export default function AccountPage() {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dw-user') || 'null');
    } catch {
      return null;
    }
  });

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setStatus('');
  };

  const submit = async (e) => {
    e.preventDefault();

    setStatus(mode === 'signup' ? 'Creating account...' : 'Signing in...');

    try {
      const payload =
        mode === 'signup'
          ? {
              name: form.name.trim(),
              email: form.email.trim().toLowerCase(),
              password: form.password
            }
          : {
              email: form.email.trim().toLowerCase(),
              password: form.password
            };

      const nextUser = await authRequest(mode, payload);

      localStorage.setItem('dw-user', JSON.stringify(nextUser));
      setUser(nextUser);
      setStatus(mode === 'signup' ? 'Account created.' : 'Signed in.');
    } catch (err) {
      setStatus(err.message || 'Something went wrong.');
    }
  };

  return (
    <main className="page account-page">
      <section className="account-shell">
        <motion.div
          className="account-card"
          initial={{ opacity: 0, y: 34, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">Account</span>

          <h1>
            {user
              ? 'Your Digital Whopper account'
              : mode === 'signup'
                ? 'Sign up to continue'
                : 'Sign in to continue'}
          </h1>

          {user ? (
            <div className="account-profile">
              <div className="account-avatar">
                {user.name?.charAt(0)?.toUpperCase() || 'D'}
              </div>

              <b>{user.name}</b>
              <span>{user.email}</span>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  localStorage.removeItem('dw-user');
                  setUser(null);
                  setStatus('');
                  setForm({ name: '', email: '', password: '' });
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <div className="account-tabs standalone">
                <button
                  type="button"
                  className={mode === 'signin' ? 'active' : ''}
                  onClick={() => switchMode('signin')}
                >
                  Sign in
                </button>

                <button
                  type="button"
                  className={mode === 'signup' ? 'active' : ''}
                  onClick={() => switchMode('signup')}
                >
                  Sign up
                </button>
              </div>

              <form className="account-form standalone" onSubmit={submit}>
                {mode === 'signup' && (
                  <label>
                    <span>Name</span>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      required
                    />
                  </label>
                )}

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                  />
                </label>

                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    minLength={6}
                    required
                  />
                </label>

                <button type="submit" className="btn btn-primary">
                  {mode === 'signup' ? 'Create account' : 'Sign in'}
                </button>

                {status && <p>{status}</p>}
              </form>
            </>
          )}
        </motion.div>
      </section>
    </main>
  );
}