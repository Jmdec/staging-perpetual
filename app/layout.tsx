import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import CookieConsent from "@/components/cookie-consent"
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider"
import FloatingSocialMedia from "@/components/FloatingSocialMedia"
import Chatbot from "@/components/Chatbot"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://pamplonatres-laspinas.vercel.app/"),
  
  title: {
    default: "Perpetual Village | Las Piñas City Official Portal",
    template: "%s | Perpetual Village"
  },
  
  description: "Official digital platform of Perpetual Village, Las Piñas City. Access barangay services, community updates, announcements, and connect with your local government. Serving 18,500+ residents with excellence.",
  
  keywords: [
    "Perpetual Village",
    "Perpetual Village",
    "Las Piñas City",
    "Metro Manila barangay",
    "barangay services",
    "barangay clearance",
    "Las Piñas government",
    "community services",
    "barangay announcements",
    "local government unit",
    "LGU Philippines",
    "Perpetual Village Las Piñas",
    "barangay hall",
    "community portal",
    "Philippine barangay",
    "NCR barangay services"
  ],
  
  authors: [{ name: "Perpetual Village" }],
  creator: "Perpetual Village",
  publisher: "Perpetual Village, Las Piñas City",
  generator: "Next.js",
  applicationName: "Perpetual Village Portal",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://pamplonatres-laspinas.vercel.app/",
    title: "Perpetual Village | Las Piñas City Official Portal",
    description: "Official digital platform of Perpetual Village, Las Piñas City. Access barangay services, community updates, and connect with your local government.",
    siteName: "Perpetual Village",
    images: [
      {
        url: "https://pamplonatres-laspinas.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Perpetual Village - Las Piñas City Official Portal",
      },
    ],
    countryName: "Philippines",
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Perpetual Village | Las Piñas City Official Portal",
    description: "Official digital platform of Perpetual Village, Las Piñas City. Access barangay services, community updates, and local government resources.",
    images: ["https://pamplonatres-laspinas.vercel.app/twitter-image.png"],
    creator: "@PamplonaTresLP",
  },

  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Brgy Perpetual Village",
    startupImage: [
      {
        url: "/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px)"
      }
    ]
  },

  // Icons
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon512_rounded.png",
        sizes: "512x512",
        type: "image/png",
      }
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/icon512_rounded.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/icon512_rounded.png",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  
  alternates: {
    canonical: "https://pamplonatres-laspinas.vercel.app/",
    languages: {
      "en-PH": "https://pamplonatres-laspinas.vercel.app/",
      "fil-PH": "https://pamplonatres-laspinas.vercel.app/fil",
    },
  },
  
  category: "government",
  
  // Additional metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ea580c" },
    { media: "(prefers-color-scheme: dark)", color: "#dc2626" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Government Organization Schema
  const governmentSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": "https://pamplonatres-laspinas.vercel.app/#organization",
    "name": "Perpetual Village",
    "alternateName": "Brgy. Perpetual Village",
    "url": "https://pamplonatres-laspinas.vercel.app/",
    "logo": "https://pamplonatres-laspinas.vercel.app/icon512_rounded.png",
    "description": "Official barangay government of Perpetual Village, Las Piñas City, Metro Manila. Serving 18,500+ residents with quality community services and transparent governance.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Perpetual Village Hall",
      "addressLocality": "Las Piñas City",
      "addressRegion": "Metro Manila",
      "postalCode": "1747",
      "addressCountry": "PH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "14.4611",
      "longitude": "120.9845"
    },
    "telephone": "+63-2-XXXX-XXXX",
    "areaServed": {
      "@type": "Place",
      "name": "Perpetual Village, Las Piñas City"
    },
    "parentOrganization": {
      "@type": "GovernmentOrganization",
      "name": "City Government of Las Piñas",
      "url": "https://laspinascity.gov.ph"
    },
    "sameAs": [
      "https://www.facebook.com/BrgyPamplonaTres",
      "https://twitter.com/PamplonaTresLP"
    ]
  }

  // LocalBusiness Schema for better local SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://pamplonatres-laspinas.vercel.app/#localbusiness",
    "name": "Perpetual Village Hall",
    "image": "https://pamplonatres-laspinas.vercel.app/og-image.png",
    "priceRange": "Free",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Perpetual Village",
      "addressLocality": "Las Piñas City",
      "addressRegion": "Metro Manila",
      "postalCode": "1747",
      "addressCountry": "Philippines"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "14.4611",
      "longitude": "120.9845"
    },
    "url": "https://pamplonatres-laspinas.vercel.app/",
    "telephone": "+63-2-XXXX-XXXX",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "17:00"
      }
    ]
  }

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://pamplonatres-laspinas.vercel.app/#website",
    "url": "https://pamplonatres-laspinas.vercel.app/",
    "name": "Perpetual Village Portal",
    "description": "Official Portal of Perpetual Village, Las Piñas City",
    "inLanguage": "en-PH",
    "publisher": {
      "@id": "https://pamplonatres-laspinas.vercel.app/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://pamplonatres-laspinas.vercel.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Metro Manila",
        "item": "https://en.wikipedia.org/wiki/Metro_Manila"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Las Piñas City",
        "item": "https://laspinascity.gov.ph"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Perpetual Village",
        "item": "https://pamplonatres-laspinas.vercel.app/"
      }
    ]
  }

  return (
    <html lang="en-PH">
      <head>
        {/* Primary Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentSchema) }}
        />
        
        {/* LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        
        {/* Open Graph Image Tags */}
        <meta property="og:image" content="https://pamplonatres-laspinas.vercel.app/og-image.png" />
        <meta property="og:image:secure_url" content="https://pamplonatres-laspinas.vercel.app/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Perpetual Village - Las Piñas City" />
        
        {/* Twitter Card Image */}
        <meta name="twitter:image" content="https://pamplonatres-laspinas.vercel.app/twitter-image.png" />
        <meta name="twitter:image:alt" content="Perpetual Village Portal" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Geographic meta tags - Las Piñas City coordinates */}
        <meta name="geo.region" content="PH-NCR" />
        <meta name="geo.placename" content="Perpetual Village, Las Piñas City" />
        <meta name="geo.position" content="14.4611;120.9845" />
        <meta name="ICBM" content="14.4611, 120.9845" />
        
        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        
        {/* Business-specific meta */}
        <meta property="place:location:latitude" content="14.4611" />
        <meta property="place:location:longitude" content="120.9845" />
        <meta name="coverage" content="Perpetual Village, Las Piñas City, Metro Manila, Philippines" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://pamplonatres-laspinas.vercel.app/" />
        
        {/* Alternative languages */}
        <link rel="alternate" hrefLang="en-ph" href="https://pamplonatres-laspinas.vercel.app/" />
        <link rel="alternate" hrefLang="fil-ph" href="https://pamplonatres-laspinas.vercel.app/fil" />
        <link rel="alternate" hrefLang="x-default" href="https://pamplonatres-laspinas.vercel.app/" />
      </head>
      <body className={`${geist.className} antialiased bg-linear-to-br from-red-50 via-orange-50 to-green-50`}>
        <ServiceWorkerProvider />
        {children}
        <Toaster />
        <CookieConsent />
        <Chatbot />
      </body>
    </html>
  )
}