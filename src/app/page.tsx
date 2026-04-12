'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isAdmin) {
        const response = await fetch('/api/auth/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          localStorage.setItem('adminToken', data.token)
          router.push('/admin')
        } else {
          setError('Invalid admin credentials')
        }
      } else if (isLogin) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          localStorage.setItem('userToken', data.token)
          localStorage.setItem('userId', data.userId)
          localStorage.setItem('userEmail', data.userEmail)
          router.push('/event')
        } else {
          const errorData = await response.json()
          setError(errorData.error)
        }
      } else {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          alert('Account created successfully. Please login.')
          setIsLogin(true)
          setFormData({ name: '', email: '', password: '' })
        } else {
          const errorData = await response.json()
          setError(errorData.error)
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_24%)]" />
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">Case Study Round 2</p>
          <h1 className="text-3xl font-bold text-white">CTF Results Portal</h1>
          <p className="mt-2 text-sm text-slate-300">Login, signup, and exam access for the two-question round.</p>
        </div>

        <div className="mb-6 flex rounded-2xl bg-white/5 p-1">
          <button
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${!isAdmin ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30' : 'text-slate-300 hover:text-white'}`}
            onClick={() => setIsAdmin(false)}
          >
            Student
          </button>
          <button
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${isAdmin ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-slate-300 hover:text-white'}`}
            onClick={() => setIsAdmin(true)}
          >
            Admin
          </button>
        </div>

        {!isAdmin && (
          <div className="mb-6 flex rounded-2xl bg-white/5 p-1">
            <button
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${isLogin ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' : 'text-slate-300 hover:text-white'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${!isLogin ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' : 'text-slate-300 hover:text-white'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isAdmin && !isLogin && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Full Name</label>
              <input
                type="text"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/10"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/10"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/10"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl px-4 py-3.5 font-semibold transition ${isAdmin ? 'bg-rose-500 text-white hover:bg-rose-400' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'} ${loading ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            {loading ? 'Please wait...' : isAdmin ? 'Admin Login' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}