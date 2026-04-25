import { useState } from 'react'
import { signUp, signIn } from '../lib/auth'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    setLoading(false)

    if (error) {
      setIsError(true)
      setMessage(error.message)
    } else if (!isLogin) {
      setIsError(false)
      setMessage('Check your email to confirm your account!')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'var(--cream)' }}
    >
      {/* Logo */}
      <div className="text-center" style={{ marginBottom: '2.5rem' }}>
        <h1
          className="font-medium tracking-tight"
          style={{ fontSize: '3.5rem', color: 'var(--text)' }}
        >
          DinnerDrop
        </h1>
        <p style={{ marginTop: '0.6rem', fontSize: '1rem', color: 'var(--text-muted)' }}>
          Find recipes from what's in your fridge!
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full rounded-2xl border"
        style={{
          maxWidth: '22rem',
          padding: '2rem',
          background: '#fff',
          borderColor: 'var(--cream-darker)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}
      >
        {/* Tab switcher */}
        <div
          className="flex gap-1 rounded-xl p-1 mb-6"
          style={{ background: 'var(--cream)' }}
        >
          {['Log in', 'Sign up'].map((label, i) => {
            const active = (i === 0) === isLogin
            return (
              <button
                key={label}
                onClick={() => { setIsLogin(i === 0); setMessage('') }}
                className="flex-1 py-2 rounded-lg transition-all cursor-pointer"
                style={{
                  fontSize: '0.95rem',
                  background: active ? 'var(--text)' : 'transparent',
                  color: active ? 'var(--cream)' : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border transition-colors outline-none"
            style={{
              padding: '0.85rem 1.25rem',
              fontSize: '0.875rem',
              background: 'var(--cream)',
              borderColor: 'var(--cream-darker)',
              color: 'var(--text)',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border transition-colors outline-none"
            style={{
              padding: '0.85rem 1.25rem',
              fontSize: '0.875rem',
              background: 'var(--cream)',
              borderColor: 'var(--cream-darker)',
              color: 'var(--text)',
            }}
          />

          {message && (
            <p
              className="text-xs text-center"
              style={{ color: isError ? 'var(--red)' : 'var(--green)' }}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium rounded-xl mt-1 transition-colors disabled:opacity-50 cursor-pointer"
            style={{
              background: 'var(--text)',
              color: 'var(--cream)',
            }}
          >
            {loading ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Auth
