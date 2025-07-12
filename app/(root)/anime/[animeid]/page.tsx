"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import AnimeGrid from "@/components/AnimeGrid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getAnimeById,
  getAnimeCharacters,
  getAnimeEpisodes,
  getAnimeFullById,
  getAnimeRecommendations,
  getAnimeReviews,
} from "@lightweight-clients/jikan-api-lightweight-client"
import type {
  Anime,
  AnimeCharacters,
  AnimeEpisodes,
  AnimeFull,
  AnimeReviews,
  GetAnimeRecommendationsResponse,
} from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import { StarIcon, CalendarIcon, UsersIcon, PlayIcon, ClockIcon, ExternalLinkIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import AnimeDetailHero from "@/components/AnimeDetailHero"

const AnimeDetailPage = () => {
  const params = useParams()
  const animeId = params.animeid as string

  const [anime, setAnime] = useState<AnimeFull | null>(null)
  const [characters, setCharacters] = useState<AnimeCharacters | null>(null)
  const [episodes, setEpisodes] = useState<AnimeEpisodes | null>(null)
  const [recommendations, setRecommendations] = useState<GetAnimeRecommendationsResponse | null>(null)
  const [reviews, setReviews] = useState<AnimeReviews | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchAnimeData = async () => {
      if (!animeId) return

      try {
        setLoading(true)

        // Fetch main anime data
        const animeData = await getAnimeFullById(Number.parseInt(animeId))
        if (animeData.data) {
          setAnime(animeData.data)
        }

        // Fetch additional data in parallel
        const [charactersData, episodesData, recommendationsData, reviewsData] = await Promise.allSettled([
          getAnimeCharacters(Number.parseInt(animeId)),
          getAnimeEpisodes(Number.parseInt(animeId)),
          getAnimeRecommendations(Number.parseInt(animeId)),
          getAnimeReviews(Number.parseInt(animeId)),
        ])

        if (charactersData.status === "fulfilled" && charactersData.value.data) {
          setCharacters(charactersData.value)
        }

        if (episodesData.status === "fulfilled" && episodesData.value.data) {
          setEpisodes(episodesData.value)
        }

        if (recommendationsData.status === "fulfilled" && recommendationsData.value.data) {
          setRecommendations(recommendationsData.value)
        }

        if (reviewsData.status === "fulfilled" && reviewsData.value.data) {
          setReviews(reviewsData.value)
        }
      } catch (error) {
        console.error("Error fetching anime data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnimeData()
  }, [animeId])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Anime Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The anime you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/explore">
              <Button>Explore Anime</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="w-full min-h-screen h-max">
        {/* Hero Section */}
        {anime && <AnimeDetailHero anime={anime} />}

        <div className="container mx-auto mt-5 border bg-white shadow-md rounded-md my-5 p-4 overflow-hidden hover:shadow-sm transition-all duration-300 ease-linear">
            <p className="prose leadin-8 italic font-medium text-lg ">

            {anime.background}
            </p>
        </div>

        {/* <div className="container mx-auto my-4">
            <h2>
                Themes
            </h2>

            <div className="flex items-center justify-between  flex-col">
                <div>
                    <p>
                        Opening themes
                    </p>

                    {anime.theme?.openings?.map((theme, key)=>(
                        <Badge key={key} variant={'default'}>
                            {theme}
                        </Badge>
                    ))}
                </div>
                <div>
                    <p>
                        Ending  themes
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {anime.theme?.endings?.map((theme, key)=>(
                            <Badge key={key} variant={'default'}>
                                {theme}
                            </Badge>
                        ))}
                    </div>

                </div>
            </div>


        </div> */}

        <div className="container mx-auto my-4">
            {anime.external && anime.external.length > 0 && (
                <div className="space-y-2">
                <h4 className="font-semibold">External Links</h4>
                {anime.external.map((link, index) => (
                    <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                    <ExternalLinkIcon className="h-3 w-3" />
                    {link.name}
                    </a>
                ))}
                </div>
            )}
        </div>

        {/* Tabs for Additional Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="container mx-auto my-5">
          <TabsList className="grid w-full grid-cols-4 bg-emerald-700/45 rounded-md p-2 h-full  " >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{anime.score || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">#{anime.rank || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">#{anime.popularity || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">Popularity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {anime.members ? (anime.members / 1000).toFixed(0) + "K" : "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {recommendations && recommendations.data && recommendations.data.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
            
                  <AnimeGrid
                
                    animes={recommendations.data.map((rec) => rec.entry as any).slice(0, 6)}
                    variant="minimalist"
                    showLoadMore={false}
                    showStats={false}
                    limit={6}
                    columns={{ default: 2, sm: 3, md: 6, lg: 6, xl: 6 }}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="episodes">
            {episodes && episodes.data && episodes.data.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Episodes ({episodes.data.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {episodes.data.map((episode) => (
                      <div
                        key={episode.mal_id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            Episode {episode.mal_id}: {episode.title || "Untitled"}
                          </div>
                          {episode.aired && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {formatDate(episode.aired)}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <PlayIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Episode information not available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="characters">
            {characters && characters.data && characters.data.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Characters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {characters.data.slice(0, 12).map((char) => (
                      <div key={char.character?.mal_id} className="flex items-center gap-3 p-3 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 ease-linear">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={char.character?.images?.webp?.image_url || "/placeholder.svg?height=48&width=48"}
                            alt={char.character?.name!}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{char.character?.name}</div>
                          <div className="text-sm text-muted-foreground">{char.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Character information not available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {reviews && reviews.data && reviews.data.length > 0 ? (
              <div className="space-y-4">
                {reviews.data.slice(0, 5).map((review) => (
                  <Card key={review.mal_id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{review.user?.username}</div>
                          <Badge variant="outline">Score: {review.score || "N/A"}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{formatDate(review?.date!)}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-4">{review.review}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <StarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reviews available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AnimeDetailPage
