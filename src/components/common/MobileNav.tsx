import { Home, BarChart3, TrendingUp, Gamepad2, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabId = 'dashboard' | 'markets' | 'trading' | 'games' | 'social' | 'settings'

interface MobileNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const NAV_ITEMS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'markets', label: 'Markets', icon: BarChart3 },
  { id: 'trading', label: 'Trade', icon: TrendingUp },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <div className="btm-nav btm-nav-sm z-50 bg-base-100/90 backdrop-blur-xl border-t border-white/10">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={cn(
            'min-h-[44px]',
            activeTab === id && 'active text-primary'
          )}
          onClick={() => onTabChange(id)}
        >
          <Icon size={18} />
          <span className="btm-nav-label text-[10px]">{label}</span>
        </button>
      ))}
    </div>
  )
}
