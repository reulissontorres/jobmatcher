'use client'

import { use } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Linkedin,
  Star,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Download,
  XCircle,
  MessageSquare
} from 'lucide-react'

// Mock data - in production this would come from an API
const candidateData = {
  '1': {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior React Developer',
    location: 'Sao Paulo, SP',
    phone: '+55 (11) 5555-0123',
    email: 'sarah.johnson@email.com',
    linkedin: 'linkedin.com/in/sarahjohnson',
    matchScore: 94,
    matchedJob: 'Senior React Developer',
    source: 'whatsapp',
    appliedDate: '15 de Marco, 2026',
    status: 'Em Analise',
    summary: 'Desenvolvedora full-stack apaixonada com 7 anos de experiencia construindo aplicacoes web escalaveis. Especialista em React, TypeScript e tecnologias web modernas. Forte foco em codigo limpo, testes e experiencia do usuario.',
    matchReasons: [
      'Forte expertise em React e TypeScript',
      '7 anos de experiencia corresponde aos requisitos da vaga',
      'Experiencia comprovada em lideranca e mentoria',
      'Experiencia com AWS e infraestrutura em nuvem',
      'Forte foco em qualidade de codigo e testes'
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        period: '2021 - Presente',
        description: 'Liderou desenvolvimento de plataforma SaaS empresarial servindo 10k+ usuarios. Arquitetou frontend usando React e TypeScript. Mentorou desenvolvedores juniores.',
        achievements: [
          'Melhorou performance do app em 40%',
          'Reduziu tamanho do bundle em 30%',
          'Liderou equipe de 5 desenvolvedores'
        ]
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        period: '2018 - 2021',
        description: 'Construiu features voltadas ao cliente para plataforma fintech. Implementou pipelines CI/CD e testes automatizados.',
        achievements: [
          'Entregou 20+ features principais',
          'Aumentou cobertura de testes para 85%'
        ]
      },
      {
        title: 'Junior Developer',
        company: 'Digital Agency',
        period: '2016 - 2018',
        description: 'Desenvolveu sites responsivos e aplicacoes web para diversos clientes.',
        achievements: [
          'Entregou 15+ projetos de clientes',
          'Aprendeu stack web moderno'
        ]
      }
    ],
    education: [
      {
        degree: 'BS Ciencia da Computacao',
        institution: 'Stanford University',
        period: '2012 - 2016',
        details: 'GPA: 3.8/4.0, Lista do Reitor'
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL', 'Docker', 'PostgreSQL', 'Redis']
  }
}

export default function CandidateDetailPage({ params }) {
  const resolvedParams = use(params)
  const candidate = candidateData[resolvedParams.id] || candidateData['1']

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Back Link */}
        <Link
          href="/candidates"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Candidatos
        </Link>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {getInitials(candidate.name)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
                  <p className="text-lg text-muted-foreground">{candidate.title}</p>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {candidate.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Resumo Profissional</h2>
              <p className="text-muted-foreground leading-relaxed">{candidate.summary}</p>
            </div>

            {/* Work Experience */}
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Experiencia Profissional</h2>
              </div>

              <div className="flex flex-col gap-6">
                {candidate.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-border last:border-transparent">
                    <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-purple-500" />
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{exp.title}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                      </div>
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{exp.description}</p>
                    <ul className="flex flex-col gap-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-600">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Formacao Academica</h2>
              </div>

              {candidate.education.map((edu, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground mt-1">{edu.details}</p>
                  </div>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                    {edu.period}
                  </span>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4">Habilidades</h2>
              <div className="flex items-center gap-2 flex-wrap">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Match Score */}
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-foreground">Match Score</h3>
              </div>

              <div className="text-center mb-4">
                <p className="text-5xl font-bold text-purple-500">{candidate.matchScore}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Excelente match para {candidate.matchedJob}
                </p>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                  style={{ width: `${candidate.matchScore}%` }}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Por que e um otimo match:</p>
                <ul className="flex flex-col gap-2">
                  {candidate.matchReasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Acoes</h3>
              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all">
                  <CheckCircle className="w-4 h-4" />
                  Pre-selecionar Candidato
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-background border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors">
                  <Mail className="w-4 h-4" />
                  Contatar por Email
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-background border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors">
                  <Download className="w-4 h-4" />
                  Baixar Curriculo
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-background border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
                  <XCircle className="w-4 h-4" />
                  Rejeitar Candidato
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Informacoes Rapidas</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fonte da Candidatura</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-sm font-medium rounded border border-emerald-200">
                    <MessageSquare className="w-3 h-3" />
                    WhatsApp
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data da Candidatura</p>
                  <p className="text-sm font-medium text-foreground mt-1">{candidate.appliedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className="inline-flex items-center mt-1 px-2 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded border border-blue-200">
                    {candidate.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
