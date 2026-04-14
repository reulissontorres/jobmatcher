import Link from 'next/link'
import { Briefcase, MapPin, Clock, Users, Eye, MoreVertical, Calendar } from 'lucide-react'

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  closed: 'bg-red-50 text-red-600 border-red-200'
}

const statusLabels = {
  active: 'Ativa',
  draft: 'Rascunho',
  closed: 'Fechada'
}

export default function JobCard({ job }) {
  const {
    id,
    title,
    status = 'active',
    location,
    type,
    salary,
    matchedCandidates = 0,
    postedAt
  } = job

  return (
    <div className="bg-background rounded-xl border border-border p-5 hover:border-purple-200 hover:shadow-sm transition-all">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-6 h-6 text-purple-500" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
              {statusLabels[status]}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {location}
              </span>
            )}
            {type && (
              <>
                <span>•</span>
                <span>{type}</span>
              </>
            )}
            {salary && (
              <>
                <span>•</span>
                <span>{salary}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-purple-600">
              <Users className="w-4 h-4" />
              <span className="font-medium">{matchedCandidates}</span>
              <span className="text-muted-foreground">candidatos correspondentes</span>
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {postedAt}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/jobs/${id}/matches`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver Matches
          </Link>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
