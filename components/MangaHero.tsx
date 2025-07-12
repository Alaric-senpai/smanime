"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpenIcon, Sparkles, TrendingUpIcon, SearchIcon, StarIcon, CalendarIcon, PenToolIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { getTopManga } from "@lightweight-clients/jikan-api-lightweight-client"
import type { Manga } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import MangaGrid from "./ MangaGrid"

const MangaHero = () => {
  const [featuredMangas, setFeaturedMangas] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchFeaturedMangas = async () => {
      try {
        const data = await getTopManga({ limit: 5 })
        if (data.data) {
          setFeaturedMangas(data.data)
        }
      } catch (error) {
        console.error("Error fetching featured manga:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMangas()
  }, [])

  // Cycle through background images
  useEffect(() => {
    if (featuredMangas.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % featuredMangas.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [featuredMangas])

  const currentManga = featuredMangas[currentImageIndex]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/manga/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="relative w-full min-h-screen flex items-center  pt-10 justify-center overflow-hidden">
      {/* Dynamic Background Images with Parallax Effect */}
      {currentManga ? (
        <div className="absolute inset-0">
          <div className="absolute inset-0 scale-110 transition-transform duration-[6000ms] ease-out">
            <Image
              src={currentManga.images?.webp?.large_image_url || "/placeholder.svg?height=1080&width=1920"}
              fill
              alt={currentManga.title || "Featured Manga"}
              className="object-cover object-center transition-opacity duration-1000"
              priority
              sizes="100vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=1080&width=1920"
              }}
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            fill
            alt="Manga Background"
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Enhanced Multi-layer Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-black/80 to-teal-900/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Floating Paper Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-6 bg-white/10 rounded-sm animate-float-paper"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white p-6 max-w-7xl mx-auto space-y-12">
        {/* Hero Text with Enhanced Typography */}
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight">
              <span className="block bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                Dive Into
              </span>
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                Manga Worlds
              </span>
            </h1>
            <div className="flex items-center justify-center gap-3 text-emerald-300">
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent flex-1 max-w-20" />
              <PenToolIcon className="h-6 w-6 animate-pulse" />
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent flex-1 max-w-20" />
            </div>
          </div>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light">
            Explore captivating manga stories that span every genre imaginable. From epic adventures to intimate
            character studies, find your next great read.
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/20">
              <Input
                type="text"
                placeholder="Search manga, authors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-grow bg-transparent border-0 text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:outline-none pr-20 py-4 text-lg font-medium rounded-full"
              />
              <Button
                onClick={handleSearch}
                className="absolute right-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <SearchIcon className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Manga Spotlight */}
        {currentManga && (
          <Card className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Now Featuring</span>
                </div>
                <div className="h-px bg-gradient-to-r from-emerald-400 to-transparent flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold leading-tight">{currentManga.title}</h3>
                  <p className="text-gray-300 leading-relaxed line-clamp-3">{currentManga.synopsis}</p>

                  <div className="flex flex-wrap items-center gap-4">
                    {currentManga.score && (
                      <div className="flex items-center gap-2 bg-yellow-500/20 rounded-full px-4 py-2">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-bold text-yellow-400">{currentManga.score}</span>
                      </div>
                    )}
                    {currentManga.published?.from && (
                      <div className="flex items-center gap-2 bg-emerald-500/20 rounded-full px-4 py-2">
                        <CalendarIcon className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">
                          {new Date(currentManga.published.from).getFullYear()}
                        </span>
                      </div>
                    )}
                    {currentManga.type && (
                      <Badge variant="outline" className="border-teal-400 text-teal-400 bg-teal-500/10">
                        {currentManga.type}
                      </Badge>
                    )}
                    {currentManga.chapters && (
                      <Badge variant="outline" className="border-cyan-400 text-cyan-400 bg-cyan-500/10">
                        {currentManga.chapters} chapters
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                    <Image
                      src={currentManga.images?.webp?.image_url || "/placeholder.svg?height=300&width=225"}
                      alt={currentManga.title || "Featured Manga"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}



        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Link href="/manga/explore" passHref>
            <Button
              size="lg"
              className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Sparkles className="mr-3 h-6 w-6 group-hover:animate-spin" />
              <span className="relative font-bold">Explore All Manga</span>
            </Button>
          </Link>
          <Link href="/manga/random" passHref>
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-white/30 text-white hover:bg-white/10 text-lg px-10 py-4 rounded-full backdrop-blur-sm bg-white/5 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
            >
              <BookOpenIcon className="mr-3 h-6 w-6 group-hover:animate-pulse" />
              <span className="font-bold">Surprise Me</span>
            </Button>
          </Link>
        </div>

        {/* Background Image Indicators */}
        {featuredMangas.length > 1 && (
          <div className="flex justify-center gap-3 pt-8">
            {featuredMangas.map((_, index) => (
              <button
                key={index}
                className={`h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                  index === currentImageIndex ? "bg-white w-12 shadow-lg" : "bg-white/40 w-3 hover:bg-white/60"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-paper {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.7; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes tilt {
          0%, 50%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
        .animate-float-paper {
          animation: float-paper 7s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
      `}</style>
    </div>
  )
}

export default MangaHero
