import React from 'react';
import { motion } from 'framer-motion';

const Textarea = ({ 
  className = '', 
  error = false, 
  helperText = '',
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-vertical';
  const normalClasses = 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500';
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  
  const classes = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;

  return (
    <div className="w-full">
      <motion.textarea
        whileFocus={{ scale: 1.01 }}
        className={classes}
        {...props}
      />
      {helperText && (
        <p className={`text-sm mt-1 ${error ? 'text-red-600' : 'text-secondary-600'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Textarea;