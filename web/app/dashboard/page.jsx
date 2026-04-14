'use client'

import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import StatCard from '@/components/StatCard'
import ActivityItem from '@/components/ActivityItem'
import { 
  Users, 
  Briefcase, 
  Sparkles,
  Plus,
  Building2
} from 'lucide-react'

const stats = [
  { 
    title: 'Total de Candidatos', 
    value: '1.284', 
    change: '+12% em relacao ao mes anterior',
    icon: Users,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50'
  },
  { 
    title: 'Vagas Ativas', 
    value: '23', 
    change: '+3 em relacao ao mes anterior',
    icon: Briefcase,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50'
  },
  { 
    title: 'Matches Gerados', 
    value: '3.847', 
    change: '+23% em relacao ao mes anterior',
    icon: Sparkles,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50'
  }
]

const recentActivity = [
  {
    type: 'match',
    title: 'Novo match para Senior React Developer',
    subtitle: 'Sarah Johnson',
    matchScore: 94,
    time: '5 minutos atras'
  },
  {
    type: 'candidate',
    title: 'Candidato enviado via WhatsApp',
    subtitle: 'Michael Chen',
    matchScore: 87,
    time: '1 hora atras'
  },
  {
    type: 'match',
    title: 'Novo match para Product Manager',
    subtitle: 'Emily Davis',
    matchScore: 92,
    time: '2 horas atras'
  },
  {
    type: 'shortlist',
    title: 'Candidato pre-selecionado',
    subtitle: 'James Wilson',
    matchScore: 89,
    time: '3 horas atras'
  },
  {
    type: 'match',
    title: 'Novo match para UX Designer',
    subtitle: 'Lisa Anderson',
    matchScore: 85,
    time: '5 horas atras'
  }
]

const quickActions = [
  { 
    label: 'Criar Nova Vaga', 
    href: '/jobs/new',
    icon: Plus,
    primary: true
  },
  { 
    label: 'Ver Todos os Candidatos', 
    href: '/candidates',
    icon: Users,
    primary: false
  },
  { 
    label: 'Gerenciar Vagas', 
    href: '/jobs',
    icon: Building2,
    primary: false
  }
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Bem-vindo de volta! Aqui esta uma visao geral da sua atividade de recrutamento.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-background rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Atividade Recente</h2>
            <div className="divide-y divide-border">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>

          {/* Quick Actions & Pro Tip */}
          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="bg-background rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Acoes Rapidas</h2>
              <div className="flex flex-col gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${action.primary 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700' 
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                      }
                    `}
                  >
                    <action.icon className="w-5 h-5" />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💡</span>
                <h3 className="font-semibold text-foreground">Dica Pro</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use descricoes de vaga detalhadas com habilidades especificas para melhorar a precisao do match de IA em ate 40%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
