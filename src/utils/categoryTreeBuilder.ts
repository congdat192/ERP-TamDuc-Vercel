export interface FlatCategory {
  id: number;
  name: string;
  path: string;
  productCount: number;
}

export interface CategoryNode {
  id: number;
  name: string;
  path: string;
  productCount: number;
  level: number;
  children: CategoryNode[];
}

/**
 * Build hierarchical category tree from flat categories with paths
 * Path format: "Level1 > Level2 > Level3"
 */
export function buildCategoryTree(flatCategories: FlatCategory[]): CategoryNode[] {
  if (!flatCategories || flatCategories.length === 0) return [];

  // Sort by path length (shortest first) to ensure parents are created before children
  const sorted = [...flatCategories].sort((a, b) => {
    const aDepth = (a.path.match(/>/g) || []).length;
    const bDepth = (b.path.match(/>/g) || []).length;
    return aDepth - bDepth;
  });

  const pathMap = new Map<string, CategoryNode>();
  const rootNodes: CategoryNode[] = [];

  sorted.forEach(category => {
    const pathParts = category.path.split(' > ').map(p => p.trim());
    const level = pathParts.length;

    // Create node for current category
    const node: CategoryNode = {
      id: category.id,
      name: category.name,
      path: category.path,
      productCount: category.productCount,
      level,
      children: []
    };

    pathMap.set(category.path, node);

    if (level === 1) {
      // Top-level category
      rootNodes.push(node);
    } else {
      // Find parent by exact path match
      const parentPath = pathParts.slice(0, -1).join(' > ');
      const parentNode = pathMap.get(parentPath);

      if (parentNode) {
        parentNode.children.push(node);
      } else {
        // Orphan node - add to root as fallback
        console.warn(`Orphan category detected: ${category.name} (path: ${category.path})`);
        rootNodes.push(node);
      }
    }
  });

  // Sort children at each level
  const sortChildren = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    nodes.forEach(node => {
      if (node.children.length > 0) {
        sortChildren(node.children);
      }
    });
  };

  sortChildren(rootNodes);
  rootNodes.sort((a, b) => a.name.localeCompare(b.name, 'vi'));

  // Aggregate product counts upward (parent = own count + all descendants)
  const aggregateProductCount = (node: CategoryNode): number => {
    if (!node.children || node.children.length === 0) {
      return node.productCount; // Leaf node - return own count
    }
    
    // Recursively sum all children + own count
    const childrenTotal = node.children.reduce((sum, child) => {
      return sum + aggregateProductCount(child);
    }, 0);
    
    node.productCount = node.productCount + childrenTotal;
    return node.productCount;
  };

  // Apply aggregation to all root nodes
  rootNodes.forEach(node => aggregateProductCount(node));

  return rootNodes;
}

/**
 * Flatten tree back to array for search/filter operations
 */
export function flattenTree(nodes: CategoryNode[]): CategoryNode[] {
  const result: CategoryNode[] = [];
  
  const traverse = (node: CategoryNode) => {
    result.push(node);
    node.children.forEach(traverse);
  };
  
  nodes.forEach(traverse);
  return result;
}

/**
 * Get all descendant IDs of a category (including itself)
 */
export function getDescendantIds(node: CategoryNode): number[] {
  const ids = [node.id];
  node.children.forEach(child => {
    ids.push(...getDescendantIds(child));
  });
  return ids;
}
