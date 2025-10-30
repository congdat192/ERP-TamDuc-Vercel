export interface FlatCategory {
  id: number;
  name: string;
  path: string;
  productCount: number;
}

export interface CategoryNode {
  id: number;
  name: string;
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

  const nodeMap = new Map<number, CategoryNode>();
  const rootNodes: CategoryNode[] = [];

  sorted.forEach(category => {
    const pathParts = category.path.split(' > ').map(p => p.trim());
    const level = pathParts.length;

    // Create node for current category
    const node: CategoryNode = {
      id: category.id,
      name: category.name,
      productCount: category.productCount,
      level,
      children: []
    };

    nodeMap.set(category.id, node);

    if (level === 1) {
      // Top-level category
      rootNodes.push(node);
    } else {
      // Find parent by reconstructing parent path
      const parentPath = pathParts.slice(0, -1).join(' > ');
      
      // Find parent node by matching path
      const parentNode = Array.from(nodeMap.values()).find(n => {
        const nodePath = pathParts.slice(0, n.level).join(' > ');
        return nodePath === parentPath.split(' > ').slice(0, n.level).join(' > ') && n.level === level - 1;
      });

      if (parentNode) {
        parentNode.children.push(node);
        // Update parent's product count to include children
        parentNode.productCount += category.productCount;
      } else {
        // Orphan node - add to root as fallback
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
