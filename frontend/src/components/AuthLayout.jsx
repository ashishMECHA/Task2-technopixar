import { Link } from 'react-router-dom';

const BrandLogo = ({ variant = 'dark' }) => (
  <div
    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
      variant === 'dark'
        ? 'bg-white/15 ring-1 ring-white/20 backdrop-blur'
        : 'bg-primary-600 shadow-lg shadow-primary-600/25'
    }`}
  >
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  </div>
);

const features = [
  'Secure JWT authentication',
  'Role-based access control',
  'Real-time user management',
];

const AuthLayout = ({ title, subtitle, children, footerText, footerLink, footerLinkText }) => {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-800 lg:flex lg:flex-col lg:justify-between">
        <div className="auth-grid-pattern absolute inset-0 opacity-[0.07]" />
        <div className="auth-glow absolute -left-20 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="auth-glow absolute -bottom-10 right-0 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-16">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span className="text-2xl font-bold tracking-tight text-white">technopixar</span>
          </div>

          <h2 className="mt-10 max-w-sm text-3xl font-bold leading-tight text-white xl:text-4xl">
            Manage your platform with confidence
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-primary-100">
            A secure, role-based dashboard built for teams that need reliable authentication and
            admin control.
          </p>

          <ul className="mt-10 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-primary-50">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 border-t border-white/10 px-12 py-6 xl:px-16">
          <p className="text-sm text-primary-200">
            Trusted by teams for secure access management
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center bg-slate-50 px-4 py-10 sm:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
            <BrandLogo variant="light" />
              <span className="text-xl font-bold tracking-tight text-slate-900">technopixar</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>
          </div>

          <div className="auth-card">{children}</div>

          <p className="mt-8 text-center text-sm text-slate-500">
            {footerText}{' '}
            <Link
              to={footerLink}
              className="font-semibold text-primary-600 transition hover:text-primary-700"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
