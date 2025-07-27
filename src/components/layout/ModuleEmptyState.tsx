
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction } from 'lucide-react';

interface ModuleEmptyStateProps {
  module: string;
  onBackToDashboard?: () => void;
}

export function ModuleEmptyState({ module, onBackToDashboard }: ModuleEmptyStateProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Construction className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Module {module}</h1>
            <p className="text-gray-600">Module đang được phát triển</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-12 h-12 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Module Đang Phát Triển
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Module này hiện đang trong quá trình phát triển. Giao diện và tính năng 
            sẽ được hoàn thiện trong các phiên bản tiếp theo.
          </p>
          
          {onBackToDashboard && (
            <Button onClick={onBackToDashboard}>
              Quay Lại Tổng Quan
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
