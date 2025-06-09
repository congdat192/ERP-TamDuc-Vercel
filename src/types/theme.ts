
export type ThemeMode = 'light' | 'dark';

export type ThemePreset = 'preset1' | 'preset2' | 'preset3' | 'preset4' | 'preset5' | 'preset6' | 'preset7' | 'preset8';

export interface ThemeConfig {
  mode: ThemeMode;
  preset: ThemePreset;
  userId?: string; // For future backend sync
}

export interface PresetColor {
  id: ThemePreset;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
}

export const THEME_PRESETS: PresetColor[] = [
  {
    id: 'preset1',
    name: 'Purple Blue',
    primary: '#A389F4',
    secondary: '#70D8FF',
    gradient: 'linear-gradient(135deg, #A389F4, #70D8FF)'
  },
  {
    id: 'preset2',
    name: 'Green Slate',
    primary: '#4BCB9A',
    secondary: '#455A64',
    gradient: 'linear-gradient(135deg, #4BCB9A, #455A64)'
  },
  {
    id: 'preset3',
    name: 'Blue Pink',
    primary: '#2234AE',
    secondary: '#F857A6',
    gradient: 'linear-gradient(135deg, #2234AE, #F857A6)'
  },
  {
    id: 'preset4',
    name: 'Teal Dark',
    primary: '#11998E',
    secondary: '#40514E',
    gradient: 'linear-gradient(135deg, #11998E, #40514E)'
  },
  {
    id: 'preset5',
    name: 'Gold Teal',
    primary: '#E2B969',
    secondary: '#167D7F',
    gradient: 'linear-gradient(135deg, #E2B969, #167D7F)'
  },
  {
    id: 'preset6',
    name: 'Navy Sky',
    primary: '#1E3A8A',
    secondary: '#38BDF8',
    gradient: 'linear-gradient(135deg, #1E3A8A, #38BDF8)'
  },
  {
    id: 'preset7',
    name: 'Dark Green',
    primary: '#142850',
    secondary: '#4BCB9A',
    gradient: 'linear-gradient(135deg, #142850, #4BCB9A)'
  },
  {
    id: 'preset8',
    name: 'Indigo Blue',
    primary: '#3546AB',
    secondary: '#556EE6',
    gradient: 'linear-gradient(135deg, #3546AB, #556EE6)'
  }
];
