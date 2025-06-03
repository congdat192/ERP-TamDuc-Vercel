
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Users, 
  Package, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

interface TenantModuleLicensing {
  tenantId: string;
  tenantName: string;
  totalMonthlyRevenue: number;
  modules: Array<{
    moduleId: string;
    status: 'active' | 'inactive' | 'expired';
  }>;
}

interface ModulePlan {
  basic: string;
  professional: string;
  enterprise: string;
}

interface BulkLicenseModalProps {
  tenants: TenantModuleLicensing[];
  isOpen: boolean;
  onClose: () => void;
  onApply: (changes: BulkLicenseChanges) => void;
}

interface BulkLicenseChanges {
  selectedTenants: string[];
  action: 'enable' | 'disable' | 'upgrade' | 'extend' | 'apply_template';
  moduleIds?: string[];
  newPlan?: string;
  templateId?: string;
  extensionMonths?: number;
}

// Mock data for available modules
const availableModules = [
  { id: 'erp-core', name: 'ERP Core', description: 'Core ERP functionality', category: 'Core' },
  { id: 'crm', name: 'CRM Module', description: 'Customer relationship management', category: 'Sales' },
  { id: 'hrm', name: 'HR Management', description: 'Human resources management', category: 'HR' },
  { id: 'inventory', name: 'Inventory', description: 'Inventory management', category: 'Operations' }
];

// Mock data for module templates
const moduleTemplates = [
  {
    id: 'starter',
    name: 'Starter Package',
    description: 'Basic modules for small businesses',
    modules: [
      { moduleId: 'erp-core' },
      { moduleId: 'crm' }
    ]
  },
  {
    id: 'professional',
    name: 'Professional Package',
    description: 'Complete solution for growing businesses',
    modules: [
      { moduleId: 'erp-core' },
      { moduleId: 'crm' },
      { moduleId: 'hrm' },
      { moduleId: 'inventory' }
    ]
  }
];

export function BulkLicenseModal({ tenants, isOpen, onClose, onApply }: BulkLicenseModalProps) {
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [action, setAction] = useState<string>('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [newPlan, setNewPlan] = useState<string>('basic');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [extensionMonths, setExtensionMonths] = useState<number>(12);

  const handleTenantToggle = (tenantId: string, checked: boolean) => {
    if (checked) {
      setSelectedTenants(prev => [...prev, tenantId]);
    } else {
      setSelectedTenants(prev => prev.filter(id => id !== tenantId));
    }
  };

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    if (checked) {
      setSelectedModules(prev => [...prev, moduleId]);
    } else {
      setSelectedModules(prev => prev.filter(id => id !== moduleId));
    }
  };

  const handleSelectAllTenants = (checked: boolean) => {
    if (checked) {
      setSelectedTenants(tenants.map(t => t.tenantId));
    } else {
      setSelectedTenants([]);
    }
  };

  const handleSelectAllModules = (checked: boolean) => {
    if (checked) {
      setSelectedModules(availableModules.map(m => m.id));
    } else {
      setSelectedModules([]);
    }
  };

  const handleApply = () => {
    const changes: BulkLicenseChanges = {
      selectedTenants,
      action: action as any,
      moduleIds: selectedModules,
      newPlan,
      templateId: selectedTemplate,
      extensionMonths
    };
    onApply(changes);
  };

  const getImpactSummary = () => {
    const tenantCount = selectedTenants.length;
    const moduleCount = selectedModules.length;
    
    if (action === 'apply_template') {
      const template = moduleTemplates.find(t => t.id === selectedTemplate);
      return `Apply "${template?.name}" package to ${tenantCount} tenants`;
    }
    
    return `${action === 'enable' ? 'Enable' : 
             action === 'disable' ? 'Disable' :
             action === 'upgrade' ? 'Upgrade' : 'Extend'} ${moduleCount} modules for ${tenantCount} tenants`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Bulk License Management</span>
          </DialogTitle>
          <DialogDescription>
            Perform license changes for multiple tenants at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Selection */}
          <div>
            <Label htmlFor="action">Select Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Choose action to perform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enable">Enable modules</SelectItem>
                <SelectItem value="disable">Disable modules</SelectItem>
                <SelectItem value="upgrade">Upgrade plan</SelectItem>
                <SelectItem value="extend">Extend duration</SelectItem>
                <SelectItem value="apply_template">Apply template package</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {action && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tenant Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Select Tenants ({selectedTenants.length}/{tenants.length})</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAllTenants(selectedTenants.length !== tenants.length)}
                  >
                    {selectedTenants.length === tenants.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                  {tenants.map((tenant) => (
                    <div key={tenant.tenantId} className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedTenants.includes(tenant.tenantId)}
                        onCheckedChange={(checked) => handleTenantToggle(tenant.tenantId, checked as boolean)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{tenant.tenantName}</p>
                        <p className="text-xs text-gray-500">
                          {tenant.modules.filter(m => m.status === 'active').length} active modules
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {(tenant.totalMonthlyRevenue / 1000000).toFixed(1)}M
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Configuration */}
              <div>
                {action === 'apply_template' ? (
                  <div>
                    <Label>Select Template Package</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose template package" />
                      </SelectTrigger>
                      <SelectContent>
                        {moduleTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedTemplate && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium mb-2">
                          {moduleTemplates.find(t => t.id === selectedTemplate)?.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {moduleTemplates.find(t => t.id === selectedTemplate)?.modules.map((module) => {
                            const moduleInfo = availableModules.find(m => m.id === module.moduleId);
                            return (
                              <Badge key={module.moduleId} variant="outline" className="text-xs">
                                {moduleInfo?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Module Selection */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label>Select Modules ({selectedModules.length}/{availableModules.length})</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectAllModules(selectedModules.length !== availableModules.length)}
                        >
                          {selectedModules.length === availableModules.length ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                        {availableModules.map((module) => (
                          <div key={module.id} className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedModules.includes(module.id)}
                              onCheckedChange={(checked) => handleModuleToggle(module.id, checked as boolean)}
                            />
                            <Package className="w-4 h-4 text-gray-500" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{module.name}</p>
                              <p className="text-xs text-gray-500">{module.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {module.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Configuration */}
                    {action === 'upgrade' && (
                      <div>
                        <Label>New Plan</Label>
                        <Select value={newPlan} onValueChange={setNewPlan}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {action === 'extend' && (
                      <div>
                        <Label>Extension Period (months)</Label>
                        <Select value={extensionMonths.toString()} onValueChange={(value) => setExtensionMonths(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 months</SelectItem>
                            <SelectItem value="6">6 months</SelectItem>
                            <SelectItem value="12">12 months</SelectItem>
                            <SelectItem value="24">24 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Impact Summary */}
          {action && selectedTenants.length > 0 && (
            <>
              <Separator />
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Change Summary</h3>
                </div>
                <p className="text-blue-700">{getImpactSummary()}</p>
              </div>
            </>
          )}

          {/* Warning */}
          {selectedTenants.length > 10 && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-800 font-medium">Warning</p>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                You are making changes to many tenants. Please review carefully before applying.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!action || selectedTenants.length === 0 || (action !== 'apply_template' && selectedModules.length === 0)}
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
