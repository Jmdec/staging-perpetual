"use client"

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Grid3x3, 
  Newspaper, 
  AlertTriangle, 
  User,
  Menu,
  X,
  FileText,
  GraduationCap,
  Rocket,
  Building2,
  MapPin,
  Bell,
  LogOut,
  ChevronUp,
   File,
} from 'lucide-react';

export default function MemberBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [showQuickAccess, setShowQuickAccess] = useState(false);

  const mainNavigationItems = [
    { icon: Home, label: 'Home', path: '/dashboard/member' },
    { icon: Grid3x3, label: 'Services', path: '/dashboard/member/services' },
    { icon: AlertTriangle, label: 'Emergency', path: '/dashboard/member/emergency' },
    { icon: User, label: 'Account', path: '/dashboard/member/account/applications' },
  ];

  const quickAccessItems = [
  { icon: Newspaper, label: 'News', path: '/dashboard/member/news' },
  { icon: FileText, label: 'Member Guide', path: '/dashboard/member/member-guide' },
  { icon: GraduationCap, label: 'Students', path: '/dashboard/member/students' },
  { icon: Rocket, label: 'Startup', path: '/dashboard/member/startup' },
  { icon: Building2, label: 'Business', path: '/dashboard/member/business' },
  { icon: MapPin, label: 'City Map', path: '/dashboard/member/city-map' },
  { icon: Bell, label: 'Alerts', path: '/dashboard/member/alerts' },

  // ✅ Newly added items
  { icon: File, label: 'Certificate of Indigency', path: '/dashboard/member/services/certificate-of-indigency' },
  { icon: File, label: 'Residency Certificate', path: '/dashboard/member/services/residency-certificate' },
    { icon: File, label: 'Good Moral Certificate', path: '/dashboard/member/services/good-moral' },
       { icon: File, label: 'Barangay Blotter', path: '/dashboard/member/services/barangay-blotter' },
];


  const isActive = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowQuickAccess(false);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Quick Access Expandable Panel */}
      <div 
        className={`bg-linear-to-br from-emerald-50 to-orange-50 border-t border-gray-200 shadow-lg transition-all duration-300 overflow-hidden ${
          showQuickAccess ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 overflow-y-auto" style={{ maxHeight: '24rem' }}>
          {/* Quick Access Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {quickAccessItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                    active 
                      ? 'bg-linear-to-br from-emerald-500 to-orange-500 shadow-md' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <item.icon 
                    size={20} 
                    className={active ? 'text-white' : 'text-gray-700'}
                    strokeWidth={2}
                  />
                  <span className={`text-xs font-medium text-center ${
                    active ? 'text-white' : 'text-gray-700'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              // Add your logout logic here
              console.log('Logout clicked');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white shadow-md"
          >
            <LogOut size={18} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Bottom Navigation Bar */}
      <nav className="bg-white border-t border-gray-200 shadow-lg">
        {/* Toggle Button for Quick Access */}
        {showQuickAccess && (
          <button
            onClick={() => setShowQuickAccess(false)}
            className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <ChevronUp size={18} />
            <span className="text-xs font-medium">Hide Quick Access</span>
          </button>
        )}

        <div className="flex items-center justify-around">
          {mainNavigationItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <button
                key={index}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors flex-1 ${
                  active ? 'text-orange-600' : 'text-gray-600'
                }`}
              >
                <item.icon 
                  size={22} 
                  className={active ? 'text-orange-600' : 'text-gray-600'} 
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-xs font-medium ${active ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
          
          {/* Menu Toggle Button */}
          <button
            onClick={() => setShowQuickAccess(!showQuickAccess)}
            className="flex flex-col items-center gap-1 px-3 py-2 transition-colors flex-1 text-gray-600 hover:text-orange-600"
          >
            {showQuickAccess ? (
              <>
                <X 
                  size={22} 
                  className="text-orange-600" 
                  strokeWidth={2.5}
                />
                <span className="text-xs font-semibold text-orange-600">
                  Close
                </span>
              </>
            ) : (
              <>
                <Menu 
                  size={22} 
                  strokeWidth={2}
                />
                <span className="text-xs font-medium">
                  Menu
                </span>
              </>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}