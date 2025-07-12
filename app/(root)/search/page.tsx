"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import AnimeGrid from "@/components/AnimeGrid"
import { getAnimeSearch } from "@lightweight-clients/jikan-api-lightweight-client"
import type { AnimeSearch } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon, FilterIcon, XIcon, SlidersIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 4, name: "Comedy" },
  { id: 8, name: "Drama" },
  { id: 10, name: "Fantasy" },
  { id: 14, name: "Horror" },
  { id: 22, name: "Romance" },
  { id: 24, name: "Sci-Fi" },
  { id: 36, name: "Slice of Life" },
  { id: 37, name: "Supernatural" },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "all",
    status: searchParams.get("status") || "all",
    rating: searchParams.get("rating") || "all",
    orderBy: searchParams.get("order_by") || "score",
    sort: searchParams.get("sort") || "desc",
    genres: searchParams.get("genres")?.split(",").filter(Boolean) || [],
    minScore: searchParams.get("min_score") || "",
    maxScore: searchParams.get("max_score") || "",
    startYear: searchParams.get("start_year") || "",
    endYear: searchParams.get("end_year") || "",
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const fetchSearchResults = async (page = 1): Promise<AnimeSearch> => {
    if (!query.trim()) {
      return { data: [], pagination: {} } as AnimeSearch
    }

    const searchParams: any = {
      q: query,
      page,
      limit: 25,
      order_by: filters.orderBy,
      sort: filters.sort,
    }

    if (filters.type !== "all") searchParams.type = filters.type
    if (filters.status !== "all") searchParams.status = filters.status
    if (filters.rating !== "all") searchParams.rating = filters.rating
    if (filters.genres.length > 0) searchParams.genres = filters.genres.join(",")
    if (filters.minScore) searchParams.min_score = Number.parseFloat(filters.minScore)
    if (filters.maxScore) searchParams.max_score = Number.parseFloat(filters.maxScore)
    if (filters.startYear) searchParams.start_date = `${filters.startYear}-01-01`
    if (filters.endYear) searchParams.end_date = `${filters.endYear}-12-31`

    return await getAnimeSearch(searchParams)
  }

  const updateURL = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (filters.type !== "all") params.set("type", filters.type)
    if (filters.status !== "all") params.set("status", filters.status)
    if (filters.rating !== "all") params.set("rating", filters.rating)
    if (filters.orderBy !== "score") params.set("order_by", filters.orderBy)
    if (filters.sort !== "desc") params.set("sort", filters.sort)
    if (filters.genres.length > 0) params.set("genres", filters.genres.join(","))
    if (filters.minScore) params.set("min_score", filters.minScore)
    if (filters.maxScore) params.set("max_score", filters.maxScore)
    if (filters.startYear) params.set("start_year", filters.startYear)
    if (filters.endYear) params.set("end_year", filters.endYear)

    router.push(`/search?${params.toString()}`)
  }

  const handleSearch = () => {
    updateURL()
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleGenreToggle = (genreId: string) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreId) ? prev.genres.filter((id) => id !== genreId) : [...prev.genres, genreId],
    }))
  }

  const clearFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      rating: "all",
      orderBy: "score",
      sort: "desc",
      genres: [],
      minScore: "",
      maxScore: "",
      startYear: "",
      endYear: "",
    })
  }

  const activeFiltersCount = Object.values(filters).filter((value) =>
    Array.isArray(value) ? value.length > 0 : value !== "all" && value !== "score" && value !== "desc" && value !== "",
  ).length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Search Anime</h1>
          <p className="text-muted-foreground">Discover anime with advanced search and filtering options</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Search Query</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter anime title, character, or keyword..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={handleSearch} className="px-8">
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FilterIcon className="h-5 w-5" />
                Filters
                {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
              </CardTitle>
              <div className="flex gap-2">
                {activeFiltersCount > 0 && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <XIcon className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersIcon className="h-4 w-4 mr-2" />
                      Advanced
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="tv">TV Series</SelectItem>
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="ova">OVA</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                    <SelectItem value="ona">ONA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="airing">Currently Airing</SelectItem>
                    <SelectItem value="complete">Completed</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={filters.orderBy} onValueChange={(value) => handleFilterChange("orderBy", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="start_date">Release Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="episodes">Episodes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Order</label>
                <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters */}
            <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
              <CollapsibleContent className="space-y-4">
                {/* Genres */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <Badge
                        key={genre.id}
                        variant={filters.genres.includes(genre.id.toString()) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleGenreToggle(genre.id.toString())}
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Score Range */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Score</label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      placeholder="0.0"
                      value={filters.minScore}
                      onChange={(e) => handleFilterChange("minScore", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Score</label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      placeholder="10.0"
                      value={filters.maxScore}
                      onChange={(e) => handleFilterChange("maxScore", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Year</label>
                    <Input
                      type="number"
                      min="1960"
                      max="2030"
                      placeholder="1990"
                      value={filters.startYear}
                      onChange={(e) => handleFilterChange("startYear", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Year</label>
                    <Input
                      type="number"
                      min="1960"
                      max="2030"
                      placeholder="2024"
                      value={filters.endYear}
                      onChange={(e) => handleFilterChange("endYear", e.target.value)}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button onClick={handleSearch} className="w-full">
              Apply Filters & Search
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {query.trim() ? (
          <AnimeGrid
            fetchFunction={fetchSearchResults}
            variant="full"
            cardVariant="compact"
            showLoadMore={true}
            showStats={true}
            columns={{ default: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          />
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
            <p className="text-muted-foreground">Enter a search term to discover amazing anime</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
