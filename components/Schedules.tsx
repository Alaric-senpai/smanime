"use client"
import { getSchedule } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Star, Users, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import SectionHeader from "./SectionHeader"
import { formatDuration, getStatusColor } from "@/constants"
import AnimeCardV2 from "./AnimeCardV2"



const Schedules = () => {
  const {
    data: schedules,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedule,
    staleTime: Number.POSITIVE_INFINITY,
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Anime Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
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
          <div className="text-red-500 text-xl mb-2">Error loading schedule</div>
          <p className="text-gray-600">{error instanceof Error ? error.message : "Something went wrong"}</p>
        </div>
      </div>
    )
  }

  if (!schedules?.data || schedules.data.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Anime Schedule</h2>
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl">No scheduled anime found</div>
        </div>
      </div>
    )
  }



  return (
    <div className="p-6">
      <SectionHeader title="Upcoming Anime" hasSeeMore={true} seeMoreLink="#" seeMoreText="See all Upcoming"  />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {schedules.data.map((anime, idx) => (
         <AnimeCardV2 key={idx} anime={anime} />
        ))}
      </div>
    </div>
  )
}

export default Schedules
