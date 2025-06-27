import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = 'FileText', 
  title = 'No data found', 
  description = 'There are no items to display at the moment.', 
  action = null 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} size={32} className="text-secondary-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {title}
      </h3>
      <p className="text-secondary-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;