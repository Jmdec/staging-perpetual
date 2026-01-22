"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Grid3x3,
  Newspaper,
  AlertTriangle,
  User,
  FileText,
  GraduationCap,
  Rocket,
  Building2,
  MapPin,
  Bell,
  LogOut,
  File,
  Shield,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { authClient } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

export default function MemberSidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Dropdown state
  const [expandedSections, setExpandedSections] = React.useState({
    quickAccess: false,
    certificates: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);

    if (!isCollapsed) {
      setExpandedSections({
        quickAccess: false,
        certificates: false,
      });
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoggingOut(true);

    try {
      await authClient.logout();

      toast({
        title: "✓ Logged Out Successfully",
        description: "You have been securely logged out.",
        className: "bg-green-50 border-green-200",
        duration: 2000,
      });

      setTimeout(() => {
        router.push('/login');
      }, 500);

    } catch (error) {
      console.error('Logout error:', error);

      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred. Please try again.",
      });

      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string) => {
    if (path === "/dashboard/member") {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  const isSectionActive = (items: { path: string }[]) =>
    items.some(item => isActive(item.path));

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/dashboard/member' },
    { icon: Grid3x3, label: 'Partners', path: '/dashboard/member/partners' },
    { icon: Newspaper, label: 'News', path: '/dashboard/member/news' },
    { icon: User, label: 'Announcemnets', path: '/dashboard/member/account/announcements' },
    { icon: User, label: 'Certificate of Legitemacy', path: '/dashboard/member/legitimacy' },
  ];

  // const quickAccessItems = [
  //   { icon: FileText, label: 'Member Guide', path: '/dashboard/member/member-guide' },
  //   { icon: GraduationCap, label: 'Students', path: '/dashboard/member/students' },
  //   { icon: Rocket, label: 'Startup', path: '/dashboard/member/startup' },
  //   { icon: MapPin, label: 'City Map', path: '/dashboard/member/city-map' },
  //   { icon: Bell, label: 'Alerts', path: '/dashboard/member/alerts' },
  // ];

  const certificateItems = [
    { icon: File, label: 'Certificates', path: '/dashboard/member/services/certificates' },
    { icon: File, label: 'Certificate of Legitemacy', path: '/dashboard/member/services/certificate-of-legitemacy' },
  ];

  // const isQuickAccessActive = expandedSections.quickAccess || isSectionActive(quickAccessItems);
  const isCertificatesActive = expandedSections.certificates || isSectionActive(certificateItems);

  return (
    <aside className={`hidden lg:block fixed top-0 left-0 h-full overflow-visible bg-gradient-to-b from-yellow-600/90 via-red-800/90 to-red-900/90 text-white shadow-2xl z-50 transition-all duration-300 ${isCollapsed ? "w-[70px]" : "w-[300px]"}`}>
      <button onClick={toggleSidebar} className="absolute top-4 -right-3 bg-white text-slate-800 rounded-full p-1.5 shadow-lg hover:bg-slate-100 transition-colors z-[999]">
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Scrollable Content */}
      <div className={`h-full overflow-y-auto overflow-x-hidden ${isCollapsed ? 'py-8 px-4' : 'py-8 px-8'} flex flex-col min-h-full`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#eda909b0 #992f2f"
        }}
      >
        {/* Logo Section */}
        <div className={`flex items-center gap-2 mb-4 py-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Shield className="text-emerald-600" size={20} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-base">Perpetual Village City</h1>
              <p className="text-xs text-emerald-100">Member Portal</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1 flex-1 py-2 border-t border-white/20">
          {navigationItems.map((item, index) => {
            const active = isActive(item.path);

            return (
              <div key={index} className="group">
                {/* MAIN BUTTON */}
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isCollapsed ? 'justify-center' : ''} ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
                >
                  <item.icon size={16} />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </button>

                {/* COLLAPSED MODE FLYOUT */}
                {isCollapsed && (
                  <div className="absolute left-full w-44 -translate-y-1/2 -m-5 px-3 py-2 -ml-2 bg-emerald-600 text-white text-xs font-semibold rounded-md shadow-xl opacity-0 translate-x-2 invisible pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 ease-out z-[9999]">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}

         

          {/* Certificates Section */}
          <div className="group">
            {/* MAIN BUTTON */}
            <button
              onClick={() => !isCollapsed && toggleSection("certificates")}
              className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-left transition-colors text-sm hover:bg-white/10 ${isCertificatesActive ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"} ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="flex items-center gap-2 justify-center">
                <FileText size={16} />
                {!isCollapsed && (
                  <span className={`font-semibold text-white/90 text-xs tracking-wide ${isCertificatesActive ? "text-white font-semibold" : "text-white/90"}`}>
                    Certificates
                  </span>
                )}
              </div>

              {!isCollapsed && (
                expandedSections.certificates ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )
              )}
            </button>

            {/* NORMAL EXPANDED MODE */}
            {!isCollapsed && expandedSections.certificates && (
              <div className="space-y-1 pl-3 m-1">
                {certificateItems.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={index}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-2 p-3 py-3 rounded-lg text-left transition-colors text-xs ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
                    >
                      <item.icon size={16} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* COLLAPSED MODE FLYOUT */}
            {isCollapsed && (
              <div className="absolute left-full -translate-y-1/2 -ml-5 py-2 w-56 bg-emerald-600 rounded-lg shadow-xl opacity-0 translate-x-2 invisible pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible group-hover:pointer-events-auto group-hover:delay-150 transition-all duration-200 ease-out z-[9999]">
                <span className="w-full flex items-center px-4 py-2 font-semibold text-white/90 text-xs tracking-wide border-b border-white/20">
                  Certificates
                </span>
                {certificateItems.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={index}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${active ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="py-6 border-t border-white/20">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed text-sm ${isCollapsed ? 'justify-center' : ''}`}
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {!isCollapsed && <span className="font-medium">Logging out...</span>}
              </>
            ) : (
              <>
                <LogOut size={16} className="group-hover:text-red-200" />
                {!isCollapsed && (
                  <span className="font-medium group-hover:text-red-200">
                    Logout
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}