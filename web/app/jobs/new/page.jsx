'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import { ArrowLeft, Sparkles, Check, Zap } from 'lucide-react'

const experienceLevels = [
  { value: '', label: 'Selecione o nivel de experiencia' },
  { value: 'junior', label: 'Junior (0-2 anos)' },
  { value: 'mid', label: 'Pleno (2-5 anos)' },
  { value: 'senior', label: 'Senior (5+ anos)' },
  { value: 'lead', label: 'Lead/Principal (8+ anos)' }
]

const jobTypes = [
  { value: '', label: 'Selecione o tipo' },
  { value: 'full-time', label: 'Tempo Integral' },
  { value: 'part-time', label: 'Meio Periodo' },
  { value: 'contract', label: 'Contrato' },
  { value: 'freelance', label: 'Freelance' }
]

const suggestedSkills = ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'CI/CD', 'Agile']

const matchingFeatures = [
  {
    title: 'Busca Semantica',
    description: 'Nossa IA entende contexto e significado, nao apenas palavras-chave.'
  },
  {
    title: 'Auto-Matching',
    description: 'Candidatos sao automaticamente correspondidos com base em habilidades, experiencia e requisitos.'
  },
  {
    title: 'Pontuacao de Match',
    description: 'Cada match recebe uma pontuacao percentual mostrando compatibilidade.'
  }
]

const tips = [
  'Use nomes especificos de habilidades',
  'Inclua requisitos tecnicos',
  'Mencione anos de experiencia',
  'Descreva a cultura da equipe'
]

export default function CreateJobPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    experienceLevel: '',
    location: '',
    jobType: '',
    salary: ''
  })
  const [selectedSkills, setSelectedSkills] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Titulo e obrigatorio'
    if (!formData.description.trim()) newErrors.description = 'Descricao e obrigatoria'
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Nivel de experiencia e obrigatorio'
    if (!formData.location.trim()) newErrors.location = 'Localizacao e obrigatoria'
    if (!formData.jobType) newErrors.jobType = 'Tipo de vaga e obrigatorio'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    router.push('/jobs')
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Vagas
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Criar Nova Vaga</h1>
          <p className="mt-1 text-muted-foreground">
            Preencha os detalhes abaixo. Nossa IA ira automaticamente corresponder candidatos qualificados.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-background rounded-xl border border-border p-6">
              <form className="flex flex-col gap-6">
                {/* Job Title */}
                <FormInput
                  label="Titulo da Vaga"
                  placeholder="ex: Senior React Developer"
                  value={formData.title}
                  onChange={handleChange('title')}
                  error={errors.title}
                  required
                />

                {/* Job Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Descricao da Vaga <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    placeholder="Descreva a funcao, responsabilidades e o que voce esta procurando..."
                    value={formData.description}
                    onChange={handleChange('description')}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg bg-muted/50 border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${errors.description ? 'border-destructive' : ''}`}
                  />
                  {errors.description && (
                    <span className="text-sm text-destructive">{errors.description}</span>
                  )}
                  <p className="text-xs text-purple-600">Dica: Seja especifico para melhorar a precisao do matching por IA</p>
                </div>

                {/* Required Skills */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Habilidades Requeridas <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: React, TypeScript, Node.js, GraphQL"
                    value={formData.skills}
                    onChange={handleChange('skills')}
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <span className="text-sm text-muted-foreground">Sugestoes:</span>
                    {suggestedSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        disabled={selectedSkills.includes(skill)}
                        className={`px-2.5 py-1 text-sm rounded-md border transition-colors ${
                          selectedSkills.includes(skill)
                            ? 'bg-purple-50 text-purple-600 border-purple-200'
                            : 'bg-background border-border text-muted-foreground hover:border-purple-300 hover:text-purple-600'
                        }`}
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                  {selectedSkills.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      {selectedSkills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-600 text-sm rounded-md border border-purple-200"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-purple-800"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience Level */}
                <FormSelect
                  label="Nivel de Experiencia"
                  options={experienceLevels}
                  value={formData.experienceLevel}
                  onChange={handleChange('experienceLevel')}
                  error={errors.experienceLevel}
                  required
                />

                {/* Location and Job Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Localizacao"
                    placeholder="ex: Remoto, Sao Paulo, SP"
                    value={formData.location}
                    onChange={handleChange('location')}
                    error={errors.location}
                    required
                  />
                  <FormSelect
                    label="Tipo de Vaga"
                    options={jobTypes}
                    value={formData.jobType}
                    onChange={handleChange('jobType')}
                    error={errors.jobType}
                    required
                  />
                </div>

                {/* Salary */}
                <FormInput
                  label="Faixa Salarial"
                  placeholder="ex: R$12.000 - R$15.000"
                  value={formData.salary}
                  onChange={handleChange('salary')}
                />

                {/* Actions */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Publicar e Iniciar Matching
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-background border border-border text-foreground font-medium rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
                  >
                    Salvar como Rascunho
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* AI-Powered Matching */}
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-foreground">Matching com IA</h3>
              </div>
              <div className="flex flex-col gap-4">
                {matchingFeatures.map((feature, index) => (
                  <div key={index}>
                    <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips for Better Matches */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Dicas para Melhores Matches</h3>
              <ul className="flex flex-col gap-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
