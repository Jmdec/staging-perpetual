"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';

export default function MemberHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block bg-white shadow-sm sticky top-0 z-30">
       
        
          
 
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-600 to-orange-500 flex items-center justify-center">
              <span className="text-lg font-bold text-white">CC</span>
            </div>
            <div>
              <h1 className="font-bold text-sm">Perpetual Village City</h1>
              <p className="text-xs text-gray-500">Connect</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}