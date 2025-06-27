import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ user, onLogout, onToggleSidebar, sidebarOpen }) => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-sm border-b border-secondary-200 h-16 flex items-center justify-between px-6 relative z-50"
    >
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ApperIcon 
            name={sidebarOpen ? "X" : "Menu"} 
            size={20} 
            className="text-secondary-600" 
          />
        </Button>
        
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="FileText" size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">AutoCV</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <span className="text-secondary-700 font-medium">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="LogOut" size={16} />
          <span className="hidden sm:block">Logout</span>
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;