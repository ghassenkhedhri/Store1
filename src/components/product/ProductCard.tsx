import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice } from '@/lib/utils'
import type { Database } from '@/lib/database.types'

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: { url: string }[]
  categories: { name: string }
}

interface ProductCardProps {
  product: Product
  showBadges?: boolean
}

export function ProductCard({ product, showBadges = true }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product.id)
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      // Show auth dialog
      return
    }

    // Toggle wishlist logic would go here
    setIsWishlisted(!isWishlisted)
  }

  const getBadges = () => {
    const badges = []
    const tags = product.tags as any[] || []
    
    if (tags.includes('trending')) badges.push({ text: '🔥 Trending', variant: 'trending' as const })
    if (tags.includes('new')) badges.push({ text: '✨ New', variant: 'new' as const })
    if (tags.includes('eco')) badges.push({ text: '♻️ Eco', variant: 'eco' as const })
    if (tags.includes('fast')) badges.push({ text: '⚡ Fast Ship', variant: 'fast' as const })
    if (tags.includes('deal')) badges.push({ text: '🏷️ Deal', variant: 'deal' as const })
    
    return badges
  }

  const imageUrl = product.product_images[0]?.url || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400'

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link to={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          {showBadges && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {getBadges().map((badge, index) => (
                <Badge key={index} variant={badge.variant} className="text-xs">
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            onClick={handleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.categories.name}
            </p>
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {formatPrice(product.price_cents)}
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}