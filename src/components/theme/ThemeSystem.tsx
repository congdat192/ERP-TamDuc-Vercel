
import { useState } from 'react';
import { ThemeFloatingButton } from './ThemeFloatingButton';
import { ThemeCustomizationPanel } from './ThemeCustomizationPanel';

export function ThemeSystem() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <ThemeFloatingButton onClick={() => setIsPanelOpen(true)} />
      <ThemeCustomizationPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </>
  );
}
