import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { ROUTES } from '../../constants/routeConstants.js';
import { Footer } from '../../components/layout/Footer.jsx';

export default function NotFound() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to={ROUTES.HOME} className="text-2xl font-bold text-brand-700 dark:text-brand-300">ACRG</Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100">404</h1>
          <p className="mt-2 text-xl text-slate-600 dark:text-slate-400">Page Not Found</p>
          <p className="mt-2 text-slate-500 dark:text-slate-500">The page you're looking for doesn't exist or has been moved.</p>
          <Button className="mt-6"><Link to={ROUTES.HOME}>Go Home</Link></Button>
        </div>
      </main>

      <Footer />
    </>
  );
}
