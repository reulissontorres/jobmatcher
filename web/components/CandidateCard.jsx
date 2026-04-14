import Link from 'next/link'
import { MapPin, Briefcase, GraduationCap, MessageSquare, Star, Eye } from 'lucide-react'

export default function CandidateCard({ candidate }) {
  const {
    id,
    name,
    title,
    location,
    experience,
    education,
    skills = [],
    matchScore,
    source
  } = candidate

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getMatchColor = (score) => {
    if (score >= 90) return 'text-emerald-500'
    if (score >= 80) return 'text-emerald-400'
    if (score >= 70) return 'text-yellow-500'
    return 'text-orange-500'
  }

  const getProgressColor = (score) => {
    if (score >= 90) return 'bg-emerald-500'
    if (score >= 80) return 'bg-emerald-400'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <div className="bg-background rounded-xl border border-border p-6 hover:border-purple-200 hover:shadow-sm transition-all">
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
          {getInitials(name)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-lg">{name}</h3>
                {source === 'whatsapp' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-md border border-emerald-200">
                    <MessageSquare className="w-3 h-3" />
                    WhatsApp
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{title}</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${getMatchColor(matchScore)}`}>{matchScore}%</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-md border border-purple-200">
                <Star className="w-3 h-3" />
                Match Score
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {experience}
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              {education}
            </span>
          </div>

          {/* Skills */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-slate-100 text-slate-700 text-sm rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Match Strength Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Forca do Match</span>
              <span className="font-medium text-foreground">{matchScore}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(matchScore)} rounded-full transition-all`}
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={`/candidates/${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              <Eye className="w-4 h-4" />
              Ver Perfil Completo
            </Link>
            <button className="px-4 py-2 bg-background border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors">
              Pre-selecionar
            </button>
            <button className="px-4 py-2 bg-background border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors">
              Contatar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
