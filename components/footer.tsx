'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  verified: boolean
}

interface JuanTapProfile {
  id: string
  slug: string
  displayName: string
}

export default function Footer() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<JuanTapProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  /** 🔐 Check logged-in user */
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
  }, [])

  /** 🪪 Check JuanTap profile */
  useEffect(() => {
    if (!user || !user.verified) return

    fetch('/api/juantap/profile')
      .then(res => res.ok ? res.json() : null)
      .then(data => setProfile(data))
      .finally(() => setLoadingProfile(false))
  }, [user])

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-orange-500 to-green-500" />

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* BRAND */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-bold mb-3 bg-linear-to-r from-red-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
              Perpetual Village
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Delivering quality government services to Las Piñas City residents
            </p>

            <div className="flex gap-3">
              <a href="https://www.facebook.com/ilovepamplonatres" target="_blank">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-orange-400" />
              </a>
              <a href="https://www.instagram.com/explore/locations/1034521926/barangay-pamplona-tres/" target="_blank">
                <Instagram className="w-5 h-5 text-gray-400 hover:text-orange-400" />
              </a>
            </div>
          </motion.div>

          {/* NAV */}
          <div>
            <h4 className="font-bold mb-4">Navigation</h4>
            {['Home','About','Services','News','Announcements','Contact'].map(p => (
              <Link key={p} href={`/${p.toLowerCase()}`} className="block text-sm text-gray-400 hover:text-orange-400">
                {p}
              </Link>
            ))}
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="flex items-center gap-2 text-sm text-gray-400">
              <Phone className="w-4 h-4" /> (02) 8872-9664
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" /> barangay.pamplonatres.lpc@gmail.com
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" /> Las Piñas City
            </p>
          </div>

          {/* 🔥 JUANTAP NFC PROFILE */}
          {user?.verified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700"
            >
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-400" />
                JuanTap NFC Profile
              </h4>

              {loadingProfile ? (
                <p className="text-sm text-gray-400">Checking profile…</p>
              ) : profile ? (
                <>
                  <p className="text-sm text-gray-300 mb-2">
                    {profile.displayName}
                  </p>
                  <Link
                    href={`/juantap/${profile.slug}`}
                    className="text-sm text-orange-400 hover:underline"
                  >
                    View Profile →
                  </Link>
                  <Link
                    href="/juantap/edit"
                    className="block mt-2 text-xs text-gray-400 hover:text-orange-400"
                  >
                    Edit Profile
                  </Link>
                </>
              ) : (
                <Link
                  href="/juantap/create"
                  className="inline-block text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Create JuanTap Profile
                </Link>
              )}
            </motion.div>
          )}
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Perpetual Village, Las Piñas City
          <div>Powered By 
            <Link href="https://www.infinitechphil.com/" className='underline'>Infinitech Philippines</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
