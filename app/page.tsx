"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Search, MapPin, Compass, Sparkles, Grid, List, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { destinations } from "@/data/destinations"
import DestinationCard from "@/components/destination-card"
import DestinationModal from "@/components/destination-modal"
import AnimatedGlobe from "@/components/animated-globe"
import ParticleBackground from "@/components/particle-background"
import type { Destination } from "@/types/destination"

export default function Home() {
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(destinations)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([])
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGridView, setIsGridView] = useState(true)
  const [sortBy, setSortBy] = useState("default")
  const [showTrending, setShowTrending] = useState(true)

  const headerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.2])
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95])

  const regions = ["all", ...Array.from(new Set(destinations.map((dest) => dest.region)))]
  const allEmojis = Array.from(new Set(destinations.flatMap((dest) => dest.emojiTags.map((tag) => tag.emoji))))

  useEffect(() => {
    let results = [...destinations]

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.country.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by region
    if (selectedRegion !== "all") {
      results = results.filter((dest) => dest.region === selectedRegion)
    }

    // Filter by emoji tags
    if (selectedEmojis.length > 0) {
      results = results.filter((dest) =>
        selectedEmojis.every((emoji) => dest.emojiTags.some((tag) => tag.emoji === emoji)),
      )
    }

    // Sort destinations
    if (sortBy === "name-asc") {
      results.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "name-desc") {
      results.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortBy === "trending") {
      results.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
    }

    setFilteredDestinations(results)
  }, [searchQuery, selectedRegion, selectedEmojis, sortBy])

  const handleEmojiToggle = (emoji: string) => {
    setSelectedEmojis((prev) => (prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]))
  }

  const handleOpenModal = (destination: Destination) => {
    setSelectedDestination(destination)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleRandomDestination = () => {
    const randomIndex = Math.floor(Math.random() * destinations.length)
    handleOpenModal(destinations[randomIndex])
  }

  const emojiContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const emojiVariants = {
    hidden: { scale: 0, rotate: -10, y: 20 },
    visible: { scale: 1, rotate: 0, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
    hover: { scale: 1.2, rotate: 5, transition: { duration: 0.3 } },
    tap: { scale: 0.9, rotate: -5, transition: { duration: 0.1 } },
  }

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } },
  }

  const titleText = "Discoveria"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 relative overflow-hidden">
      <ParticleBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.header ref={headerRef} style={{ opacity: headerOpacity, scale: headerScale }} className="mb-12 pt-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-full h-[300px] mb-8 overflow-hidden rounded-xl">
              <AnimatedGlobe />
              <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
                <motion.div variants={titleVariants} initial="hidden" animate="visible" className="flex">
                  {titleText.split("").map((letter, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariants}
                      className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="text-gray-300 max-w-2xl mt-4 text-xl"
                >
                  Explore amazing destinations around the world
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 backdrop-blur-sm bg-gray-900/30 p-6 rounded-xl border border-gray-800/50 shadow-xl"
        >
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search destinations..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-400" />
                Regions
              </h3>
              <Tabs defaultValue="all" value={selectedRegion} onValueChange={setSelectedRegion}>
                <TabsList className="bg-gray-800/50 backdrop-blur-sm">
                  {regions.map((region) => (
                    <TabsTrigger
                      key={region}
                      value={region}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                    >
                      {region.charAt(0).toUpperCase() + region.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  id="trending-mode"
                  checked={showTrending}
                  onCheckedChange={setShowTrending}
                  className="data-[state=checked]:bg-purple-600"
                />
                <Label htmlFor="trending-mode" className="text-gray-300 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  Trending
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsGridView(true)}
                  className={`${
                    isGridView ? "bg-purple-600 text-white" : "bg-gray-800/50 text-gray-400"
                  } border-gray-700`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsGridView(false)}
                  className={`${
                    !isGridView ? "bg-purple-600 text-white" : "bg-gray-800/50 text-gray-400"
                  } border-gray-700`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-gray-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="trending">Trending First</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleRandomDestination}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-900/20"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Random Destination
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-gray-300 mb-2 flex items-center gap-2">
              <Compass className="h-4 w-4 text-purple-400" />
              Experiences
            </h3>
            <motion.div
              variants={emojiContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2"
            >
              {allEmojis.map((emoji, index) => (
                <motion.div
                  key={emoji}
                  variants={emojiVariants}
                  whileHover="hover"
                  whileTap="tap"
                  custom={index}
                  className="relative"
                >
                  <Badge
                    variant={selectedEmojis.includes(emoji) ? "default" : "outline"}
                    className={`text-base cursor-pointer ${
                      selectedEmojis.includes(emoji)
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-900/20"
                        : "bg-gray-800/50 hover:bg-gray-700/50"
                    }`}
                    onClick={() => handleEmojiToggle(emoji)}
                  >
                    <span className="mr-1 text-lg">{emoji}</span>{" "}
                    {
                      destinations
                        .find((d) => d.emojiTags.some((tag) => tag.emoji === emoji))
                        ?.emojiTags.find((tag) => tag.emoji === emoji)?.name
                    }
                  </Badge>
                  {selectedEmojis.includes(emoji) && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500"
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(236, 72, 153, 0)",
                          "0 0 8px rgba(236, 72, 153, 0.8)",
                          "0 0 0px rgba(236, 72, 153, 0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {filteredDestinations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-400 backdrop-blur-sm bg-gray-900/30 rounded-xl border border-gray-800/50"
            >
              <p>No destinations found matching your criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedRegion("all")
                  setSelectedEmojis([])
                }}
                className="text-purple-400"
              >
                Reset filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                isGridView
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredDestinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05 },
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <DestinationCard
                    destination={destination}
                    onClick={() => handleOpenModal(destination)}
                    isGridView={isGridView}
                    showTrending={showTrending}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedDestination && (
          <DestinationModal destination={selectedDestination} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  )
}
