"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  X,
  MapPin,
  Heart,
  Share2,
  Navigation,
  Star,
  Calendar,
  Clock,
  DollarSign,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Destination } from "@/types/destination"

interface DestinationModalProps {
  destination: Destination
  onClose: () => void
}

export default function DestinationModal({ destination, onClose }: DestinationModalProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)

    if (!isFavorited) {
      // Trigger confetti effect when adding to favorites
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#c084fc", "#e879f9", "#f472b6"],
      })
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real app, implement sharing functionality
    alert(`Sharing ${destination.name}!`)
  }

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real app, implement directions functionality
    alert(`Getting directions to ${destination.name}!`)
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
  }

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  // Gallery images
  const galleryImages = destination.galleryImages || [destination.image]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl shadow-2xl border border-gray-800/50"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="relative aspect-video">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={galleryImages[currentImageIndex] || "/placeholder.svg"}
            alt={`${destination.name} - image ${currentImageIndex + 1}`}
            fill
            className={`object-cover rounded-t-xl ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setIsImageLoaded(true)}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>

          {galleryImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full ${
                      currentImageIndex === index ? "bg-white" : "bg-white/50"
                    } transition-all duration-300`}
                  />
                ))}
              </div>
            </>
          )}

          <AnimatePresence>
            {isImageLoaded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 p-6 w-full"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-white mb-1"
                >
                  {destination.name}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center text-gray-300 mb-2"
                >
                  <MapPin className="h-4 w-4 mr-1 text-purple-400" />
                  <span>
                    {destination.country}, {destination.region}
                  </span>
                  {destination.rating && (
                    <div className="flex items-center ml-4">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1">{destination.rating}</span>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, staggerChildren: 0.1 }}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {destination.emojiTags.map((tag, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <Badge className="bg-gray-800/80 backdrop-blur-sm text-white border-none shadow-lg shadow-purple-900/20">
                        <motion.span
                          animate={{ rotate: [0, -10, 10, -5, 0] }}
                          transition={{ duration: 0.5, delay: i * 0.1, repeat: 1 }}
                          className="mr-1 text-lg"
                        >
                          {tag.emoji}
                        </motion.span>{" "}
                        {tag.name}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center justify-center p-3 bg-gray-800/40 rounded-lg backdrop-blur-sm">
              <Calendar className="h-5 w-5 text-purple-400 mb-1" />
              <span className="text-xs text-gray-400">Best Time</span>
              <span className="text-sm text-white text-center">May - October</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-gray-800/40 rounded-lg backdrop-blur-sm">
              <Clock className="h-5 w-5 text-purple-400 mb-1" />
              <span className="text-xs text-gray-400">Duration</span>
              <span className="text-sm text-white text-center">5-7 Days</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-gray-800/40 rounded-lg backdrop-blur-sm">
              <DollarSign className="h-5 w-5 text-purple-400 mb-1" />
              <span className="text-xs text-gray-400">Budget</span>
              <span className="text-sm text-white text-center">$$$</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-gray-800/40 rounded-lg backdrop-blur-sm">
              <Bookmark className="h-5 w-5 text-purple-400 mb-1" />
              <span className="text-xs text-gray-400">Category</span>
              <span className="text-sm text-white text-center">{destination.emojiTags[0]?.name || "Adventure"}</span>
            </div>
          </div>

          <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800 mb-4 w-full">
              <TabsTrigger
                value="about"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="tips"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600"
              >
                Travel Tips
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600"
              >
                Gallery
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={tabContentVariants}
              >
                <TabsContent value="about" className="text-gray-300 space-y-4">
                  <p>{destination.description}</p>
                </TabsContent>

                <TabsContent value="tips" className="text-gray-300">
                  <ul className="space-y-3">
                    {destination.travelTips.map((tip, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 p-3 bg-gray-800/30 rounded-lg"
                      >
                        <span className="text-purple-400 text-lg">•</span>
                        <span>{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="gallery" className="text-gray-300">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {galleryImages.map((image, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Gallery image ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex(i)
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-black/50 text-white hover:bg-black/70"
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentImageIndex(i)
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              variant={isFavorited ? "default" : "outline"}
              className={
                isFavorited
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-900/20"
                  : ""
              }
              onClick={handleFavoriteToggle}
            >
              <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
              {isFavorited ? "Saved to Wishlist" : "Add to Wishlist"}
            </Button>

            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>

            <Button
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-purple-900/20"
              onClick={handleGetDirections}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
