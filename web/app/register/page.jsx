'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/spinner'

const organizationTypes = [
  { value: 'company', label: 'Empresa' },
  { value: 'university', label: 'Universidade' },
  { value: 'government', label: 'Governo' }
]

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateForm = () => {
    const newErrors = {}

    if (!formData.organizationName) {
      newErrors.organizationName = 'Nome da organização é obrigatório'
    } else if (formData.organizationName.length < 2) {
      newErrors.organizationName = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!formData.organizationType) {
      newErrors.organizationType = 'Tipo de organização é obrigatório'
    }

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
      await register(
        formData.organizationName,
        formData.organizationType,
        formData.email,
        formData.password
      )
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
      title="Create Your Account"
      subtitle="Start matching candidates with opportunities"
      footerText="By creating an account, you agree to our Terms of Service"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {submitError && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
            {submitError}
          </div>
        )}

        <FormInput
          label="Organization Name"
          type="text"
          placeholder="Acme Corporation"
          value={formData.organizationName}
          onChange={handleChange('organizationName')}
          error={errors.organizationName}
          required
        />

        <FormSelect
          label="Organization Type"
          placeholder="Select type"
          value={formData.organizationType}
          onChange={handleChange('organizationType')}
          options={organizationTypes}
          error={errors.organizationType}
          required
        />

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
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner size="small" className="text-white" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
