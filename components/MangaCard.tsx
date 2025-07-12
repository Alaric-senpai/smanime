"use client"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import type { Manga } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import { Badge } from "./ui/badge"
import { StarIcon, BookOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type MangaCardProps = {
  manga: Manga
  variant?: "default" | "compact" | "minimal"
  showScore?: boolean
  showType?: boolean
  showYear?: boolean
  showStatus?: boolean
  className?: string
}

const MangaCard = ({
  manga,
  variant = "default",
  showScore = true,
  showType = true,
  showYear = true,
  showStatus = true,
  className,
}: MangaCardProps) => {
  const [imageError, setImageError] = useState(false)

  const formatScore = (score: number | null) => {
    return score ? score.toFixed(1) : "N/A"
  }

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

  if (variant === "minimal") {
    return (
      <Link href={`/manga/${manga.mal_id}`}>
        <Card
          className={cn(
            "group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg",
            className,
          )}
        >
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={
                imageError
                  ? "/placeholder.svg?height=400&width=300"
                  : manga.images?.webp?.image_url || "/placeholder.svg?height=400&width=300"
              }
              alt={manga.title || "Manga cover"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Read button on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                <BookOpenIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <CardContent className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{manga.title}</h3>
            {showYear && (
              <p className="text-xs text-muted-foreground">
                {manga.published?.from ? new Date(manga.published.from).getFullYear() : "TBA"}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === "compact") {
    return (
      <Link href={`/manga/${manga.mal_id}`}>
        <Card
          className={cn(
            "group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
            className,
          )}
        >
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={
                imageError
                  ? "/placeholder.svg?height=400&width=300"
                  : manga.images?.webp?.image_url || "/placeholder.svg?height=400&width=300"
              }
              alt={manga.title || "Manga cover"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />

            {/* Score badge */}
            {showScore && manga.score && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-yellow-500/90 text-black font-semibold text-xs">
                  <StarIcon className="h-3 w-3 mr-1 fill-current" />
                  {formatScore(manga.score)}
                </Badge>
              </div>
            )}

            {/* Status badge */}
            {showStatus && manga.status && (
              <div className="absolute top-2 right-2">
                <Badge className={cn("text-white text-xs", getStatusColor(manga.status))}>{manga.status}</Badge>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <CardContent className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 mb-2">{manga.title}</h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {showYear && <span>{manga.published?.from ? new Date(manga.published.from).getFullYear() : "TBA"}</span>}
              {showType && manga.type && <span>{manga.type}</span>}
            </div>
            {manga.chapters && <div className="text-xs text-muted-foreground mt-1">{manga.chapters} chapters</div>}
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/manga/${manga.mal_id}`}>
      <Card
        className={cn(
          "group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
          className,
        )}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={
              imageError
                ? "/placeholder.svg?height=400&width=300"
                : manga.images?.webp?.image_url || "/placeholder.svg?height=400&width=300"
            }
            alt={manga.title || "Manga cover"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Score badge */}
          {showScore && manga.score && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-yellow-500/90 text-black font-bold">
                <StarIcon className="h-3 w-3 mr-1 fill-current" />
                {formatScore(manga.score)}
              </Badge>
            </div>
          )}

          {/* Status badge */}
          {showStatus && manga.status && (
            <div className="absolute top-3 right-3">
              <Badge className={cn("text-white", getStatusColor(manga.status))}>{manga.status}</Badge>
            </div>
          )}

          {/* Read button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm border border-white/30">
              <BookOpenIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {manga.title || "Untitled"}
          </h3>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-3">
              {showYear && manga.published?.from && <span>{new Date(manga.published.from).getFullYear()}</span>}
              {showType && manga.type && (
                <Badge variant="secondary" className="text-xs">
                  {manga.type}
                </Badge>
              )}
            </div>
          </div>

          {/* Chapters and Volumes info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {manga.chapters && <span>{manga.chapters} chapters</span>}
            {manga.volumes && <span>{manga.volumes} volumes</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default MangaCard
