export function getActiveModule(pathname: string): string | null {
  const match = pathname.match(/^\/ERP\/([^/]+)/);
  return match ? match[1].toLowerCase() : null;
}

export function getActiveSubmenu(pathname: string): string | null {
  const parts = pathname.split('/');
  return parts.length > 3 ? parts[3] : null;
}

export function isPathActive(currentPath: string, targetPath: string): boolean {
  return currentPath === targetPath;
}

export function isModuleActive(currentPath: string, modulePath: string): boolean {
  return currentPath.startsWith(modulePath);
}
