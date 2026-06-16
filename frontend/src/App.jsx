import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useScrollToTop } from './hooks/useScrollToTop.js';

function App() {
  const location = useLocation();
  const [theme] = useLocalStorage('acrg-theme', 'light');

  useScrollToTop();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="min-h-screen"
      >
        <AppRoutes />
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
