import Logo from './Logo'

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  footerText 
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 top-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute -right-32 top-1/3 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <Logo />

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold text-foreground text-center text-balance">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-muted-foreground text-center">
          {subtitle}
        </p>

        {/* Card */}
        <div className="mt-8 w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
          {children}
        </div>

        {/* Footer */}
        {footerText && (
          <p className="mt-8 text-sm text-muted-foreground text-center">
            {footerText}
          </p>
        )}
      </div>
    </div>
  )
}
