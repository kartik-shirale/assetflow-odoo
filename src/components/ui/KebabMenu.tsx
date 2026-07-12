"use client";

import { useState, useRef, useEffect } from "react";

export interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
  destructive?: boolean;
}

interface KebabMenuProps {
  items: MenuItem[];
}

export function KebabMenu({ items }: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setIsOpen(false);
                }
              }}
              disabled={item.disabled}
              title={item.tooltip}
              className={`
                w-full text-left px-4 py-2 text-sm
                ${item.destructive ? "text-red-600 hover:bg-red-50" : "text-gray-900 hover:bg-gray-50"}
                ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${index === 0 ? "rounded-t-lg" : ""}
                ${index === items.length - 1 ? "rounded-b-lg" : "border-b border-gray-100"}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
