"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import AnimeCard from "@/components/AnimeCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRandomAnime, getAnimeSearch } from "@lightweight-clients/jikan-api-lightweight-client"
import type { Anime } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import {
  ShuffleIcon,
  Dice1Icon as DiceIcon,
  SparklesIcon,
  RefreshCwIcon,
  HeartIcon,
  BookmarkIcon,
  InfoIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

const RandomPage = () => {
  const [currentAnime, setCurrentAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<Anime[]>([])
  const [preferences, setPreferences] = useState({
    type: "all",
    genre: "all",
    minScore: "0",
    status: "all",
  })

  const genres = [
    { value: "1", label: "Action" },
    { value: "2", label: "Adventure" },
    { value: "4", label: "Comedy" },
    { value: "8", label: "Drama" },
    { value: "10", label: "Fantasy" },
    { value: "22", label: "Romance" },
    { value: "24", label: "Sci-Fi" },
    { value: "36", label: "Slice of Life" },
  ]

  const fetchRandomAnime = async () => {
    setLoading(true)
    try {
      // Get random anime based on preferences
      const searchParams: any = {
        order_by: "score",
        sort: "desc",
        limit: 1,
        page: Math.floor(Math.random() * 50) + 1, // Random page
      }

      if (preferences.type !== "all") searchParams.type = preferences.type
      if (preferences.genre !== "all") searchParams.genres = preferences.genre
      if (preferences.status !== "all") searchParams.status = preferences.status
      if (preferences.minScore !== "0") searchParams.min_score = Number.parseFloat(preferences.minScore)

      // Use search with random parameters or fallback to random endpoint
      let data
      try {
        data = await getAnimeSearch(searchParams)
        if (data.data && data.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.data.length)
          const anime = data.data[randomIndex]
          setCurrentAnime(anime)
          setHistory((prev) => [anime, ...prev.slice(0, 9)]) // Keep last 10
        } else {
          // Fallback to random anime endpoint
          const randomData = await getRandomAnime()
          if (randomData.data) {
            setCurrentAnime(randomData.data)
            // @ts-expect-error
            setHistory((prev) => [randomData.data, ...prev.slice(0, 9)])
          }
        }
      } catch (error) {
        // Fallback to random anime endpoint
        const randomData = await getRandomAnime()
        if (randomData.data) {
          setCurrentAnime(randomData.data)
          setHistory((prev) => [randomData.data, ...prev.slice(0, 9)])
        }
      }
    } catch (error) {
      console.error("Error fetching random anime:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRandomAnime()
  }, [])

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Random Anime Discovery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let fate decide your next anime adventure! Discover hidden gems and popular series with our random picker.
          </p>
        </div>

        {/* Preferences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              Customize Your Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={preferences.type} onValueChange={(value) => handlePreferenceChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Type</SelectItem>
                    <SelectItem value="tv">TV Series</SelectItem>
                    <SelectItem value="movie">Movies</SelectItem>
                    <SelectItem value="ova">OVA</SelectItem>
                    <SelectItem value="special">Specials</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Genre</label>
                <Select value={preferences.genre} onValueChange={(value) => handlePreferenceChange("genre", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Genre</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Min Score</label>
                <Select
                  value={preferences.minScore}
                  onValueChange={(value) => handlePreferenceChange("minScore", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Score</SelectItem>
                    <SelectItem value="6">6.0+</SelectItem>
                    <SelectItem value="7">7.0+</SelectItem>
                    <SelectItem value="8">8.0+</SelectItem>
                    <SelectItem value="9">9.0+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={preferences.status} onValueChange={(value) => handlePreferenceChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Status</SelectItem>
                    <SelectItem value="airing">Currently Airing</SelectItem>
                    <SelectItem value="complete">Completed</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={fetchRandomAnime} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <RefreshCwIcon className="h-5 w-5 mr-2 animate-spin" />
                  Finding Your Next Anime...
                </>
              ) : (
                <>
                  <DiceIcon className="h-5 w-5 mr-2" />
                  Roll the Dice!
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Current Random Anime */}
        {loading ? (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : currentAnime ? (
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Anime Image */}
                <div className="lg:col-span-1 relative">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={currentAnime.images?.webp?.large_image_url || "/placeholder.svg?height=600&width=450"}
                      alt={currentAnime.title || "Anime"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Score Badge */}
                    {currentAnime.score && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500/90 text-black font-bold text-lg px-3 py-1">
                          ★ {currentAnime.score}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Anime Details */}
                <div className="lg:col-span-2 p-8">
                  <div className="space-y-6">
                    {/* Title and Basic Info */}
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-2">{currentAnime.title}</h2>
                      {currentAnime.title_english && currentAnime.title_english !== currentAnime.title && (
                        <p className="text-xl text-muted-foreground mb-4">{currentAnime.title_english}</p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentAnime.type && <Badge variant="secondary">{currentAnime.type}</Badge>}
                        {currentAnime.status && (
                          <Badge className={`text-white ${getStatusColor(currentAnime.status)}`}>
                            {currentAnime.status}
                          </Badge>
                        )}
                        {currentAnime.year && <Badge variant="outline">{currentAnime.year}</Badge>}
                        {currentAnime.episodes && <Badge variant="outline">{currentAnime.episodes} episodes</Badge>}
                      </div>
                    </div>

                    {/* Synopsis */}
                    {currentAnime.synopsis && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-4">{currentAnime.synopsis}</p>
                      </div>
                    )}

                    {/* Genres */}
                    {currentAnime.genres && currentAnime.genres.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {currentAnime.genres.map((genre) => (
                            <Badge key={genre.mal_id} variant="outline">
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <Link href={`/anime/${currentAnime.mal_id}`}>
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <InfoIcon className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" size="lg">
                        <BookmarkIcon className="h-4 w-4 mr-2" />
                        Add to Watchlist
                      </Button>
                      <Button variant="outline" size="lg">
                        <HeartIcon className="h-4 w-4 mr-2" />
                        Like
                      </Button>
                      <Button variant="outline" size="lg" onClick={fetchRandomAnime}>
                        <ShuffleIcon className="h-4 w-4 mr-2" />
                        Next Random
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <DiceIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Discover?</h3>
              <p className="text-muted-foreground">Click the button above to find your next anime adventure!</p>
            </CardContent>
          </Card>
        )}

        {/* History */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCwIcon className="h-5 w-5" />
                Recently Discovered ({history.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {history.map((anime, index) => (
                  <AnimeCard
                    key={`${anime.mal_id}-${index}`}
                    anime={anime}
                    variant="minimal"
                    showScore={true}
                    showType={false}
                    showYear={true}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default RandomPage
