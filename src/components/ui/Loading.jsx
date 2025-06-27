import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Loading = () => {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <ApperIcon name="Loader2" size={32} className="text-white" />
          </motion.div>
        </div>
        
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">
          Loading AutoCV
        </h2>
        <p className="text-secondary-600">
          Please wait while we prepare your resume builder...
        </p>
        
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-primary-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;