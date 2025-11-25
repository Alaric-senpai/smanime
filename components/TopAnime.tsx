"use client"
import { getTopSection } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import AnimeGrid from "./AnimeGrid"
import { getTopAnime } from "@lightweight-clients/jikan-api-lightweight-client"



const TopAnime = () => {
  const {
    data: topAnime,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["top-anime"],
    queryFn: () => getTopAnime({limit:20}),
    staleTime: Number.POSITIVE_INFINITY,
  })

  console.log(topAnime)

  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Top Anime</h2>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, idx) => (
            <Card key={idx} className="flex items-center p-4 animate-pulse">
              <div className="w-16 h-20 bg-gray-200 rounded-md flex-shrink-0 mr-4"></div>
              <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-2">Error loading top anime</div>
          <p className="text-gray-600">{error instanceof Error ? error.message : "Something went wrong"}</p>
        </div>
      </div>
    )
  }

  if (!topAnime?.data || topAnime.data.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Top Anime</h2>
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl">No top anime found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Top {topAnime.data.length} Anime</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
            <AnimeGrid animes={topAnime.data as any} />
        </CardContent>
      </Card>
    </div>
  )
}

export default TopAnime
