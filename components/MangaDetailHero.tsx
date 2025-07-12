"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import type { Manga } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import {
  BookOpenIcon,
  BookmarkIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  CalendarIcon,
  FileTextIcon,
  UsersIcon,
  TrendingUpIcon,
  PenToolIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type MangaDetailHeroProps = {
  manga: Manga
  className?: string
}

const MangaDetailHero = ({ manga, className }: MangaDetailHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [backgroundError, setBackgroundError] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "publishing":
        return "bg-green-500"
      case "finished":
        return "bg-blue-500"
      case "on hiatus":
        return "bg-yellow-500"
      case "discontinued":
        return "bg-red-500"
      case "not yet published":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className={cn("relative w-full min-h-screen flex items-end overflow-hidden pt-10", className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src={
              backgroundError
                ? "/placeholder.svg?height=1080&width=1920"
                : manga.images?.webp?.large_image_url || "/placeholder.svg?height=1080&width=1920"
            }
            alt={manga.title || "Manga background"}
            fill
            className={cn(
              "object-cover object-center transition-all duration-1000",
              imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0",
            )}
            priority
            sizes="100vw"
            onLoad={() => setImageLoaded(true)}
            onError={() => setBackgroundError(true)}
          />
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Poster */}
            <div className="lg:col-span-3">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <Card className="relative overflow-hidden rounded-xl shadow-2xl">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={manga.images?.webp?.large_image_url || "/placeholder.svg?height=600&width=450"}
                      alt={manga.title || "Manga poster"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {/* Score Badge */}
                    {manga.score && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500/95 text-black font-bold text-lg px-3 py-2 shadow-lg">
                          <StarIcon className="h-5 w-5 mr-2 fill-current" />
                          {manga.score}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6 text-white">
              {/* Title Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                    <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                      {manga.title}
                    </span>
                  </h1>
                  {manga.title_english && manga.title_english !== manga.title && (
                    <h2 className="text-xl md:text-2xl text-gray-300 font-light">{manga.title_english}</h2>
                  )}
                </div>

                {/* Status and Type */}
                <div className="flex flex-wrap items-center gap-3">
                  {manga.status && (
                    <Badge className={cn("text-white font-semibold px-3 py-1", getStatusColor(manga.status))}>
                      {manga.status}
                    </Badge>
                  )}
                  {manga.type && (
                    <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm">
                      {manga.type}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {manga.score && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                      <StarIcon className="h-5 w-5 fill-current" />
                      <span className="text-2xl font-bold">{manga.score}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {manga.scored_by ? `${manga.scored_by.toLocaleString()} users` : "Score"}
                    </p>
                  </div>
                )}

                {manga.rank && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <TrendingUpIcon className="h-5 w-5" />
                      <span className="text-2xl font-bold">#{manga.rank}</span>
                    </div>
                    <p className="text-xs text-gray-400">Ranked</p>
                  </div>
                )}

                {manga.members && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-teal-400 mb-1">
                      <UsersIcon className="h-5 w-5" />
                      <span className="text-2xl font-bold">{(manga.members / 1000).toFixed(0)}K</span>
                    </div>
                    <p className="text-xs text-gray-400">Members</p>
                  </div>
                )}

                {manga.chapters && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                      <FileTextIcon className="h-5 w-5" />
                      <span className="text-2xl font-bold">{manga.chapters}</span>
                    </div>
                    <p className="text-xs text-gray-400">Chapters</p>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              {manga.synopsis && (
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <p className="text-gray-200 leading-relaxed line-clamp-4 text-lg">{manga.synopsis}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  {manga.published?.from && (
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Published:</span>
                      <span className="text-white">{formatDate(manga.published.from)}</span>
                    </div>
                  )}
                  {manga.volumes && (
                    <div className="flex items-center gap-3">
                      <BookOpenIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Volumes:</span>
                      <span className="text-white">{manga.volumes}</span>
                    </div>
                  )}
                  {manga.authors && manga.authors.length > 0 && (
                    <div className="flex items-center gap-3">
                      <PenToolIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Author:</span>
                      <span className="text-white">{manga.authors[0].name}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {manga.genres && manga.genres.length > 0 && (
                  <div>
                    <p className="text-gray-300 mb-2">Genres:</p>
                    <div className="flex flex-wrap gap-2">
                      {manga.genres.slice(0, 6).map((genre) => (
                        <Badge
                          key={genre.mal_id}
                          variant="outline"
                          className="border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          {genre.name}
                        </Badge>
                      ))}
                      {manga.genres.length > 6 && (
                        <Badge variant="outline" className="border-white/20 text-gray-400 bg-white/5">
                          +{manga.genres.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <BookOpenIcon className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Read Now
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm bg-white/5 hover:border-white/50 transition-all duration-300"
                >
                  <BookmarkIcon className="h-5 w-5 mr-2" />
                  Add to List
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm bg-white/5 hover:border-white/50 transition-all duration-300"
                >
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Favorite
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm bg-white/5 hover:border-white/50 transition-all duration-300"
                >
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MangaDetailHero

