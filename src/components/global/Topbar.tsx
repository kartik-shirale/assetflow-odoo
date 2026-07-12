"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import { Bars3Icon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TopbarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  title?: string;
}

export default function Topbar({ user, title = "Dashboard" }: TopbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: "bg-purple-100 text-purple-700",
      ASSET_MANAGER: "bg-blue-100 text-blue-700",
      DEPARTMENT_HEAD: "bg-green-100 text-green-700",
      EMPLOYEE: "bg-gray-100 text-gray-700",
    };
    return badges[role as keyof typeof badges] || badges.EMPLOYEE;
  };

  const getRoleLabel = (role: string) => {
    return role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title and hamburger (for mobile) */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors">
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets, resources..."
              className="w-80 pl-10 pr-16 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                ⌘ K
              </kbd>
            </div>
          </div>

          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}{user.name.split(" ")[1]?.charAt(0).toUpperCase() || ""}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
                <div
                  className={`text-xs font-medium px-2 py-0.5 rounded mt-0.5 inline-block ${getRoleBadge(
                    user.role
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </div>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-3 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <div className="py-2">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Profile Settings
                    </a>
                    <a
                      href="/preferences"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Preferences
                    </a>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
