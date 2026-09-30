import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { staticSecurityHeaders } from './src/lib/security/csp'

const withNextIntl = createNextIntlPlugin({
  experimental: {
    // Type-safe message keys derived from the English catalogue.
    createMessagesDeclaration: './messages/en.json',
  },
})

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : '*.supabase.co'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    // Request-independent headers on every response, including static
    // assets. The nonce-based CSP is added per request in src/proxy.ts.
    return [
      {
        source: '/(.*)',
        headers: Object.entries(staticSecurityHeaders).map(([key, value]) => ({ key, value })),
      },
    ]
  },
}

export default withNextIntl(nextConfig)
