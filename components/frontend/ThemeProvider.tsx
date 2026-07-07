import { db } from '@/lib/db'

interface ThemeProviderProps {
  children: React.ReactNode
}

export default async function ThemeProvider({ children }: ThemeProviderProps) {
  const settings = await db.siteSettings.findUnique({ where: { id: 'main' } })
  const theme = settings?.activeTheme ?? 'dark-tech'

  return (
    <html data-theme={theme} suppressHydrationWarning>
      {children}
    </html>
  )
}
