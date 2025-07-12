'use client'
import MangaGrid from "@/components/ MangaGrid"
import MangaHero from "@/components/MangaHero"
import { Navbar } from "@/components/Navbar"
import SectionHeader from "@/components/SectionHeader"
import { getTopManga } from "@lightweight-clients/jikan-api-lightweight-client"
import { BookOpenIcon, StarIcon } from "lucide-react"

export default  function MangaPage() {
  return (
    <main className="min-h-screen">
      <MangaHero />

      {/* Popular Manga Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Popular Manga"
            subtitle="Discover the most beloved manga series"
            hasSeeMore={true}
            seeMoreLink="/manga/explore"
            seeMoreText="Explore All"
            icon={<StarIcon className="h-5 w-5" />}
            variant="featured"
          />

          <MangaGrid
            fetchFunction={async (page = 1) => await getTopManga({ page, limit: 12 })}
            variant="featured"
            cardVariant="default"
            showLoadMore={false}
            showStats={false}
            limit={12}
            columns={{ default: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
          />
        </div>
      </section>

      {/* Recently Updated Section */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Recently Updated"
            subtitle="Latest chapters and new releases"
            hasSeeMore={true}
            seeMoreLink="/manga/explore?filter=publishing"
            seeMoreText="View All"
            icon={<BookOpenIcon className="h-5 w-5" />}
          />

          <MangaGrid
            fetchFunction={async (page = 1) => await getTopManga({ page, limit: 8, filter: "publishing" })}
            variant="minimalist"
            cardVariant="compact"
            showLoadMore={false}
            showStats={false}
            limit={8}
            columns={{ default: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
          />
        </div>
      </section>
    </main>
  )
}
