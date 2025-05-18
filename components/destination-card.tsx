"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MapPin, TrendingUp, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Destination } from "@/types/destination"

interface DestinationCardProps {
  destination: Destination
  onClick: () => void
  isGridView: boolean
  showTrending: boolean
}

export default function DestinationCard({ destination, onClick, isGridView, showTrending }: DestinationCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D card effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(0, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 })

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = (e.clientX - rect.left) / width - 0.5
    const mouseY = (e.clientY - rect.top) / height - 0.5

    x.set(mouseX)
    y.set(mouseY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const emojiVariants = {
    initial: { y: 10, opacity: 0, scale: 0.8 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        type: "spring",
        stiffness: 200,
      },
    }),
    hover: (i: number) => ({
      y: -5,
      scale: 1.2,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        type: "spring",
        stiffness: 300,
      },
    }),
  }

  // Floating animation for trending badge
  const floatingBadge: Variants = {
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  }

  if (isGridView) {
    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
        style={{ perspective: 1000, rotateX, rotateY, z: 0 }}
        className="cursor-pointer h-full"
      >
        <Card className="overflow-hidden h-full bg-gray-800/40 border-gray-700 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300 relative">
          {showTrending && destination.trending && (
            <motion.div variants={floatingBadge} animate="animate" className="absolute top-2 right-2 z-10">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg shadow-orange-900/20 px-2 py-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </motion.div>
          )}

          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={destination.image || "/placeholder.svg"}
              alt={destination.name}
              fill
              className="object-cover transition-transform duration-700"
              style={{
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <motion.div className="flex flex-wrap gap-1">
                {destination.emojiTags.map((tag, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="initial"
                    animate="animate"
                    variants={emojiVariants}
                    whileHover="hover"
                    className="relative"
                  >
                    <Badge className="bg-gray-800/80 backdrop-blur-sm text-white border-none shadow-lg shadow-purple-900/20">
                      <motion.span
                        animate={isHovered ? { rotate: [0, -10, 10, -5, 0] } : {}}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="mr-1 text-lg"
                      >
                        {tag.emoji}
                      </motion.span>
                    </Badge>
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        initial={{ boxShadow: "0 0 0px rgba(168, 85, 247, 0)" }}
                        animate={{ boxShadow: "0 0 10px rgba(168, 85, 247, 0.7)" }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-white">{destination.name}</h3>
                {destination.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-300 text-sm ml-1">{destination.rating}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center text-gray-400 text-sm mb-2">
                <MapPin className="h-3 w-3 mr-1 text-purple-400" />
                <span>{destination.country}</span>
              </div>
              <p className="text-gray-300 text-sm line-clamp-2">{destination.shortDescription}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  } else {
    // List view
    return (
      <Card
        className="overflow-hidden bg-gray-800/40 border-gray-700 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300"
        onClick={onClick}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/3 aspect-video md:aspect-square">
            <Image src={destination.image || "/placeholder.svg"} alt={destination.name} fill className="object-cover" />
            {showTrending && destination.trending && (
              <motion.div variants={floatingBadge} animate="animate" className="absolute top-2 right-2 z-10">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg shadow-orange-900/20 px-2 py-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              </motion.div>
            )}
          </div>
          <div className="p-4 md:w-2/3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-white">{destination.name}</h3>
              {destination.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-300 text-sm ml-1">{destination.rating}</span>
                </div>
              )}
            </div>
            <div className="flex items-center text-gray-400 text-sm my-2">
              <MapPin className="h-3 w-3 mr-1 text-purple-400" />
              <span>
                {destination.country}, {destination.region}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">{destination.shortDescription}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {destination.emojiTags.map((tag, i) => (
                <Badge key={i} className="bg-gray-800/80 backdrop-blur-sm text-white border-none">
                  <span className="mr-1">{tag.emoji}</span> {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }
}
