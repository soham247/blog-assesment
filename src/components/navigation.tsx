'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      exact: true,
    },
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
  ];

  return (
    <nav className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-4 text-lg font-bold text-primary">
              DevBlog
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Button variant="ghost" size="sm">
              <span className="sr-only">Open menu</span>
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}