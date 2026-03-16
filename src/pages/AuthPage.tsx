import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useTheme } from '../hooks/useTheme'

export const AuthPage = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-accent-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-info/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-bg-800/80 bg-bg-950/70 shadow-card lg:grid-cols-[1.1fr_0.9fr]">
        <button
          onClick={toggleTheme}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-bg-700/70 bg-bg-900/60 text-slate-400 shadow-card hover:text-slate-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <div className="hidden flex-col justify-between bg-gradient-to-br from-bg-900/90 via-bg-900/70 to-bg-950 p-10 lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/20 text-accent-300">
                TL
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">TradeLab</p>
                <h1 className="font-display text-2xl text-slate-100">Advanced Trading Journal</h1>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-400">
              Stay in control of your edge. Track every trade, review psychology, and surface insights with a
              data-first journal built for serious traders.
            </p>
            <div className="mt-8 grid gap-4 text-xs text-slate-400">
              <div className="rounded-2xl border border-bg-800/70 bg-bg-900/60 p-4">
                <p className="text-slate-300">Equity curve, expectancy, drawdown — all in one view.</p>
              </div>
              <div className="rounded-2xl border border-bg-800/70 bg-bg-900/60 p-4">
                <p className="text-slate-300">Tag setups, capture mistakes, and refine your playbook weekly.</p>
              </div>
              <div className="rounded-2xl border border-bg-800/70 bg-bg-900/60 p-4">
                <p className="text-slate-300">Store screenshots and context links for full trade recall.</p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between text-xs text-slate-500">
            <span>Professional analytics</span>
            <span>Private & secure</span>
          </div>
        </div>

        <div className="panel flex flex-col justify-center p-8 sm:p-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-slate-100">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
              <p className="mt-2 text-sm text-slate-500">Login to manage trades and performance.</p>
            </div>
            <div className="hidden rounded-full border border-bg-800/80 px-3 py-1 text-xs text-slate-500 sm:inline-flex">
              Secure Auth
            </div>
          </div>

          <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
            <Button type="button" variant="secondary" onClick={() => signInWithGoogle()}>
              Continue with Google
            </Button>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="h-px flex-1 bg-bg-800" />
              or use email
              <span className="h-px flex-1 bg-bg-800" />
            </div>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
            <Button type="submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'signin' ? 'Login' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="hover:text-slate-200">
              {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </button>
            <span>Version 1.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
