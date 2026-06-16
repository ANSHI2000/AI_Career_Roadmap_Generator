import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart3, Target, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { ROUTES } from '../../constants/routeConstants.js';
import { Footer } from '../../components/layout/Footer.jsx';

export default function Home() {
  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Personalized Roadmaps',
      description: 'AI-generated career paths tailored to your skills and goals',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Gap Analysis',
      description: 'Identify skill gaps and get actionable recommendations',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Mentor Support',
      description: 'Connect with experienced mentors for guidance and feedback',
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'AI Intelligence',
      description: 'Smart project recommendations and weekly planning',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to={ROUTES.HOME} className="text-2xl font-bold text-brand-700 dark:text-brand-300">ACRG</Link>
          <nav className="flex items-center gap-4">
            <Link to={ROUTES.LOGIN} className="text-sm font-medium text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300">Login</Link>
            <Button><Link to={ROUTES.REGISTER}>Get Started</Link></Button>
          </nav>
        </div>
      </header>

      <main className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <section className="relative min-h-screen overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 sm:text-6xl">
              Your AI-Powered Career Roadmap
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-slate-300">
              Get a personalized, evidence-based career plan that adapts to your skills, goals, and timeline. Build the future you deserve.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg"><Link to={ROUTES.REGISTER} className="flex items-center gap-2">Get Started Free <ArrowRight className="h-5 w-5" /></Link></Button>
              <Button variant="outline" size="lg"><Link to={ROUTES.LOGIN}>Sign In</Link></Button>
            </div>
          </motion.div>
        </section>

        <section className="border-t border-slate-200 px-4 py-20 dark:border-slate-700 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">Why Choose ACRG?</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30">{feature.icon}</div>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 px-4 py-20 dark:border-slate-700 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Ready to start your journey?</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Create your account today and get your first personalized roadmap in minutes.</p>
            <Button size="lg" className="mt-8"><Link to={ROUTES.REGISTER} className="flex items-center gap-2">Create Free Account <ArrowRight className="h-5 w-5" /></Link></Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
