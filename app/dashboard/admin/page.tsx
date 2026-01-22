"use client"

import { useEffect, useState } from "react"
import { 
  Users, 
  FileText, 
  Heart, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Eye,
  FileCheck,
  Building,
  Briefcase,
  CreditCard,
  HeartPulse,
  Shield,
  Flame,
  Phone,
  BarChart3,
  Activity,
  TrendingDown
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"
import AdminLayout from "@/components/adminLayout"
import { useAuth } from "@/hooks/useAuth"

interface DashboardStats {
  totalUsers: number
  totalNews: number
  totalAssistance: number
  pendingAssistance: number
  approvedAssistance: number
  rejectedAssistance: number
  publishedNews: number
  draftNews: number
  totalApplications: number
  buildingPermits: number
  businessPermits: number
  healthCertificates: number
  cedula: number
  barangayClearance: number
  policeClearance: number
  ambulanceRequests: number
  reports: number
}

interface RecentActivity {
  id: number
  type: string
  title: string
  date: string
  status: string
}

export default function EnhancedAdminDashboard() {
  const { user, loading: authLoading } = useAuth(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalNews: 0,
    totalAssistance: 0,
    pendingAssistance: 0,
    approvedAssistance: 0,
    rejectedAssistance: 0,
    publishedNews: 0,
    draftNews: 0,
    totalApplications: 0,
    buildingPermits: 0,
    businessPermits: 0,
    healthCertificates: 0,
    cedula: 0,
    barangayClearance: 0,
    policeClearance: 0,
    ambulanceRequests: 0,
    reports: 0,
  })
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for charts (replace with real API data)
  const applicationTrendData = [
    { month: "Jun", applications: 45, approved: 38, rejected: 7 },
    { month: "Jul", applications: 52, approved: 45, rejected: 7 },
    { month: "Aug", applications: 68, approved: 60, rejected: 8 },
    { month: "Sep", applications: 71, approved: 63, rejected: 8 },
    { month: "Oct", applications: 85, approved: 75, rejected: 10 },
    { month: "Nov", applications: 92, approved: 82, rejected: 10 },
  ]

  const serviceDistributionData = [
    { name: "Medical Assistance", value: stats.totalAssistance || 35, color: "#e70000" },
    { name: "Building Permits", value: stats.buildingPermits || 25, color: "#f56600" },
    { name: "Business Permits", value: stats.businessPermits || 20, color: "#edb200" },
    { name: "Health Certificates", value: stats.healthCertificates || 30, color: "#00d74f" },
    { name: "Cedula", value: stats.cedula || 40, color: "#005ef4" },
    { name: "Clearances", value: (stats.barangayClearance || 15) + (stats.policeClearance || 10), color: "#4300df" },
  ]

  const weeklyActivityData = [
    { day: "Mon", activity: 34 },
    { day: "Tue", activity: 45 },
    { day: "Wed", activity: 52 },
    { day: "Thu", activity: 48 },
    { day: "Fri", activity: 61 },
    { day: "Sat", activity: 28 },
    { day: "Sun", activity: 15 },
  ]

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData()
    }
  }, [authLoading, user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const endpoints = [
        "/api/admin/news",
        "/api/medical-assistance",
        "/api/building-permit",
        "/api/business-permit",
        "/api/health-certificate",
        "/api/cedula",
        "/api/barangay-clearance",
        "/api/police-clearance",
        "/api/emergency/ambulance",
        "/api/reports",
        "/api/users"
      ]

      const responses = await Promise.allSettled(
        endpoints.map(endpoint => 
          fetch(endpoint, { credentials: "include" }).then(res => res.ok ? res.json() : null)
        )
      )

      let newStats = { ...stats }
      let activities: RecentActivity[] = []

      // Process News
      if (responses[0].status === "fulfilled" && responses[0].value?.success) {
        const newsData = responses[0].value.data
        const published = newsData.data?.filter((n: any) => n.status === "published").length || 0
        const draft = newsData.data?.filter((n: any) => n.status === "draft").length || 0
        newStats.totalNews = newsData.total || newsData.data?.length || 0
        newStats.publishedNews = published
        newStats.draftNews = draft
      }

      // Process Medical Assistance
      if (responses[1].status === "fulfilled" && responses[1].value?.success) {
        const responseData = responses[1].value.data
        // Handle different response structures
        const dataArray = responseData.data || responseData || []
        
        const pending = dataArray.filter((a: any) => a.status === "pending").length || 0
        const approved = dataArray.filter((a: any) => a.status === "approved").length || 0
        const rejected = dataArray.filter((a: any) => a.status === "rejected").length || 0
        
        newStats.totalAssistance = responseData.total || dataArray.length || 0
        newStats.pendingAssistance = pending
        newStats.approvedAssistance = approved
        newStats.rejectedAssistance = rejected

        // Add to recent activities
        dataArray.slice(0, 3).forEach((a: any) => {
          // Try multiple possible field names
          const firstName = a.first_name || a.firstName || a.applicant_first_name || ""
          const lastName = a.last_name || a.lastName || a.applicant_last_name || ""
          const fullName = a.full_name || a.fullName || a.name || `${firstName} ${lastName}`.trim()
          
          // Only add if we have a valid name
          if (fullName && fullName !== "undefined undefined" && fullName.trim()) {
            activities.push({
              id: a.id,
              type: "Medical Assistance",
              title: fullName,
              date: a.created_at || a.createdAt || a.date || new Date().toISOString(),
              status: a.status || "pending",
            })
          }
        })
      }

      // Process Building Permits
      if (responses[2].status === "fulfilled" && responses[2].value?.success) {
        const data = responses[2].value.data
        newStats.buildingPermits = data.total || data.data?.length || 0
      }

      // Process Business Permits
      if (responses[3].status === "fulfilled" && responses[3].value?.success) {
        const data = responses[3].value.data
        newStats.businessPermits = data.total || data.data?.length || 0
      }

      // Process Health Certificates
      if (responses[4].status === "fulfilled" && responses[4].value?.success) {
        const data = responses[4].value.data
        newStats.healthCertificates = data.total || data.data?.length || 0
      }

      // Process Cedula
      if (responses[5].status === "fulfilled" && responses[5].value?.success) {
        const data = responses[5].value.data
        newStats.cedula = data.total || data.data?.length || 0
      }

      // Process Barangay Clearance
      if (responses[6].status === "fulfilled" && responses[6].value?.success) {
        const data = responses[6].value.data
        newStats.barangayClearance = data.total || data.data?.length || 0
      }

      // Process Police Clearance
      if (responses[7].status === "fulfilled" && responses[7].value?.success) {
        const data = responses[7].value.data
        newStats.policeClearance = data.total || data.data?.length || 0
      }

      // Process Ambulance Requests
      if (responses[8].status === "fulfilled" && responses[8].value?.success) {
        const data = responses[8].value.data
        newStats.ambulanceRequests = data.total || data.data?.length || 0
      }

      // Process Reports
      if (responses[9].status === "fulfilled" && responses[9].value?.success) {
        const data = responses[9].value.data
        newStats.reports = data.total || data.data?.length || 0
      }

      // Process Users
      if (responses[10].status === "fulfilled" && responses[10].value?.success) {
        const data = responses[10].value.data
        newStats.totalUsers = data.total || data.data?.length || 0
      }

      // Calculate total applications
      newStats.totalApplications = 
        newStats.totalAssistance +
        newStats.buildingPermits +
        newStats.businessPermits +
        newStats.healthCertificates +
        newStats.cedula +
        newStats.barangayClearance +
        newStats.policeClearance

      setStats(newStats)
      setRecentActivities(activities)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600/90' : 'text-red-600/90'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{trendValue}%</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">
        {loading ? "..." : value.toLocaleString()}
      </p>
    </div>
  )

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="h-full overflow-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Comprehensive overview of system performance</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#eda909b0] text-white rounded-lg hover:bg-yellow-500/90 transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </header>

      <main className="px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Users" 
              value={stats.totalUsers} 
              icon={Users} 
              color="blue"
              trend="up"
              trendValue={12}
            />
            <StatCard 
              title="Total Applications" 
              value={stats.totalApplications} 
              icon={FileCheck} 
              color="purple"
              trend="up"
              trendValue={8}
            />
            <StatCard 
              title="Medical Assistance" 
              value={stats.totalAssistance} 
              icon={Heart} 
              color="red"
              trend="up"
              trendValue={15}
            />
            <StatCard 
              title="Pending Reviews" 
              value={stats.pendingAssistance} 
              icon={Clock} 
              color="yellow"
            />
          </div>

          {/* Service Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Building className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Building Permits</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.buildingPermits}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Business Permits</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.businessPermits}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <HeartPulse className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Health Certificates</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.healthCertificates}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Cedula Issued</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.cedula}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Clearances</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.barangayClearance + stats.policeClearance}
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Ambulance Requests</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.ambulanceRequests}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Trends */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Application Trends</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={applicationTrendData}>
                  <defs>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff0000" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ffff00b0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#ff0000" 
                    strokeWidth={2}
                    fill="url(#colorApplications)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Service Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Service Distribution</h2>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={serviceDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="flex flex-col gap-2 w-full lg:w-auto">
                  {serviceDistributionData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs text-gray-700">{entry.name}</span>
                      <span className="text-xs font-bold text-gray-900 ml-auto">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Weekly Activity</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="activity" fill="#ab0000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Applications */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
                <button className="text-sm text-orange-600 font-medium hover:text-orange-700">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-2">No recent activities</p>
                    <p className="text-xs">Medical assistance applications will appear here</p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.type}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          activity.status === "pending"
                            ? "bg-orange-100 text-orange-700"
                            : activity.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Status Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Status Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.pendingAssistance}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Approved</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.approvedAssistance}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">Rejected</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.rejectedAssistance}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border-t-2 border-gray-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Total</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.totalAssistance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AdminLayout>
  ) 
}