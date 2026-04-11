import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Task Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}