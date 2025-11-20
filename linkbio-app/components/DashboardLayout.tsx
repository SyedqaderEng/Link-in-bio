import Sidebar from './Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-magenta opacity-10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-cyan opacity-10 blur-3xl rounded-full" />
      </div>

      <Sidebar />

      <main className="ml-20 relative z-10">
        {children}
      </main>
    </div>
  )
}
