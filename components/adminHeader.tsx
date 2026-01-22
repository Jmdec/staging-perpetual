"use client"

import React from 'react';
import { Shield, Bell, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

export default function AdminHeader() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
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
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block bg-white shadow-sm sticky top-0 z-30">
        {/* You can add desktop header content here if needed */}
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-sm">Perpetual Village City</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}