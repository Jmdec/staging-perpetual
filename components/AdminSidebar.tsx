"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Ambulance,
  LayoutDashboard,
  Newspaper,
  Mail,
  User,
  LogOut,
  Shield,
  FileText,
  Megaphone,
  ScrollText,
  Heart,
  UserCheck,
  ShieldCheck,
  Home,
  HandHelping,
  MapPin,
  MonitorCog,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Images,
  Settings,
  Menu,
  X,
  Camera,
  Video,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSidebar({
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
    government: false,
    civilRegistry: false,
    health: false,
    publicSafety: false,
    aboutUs: false,
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
        government: false,
        civilRegistry: false,
        health: false,
        publicSafety: false,
        aboutUs: false,
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

      setTimeout(() => router.push("/login"), 500);
    } catch (error) {
      console.error("Logout error:", error);

      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred. Please try again.",
      });

      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string) => {
    if (path === "/dashboard/admin") {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(path + "/");
  };


  const isSectionActive = (items: { path: string }[]) =>
    items.some(item => isActive(item.path));

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/admin" },
    { icon: Newspaper, label: "News", path: "/dashboard/admin/news" },
    { icon: Megaphone, label: "Announcements", path: "/dashboard/admin/announcements" },
    { icon: Mail, label: "Contact Messages", path: "/dashboard/admin/contact" },
    { icon: FileText, label: "Legitimacy", path: "/dashboard/admin/legitimacy" },
   
    { icon: User, label: "Users", path: "/dashboard/admin/users" },
  ];

  const customization = [
    { icon: FileText, label: "About Us", path: "/dashboard/admin/about-us" },
    { icon: FileText, label: "Contact Information", path: "/dashboard/admin/office-contact" },
    { icon: Handshake, label: "Partnerships", path: "/dashboard/admin/partners" },
    { icon: Images, label: "Gallery", path: "/dashboard/admin/gallery" }, 
    { icon: Video, label: "Vlogs", path: "/dashboard/admin/vlogs" },
  ];

  const isaboutUsActive =
    expandedSections.aboutUs || isSectionActive(customization);

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
          <div
            className="w-10 h-10 rounded-full
              bg-gradient-to-b from-yellow-600/90 via-red-800/90 to-red-900/90
              flex items-center justify-center flex-shrink-0
              ring-2 ring-white/30 shadow-lg"
          >
            <img
              src="/perpetuallogo.jpg"
              alt="Perpetual Village Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-base">Perpetual Help College</h1>
              <p className="text-xs text-slate-200">Admin Panel</p>
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
                  className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isCollapsed ? 'justify-center' : ''} ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}>
                  <item.icon size={16} />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </button>

                {/* COLLAPSED MODE FLYOUT */}
                {isCollapsed && (
                  <div
                    className=" absolute left-full w-44 -translate-y-1/2 -m-5 px-3 py-2 -ml-2 bg-yellow-600 text-white text-xs font-semibold rounded-md shadow-xl opacity-0 translate-x-2 invisible pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 ease-out z-[9999]">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}

          <div className="group">
            {/* MAIN BUTTON */}
            <button
              onClick={() => !isCollapsed && toggleSection("aboutUs")}
              className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-left transition-colors text-sm hover:bg-white/10 ${isaboutUsActive ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"} ${isCollapsed ? "justify-center" : ""}`}>
              <div className="flex items-center gap-2 justify-center">
                <Settings size={16} />
                {!isCollapsed && (
                  <span className={`font-semibold text-white/90 text-sm tracking-wide ${isaboutUsActive ? "text-white font-semibold" : "text-white/90"}`}>
                    Customization
                  </span>
                )}
              </div>

              {!isCollapsed && (
                expandedSections.aboutUs ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )
              )}
            </button>

            {/* NORMAL EXPANDED MODE */}
            {!isCollapsed && expandedSections.aboutUs && (
              <div className="space-y-1 pl-3 m-1">
                {customization.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={index}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-2 p-3 py-3 rounded-lg text-left transition-colors text-xs ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"
                        }`}
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
              <div className="absolute left-full -translate-y-1/2 -ml-5 py-2 w-56 bg-yellow-600 rounded-lg shadow-xl opacity-0 translate-x-2 invisible pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible group-hover:pointer-events-auto group-hover:delay-150 transition-all duration-200 ease-out z-[9999]">
                <span className="w-full flex items-center px-4 py-2 font-semibold text-white/90 text-xs tracking-wide border-b border-white/20">
                  CUSTOMIZATION
                </span>
                {customization.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={index}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${active ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                        }`}
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
            className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed text-sm ${isCollapsed ? 'justify-center' : ''
              }`}
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