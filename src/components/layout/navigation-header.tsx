'use client'

import Link from 'next/link'
import { NavigationDropdown } from '@/components/ui/navigation-dropdown'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Briefcase, MapPin, Heart } from 'lucide-react'

interface NavigationHeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export function NavigationHeader({ user }: NavigationHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">Job Finders</h1>
              <p className="text-xs text-muted-foreground">South Africa</p>
            </div>
          </Link>

          {/* Location Indicator */}
          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>South Africa</span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-4">
          {/* Quick Stats for Authenticated Users */}
          {user && (
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>2,451 Jobs</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span>12 Saved</span>
              </div>
            </div>
          )}

          {/* Navigation Dropdown */}
          <NavigationDropdown user={user} />
        </div>
      </div>
    </header>
  )
}