"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, TrendingUpIcon, Star, Calendar, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { getAnimeSearch } from "@lightweight-clients/jikan-api-lightweight-client"
import type { Anime } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import useDebounce from "@/hooks/use-debounce"
import useOnClickOutside from "@/hooks/use-on-click-outside"

const trendingSearches = [
  "Attack on Titan",
  "Demon Slayer",
  "Jujutsu Kaisen",
  "One Piece",
  "Naruto",
  "Dragon Ball",
  "My Hero Academia",
  "Death Note",
]

const SearchResultSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 animate-pulse bg-gray-900">
    <div className="w-16 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex-shrink-0"></div>
    <div className="flex-grow min-w-0 space-y-3">
      <div className="h-5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full w-3/4"></div>
      <div className="flex items-center gap-3">
        <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full w-16"></div>
        <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full w-12"></div>
        <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full w-20"></div>
      </div>
    </div>
  </div>
)

interface SearchResultsProps {
  results: Anime[]
  selectedIndex: number
  onResultClick: () => void
  debouncedQuery: string
  onViewAllResults: () => void
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  selectedIndex,
  onResultClick,
  debouncedQuery,
  onViewAllResults,
}) => (
  <div className="max-h-[400px] overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
    {results.map((anime, index) => (
      <Link key={index} href={`/anime/${anime.mal_id}`} onClick={onResultClick}>
        <div
          className={`flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-purple-900/50 hover:to-pink-900/50 transition-all duration-300 cursor-pointer border-b border-gray-800 last:border-b-0 group ${
            index === selectedIndex
              ? "bg-gradient-to-r from-purple-900/70 to-pink-900/70 shadow-lg shadow-purple-500/20"
              : ""
          }`}
        >
          <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-300">
            <Image
              src={anime.images?.webp?.small_image_url || "/placeholder.svg?height=80&width=64"}
              alt={anime.title || "Anime"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 ring-2 ring-purple-500/0 group-hover:ring-purple-500/50 rounded-lg transition-all duration-300" />
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="font-bold text-white line-clamp-2 text-lg leading-tight mb-2 group-hover:text-purple-200 transition-colors duration-300">
              {anime.title}
            </h4>
            <div className="flex items-center gap-3 flex-wrap">
              {anime.type && (
                <Badge className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                  <Play className="w-3 h-3 mr-1" />
                  {anime.type}
                </Badge>
              )}
              {anime.year && (
                <div className="flex items-center gap-1 text-xs text-gray-300 group-hover:text-white transition-colors duration-300">
                  <Calendar className="w-3 h-3" />
                  <span className="font-medium">{anime.year}</span>
                </div>
              )}
              {anime.score && (
                <div className="flex items-center gap-1 text-xs text-yellow-400 font-semibold group-hover:text-yellow-300 transition-colors duration-300">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{anime.score}</span>
                </div>
              )}
              {anime.episodes && (
                <span className="text-xs text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">
                  {anime.episodes} Episodes
                </span>
              )}
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
          </div>
        </div>
      </Link>
    ))}
    {results.length === 8 && (
      <div className="p-4 border-t border-gray-800 text-center bg-gradient-to-r from-gray-900 to-black">
        <Button
          variant="ghost"
          onClick={onViewAllResults}
          className="text-purple-400 hover:text-purple-300 font-semibold hover:bg-purple-900/30 transition-all duration-200 border border-purple-500/30 hover:border-purple-400/50"
        >
          View All Results for "{debouncedQuery}" →
        </Button>
      </div>
    )}
  </div>
)

interface TrendingSearchesProps {
  onTrendingClick: (term: string) => void
}

const TrendingSearches: React.FC<TrendingSearchesProps> = ({ onTrendingClick }) => (
  <div className="p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
        <TrendingUpIcon className="h-5 w-5 text-purple-600" />
      </div>
      <span className="text-lg font-bold text-gray-800">Trending Anime</span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {trendingSearches.map((term, index) => (
        <Button
          key={term}
          variant="outline"
          size="sm"
          onClick={() => onTrendingClick(term)}
          className="justify-start text-sm font-medium rounded-xl border-2 border-purple-200 text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-200 h-12"
        >
          <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
            {index + 1}
          </span>
          {term}
        </Button>
      ))}
    </div>
  </div>
)

const SearchElement = () => {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
// @ts-ignore
  useOnClickOutside(searchRef, () => {
    setShowResults(false)
  })

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["anime-search", debouncedQuery],
    queryFn: () => getAnimeSearch({ q: debouncedQuery, limit: 8 }),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 60, // 1 minute
  })

  useEffect(() => {
    setSelectedIndex(-1)
  }, [debouncedQuery])

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setShowResults(false)
      setQuery("")
    }
  }, [query, router])

  const handleTrendingClick = useCallback((term: string) => {
    setQuery(term)
    inputRef.current?.focus()
    setShowResults(true)
  }, [])

  const clearSearch = useCallback(() => {
    setQuery("")
    setShowResults(false)
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const results = searchResults?.data || []
      if (!showResults) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            router.push(`/anime/${results[selectedIndex].mal_id}`)
            setShowResults(false)
            setQuery("")
          } else if (query.trim()) {
            handleSearch()
          }
          break
        case "Escape":
          setShowResults(false)
          inputRef.current?.blur()
          break
      }
    },
    [showResults, searchResults, selectedIndex, query, router, handleSearch],
  )
  // @ts-ignore
  const hasSearchResults = searchResults?.data?.length > 0
  const showNoResultsMessage = debouncedQuery.trim().length >= 2 && !isLoading && !hasSearchResults && !isError
  const showInitialContent = !query.trim()
  const showLoading = isLoading && debouncedQuery.trim().length >= 2

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      {/* Search Input Container */}
      <div className="relative p-6">
        <div className="relative bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xl border-2 border-white/40 rounded-2xl shadow-2xl overflow-hidden">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />

          {/* Input and buttons container */}
          <div className="relative flex items-center p-3 gap-3">
            {/* Input field */}
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search your favorite anime..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  if (e.target.value.trim().length >= 2 || !e.target.value.trim()) {
                    setShowResults(true)
                  } else {
                    setShowResults(false)
                  }
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (query.trim().length >= 2 || !query.trim()) {
                    setShowResults(true)
                  }
                }}
                className="w-full bg-transparent border-none text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 py-4 text-lg font-medium pr-4"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex-shrink-0"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full p-0 left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl border-2 border-white/50 shadow-2xl rounded-2xl overflow-hidden z-50">
          <CardContent className="p-0">
            {showLoading ? (
              <div className="p-6 bg-gradient-to-b from-gray-900 to-black">
                {[...Array(3)].map((_, i) => (
                  <SearchResultSkeleton key={i} />
                ))}
                <div className="p-4 text-center">
                  <div className="inline-flex items-center gap-3 text-purple-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                    <span className="font-medium">Searching anime database...</span>
                  </div>
                </div>
              </div>
            ) : hasSearchResults ? (
              <SearchResults
                results={searchResults.data!}
                selectedIndex={selectedIndex}
                onResultClick={() => {
                  setShowResults(false)
                  setQuery("")
                }}
                debouncedQuery={debouncedQuery}
                onViewAllResults={handleSearch}
              />
            ) : showNoResultsMessage ? (
              <div className="p-8 text-center bg-gradient-to-b from-gray-900 to-black">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-900 to-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-300 text-lg mb-4">No anime found for "{debouncedQuery}"</p>
                <Button
                  variant="outline"
                  onClick={handleSearch}
                  className="text-purple-400 hover:text-purple-300 border-purple-500/50 hover:bg-purple-900/30 bg-transparent hover:border-purple-400/70 transition-all duration-300"
                >
                  Search anyway →
                </Button>
              </div>
            ) : showInitialContent ? (
              <TrendingSearches onTrendingClick={handleTrendingClick} />
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SearchElement
