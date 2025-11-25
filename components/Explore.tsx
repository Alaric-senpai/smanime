"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import AnimeGrid from "./AnimeGrid"
import { getTopAnime, getSeasonNow, getAnimeSearch } from "@lightweight-clients/jikan-api-lightweight-client"
import type { AnimeSearch } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import { TrendingUpIcon, CalendarIcon, SearchIcon, FilterIcon, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import useDebounce from "@/hooks/use-debounce"
import SectionHeader from "./SectionHeader"
import TopAnime from "./TopAnime"


const Explore = () => {

  const [currentPage, setCurrentPage] = useState(1)



  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }



  // Error component
  const ErrorState = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-8">
        <div className="text-red-500 mb-4">
          <FilterIcon className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground text-center mb-4">{error?.message || "Failed to load anime data"}</p>
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      </CardContent>
    </Card>
  )

  // Loading component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
      <p className="text-muted-foreground">Loading anime...</p>
    </div>
  )

  // Empty search state
  const EmptySearchState = () => (
    <div className="text-center py-12">
      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Search for anime</h3>
      <p className="text-muted-foreground">Enter a search term to find your favorite anime</p>
    </div>
  )

  // No results state
  const NoResultsState = () => (
    <div className="text-center py-12">
      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No results found</h3>
      <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
    </div>
  )

  return (
    <div className="w-full p-4 space-y-8">

      <SectionHeader title="Recently Top Anime" hasSeeMore={false} subtitle="Anime which are topping the charts recently"  />

      <TopAnime />

    </div>
  )
}

export default Explore
