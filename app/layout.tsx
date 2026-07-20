import type { Metadata } from 'next'
import './globals.css'

// Allow child routes to opt into ISR; a root-level force-dynamic would override
// every segment's `revalidate` and keep the whole tree dynamic.
export const revalidate = 60

export const metadata: Metadata = {
  metadataBase: new URL('https://mejorsiptv.shop'),
  title: 'Mejors IPTV',
  description: 'Premium IPTV subscription service',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
