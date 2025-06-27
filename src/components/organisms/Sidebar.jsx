import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ collapsed, currentPath }) => {
  const navigationItems = [
    { path: '/dashboard', icon: 'LayoutDashboard', label: 'Dashboard' },
    { path: '/profile', icon: 'User', label: 'Profile' },
    { path: '/generate', icon: 'FileText', label: 'Generate Resume' },
    { path: '/history', icon: 'Clock', label: 'History' },
  ];

  return (
    <div className="h-full flex flex-col py-6">
      <nav className="flex-1 space-y-2 px-3">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className={isActive ? 'text-white' : 'text-secondary-500'} 
                />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-3 py-4 border-t border-secondary-200"
        >
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-4">
            <h3 className="font-semibold text-secondary-900 mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-secondary-600 mb-3">
              Check our guide for creating perfect resumes
            </p>
            <button className="text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors">
              View Guide →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Sidebar;