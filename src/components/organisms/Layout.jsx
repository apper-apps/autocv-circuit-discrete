import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header 
        user={user} 
        onLogout={onLogout} 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sidebarOpen ? 'open' : 'closed'}
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: sidebarOpen ? '16rem' : '4rem',
              opacity: 1 
            }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white shadow-lg border-r border-secondary-200 relative z-10"
          >
            <Sidebar 
              collapsed={!sidebarOpen}
              currentPath={location.pathname}
            />
          </motion.div>
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 max-w-7xl mx-auto"
          >
            {children}
          </motion.main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;