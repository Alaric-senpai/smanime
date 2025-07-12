"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getMangaById,
  getMangaCharacters,
  getMangaRecommendations,
  getMangaReviews,
} from "@lightweight-clients/jikan-api-lightweight-client"
import type {
    GetMangaRecommendationsResponse,
  Manga,
  MangaCharacters,
  MangaReviews,
} from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import {
  StarIcon,
  BookOpenIcon,
  UsersIcon,
  BookmarkIcon,
  HeartIcon,
  ShareIcon,
  ExternalLinkIcon,
  FileTextIcon,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import MangaDetailHero from "@/components/MangaDetailHero"
import MangaGrid from "@/components/ MangaGrid"

const MangaDetailPage = () => {
  const params = useParams()
  const mangaId = params.mangaid as string

  const [manga, setManga] = useState<Manga | null>(null)
  const [characters, setCharacters] = useState<MangaCharacters | null>(null)
  const [recommendations, setRecommendations] = useState<GetMangaRecommendationsResponse | null>(null)
  const [reviews, setReviews] = useState<MangaReviews | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchMangaData = async () => {
      if (!mangaId) return

      try {
        setLoading(true)

        // Fetch main manga data
        const mangaData = await getMangaById(Number.parseInt(mangaId))
        if (mangaData.data) {
          setManga(mangaData.data)
        }

        // Fetch additional data in parallel
        const [charactersData, recommendationsData, reviewsData] = await Promise.allSettled([
          getMangaCharacters(Number.parseInt(mangaId)),
          getMangaRecommendations(Number.parseInt(mangaId)),
          getMangaReviews(Number.parseInt(mangaId)),
        ])

        if (charactersData.status === "fulfilled" && charactersData.value.data) {
          setCharacters(charactersData.value)
        }

        if (recommendationsData.status === "fulfilled" && recommendationsData.value.data) {
          setRecommendations(recommendationsData.value)
        }

        if (reviewsData.status === "fulfilled" && reviewsData.value.data) {
          setReviews(reviewsData.value)
        }
      } catch (error) {
        console.error("Error fetching manga data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMangaData()
  }, [mangaId])

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

  if (!manga) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Manga Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The manga you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/manga/explore">
              <Button>Explore Manga</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="w-full  min-h-screen">
        {/* Hero Section */}
        {manga && <MangaDetailHero manga={manga} />}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Manga Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={manga.images?.webp?.large_image_url || "/placeholder.svg?height=600&width=450"}
                    alt={manga.title || "Manga poster"}
                    fill
                    className="object-cover"
                    priority
                  />
                  {manga.score && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500/90 text-black font-bold text-lg px-3 py-1">
                        <StarIcon className="h-4 w-4 mr-1 fill-current" />
                        {manga.score}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="w-full">
                        <BookOpenIcon className="h-4 w-4 mr-2" />
                        Read
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <BookmarkIcon className="h-4 w-4 mr-2" />
                        Reading List
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <HeartIcon className="h-4 w-4 mr-2" />
                        Favorite
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <ShareIcon className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-3 text-sm">
                      {manga.type && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <Badge variant="secondary">{manga.type}</Badge>
                        </div>
                      )}
                      {manga.chapters && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chapters:</span>
                          <span>{manga.chapters}</span>
                        </div>
                      )}
                      {manga.volumes && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Volumes:</span>
                          <span>{manga.volumes}</span>
                        </div>
                      )}
                      {manga.status && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className={`text-white ${getStatusColor(manga.status)}`}>{manga.status}</Badge>
                        </div>
                      )}
                      {manga.published?.from && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Published:</span>
                          <span>{formatDate(manga.published.from)}</span>
                        </div>
                      )}
                      {manga.authors && manga.authors.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Author:</span>
                          <span>{manga.authors[0].name}</span>
                        </div>
                      )}
                    </div>

                    {/* External Links
                    {manga.external && manga.external.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">External Links</h4>
                        {manga.external.slice(0, 3).map((link, index) => (
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
                    )} */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{manga.title}</h1>
              {manga.title_english && manga.title_english !== manga.title && (
                <h2 className="text-2xl text-muted-foreground mb-4">{manga.title_english}</h2>
              )}

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 mb-6">
                {manga.score && (
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{manga.score}</span>
                    <span className="text-muted-foreground">({manga.scored_by?.toLocaleString()} users)</span>
                  </div>
                )}
                {manga.members && (
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-blue-500" />
                    <span>{(manga.members / 1000).toFixed(0)}K members</span>
                  </div>
                )}
                {manga.rank && (
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-5 w-5 text-emerald-500" />
                    <span>Rank #{manga.rank}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {manga.genres && manga.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {manga.genres.map((genre) => (
                    <Badge key={genre.mal_id} variant="outline">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Synopsis */}
            {manga.synopsis && (
              <Card>
                <CardHeader>
                  <CardTitle>Synopsis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{manga.synopsis}</p>
                </CardContent>
              </Card>
            )}

            {/* Tabs for Additional Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
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
                        <div className="text-2xl font-bold text-primary">{manga.score || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">#{manga.rank || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">Rank</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">#{manga.popularity || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">Popularity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {manga.members ? (manga.members / 1000).toFixed(0) + "K" : "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">Members</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                {/* {recommendations && recommendations.data && recommendations.data.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MangaGrid
                        mangas={recommendations.data.map((rec) => rec.entry).slice(0, 6)}
                        variant="minimalist"
                        showLoadMore={false}
                        showStats={false}
                        limit={6}
                        columns={{ default: 2, sm: 3, md: 6, lg: 6, xl: 6 }}
                      />
                    </CardContent>
                  </Card>
                )} */}
              </TabsContent>

              <TabsContent value="characters">
                {characters && characters.data && characters.data.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Characters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {characters.data.slice(0, 12).map((char) => (
                          <div key={char.character.mal_id} className="flex items-center gap-3 p-3 rounded-lg border">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={char.character.images?.webp?.image_url || "/placeholder.svg?height=48&width=48"}
                                alt={char.character.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{char.character.name}</div>
                              <div className="text-sm text-muted-foreground">{char.role}</div>
                            </div>
                          </div>
                        ))}
                      </div> */}
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
                              <div className="font-semibold">{review?.user?.username}</div>
                              <Badge variant="outline">Score: {review.score || "N/A"}</Badge>
                            </div>
                            {/* <div className="text-sm text-muted-foreground">{formatDate(review.date)}</div> */}
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
                      <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reviews available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MangaDetailPage
