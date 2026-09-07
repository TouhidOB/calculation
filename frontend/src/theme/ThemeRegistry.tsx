'use client'

import * as React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider, createTheme, type Theme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import type { PaletteMode } from '@mui/material'

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#6366f1' },
          secondary: { main: '#06b6d4' },
          background: { default: '#f4f5fb', paper: '#ffffff' },
          text: { primary: '#1a1d2e', secondary: '#5c6172' },
        }
      : {
          primary: { main: '#818cf8' },
          secondary: { main: '#22d3ee' },
          background: { default: '#0b0d17', paper: '#131629' },
          text: { primary: '#e6e9f5', secondary: '#9aa1b5' },
        }),
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter","Segoe UI",system-ui,-apple-system,sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none' as const, fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.divider}`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(99,102,241,0.15)'
              : '0 8px 32px rgba(0,0,0,0.08)',
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, padding: '10px 24px' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' as const, fullWidth: true },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
})

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<PaletteMode>('dark')

  React.useEffect(() => {
    const saved = window.localStorage.getItem('calchub-theme')
    if (saved === 'light' || saved === 'dark') setMode(saved)
  }, [])

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => {
          const next = prev === 'light' ? 'dark' : 'light'
          window.localStorage.setItem('calchub-theme', next)
          return next
        }),
    }),
    []
  )

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode) as any), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AppRouterCacheProvider options={{ key: 'mui' }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ColorModeContext.Provider>
  )
}