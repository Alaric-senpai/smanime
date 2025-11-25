"use client"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import type { Anime } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import { Badge } from "./ui/badge"
import { StarIcon, PlayIcon, CalendarIcon, TvIcon, EyeIcon, HeartIcon, BookmarkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "./ui/button"

export type AnimeCardProps = {
  anime: Anime
  variant?: "default" | "compact" | "minimal" | "featured"
  showScore?: boolean
  showType?: boolean
  showYear?: boolean
  showEpisodes?: boolean
  showQuickActions?: boolean
  className?: string
}

const AnimeCard = ({
  anime,
  variant = "default",
  showScore = true,
  showType = true,
  showYear = true,
  showEpisodes = true,
  showQuickActions = false,
  className,
}: AnimeCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatScore = (score: number | null) => {
    return score ? score.toFixed(1) : "N/A"
  }

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

  if (variant === "minimal") {
    return (
      <Link href={`/anime/${anime.mal_id}`}>
        <Card
          className={cn(
            "group relative overflow-hidden rounded-xl h-full transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20",
            "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
            "border-0 shadow-lg hover:shadow-xl p-0",
            className,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={
                imageError
                  ? "/placeholder.svg?height=400&width=300"
                  : anime.images?.webp?.image_url || "/placeholder.svg?height=400&width=300"
              }
              alt={anime.title || "Anime cover"}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Score Badge */}
            {showScore && anime.score && (
              <div className="absolute top-3 left-3 transform transition-all duration-300 group-hover:scale-110">
                <Badge className="bg-yellow-500/95 text-black font-bold text-xs shadow-lg">
                  <StarIcon className="h-3 w-3 mr-1 fill-current" />
                  {formatScore(anime.score)}
                </Badge>
              </div>
            )}

            {/* Play Button */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-500",
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
              )}
            >
              <div className="rounded-full bg-white/20 backdrop-blur-md p-4 border border-white/30 shadow-2xl">
                <PlayIcon className="h-8 w-8 text-white fill-current" />
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
              {anime.title}
            </h3>
            {showYear && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {anime.year || "TBA"}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === "compact") {
    return (
      <Link href={`/anime/${anime.mal_id}`}>
        <Card
          className={cn(
            "group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20",
            "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
            "border-0 shadow-lg hover:shadow-xl",
            className,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={
                imageError
                  ? "/placeholder.svg?height=400&width=300"
                  : anime.images?.webp?.image_url || "/placeholder.svg?height=400&width=300"
              }
              alt={anime.title || "Anime cover"}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Score Badge */}
            {showScore && anime.score && (
              <div className="absolute top-3 left-3 transform transition-all duration-300 group-hover:scale-110">
                <Badge className="bg-yellow-500/95 text-black font-bold text-xs shadow-lg">
                  <StarIcon className="h-3 w-3 mr-1 fill-current" />
                  {formatScore(anime.score)}
                </Badge>
              </div>
            )}

            {/* Type Badge */}
            {showType && anime.type && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                  {anime.type}
                </Badge>
              </div>
            )}

            {/* Play Button */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-500",
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
              )}
            >
              <div className="rounded-full bg-white/20 backdrop-blur-md p-4 border border-white/30 shadow-2xl">
                <PlayIcon className="h-8 w-8 text-white fill-current" />
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="font-bold text-sm line-clamp-2 mb-3 group-hover:text-purple-600 transition-colors">
              {anime.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {showYear && anime.year && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{anime.year}</span>
                </div>
              )}
              {showEpisodes && anime.episodes && (
                <div className="flex items-center gap-1">
                  <TvIcon className="h-3 w-3" />
                  <span>{anime.episodes} eps</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === "featured") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20",
          "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
          "border-0 shadow-xl",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={
              imageError
                ? "/placeholder.svg?height=400&width=600"
                : anime.images?.webp?.large_image_url || "/placeholder.svg?height=400&width=600"
            }
            alt={anime.title || "Anime cover"}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Score Badge */}
          {showScore && anime.score && (
            <div className="absolute top-4 left-4 transform transition-all duration-300 group-hover:scale-110">
              <Badge className="bg-yellow-500/95 text-black font-bold shadow-lg">
                <StarIcon className="h-4 w-4 mr-2 fill-current" />
                {formatScore(anime.score)}
              </Badge>
            </div>
          )}

          {/* Quick Actions */}
          {showQuickActions && (
            <div
              className={cn(
                "absolute top-4 right-4 flex gap-2 transition-all duration-500",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
              )}
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/20 backdrop-blur-md border-white/30"
              >
                <HeartIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/20 backdrop-blur-md border-white/30"
              >
                <BookmarkIcon className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Link href={`/anime/${anime.mal_id}`}>
              <h3 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                {anime.title}
              </h3>
            </Link>
            <p className="text-gray-300 text-sm line-clamp-2 mb-4">{anime.synopsis}</p>

            <div className="flex items-center gap-4 text-sm">
              {showYear && anime.year && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{anime.year}</span>
                </div>
              )}
              {showType && anime.type && (
                <Badge variant="outline" className="border-white/30 text-white">
                  {anime.type}
                </Badge>
              )}
              {showEpisodes && anime.episodes && (
                <div className="flex items-center gap-1">
                  <TvIcon className="h-4 w-4" />
                  <span>{anime.episodes} episodes</span>
                </div>
              )}
            </div>
          </div>

          {/* Play Button */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-500",
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
            )}
          >
            <Link href={`/anime/${anime.mal_id}`}>
              <div className="rounded-full bg-white/20 backdrop-blur-md p-6 border border-white/30 shadow-2xl hover:bg-white/30 transition-colors">
                <PlayIcon className="h-12 w-12 text-white fill-current" />
              </div>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  // Default variant
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <Card
        className={cn(
          "group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20",
          "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
          "border-0 shadow-lg hover:shadow-xl",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={
              imageError
                ? "/placeholder.svg?height=400&width=300"
                : anime.images?.webp?.image_url || "/placeholder.svg?height=400&width=300"
            }
            alt={anime.title || "Anime cover"}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Score Badge */}
          {showScore && anime.score && (
            <div className="absolute top-4 left-4 transform transition-all duration-300 group-hover:scale-110">
              <Badge className="bg-yellow-500/95 text-black font-bold shadow-lg">
                <StarIcon className="h-4 w-4 mr-2 fill-current" />
                {formatScore(anime.score)}
              </Badge>
            </div>
          )}

          {/* Quick Actions */}
          {showQuickActions && (
            <div
              className={cn(
                "absolute top-4 right-4 flex flex-col gap-2 transition-all duration-500",
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
              )}
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/20 backdrop-blur-md border-white/30 p-2"
              >
                <HeartIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/20 backdrop-blur-md border-white/30 p-2"
              >
                <BookmarkIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/20 backdrop-blur-md border-white/30 p-2"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Play Button */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-500",
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
            )}
          >
            <div className="rounded-full bg-white/20 backdrop-blur-md p-6 border border-white/30 shadow-2xl">
              <PlayIcon className="h-12 w-12 text-white fill-current" />
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-purple-600 transition-colors mb-3">
            {anime.title || "Untitled"}
          </h3>

          <div className="space-y-3">
            {/* Metadata Row */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                {showYear && anime.year && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{anime.year}</span>
                  </div>
                )}
                {showType && anime.type && (
                  <Badge variant="secondary" className="text-xs">
                    {anime.type}
                  </Badge>
                )}
              </div>
            </div>

            {/* Episodes and Duration */}
            {showEpisodes && anime.episodes && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TvIcon className="h-3 w-3" />
                  <span>{anime.episodes} episodes</span>
                </div>
                {anime.duration && <span>{anime.duration}</span>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default AnimeCard
