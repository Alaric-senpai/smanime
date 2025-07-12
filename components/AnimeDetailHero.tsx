"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import type { Anime, AnimeFull } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import {
  PlayIcon,
  BookmarkIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  CalendarIcon,
  TvIcon,
  ClockIcon,
  UsersIcon,
  TrendingUpIcon,
  ExternalLinkIcon,
  VideotapeIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import TrailerDialog from "./TrailerDialog"

type AnimeDetailHeroProps = {
  anime: AnimeFull
  className?: string
}

const AnimeDetailHero = ({ anime, className }: AnimeDetailHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [backgroundError, setBackgroundError] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "airing":
        return "bg-green-500"
      case "finished airing":
        return "bg-blue-500"
      case "not yet aired":
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

  const formatDuration = (duration: string) => {
    if (!duration) return null
    return duration.replace("per ep", "").trim()
  }

  return (
    <div className={cn("relative w-full min-h-screen pt-10 flex items-end overflow-hidden", className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src={
              backgroundError
                ? "/images/tanjiro.png"
                : anime.images?.webp?.large_image_url || "/placeholder.svg?height=1080&width=1920"
            }
            alt={anime.title || "Anime background"}
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
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Poster */}
            <div className="lg:col-span-3">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <Card className="relative overflow-hidden rounded-xl shadow-2xl p-0">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={anime.images?.jpg?.large_image_url || "/images/tanjiro.png"}
                      alt={anime.title || "Anime poster"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {/* Score Badge */}
                    {anime.score && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500/95 text-black font-bold text-lg px-3 py-2 shadow-lg">
                          <StarIcon className="h-5 w-5 mr-2 fill-current" />
                          {anime.score}
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
                    <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                      {anime.title}
                    </span>
                  </h1>
                  {anime.title_english && anime.title_english !== anime.title && (
                    <h2 className="text-xl md:text-2xl text-gray-300 font-light">{anime.title_english}</h2>
                  )}
                </div>

                {/* Status and Type */}
                <div className="flex flex-wrap items-center gap-3">
                  {anime.status && (
                    <Badge className={cn("text-white font-semibold px-3 py-1", getStatusColor(anime.status))}>
                      {anime.status}
                    </Badge>
                  )}
                  {anime.type && (
                    <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm">
                      {anime.type}
                    </Badge>
                  )}
                  {anime.rating && (
                    <Badge variant="outline" className="border-purple-400 text-purple-300 bg-purple-500/20">
                      {anime.rating}
                    </Badge>
                  )}

                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {anime.score && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                      <StarIcon className="h-5 w-5 fill-current" />
                      <span className="text-2xl font-bold">{anime.score}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {anime.scored_by ? `${anime.scored_by.toLocaleString()} users` : "Score"}
                    </p>
                  </div>
                )}

                {anime.rank && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                      <TrendingUpIcon className="h-5 w-5" />
                      <span className="text-2xl font-bold">#{anime.rank}</span>
                    </div>
                    <p className="text-xs text-gray-400">Ranked</p>
                  </div>
                )}

                {anime.members && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <UsersIcon className="h-5 w-5" />
                      <span className="text-2xl font-bold">{(anime.members / 1000).toFixed(0)}K</span>
                    </div>
                    <p className="text-xs text-gray-400">Members</p>
                  </div>
                )}

                {anime.episodes && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-green-400 mb-1">
                      <TvIcon className="h-5 w-5" />
                      <span className="text-2xl font-bold">{anime.episodes}</span>
                    </div>
                    <p className="text-xs text-gray-400">Episodes</p>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              {anime.synopsis && (
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <p className="text-gray-200 leading-relaxed line-clamp-4 text-lg">{anime.synopsis}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  {anime.aired?.from && (
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Aired:</span>
                      <span className="text-white">{formatDate(anime.aired.from)}</span>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Duration:</span>
                      <span className="text-white">{formatDuration(anime.duration)}</span>
                    </div>
                  )}
                  {anime.studios && anime.studios.length > 0 && (
                    <div className="flex items-center gap-3">
                      <ExternalLinkIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Studio:</span>
                      <span className="text-white">{anime.studios[0].name}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {anime.genres && anime.genres.length > 0 && (
                  <div>
                    <p className="text-gray-300 mb-2">Genres:</p>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.slice(0, 6).map((genre) => (
                        <Badge
                          key={genre.mal_id}
                          variant="outline"
                          className="border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          {genre.name}
                        </Badge>
                      ))}
                      {anime.genres.length > 6 && (
                        <Badge variant="outline" className="border-white/20 text-gray-400 bg-white/5">
                          +{anime.genres.length - 6} more
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
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <PlayIcon className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Watch Now
                </Button>

                <TrailerDialog anime={anime} />

                

                {/* <Button
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
                </Button> */}



                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm bg-white/5 hover:border-white/50 transition-all duration-300"
                >
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
                {anime.streaming && anime.streaming.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>
                    {anime.streaming.map((stream, key) => (
                    <Button key={key} variant={'link'}>
                        <a
                            href={stream.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-sm flex flex-row gap-4 text-purple-400 hover:underline underline-offset-2 transition-all duration-150'
                        >
                            <ExternalLinkIcon />
                            Watch on {stream.name}
                        </a>

                    </Button>
                    ))}
                </div>
                )}

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AnimeDetailHero
