"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Mail,
  User,
  LogOut,
  Shield,
  FileText,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Dropdown state
  const [expandedSections, setExpandedSections] = React.useState({
    government: false,
    civilRegistry: false,
    health: false,
    publicSafety: false,
    certificateItems: false,
    aboutUs: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
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
    items.some((item) => isActive(item.path));

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/admin" },
    { icon: Newspaper, label: "News", path: "/dashboard/admin/news" },
    { icon: Newspaper, label: "Announcements", path: "/dashboard/admin/announcements" },
    { icon: Mail, label: "Contact Messages", path: "/dashboard/admin/contact" },
    { icon: FileText, label: "Legitimacy", path: "/dashboard/admin/legitimacy" },
  ];

  // const certificateItems = [
  //   { icon: FileText, label: "Legitimacy", path: "/dashboard/admin/legitimacy" },
  //   { icon: FileText, label: "Certificate Verifications", path: "/dashboard/admin/certification-verifications" },
  // ];

  const aboutUs = [
    { icon: FileText, label: "Our Comunity", path: "/dashboard/admin/our-community" },
    { icon: FileText, label: "Goals", path: "/dashboard/admin/goals" },
    { icon: FileText, label: "Mission & Vision", path: "/dashboard/admin/mission-and-vision" },
    { icon: FileText, label: "Objectives", path: "/dashboard/admin/objectives" },
  ];



  // const iscertificateItemsActive =
  //   expandedSections.certificateItems || isSectionActive(certificateItems);

  const isaboutUsActive =
    expandedSections.aboutUs || isSectionActive(aboutUs);

  return (
    <>
      {/* Mobile Hamburger Button - Visible only on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay - Visible only on mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full bg-gradient-to-b from-yellow-600/90 via-red-800/90 to-red-900/90 text-white shadow-2xl z-50 transition-transform duration-300 w-[300px] ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

      {/* Scrollable Content */}
      <div
        className="h-full overflow-y-auto overflow-x-hidden py-8 px-8 flex flex-col min-h-full"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#eda909b0 #992f2f",
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-4 py-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Shield className="text-slate-800" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-base">Perpetual Village City</h1>
            <p className="text-xs text-slate-200">Admin Panel</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1 flex-1 py-2 border-t border-white/20">
          {navigationItems.map((item, index) => {
            const active = isActive(item.path);

            return (
              <div key={index} className="group">
                {/* MAIN BUTTON */}
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
                >
                  <item.icon size={16} />
                  <span className="text-sm">{item.label}</span>
                </button>
              </div>
            );
          })}

          <div className="group">
            {/* MAIN BUTTON */}
            <button
              onClick={() => toggleSection("aboutUs")}
              className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isaboutUsActive ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span className={`font-semibold text-white/90 text-xs tracking-wide ${isaboutUsActive ? "text-white font-semibold" : "text-white/90"}`}>
                  ABOUT US
                </span>
              </div>

              {expandedSections.aboutUs ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </button>

            {/* Expanded Menu */}
            {expandedSections.aboutUs && (
              <div className="space-y-1 pl-3 m-1">
                {aboutUs.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={index}
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full flex items-center gap-2 p-3 py-3 rounded-lg text-left transition-colors text-xs ${active ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}
                    >
                      <item.icon size={16} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Business Partners Section */}
          <button
            onClick={() => handleNavClick("/dashboard/admin/business-partners")}
            className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isActive("/dashboard/admin/business-partners") ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
          >
            <User size={16} />
            <span className="text-xs">Business Partners</span>
          </button>

          {/* Account Section */}
          <button
            onClick={() => handleNavClick("/dashboard/admin/users")}
            className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isActive("/dashboard/admin/users") ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
          >
            <User size={16} />
            <span className="text-xs">Users</span>
          </button>

          {/* Contact Us Section */}
          <button
            onClick={() => handleNavClick("/dashboard/admin/office-contact")}
            className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isActive("/dashboard/admin/office-contact") ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
          >
            <User size={16} />
            <span className="text-xs">Office Contact</span>
          </button>
        </nav>

        {/* Logout Section */}
        <div className="py-6 border-t border-white/20">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={16} className="group-hover:text-red-200" />
                <span className="font-medium group-hover:text-red-200">Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
      </aside>

      {/* Desktop Sidebar - Visible only on desktop */}
      <aside className="hidden lg:fixed lg:flex lg:flex-col lg:top-0 lg:left-0 lg:h-full lg:bg-gradient-to-b lg:from-yellow-600/90 lg:via-red-800/90 lg:to-red-900/90 lg:text-white lg:shadow-2xl lg:z-50 lg:w-[300px]">
        {/* Scrollable Content */}
        <div
          className="h-full overflow-y-auto overflow-x-hidden py-8 px-8 flex flex-col min-h-full"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#eda909b0 #992f2f",
          }}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-4 py-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Shield className="text-slate-800" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-base">Perpetual Village City</h1>
              <p className="text-xs text-slate-200">Admin Panel</p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1 flex-1 py-2 border-t border-white/20">
            {navigationItems.map((item, index) => {
              const active = isActive(item.path);

              return (
                <div key={index} className="group">
                  <button
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${active ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
                  >
                    <item.icon size={16} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </div>
              );
            })}

            <div className="group">
              <button
                onClick={() => toggleSection("aboutUs")}
                className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isaboutUsActive ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span className={`font-semibold text-white/90 text-xs tracking-wide ${isaboutUsActive ? "text-white font-semibold" : "text-white/90"}`}>
                    ABOUT US
                  </span>
                </div>

                {expandedSections.aboutUs ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
              </button>

              {expandedSections.aboutUs && (
                <div className="space-y-1 pl-3 m-1">
                  {aboutUs.map((item, index) => {
                    const active = isActive(item.path);
                    return (
                      <button
                        key={index}
                        onClick={() => router.push(item.path)}
                        className={`w-full flex items-center gap-2 p-3 py-3 rounded-lg text-left transition-colors text-xs ${active ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}
                      >
                        <item.icon size={16} />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Business Partners Section */}
            <button
              onClick={() => router.push("/dashboard/admin/business-partners")}
              className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isActive("/dashboard/admin/business-partners") ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
            >
              <User size={16} />
              <span className="text-xs">Business Partners</span>
            </button>

            {/* Account Section */}
            <button
              onClick={() => router.push("/dashboard/admin/users")}
              className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isActive("/dashboard/admin/users") ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
            >
              <User size={16} />
              <span className="text-xs">Users</span>
            </button>

            {/* Contact Us Section */}
            <button
              onClick={() => router.push("/dashboard/admin/office-contact")}
              className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-colors text-sm ${isActive("/dashboard/admin/office-contact") ? "bg-white/20 font-semibold shadow-lg" : "hover:bg-white/10"}`}
            >
              <User size={16} />
              <span className="text-xs">Office Contact</span>
            </button>
          </nav>

          {/* Logout Section */}
          <div className="py-6 border-t border-white/20">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut size={16} className="group-hover:text-red-200" />
                  <span className="font-medium group-hover:text-red-200">Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
