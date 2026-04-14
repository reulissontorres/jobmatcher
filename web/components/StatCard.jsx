import { TrendingUp } from 'lucide-react'

export default function StatCard({ title, value, change, icon: Icon, iconColor = 'text-purple-500', iconBg = 'bg-purple-50' }) {
  return (
    <div className="bg-background rounded-xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2 text-emerald-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  )
}
