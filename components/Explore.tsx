"use client"

import { useState } from "react"
import SectionHeader from "./SectionHeader"
import AnimeGrid from "./AnimeGrid"
import { getTopAnime, getSeasonNow, getAnimeSearch, } from "@lightweight-clients/jikan-api-lightweight-client"
import type { AnimeSearch } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import { TrendingUpIcon, CalendarIcon, SearchIcon, FilterIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type ExploreTab = "trending" | "seasonal" | "top" | "search"

const Explore = () => {
  const [activeTab, setActiveTab] = useState<ExploreTab>("trending")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("score")
  const [filterType, setFilterType] = useState("all")

  // Fetch functions for different tabs
  const fetchTrending = async (page = 1) => {
    return await getTopAnime({
      page,
      limit: 25,
      filter: "airing",
    })
  }

  const fetchSeasonal = async (page = 1) => {
    return await getSeasonNow({ page, limit: 25 })
  }

  const fetchTop = async (page = 1) => {
    return await getTopAnime({
      page,
      limit: 25,
      // filter: sortBy === "score" ? "bypopularity" : "score",
    })
  }

  const fetchSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      return { data: [], pagination: {} } as AnimeSearch
    }

    return await getAnimeSearch({
      q: searchQuery,
      page,
      limit: 25,
      // type: filterType === "all" ? undefined : filterType,
      // order_by: sortBy,
      sort: "desc",
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setActiveTab("search")
    }
  }

  return (
    <div className="w-full p-4 space-y-8">
      {/* Header */}
      <SectionHeader
        title="Explore Anime"
        subtitle="Discover thousands of anime across different categories"
        hasSeeMore={false}
        icon={<TrendingUpIcon className="h-5 w-5" />}
        variant="featured"
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Score</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="start_date">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tv">TV</SelectItem>
              <SelectItem value="movie">Movie</SelectItem>
              <SelectItem value="ova">OVA</SelectItem>
              <SelectItem value="special">Special</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ExploreTab)}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUpIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Seasonal</span>
          </TabsTrigger>
          <TabsTrigger value="top" className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Top Rated</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-6">
          <AnimeGrid
            fetchFunction={fetchTrending}
            variant="full"
            cardVariant="compact"
            showLoadMore={true}
            showStats={true}
            columns={{ default: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          />
        </TabsContent>

        <TabsContent value="seasonal" className="mt-6">
          <AnimeGrid
            fetchFunction={fetchSeasonal}
            variant="full"
            cardVariant="compact"
            showLoadMore={true}
            showStats={true}
            columns={{ default: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          />
        </TabsContent>

        <TabsContent value="top" className="mt-6">
          <AnimeGrid
            fetchFunction={fetchTop}
            variant="full"
            cardVariant="default"
            showLoadMore={true}
            showStats={true}
            columns={{ default: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
          />
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          {searchQuery.trim() ? (
            <AnimeGrid
              fetchFunction={fetchSearch}
              variant="full"
              cardVariant="compact"
              showLoadMore={true}
              showStats={true}
              columns={{ default: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
            />
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Enter a search term to find anime</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Explore
