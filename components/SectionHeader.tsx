"use client"

import { Button } from "./ui/button"
import Link from "next/link"
import { ArrowRightIcon, SparklesIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

type SectionHeaderProps = {
  title: string
  subtitle?: string
  hasSeeMore: boolean
  seeMoreText?: string
  seeMoreLink?: string
  icon?: React.ReactNode
  variant?: 'default' | 'featured' | 'minimal'
  className?: string
}

const SectionHeader = ({ 
  title, 
  hasSeeMore, 
  seeMoreLink, 
  seeMoreText, 
  subtitle, 
  icon,
  variant = 'default',
  className 
}: SectionHeaderProps) => {
  return (
    <div className={cn(
      "flex items-center justify-between py-6 px-4",
      variant === 'featured' && "bg-gradient-to-r from-primary/10 to-transparent rounded-lg px-6",
      variant === 'minimal' && "py-4 px-0",
      className
    )}>
      {/* Title and Subtitle Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <h2 className={cn(
            "font-bold text-foreground",
            variant === 'featured' ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
            variant === 'minimal' && "text-xl md:text-2xl"
          )}>
            {title}
          </h2>
          {variant === 'featured' && (
            <SparklesIcon className="h-6 w-6 text-yellow-500 animate-pulse" />
          )}
        </div>
        {subtitle && (
          <p className={cn(
            "text-muted-foreground",
            variant === 'featured' ? "text-base" : "text-sm",
            variant === 'minimal' && "text-xs"
          )}>
            {subtitle}
          </p>
        )}
      </div>

      {/* See More Button Section */}
      {hasSeeMore && seeMoreLink && (
        <Button 
          variant={variant === 'featured' ? 'default' : 'outline'} 
          asChild 
          className={cn(
            "group transition-all duration-300",
            variant === 'featured' && "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl",
            variant === 'minimal' && "h-8 text-xs"
          )}
        >
          <Link href={seeMoreLink} className="flex items-center gap-2">
            {seeMoreText || "See more"}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
    </div>
  )
}

export default SectionHeader
