"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { MenuIcon, HomeIcon, CompassIcon, BookOpenIcon, ShuffleIcon, SearchIcon, UserIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "./ui/sheet"

const navitems = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Explore", href: "/explore", icon: CompassIcon },
  { name: "Manga", href: "/manga", icon: BookOpenIcon },
  { name: "Random", href: "/random", icon: ShuffleIcon },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => pathname === href

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        "py-3 px-4 md:px-6",
        scrolled ? "bg-black/90 backdrop-blur-lg shadow-2xl border-b border-white/10" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              width={40}
              height={40}
              alt="SmAnime Logo"
              src="/images/logo-full.png"
              className="rounded-full ring-2 ring-purple-500/50 group-hover:ring-purple-400 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 group-hover:from-purple-400/30 group-hover:to-pink-400/30 transition-all duration-300" />
          </div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            SmAnime
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navitems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-white hover:text-purple-300 hover:bg-white/10 transition-all duration-300 rounded-full px-4 py-2",
                    "flex items-center gap-2 font-medium",
                    isActive(item.href) &&
                      (scrolled
                        ? "bg-purple-600/80 text-white hover:bg-purple-600 hover:text-white"
                        : "bg-white/20 text-white hover:bg-white/30"),
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-white hover:text-purple-300 hover:bg-white/10 rounded-full">
            <SearchIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:text-purple-300 hover:bg-white/10 rounded-full">
            <UserIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full p-2">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-black/95 backdrop-blur-lg border-white/10">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3 text-white">
                  <Image
                    width={32}
                    height={32}
                    alt="SmAnime Logo"
                    src="/placeholder.svg?height=32&width=32"
                    className="rounded-full"
                  />
                  SmAnime
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-8">
                {/* Navigation Links */}
                <div className="space-y-2">
                  {navitems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-white hover:text-purple-300 hover:bg-white/10 rounded-lg p-3 h-auto",
                            "flex items-center gap-3 font-medium text-base",
                            isActive(item.href) && "bg-purple-600/80 text-white hover:bg-purple-600",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.name}
                        </Button>
                      </Link>
                    )
                  })}
                </div>

                {/* Divider */}
                <div className="border-t border-white/20 my-4" />

                {/* Additional Actions */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-purple-300 hover:bg-white/10 rounded-lg p-3 h-auto flex items-center gap-3"
                  >
                    <SearchIcon className="h-5 w-5" />
                    Search
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-purple-300 hover:bg-white/10 rounded-lg p-3 h-auto flex items-center gap-3"
                  >
                    <UserIcon className="h-5 w-5" />
                    Profile
                  </Button>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-8 text-center text-sm text-gray-400">
                  <p>Discover amazing anime</p>
                  <p className="text-xs mt-1">Powered by Jikan API</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
