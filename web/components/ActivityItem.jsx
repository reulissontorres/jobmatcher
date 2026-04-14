import { Sparkles, Users, CheckCircle, Clock } from 'lucide-react'

const iconMap = {
  match: { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' },
  candidate: { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  shortlist: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
}

export default function ActivityItem({ type = 'match', title, subtitle, matchScore, time }) {
  const { icon: Icon, color, bg } = iconMap[type] || iconMap.match

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-muted-foreground">{subtitle}</span>
          {matchScore && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-200">
              {matchScore}% match
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>{time}</span>
      </div>
    </div>
  )
}
