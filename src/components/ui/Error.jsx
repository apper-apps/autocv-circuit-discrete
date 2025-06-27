import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const Error = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-secondary-600 mb-6">
            {message}
          </p>
          
          <div className="space-y-3">
            {onRetry && (
              <Button
                variant="primary"
                onClick={onRetry}
                className="w-full flex items-center justify-center space-x-2"
              >
                <ApperIcon name="RefreshCw" size={16} />
                <span>Try Again</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center space-x-2"
            >
              <ApperIcon name="RotateCcw" size={16} />
              <span>Reload Page</span>
            </Button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-secondary-200">
            <p className="text-sm text-secondary-500">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Error;