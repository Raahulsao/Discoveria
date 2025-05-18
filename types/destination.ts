export interface EmojiTag {
  emoji: string
  name: string
}

export interface Destination {
  id: string
  name: string
  country: string
  region: string
  emojiTags: EmojiTag[]
  shortDescription: string
  description: string
  image: string
  galleryImages?: string[]
  travelTips: string[]
  rating?: number
  trending?: boolean
}
