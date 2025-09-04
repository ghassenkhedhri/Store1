import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Sparkles, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductGrid } from '@/components/product/ProductGrid'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: { url: string }[]
  categories: { name: string }
}

type Category = Database['public']['Tables']['categories']['Row']

export function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      // Fetch trending products
      const { data: trending } = await supabase
        .from('products')
        .select(`
          *,
          product_images (url),
          categories (name)
        `)
        .eq('active', true)
        .contains('tags', ['trending'])
        .limit(8)

      // Fetch new products
      const { data: newArrivals } = await supabase
        .from('products')
        .select(`
          *,
          product_images (url),
          categories (name)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(8)

      // Fetch main categories
      const { data: mainCategories } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .limit(8)

      setTrendingProducts(trending as Product[] || [])
      setNewProducts(newArrivals as Product[] || [])
      setCategories(mainCategories || [])
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Discover Amazing Products
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Shop the latest trends, find great deals, and enjoy fast shipping on thousands of products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/categories">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/deals">View Deals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Shop by Category</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/categories">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-md transition-all duration-300 cursor-pointer">
              <Link to={`/categories/${category.slug}`}>
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">📦</span>
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/trending">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={trendingProducts} loading={loading} />
      </section>

      {/* New Arrivals */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <h2 className="text-2xl font-bold">New Arrivals</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/new">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={newProducts} loading={loading} />
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🚚</span>
              <span>Fast Shipping</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Free shipping on orders over $50. Express delivery available.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔒</span>
              <span>Secure Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Multiple payment options including cash on delivery and bank transfer.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>↩️</span>
              <span>Easy Returns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              30-day return policy. No questions asked for unused items.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}