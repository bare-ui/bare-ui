'use client'

export function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="my-6 rounded-lg border border-gray-200 dark:border-gray-700"
      style={{
        fontFamily: "'Patrick Hand', cursive",
        backgroundColor: '#ffffff',
        backgroundImage:
          'radial-gradient(circle, #d4d4d4 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="p-6">{children}</div>
    </div>
  )
}
