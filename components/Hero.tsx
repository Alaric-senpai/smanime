"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlayCircle, Sparkles, TrendingUpIcon } from "lucide-react"
import SearchElement from "./SearchElement"
import { useEffect, useState } from "react"
import { getTopAnime } from "@lightweight-clients/jikan-api-lightweight-client"
import type { Anime } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import AnimeCard from "./AnimeCard"
import { Card, CardContent } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

const Hero = () => {
  const [featuredAnimes, setFeaturedAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchFeaturedAnimes = async () => {
      try {
        const data = await getTopAnime({ limit: 5 })
        if (data.data) {
          setFeaturedAnimes(data.data)
        }
      } catch (error) {
        console.error("Error fetching featured anime:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedAnimes()
  }, [])

  // Cycle through background images
  useEffect(() => {
    if (featuredAnimes.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % featuredAnimes.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [featuredAnimes])

  const currentAnime = featuredAnimes[currentImageIndex]

  return (
    <div className="relative w-full min-h-screen flex pt-10 items-center justify-center overflow-hidden">
      {/* Dynamic Background Images */}
      {currentAnime ? (
        <div className="absolute inset-0">
          <Image
            src={currentAnime.images?.webp?.large_image_url || "/placeholder.svg?height=1080&width=1920"}
            fill
            alt={currentAnime.title || "Featured Anime"}
            className="object-cover object-center transition-opacity duration-1000"
            priority
            sizes="100vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=1080&width=1920"
            }}
          />
        </div>
      ) : (
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          fill
          alt="Anime Background"
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      )}

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/70 to-pink-900/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white p-6 max-w-6xl mx-auto space-y-8">
        {/* Hero Text */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Discover Your Next
            <br />
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Favorite Anime
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Explore a vast collection of anime, from classic masterpieces to the latest hits. Join millions of fans in
            discovering your next obsession.
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto">
          <SearchElement />
        </div>

        {/* Featured Anime Info */}
        {currentAnime && (
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">NOW FEATURING</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{currentAnime.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-2 mb-4">{currentAnime.synopsis}</p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-yellow-400">★</span>
                <span>{currentAnime.score || "N/A"}</span>
              </div>
              <div className="text-sm text-gray-400">{currentAnime.year}</div>
              <div className="text-sm text-gray-400">{currentAnime.type}</div>
            </div>
          </div>
        )}

        {/* Recommended Animes Section */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <TrendingUpIcon className="h-8 w-8 text-purple-400" />
            Trending Now
          </h2>

          {/* {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="bg-black/40 border-white/20">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {featuredAnimes.slice(0, 5).map((anime, index) => (
                <div key={anime.mal_id} className="transform hover:scale-105 transition-transform duration-300">
                  <AnimeCard anime={anime} variant="compact" />
                </div>
              ))}
            </div>
          )} */}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link href="/explore" passHref>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Explore All Anime
            </Button>
          </Link>
          <Link href="/random" passHref>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full backdrop-blur-sm bg-transparent"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Surprise Me
            </Button>
          </Link>
        </div>

        {/* Background Image Indicators */}
        {featuredAnimes.length > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {featuredAnimes.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white w-8" : "bg-white/50"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero
