'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import CandidateCard from '@/components/CandidateCard'
import { ArrowLeft, Search, ChevronDown, Briefcase, Users, TrendingUp } from 'lucide-react'

// Mock data para vagas
const mockJobs = {
  '1': {
    id: '1',
    title: 'Senior React Developer',
    status: 'active',
    location: 'Remoto',
    type: 'Tempo Integral',
    salary: 'R$12.000 - R$15.000',
    matchedCandidates: 47,
    postedAt: '2 dias atras'
  },
  '2': {
    id: '2',
    title: 'Product Manager',
    status: 'active',
    location: 'Sao Paulo, SP',
    type: 'Tempo Integral',
    salary: 'R$14.000 - R$18.000',
    matchedCandidates: 32,
    postedAt: '5 dias atras'
  },
  '3': {
    id: '3',
    title: 'UX Designer',
    status: 'active',
    location: 'Rio de Janeiro, RJ',
    type: 'Tempo Integral',
    salary: 'R$10.000 - R$13.000',
    matchedCandidates: 28,
    postedAt: '1 semana atras'
  },
  '4': {
    id: '4',
    title: 'DevOps Engineer',
    status: 'draft',
    location: 'Remoto',
    type: 'Tempo Integral',
    salary: 'R$13.000 - R$16.000',
    matchedCandidates: 0,
    postedAt: 'Rascunho'
  },
  '5': {
    id: '5',
    title: 'Marketing Manager',
    status: 'closed',
    location: 'Belo Horizonte, MG',
    type: 'Tempo Integral',
    salary: 'R$9.000 - R$12.000',
    matchedCandidates: 54,
    postedAt: '2 semanas atras'
  }
}

// Mock data para candidatos por vaga
const mockCandidatesByJob = {
  '1': [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior React Developer',
      location: 'Sao Paulo, SP',
      experience: '7 anos',
      education: 'Ciencia da Computacao, Stanford',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      matchScore: 94,
      source: 'whatsapp'
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Full Stack Engineer',
      location: 'Remoto',
      experience: '5 anos',
      education: 'Engenharia de Software, MIT',
      skills: ['React', 'Python', 'Docker', 'GraphQL'],
      matchScore: 87,
      source: null
    },
    {
      id: '6',
      name: 'Lucas Oliveira',
      title: 'Frontend Developer',
      location: 'Curitiba, PR',
      experience: '4 anos',
      education: 'Sistemas de Informacao, UFPR',
      skills: ['React', 'Vue.js', 'JavaScript', 'CSS'],
      matchScore: 82,
      source: null
    }
  ],
  '2': [
    {
      id: '3',
      name: 'Emily Davis',
      title: 'Product Manager',
      location: 'Rio de Janeiro, RJ',
      experience: '6 anos',
      education: 'MBA, Harvard Business School',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'UX'],
      matchScore: 92,
      source: null
    },
    {
      id: '7',
      name: 'Ana Paula Santos',
      title: 'Senior Product Manager',
      location: 'Sao Paulo, SP',
      experience: '8 anos',
      education: 'Administracao, FGV',
      skills: ['Scrum', 'Roadmap', 'Data Analysis', 'Leadership'],
      matchScore: 89,
      source: 'whatsapp'
    }
  ],
  '3': [
    {
      id: '8',
      name: 'Carolina Ferreira',
      title: 'UX/UI Designer',
      location: 'Rio de Janeiro, RJ',
      experience: '5 anos',
      education: 'Design, PUC-Rio',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      matchScore: 91,
      source: null
    },
    {
      id: '9',
      name: 'Rafael Costa',
      title: 'Product Designer',
      location: 'Florianopolis, SC',
      experience: '4 anos',
      education: 'Design de Interacao, UFSC',
      skills: ['Figma', 'Sketch', 'Adobe XD', 'CSS'],
      matchScore: 85,
      source: 'whatsapp'
    }
  ],
  '4': [],
  '5': [
    {
      id: '10',
      name: 'Mariana Lima',
      title: 'Marketing Manager',
      location: 'Belo Horizonte, MG',
      experience: '6 anos',
      education: 'Marketing, UFMG',
      skills: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
      matchScore: 88,
      source: null
    }
  ]
}

const filterOptions = [
  { value: 'all', label: 'Todos os Candidatos' },
  { value: 'high', label: 'Match Alto (90%+)' },
  { value: 'medium', label: 'Match Medio (70-89%)' },
  { value: 'whatsapp', label: 'Via WhatsApp' }
]

export default function JobMatchesPage({ params }) {
  const { id } = use(params)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const job = mockJobs[id]
  const candidates = mockCandidatesByJob[id] || []

  // Filtrar candidatos
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    let matchesFilter = true
    if (filter === 'high') {
      matchesFilter = candidate.matchScore >= 90
    } else if (filter === 'medium') {
      matchesFilter = candidate.matchScore >= 70 && candidate.matchScore < 90
    } else if (filter === 'whatsapp') {
      matchesFilter = candidate.source === 'whatsapp'
    }
    
    return matchesSearch && matchesFilter
  })

  // Calcular estatisticas
  const avgMatchScore = candidates.length > 0
    ? Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / candidates.length)
    : 0
  const highMatches = candidates.filter(c => c.matchScore >= 90).length

  if (!job) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center py-12 bg-background rounded-xl border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-2">Vaga nao encontrada</h2>
            <p className="text-muted-foreground mb-4">A vaga que voce esta procurando nao existe.</p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Vagas
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Vagas
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
              <p className="text-muted-foreground">
                {job.location} • {job.type} • {job.salary}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-background rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Candidatos</p>
                <p className="text-2xl font-bold text-foreground mt-1">{candidates.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>
          <div className="bg-background rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Match Score Medio</p>
                <p className="text-2xl font-bold text-foreground mt-1">{avgMatchScore}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </div>
          <div className="bg-background rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Matches Altos (90%+)</p>
                <p className="text-2xl font-bold text-foreground mt-1">{highMatches}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <span className="text-yellow-500 text-lg">★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar candidatos por nome, habilidades, cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-lg text-foreground hover:bg-muted transition-colors min-w-[200px] justify-between"
            >
              <span>{filterOptions.find(f => f.value === filter)?.label}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-10">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value)
                      setShowFilterDropdown(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      filter === option.value ? 'text-purple-600 font-medium' : 'text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Candidates List */}
        <div className="flex flex-col gap-4">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))
          ) : (
            <div className="text-center py-12 bg-background rounded-xl border border-border">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum candidato encontrado
              </h3>
              <p className="text-muted-foreground">
                {candidates.length === 0
                  ? 'Esta vaga ainda nao possui candidatos correspondentes.'
                  : 'Tente ajustar seus filtros de busca.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
