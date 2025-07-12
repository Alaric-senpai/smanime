"use client"

import { useState, useEffect } from "react"
import AnimeCard from "./AnimeCard"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import type { Anime, AnimeSearch } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import { cn } from "@/lib/utils"

type AnimeGridVariant = "full" | "minimalist" | "featured"

type AnimeGridProps = {
  // Data props
  animes?: Anime[]
  fetchFunction?: (page?: number) => Promise<AnimeSearch>

  // Layout props
  variant?: AnimeGridVariant
  limit?: number
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }

  // State props
  loading?: boolean
  error?: string | null

  // Feature props
  showPagination?: boolean
  showLoadMore?: boolean
  showStats?: boolean
  enableInfiniteScroll?: boolean

  // Card customization
  cardVariant?: "default" | "compact" | "minimal"
  showScore?: boolean
  showType?: boolean
  showYear?: boolean

  // Styling
  className?: string
  gap?: "sm" | "md" | "lg"

  // Callbacks
  onLoadMore?: () => void
  onRetry?: () => void
}

const AnimeGrid = ({
  animes: initialAnimes,
  fetchFunction,
  variant = "full",
  limit,
  columns = { default: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  loading = false,
  error = null,
  showPagination = false,
  showLoadMore = true,
  showStats = true,
  enableInfiniteScroll = false,
  cardVariant = "default",
  showScore = true,
  showType = true,
  showYear = true,
  className,
  gap = "md",
  onLoadMore,
  onRetry,
}: AnimeGridProps) => {
  const [animes, setAnimes] = useState<Anime[]>(initialAnimes || [])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(loading)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentError, setCurrentError] = useState(error)

  // Grid configuration based on variant
  const getGridConfig = () => {
    switch (variant) {
      case "minimalist":
        return {
          columns: { default: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          cardVariant: "minimal" as const,
          gap: "sm" as const,
          limit: limit || 12,
        }
      case "featured":
        return {
          columns: { default: 1, sm: 2, md: 3, lg: 4, xl: 4 },
          cardVariant: "default" as const,
          gap: "lg" as const,
          limit: limit || 8,
        }
      default: // full
        return {
          columns: columns,
          cardVariant: cardVariant,
          gap: gap,
          limit: limit || 20,
        }
    }
  }

  const config = getGridConfig()

  // Generate grid classes
  const getGridClasses = () => {
    const { columns: cols, gap: gridGap } = config
    const gapClasses = {
      sm: "gap-3",
      md: "gap-4 md:gap-6",
      lg: "gap-6 md:gap-8",
    }

    return cn(
      "grid w-full",
      `grid-cols-${cols.default || 1}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`,
      gapClasses[gridGap],
      className,
    )
  }

  // Fetch data function
  const fetchData = async (page = 1, append = false) => {
    if (!fetchFunction) return

    try {
      if (!append) setIsLoading(true)
      else setLoadingMore(true)

      setCurrentError(null)

      const data = await fetchFunction(page)

      if (data.data) {
        const newAnimes = config.limit ? data.data.slice(0, config.limit) : data.data

        if (append) {
          setAnimes((prev) => [...prev, ...newAnimes])
        } else {
          setAnimes(newAnimes)
        }

        setTotalItems(data.pagination?.items?.total || data.data.length)
        setHasNextPage(data.pagination?.has_next_page || false)
        setCurrentPage(page)
      }
    } catch (err) {
      setCurrentError("Failed to load anime data")
      console.error("Error fetching anime:", err)
    } finally {
      setIsLoading(false)
      setLoadingMore(false)
    }
  }

  // Load more handler
  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore()
    } else if (fetchFunction) {
      fetchData(currentPage + 1, true)
    }
  }

  // Retry handler
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else if (fetchFunction) {
      fetchData(1, false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (fetchFunction && !initialAnimes) {
      fetchData(1, false)
    }
  }, [fetchFunction])

  // Update external state
  useEffect(() => {
    if (initialAnimes) {
      const limitedAnimes = config.limit ? initialAnimes.slice(0, config.limit) : initialAnimes
      setAnimes(limitedAnimes)
    }
  }, [initialAnimes, config.limit])

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  useEffect(() => {
    setCurrentError(error)
  }, [error])

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={getGridClasses()}>
      {Array.from({ length: config.limit || 12 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="aspect-[3/4] w-full" />
          <CardContent className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Error state
  if (currentError && animes.length === 0) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{currentError}</span>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Loading state
  if (isLoading && animes.length === 0) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {showStats && animes.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {animes.length} {totalItems > 0 && `of ${totalItems.toLocaleString()}`} anime
        </div>
      )}

      {/* Grid */}
      <div className={getGridClasses()}>
        {animes.map((anime, index) => (
          <AnimeCard
            key={`${anime.mal_id}-${index}`}
            anime={anime}
            variant={config.cardVariant}
            showScore={showScore}
            showType={showType}
            showYear={showYear}
          />
        ))}
      </div>

      {/* Load More */}
      {showLoadMore && hasNextPage && animes.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button onClick={handleLoadMore} disabled={loadingMore} size="lg" className="min-w-32">
            {loadingMore ? (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {/* No results */}
      {animes.length === 0 && !isLoading && !currentError && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No anime found</p>
        </div>
      )}
    </div>
  )
}

export default AnimeGrid
