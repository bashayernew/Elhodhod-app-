export const colors = {
  background: '#0b0b0d',
  foreground: '#fafafa',
  primary: '#6e56cf',
  muted: '#2a2a2e',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radii = { sm: 6, md: 8, lg: 12 };
export const typography = { baseSize: 16, scale: 1.2 };

export function tailwindPreset() {
  return {
    theme: {
      extend: {
        colors: {
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          border: 'hsl(var(--foreground) / 0.12)'
        },
        borderRadius: {
          DEFAULT: 'var(--radius)'
        }
      }
    }
  };
}


