'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import FormInput from '@/components/FormInput'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/spinner'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await login(formData.email, formData.password)
      router.push('/dashboard')
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  return (
    <AuthLayout
      title="Welcome to JobMatcher"
      subtitle="AI-powered recruitment platform"
      footerText="Trusted by companies, universities, and government institutions"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {submitError && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
            {submitError}
          </div>
        )}

        <FormInput
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange('password')}
          error={errors.password}
          required
          rightElement={
            <Link 
              href="/forgot-password" 
              className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
            >
              Forgot password?
            </Link>
          }
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner size="small" className="text-white" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link 
            href="/register" 
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
