'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import JobCard from '@/components/JobCard'
import { Search, Plus, ChevronDown } from 'lucide-react'

const mockJobs = [
  {
    id: '1',
    title: 'Senior React Developer',
    status: 'active',
    location: 'Remoto',
    type: 'Tempo Integral',
    salary: 'R$12.000 - R$15.000',
    matchedCandidates: 47,
    postedAt: '2 dias atras'
  },
  {
    id: '2',
    title: 'Product Manager',
    status: 'active',
    location: 'Sao Paulo, SP',
    type: 'Tempo Integral',
    salary: 'R$14.000 - R$18.000',
    matchedCandidates: 32,
    postedAt: '5 dias atras'
  },
  {
    id: '3',
    title: 'UX Designer',
    status: 'active',
    location: 'Rio de Janeiro, RJ',
    type: 'Tempo Integral',
    salary: 'R$10.000 - R$13.000',
    matchedCandidates: 28,
    postedAt: '1 semana atras'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    status: 'draft',
    location: 'Remoto',
    type: 'Tempo Integral',
    salary: 'R$13.000 - R$16.000',
    matchedCandidates: 0,
    postedAt: 'Rascunho'
  },
  {
    id: '5',
    title: 'Marketing Manager',
    status: 'closed',
    location: 'Belo Horizonte, MG',
    type: 'Tempo Integral',
    salary: 'R$9.000 - R$12.000',
    matchedCandidates: 54,
    postedAt: '2 semanas atras'
  }
]

const filterOptions = [
  { value: 'all', label: 'Todas as Vagas' },
  { value: 'active', label: 'Ativas' },
  { value: 'draft', label: 'Rascunhos' },
  { value: 'closed', label: 'Fechadas' }
]

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || job.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Vagas</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie suas vagas e veja candidatos correspondentes por IA
            </p>
          </div>
          <Link
            href="/jobs/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Criar Nova Vaga
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar vagas por titulo, palavras-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-lg text-foreground hover:bg-muted transition-colors min-w-[180px] justify-between"
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

        {/* Jobs List */}
        <div className="flex flex-col gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="text-center py-12 bg-background rounded-xl border border-border">
              <p className="text-muted-foreground">Nenhuma vaga encontrada</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
