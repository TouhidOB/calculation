'use client'

import * as React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f172a',
      light: '#334155',
      dark: '#020617',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16a34a',
      dark: '#15803d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: '#e2e8f0',
    action: {
      hover: 'rgba(15, 23, 42, 0.04)',
      selected: 'rgba(37, 99, 235, 0.08)',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' },
    h3: { fontWeight: 600, letterSpacing: '-0.015em', color: '#0f172a' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em', color: '#0f172a' },
    h5: { fontWeight: 600, color: '#0f172a' },
    h6: { fontWeight: 600, color: '#0f172a' },
    subtitle1: { color: '#475569', fontWeight: 500 },
    subtitle2: { color: '#64748b', fontWeight: 500 },
    body1: { color: '#0f172a', lineHeight: 1.6 },
    body2: { color: '#475569', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          color: '#0f172a',
        },
        '@media print': {
          '.no-print, nav, header, footer, .MuiAppBar-root, .MuiBreadcrumbs-root, .MuiDrawer-root, .MuiModal-root, .MuiSnackbar-root, .MuiTabs-root, .MuiTab-root, .MuiButton-root, .MuiIconButton-root, .MuiButtonGroup-root, .MuiChip-root, .MuiTextField-root, .MuiSlider-root, .MuiSwitch-root, .MuiRadio-root, .MuiCheckbox-root, .MuiFormControl-root, .MuiFormGroup-root, .MuiInputBase-root, .MuiOutlinedInput-root, .MuiInputLabel-root, .MuiFormHelperText-root, .MuiAccordion-root, .MuiBottomNavigation-root': {
            display: 'none !important',
            visibility: 'hidden !important',
          },
          '.print-only': {
            display: 'block !important',
            visibility: 'visible !important',
          },
          '.print-full-width': {
            width: '100% !important',
            maxWidth: '100% !important',
            flexBasis: '100% !important',
          },
          '.print-chassis-clean': {
            background: '#ffffff !important',
            border: 'none !important',
            boxShadow: 'none !important',
            padding: '0 !important',
            margin: '0 !important',
          },
          'body, html': {
            background: '#ffffff !important',
            color: '#0f172a !important',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          backgroundImage: 'none',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          boxShadow: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            borderColor: '#cbd5e1',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          boxShadow: 'none',
        },
        contained: {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#1d4ed8',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#0f172a',
          '&:hover': {
            borderColor: '#cbd5e1',
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563eb',
              borderWidth: 1.5,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {},
    }),
    []
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AppRouterCacheProvider options={{ key: 'mui' }}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ColorModeContext.Provider>
  )
}
