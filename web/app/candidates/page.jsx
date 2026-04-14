'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import CandidateCard from '@/components/CandidateCard'
import { Search, ChevronDown } from 'lucide-react'

const mockCandidates = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior React Developer',
    location: 'Sao Paulo, SP',
    experience: '7 anos',
    education: 'BS Ciencia da Computacao, Stanford',
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
    education: 'MS Engenharia de Software, MIT',
    skills: ['React', 'Python', 'Docker', 'GraphQL'],
    matchScore: 87,
    source: 'direct'
  },
  {
    id: '3',
    name: 'Emily Davis',
    title: 'Product Manager',
    location: 'Rio de Janeiro, RJ',
    experience: '6 anos',
    education: 'MBA, Harvard Business School',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'UX'],
    matchScore: 92,
    source: 'direct'
  },
  {
    id: '4',
    name: 'James Wilson',
    title: 'DevOps Engineer',
    location: 'Belo Horizonte, MG',
    experience: '4 anos',
    education: 'BS Engenharia de Software, USP',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    matchScore: 85,
    source: 'whatsapp'
  },
  {
    id: '5',
    name: 'Ana Silva',
    title: 'UX Designer',
    location: 'Florianopolis, SC',
    experience: '5 anos',
    education: 'Design Digital, UFSC',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    matchScore: 89,
    source: 'direct'
  }
]

const filterOptions = [
  { value: 'all', label: 'Todos os Candidatos' },
  { value: 'high', label: 'Match Alto (90%+)' },
  { value: 'medium', label: 'Match Medio (70-89%)' },
  { value: 'whatsapp', label: 'Via WhatsApp' }
]

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    let matchesFilter = true
    if (filter === 'high') matchesFilter = candidate.matchScore >= 90
    else if (filter === 'medium') matchesFilter = candidate.matchScore >= 70 && candidate.matchScore < 90
    else if (filter === 'whatsapp') matchesFilter = candidate.source === 'whatsapp'

    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Candidatos</h1>
          <p className="mt-1 text-muted-foreground">
            Navegue por candidatos correspondidos por IA para suas vagas abertas
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
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

          {/* Filter Dropdown */}
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
              <p className="text-muted-foreground">Nenhum candidato encontrado</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
