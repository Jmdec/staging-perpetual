"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Home, Leaf, Award, Target, Globe, Loader2 } from "lucide-react"

interface ObjectiveData {
  objectives_header: string
  objectives_title: string
  objectives_description: string
  objectives_card_title: string[]
  objectives_card_content: string[]
}

interface MissionVisionData {
  mission_and_vision_header: string
  mission_and_vision_title: string
  mission_and_vision_description: string
  mission_content: string
  vision_content: string
}

export default function AboutSection() {
  const [objectivesData, setObjectivesData] = useState<ObjectiveData | null>(null)
  const [missionVisionData, setMissionVisionData] = useState<MissionVisionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const stats = [
    {
      icon: Users,
      number: "18,500+",
      label: "Proud Residents",
    },
    {
      icon: Home,
      number: "4,200+",
      label: "Households",
    },
    {
      icon: Leaf,
      number: "3",
      label: "Green Spaces",
    },
    {
      icon: Award,
      number: "20+",
      label: "Community Programs",
    },
  ]

  const highlights = [
    "Delivering efficient and responsive barangay services",
    "Fostering unity through community events and festivals",
    "Championing environmental sustainability initiatives",
    "Empowering residents through livelihood and skills programs",
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch both objectives and mission/vision data
      const [objectivesRes, missionVisionRes] = await Promise.all([
        fetch("/api/objectives"),
        fetch("/api/mission-and-vision")
      ])

      // Handle objectives data
      if (objectivesRes.ok) {
        const objectivesJson = await objectivesRes.json()
        if (objectivesJson.success && objectivesJson.data) {
          const data = objectivesJson.data
          
          // Parse JSON strings to arrays if needed
          const parsedData = {
            objectives_header: data.objectives_header || "",
            objectives_title: data.objectives_title || "",
            objectives_description: data.objectives_description || "",
            objectives_card_title: typeof data.objectives_card_title === 'string' 
              ? JSON.parse(data.objectives_card_title) 
              : data.objectives_card_title || [],
            objectives_card_content: typeof data.objectives_card_content === 'string'
              ? JSON.parse(data.objectives_card_content)
              : data.objectives_card_content || []
          }
          
          setObjectivesData(parsedData)
        }
      }

      // Handle mission/vision data
      if (missionVisionRes.ok) {
        const missionVisionJson = await missionVisionRes.json()
        if (missionVisionJson.success && missionVisionJson.data) {
          setMissionVisionData(missionVisionJson.data)
        }
      }

    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-green-50" />
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-green-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Stats Grid - Now on Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-gradient-to-r hover:from-red-400 hover:via-orange-400 hover:to-green-400 text-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-red-600 to-[#800000]/90 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 via-red-600 to-[#800000]/90 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Text Content - Now on Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-red-800 via-red-800 to-yellow-500/80 text-sm font-semibold bg-gradient-to-r from-green-600 via-red-600 to-[#800000]/90 bg-clip-text text-transparent">
                Our Community
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-600 via-red-600 to-red-900 bg-clip-text text-transparent">
                Perpetual Village
              </span>
            </h2>

            <div className="w-20 h-1.5 bg-gradient-to-r from-yellow-600 via-red-600 to-red-900 rounded-full mb-6" />

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Nestled in the bustling city of Las Piñas, Perpetual Village is a thriving urban community
              where tradition meets progress. Home to over 18,500 residents, we are a diverse neighborhood
              united by shared values of cooperation, resilience, and progress.
            </p>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our barangay is more than just a place—it's a home where families grow, businesses flourish,
              and every voice matters. We take pride in:
            </p>

            <ul className="space-y-4">
              {highlights.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 via-red-600 to-[#800000]/90 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-md">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                  <span className="text-gray-800 text-lg font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10"
            >
              <button className="px-8 py-4 rounded-full bg-gradient-to-tl from-yellow-600 via-red-700 to-red-900 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                Learn More About Us
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Mission & Vision Section */}
        {missionVisionData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-24 mb-24"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-sm font-semibold bg-gradient-to-r from-green-600 via-red-600 to-[#800000]/90 bg-clip-text text-transparent">
                  {missionVisionData.mission_and_vision_header}
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-600 via-red-600 to-red-900 bg-clip-text text-transparent">
                  {missionVisionData.mission_and_vision_title}
                </span>
              </h2>

              {missionVisionData.mission_and_vision_description && (
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  {missionVisionData.mission_and_vision_description}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Mission Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.08 }}
                className="bg-gradient-to-br from-yellow-500 via-red-600 to-[#800000]/90 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 md:p-10"
              >
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl backdrop-blur-sm bg-white/20">
                  <Target className="w-8 h-8 text-orange-200" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg text-orange-100 leading-relaxed">
                  {missionVisionData.mission_content}
                </p>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.08 }}
                className="bg-gradient-to-br from-yellow-500 via-red-600 to-[#800000]/90 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 md:p-10"
              >
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl backdrop-blur-sm bg-white/20">
                  <Globe className="w-8 h-8 text-orange-200" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg text-red-100 leading-relaxed">
                  {missionVisionData.vision_content}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Objectives Section */}
        {objectivesData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-24"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-sm font-semibold bg-gradient-to-r from-green-600 via-red-600 to-[#800000]/90 bg-clip-text text-transparent">
                  {objectivesData.objectives_header}
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-600 via-red-600 to-red-900 bg-clip-text text-transparent">
                  {objectivesData.objectives_title}
                </span>
              </h2>

              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {objectivesData.objectives_description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {Array.isArray(objectivesData.objectives_card_title) && objectivesData.objectives_card_title.map((title, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="relative p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-gradient-to-b from-yellow-500 via-red-600 to-[#800000]/90 group"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 via-red-600 to-[#800000]/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-xl">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-600 via-red-600 to-red-900 bg-clip-text text-transparent">
                        {title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {objectivesData.objectives_card_content[index]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-red-300/20 via-orange-300/20 to-green-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-green-300/20 via-orange-300/20 to-red-300/20 rounded-full blur-3xl" />
    </section>
  )
}