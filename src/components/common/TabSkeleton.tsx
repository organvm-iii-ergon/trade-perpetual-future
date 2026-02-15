interface TabSkeletonProps {
  type: 'dashboard' | 'markets' | 'trading' | 'games' | 'social' | 'settings'
}

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card bg-base-200 animate-pulse ${className}`}>
      <div className="card-body">
        <div className="h-4 bg-base-300 rounded w-1/3" />
        <div className="h-8 bg-base-300 rounded w-2/3 mt-2" />
        <div className="h-3 bg-base-300 rounded w-1/2 mt-2" />
      </div>
    </div>
  )
}

export function TabSkeleton({ type }: TabSkeletonProps) {
  switch (type) {
    case 'dashboard':
      return (
        <div className="space-y-6">
          <div className="h-16 bg-base-200 animate-pulse rounded-lg" />
          <div className="stats shadow w-full animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="stat">
                <div className="h-3 bg-base-300 rounded w-20 mb-2" />
                <div className="h-6 bg-base-300 rounded w-24" />
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )

    case 'markets':
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-base-300 animate-pulse rounded w-32" />
            <div className="h-10 bg-base-300 animate-pulse rounded w-28" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-strong rounded-3xl p-5 animate-pulse">
                <div className="h-4 bg-base-300 rounded w-20 mb-3" />
                <div className="h-10 bg-base-300 rounded w-32 mb-2" />
                <div className="h-24 bg-base-300 rounded mt-4" />
              </div>
            ))}
          </div>
        </div>
      )

    case 'trading':
      return (
        <div className="space-y-6">
          <SkeletonCard className="h-96" />
          <SkeletonCard />
        </div>
      )

    case 'games':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
          <div className="h-12 bg-base-200 animate-pulse rounded-lg" />
          <div className="h-40 bg-base-200 animate-pulse rounded-lg" />
        </div>
      )

    case 'social':
      return (
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      )

    case 'settings':
      return (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      )
  }
}
