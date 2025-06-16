
import { AdvancedFilter, FilterGroup, FilterCondition, FilterResult } from '../types/filter';
import { mockCustomers, mockSales, mockInventory, MockCustomer, MockSale, MockInventory } from '@/data/mockData';

export class FilterProcessor {
  static executeFilter(filter: AdvancedFilter): FilterResult {
    const startTime = Date.now();
    
    // Get all customers that match the filter
    const matchingCustomerIds = this.processFilterGroups(filter.groups, filter.logic);
    
    const executionTime = Date.now() - startTime;
    
    return {
      customers: matchingCustomerIds,
      totalCount: matchingCustomerIds.length,
      executionTime
    };
  }

  private static processFilterGroups(groups: FilterGroup[], logic: 'and' | 'or'): string[] {
    if (groups.length === 0) return [];
    
    let result: string[] = [];
    
    for (let i = 0; i < groups.length; i++) {
      const groupResult = this.processFilterGroup(groups[i]);
      
      if (i === 0) {
        result = groupResult;
      } else if (logic === 'and') {
        result = result.filter(id => groupResult.includes(id));
      } else { // logic === 'or'
        result = [...new Set([...result, ...groupResult])];
      }
    }
    
    return result;
  }

  private static processFilterGroup(group: FilterGroup): string[] {
    const conditionResults: string[] = [];
    const subGroupResults: string[] = [];
    
    // Process conditions
    for (const condition of group.conditions) {
      if (condition.field && condition.operator) {
        const conditionResult = this.processCondition(condition);
        conditionResults.push(...conditionResult);
      }
    }
    
    // Process sub-groups
    if (group.groups && group.groups.length > 0) {
      const subResult = this.processFilterGroups(group.groups, group.logic);
      subGroupResults.push(...subResult);
    }
    
    // Combine results based on group logic
    const allResults = [...conditionResults, ...subGroupResults];
    
    if (allResults.length === 0) return [];
    
    if (group.logic === 'and') {
      // Find intersection of all condition results
      let result = conditionResults.length > 0 ? conditionResults : mockCustomers.map(c => c.id);
      
      if (subGroupResults.length > 0) {
        result = result.filter(id => subGroupResults.includes(id));
      }
      
      return result;
    } else {
      // Find union of all results
      return [...new Set(allResults)];
    }
  }

  private static processCondition(condition: FilterCondition): string[] {
    const { field, operator, value } = condition;
    
    if (!field || !operator) return [];
    
    // Determine which data source to use
    if (field.startsWith('customer_')) {
      return this.processCustomerCondition(field, operator, value);
    } else if (field.startsWith('invoice_') || field.includes('purchase') || field.includes('order')) {
      return this.processInvoiceCondition(field, operator, value);
    } else if (field.startsWith('product_') || field.includes('purchased')) {
      return this.processProductCondition(field, operator, value);
    }
    
    return [];
  }

  private static processCustomerCondition(field: string, operator: string, value: any): string[] {
    return mockCustomers.filter(customer => {
      const fieldValue = this.getCustomerFieldValue(customer, field);
      return this.evaluateCondition(fieldValue, operator, value);
    }).map(c => c.id);
  }

  private static processInvoiceCondition(field: string, operator: string, value: any): string[] {
    // Group sales by customer
    const customerSales = mockSales.reduce((acc, sale) => {
      if (!acc[sale.customerId]) {
        acc[sale.customerId] = [];
      }
      acc[sale.customerId].push(sale);
      return acc;
    }, {} as Record<string, MockSale[]>);

    return Object.keys(customerSales).filter(customerId => {
      const sales = customerSales[customerId];
      const aggregatedValue = this.getInvoiceFieldValue(sales, field);
      return this.evaluateCondition(aggregatedValue, operator, value);
    });
  }

  private static processProductCondition(field: string, operator: string, value: any): string[] {
    // Get customer purchase history
    const customerProducts = mockSales.reduce((acc, sale) => {
      if (!acc[sale.customerId]) {
        acc[sale.customerId] = [];
      }
      acc[sale.customerId].push(...sale.items);
      return acc;
    }, {} as Record<string, string[]>);

    return Object.keys(customerProducts).filter(customerId => {
      const productIds = customerProducts[customerId];
      const fieldValue = this.getProductFieldValue(productIds, field);
      return this.evaluateCondition(fieldValue, operator, value);
    });
  }

  private static getCustomerFieldValue(customer: MockCustomer, field: string): any {
    switch (field) {
      case 'customer_group': return customer.group;
      case 'customer_name': return customer.name;
      case 'customer_phone': return customer.phone;
      case 'customer_email': return customer.email;
      case 'customer_address': return customer.address;
      case 'delivery_area': return customer.deliveryArea;
      case 'total_spent': return customer.totalSpent;
      case 'points': return customer.points;
      case 'total_debt': return customer.totalDebt;
      case 'created_date': return customer.createdDate;
      case 'status': return customer.status;
      default: return null;
    }
  }

  private static getInvoiceFieldValue(sales: MockSale[], field: string): any {
    switch (field) {
      case 'invoice_count': return sales.length;
      case 'total_invoice_value': return sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      case 'last_purchase_date': {
        const dates = sales.map(s => new Date(s.date));
        return dates.length > 0 ? Math.max(...dates.map(d => d.getTime())) : null;
      }
      case 'invoice_status': return sales.map(s => s.status);
      case 'purchase_channel': return sales.map(s => s.channel);
      case 'branch': return sales.map(s => s.branch);
      case 'average_order_value': {
        const total = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        return sales.length > 0 ? total / sales.length : 0;
      }
      default: return null;
    }
  }

  private static getProductFieldValue(productIds: string[], field: string): any {
    const products = productIds.map(id => mockInventory.find(p => p.id === id)).filter(Boolean) as MockInventory[];
    
    switch (field) {
      case 'purchased_products': return productIds;
      case 'product_category': return [...new Set(products.map(p => p.category))];
      case 'product_brand': return [...new Set(products.map(p => p.brand))];
      case 'product_quantity': return productIds.length;
      case 'never_purchased_category': return [...new Set(products.map(p => p.category))];
      default: return null;
    }
  }

  private static evaluateCondition(fieldValue: any, operator: string, conditionValue: any): boolean {
    if (fieldValue === null || fieldValue === undefined) {
      return operator === 'is_null';
    }

    switch (operator) {
      case 'equals': return fieldValue === conditionValue;
      case 'not_equals': return fieldValue !== conditionValue;
      case 'contains': return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
      case 'not_contains': return !String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
      case 'starts_with': return String(fieldValue).toLowerCase().startsWith(String(conditionValue).toLowerCase());
      case 'ends_with': return String(fieldValue).toLowerCase().endsWith(String(conditionValue).toLowerCase());
      case 'greater_than': return Number(fieldValue) > Number(conditionValue);
      case 'less_than': return Number(fieldValue) < Number(conditionValue);
      case 'greater_equal': return Number(fieldValue) >= Number(conditionValue);
      case 'less_equal': return Number(fieldValue) <= Number(conditionValue);
      case 'in': 
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(conditionValue);
        }
        return fieldValue === conditionValue;
      case 'not_in':
        if (Array.isArray(fieldValue)) {
          return !fieldValue.includes(conditionValue);
        }
        return fieldValue !== conditionValue;
      case 'between': {
        const num = Number(fieldValue);
        const from = Number(conditionValue.from);
        const to = Number(conditionValue.to);
        return num >= from && num <= to;
      }
      case 'is_null': return fieldValue === null || fieldValue === undefined || fieldValue === '';
      case 'is_not_null': return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      default: return false;
    }
  }
}
