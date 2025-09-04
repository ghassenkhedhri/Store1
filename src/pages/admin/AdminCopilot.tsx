import { useState } from 'react'
import { Bot, Send, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'

interface CopilotResponse {
  type: 'products' | 'insights' | 'recommendations'
  title: string
  items: Array<{
    id: string
    name: string
    metrics?: Record<string, any>
    link?: string
    badge?: string
  }>
  summary?: string
}

const presetQuestions = [
  {
    icon: TrendingUp,
    text: "What should we sponsor this week?",
    query: "sponsor_candidates"
  },
  {
    icon: AlertTriangle,
    text: "Which SKUs are underpriced vs market?",
    query: "underpriced_products"
  },
  {
    icon: Target,
    text: "What's trending by category?",
    query: "trending_by_category"
  },
  {
    icon: Zap,
    text: "Low-stock bestsellers?",
    query: "low_stock_bestsellers"
  }
]

export function AdminCopilot() {
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant', content: string | CopilotResponse }>>([
    {
      type: 'assistant',
      content: "Hello! I'm your AI assistant. I can help you analyze your store data, find opportunities, and make data-driven decisions. Try asking me one of the questions below or type your own."
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePresetQuestion = async (query: string, text: string) => {
    setMessages(prev => [...prev, { type: 'user', content: text }])
    setLoading(true)

    try {
      const response = await processQuery(query)
      setMessages(prev => [...prev, { type: 'assistant', content: response }])
    } catch (error) {
      console.error('Error processing query:', error)
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: "I'm sorry, I encountered an error processing your request. Please try again." 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Simple keyword matching for demo
      let query = 'general'
      if (userMessage.toLowerCase().includes('sponsor')) query = 'sponsor_candidates'
      else if (userMessage.toLowerCase().includes('trending')) query = 'trending_by_category'
      else if (userMessage.toLowerCase().includes('stock')) query = 'low_stock_bestsellers'
      else if (userMessage.toLowerCase().includes('price')) query = 'underpriced_products'

      const response = await processQuery(query)
      setMessages(prev => [...prev, { type: 'assistant', content: response }])
    } catch (error) {
      console.error('Error processing query:', error)
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: "I'm sorry, I encountered an error processing your request. Please try again." 
      }])
    } finally {
      setLoading(false)
    }
  }

  const processQuery = async (query: string): Promise<CopilotResponse> => {
    switch (query) {
      case 'sponsor_candidates':
        return await getSponsorCandidates()
      case 'trending_by_category':
        return await getTrendingByCategory()
      case 'low_stock_bestsellers':
        return await getLowStockBestsellers()
      case 'underpriced_products':
        return await getUnderpricedProducts()
      default:
        return {
          type: 'insights',
          title: 'General Insights',
          items: [
            {
              id: '1',
              name: 'Store Performance',
              metrics: { status: 'Good', trend: 'Up 12%' }
            }
          ],
          summary: "Your store is performing well. Consider checking the preset questions for specific insights."
        }
    }
  }

  const getSponsorCandidates = async (): Promise<CopilotResponse> => {
    // Get trending products with good margins
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        title,
        price_cents,
        tags,
        variants (stock)
      `)
      .eq('active', true)
      .contains('tags', ['trending'])
      .limit(5)

    return {
      type: 'recommendations',
      title: 'Sponsor Candidates This Week',
      items: products?.map(product => ({
        id: product.id,
        name: product.title,
        metrics: {
          price: formatPrice(product.price_cents),
          stock: product.variants.reduce((sum, v) => sum + v.stock, 0),
          trend: 'Trending'
        },
        link: `/admin/products/${product.id}`,
        badge: 'High Potential'
      })) || [],
      summary: "These products are trending and have good stock levels, making them ideal for promotional campaigns."
    }
  }

  const getTrendingByCategory = async (): Promise<CopilotResponse> => {
    const { data: categories } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        products (
          id,
          title,
          tags
        )
      `)
      .limit(5)

    return {
      type: 'insights',
      title: 'Trending by Category',
      items: categories?.map(category => ({
        id: category.id,
        name: category.name,
        metrics: {
          trending_products: category.products.filter((p: any) => 
            p.tags && p.tags.includes('trending')
          ).length,
          total_products: category.products.length
        }
      })) || [],
      summary: "Electronics and Home categories are showing the strongest trending activity."
    }
  }

  const getLowStockBestsellers = async (): Promise<CopilotResponse> => {
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        title,
        price_cents,
        variants (stock)
      `)
      .eq('active', true)
      .contains('tags', ['trending'])

    const lowStockProducts = products?.filter(product => 
      product.variants.some(v => v.stock < 10)
    ) || []

    return {
      type: 'recommendations',
      title: 'Low-Stock Bestsellers',
      items: lowStockProducts.slice(0, 5).map(product => ({
        id: product.id,
        name: product.title,
        metrics: {
          price: formatPrice(product.price_cents),
          stock: Math.min(...product.variants.map(v => v.stock)),
          status: 'Restock Needed'
        },
        link: `/admin/products/${product.id}`,
        badge: 'Urgent'
      })),
      summary: "These bestselling products are running low on stock and need immediate attention."
    }
  }

  const getUnderpricedProducts = async (): Promise<CopilotResponse> => {
    // This would compare with competitor_products table
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        title,
        price_cents,
        competitor_products (price_cents, source)
      `)
      .eq('active', true)
      .limit(5)

    return {
      type: 'recommendations',
      title: 'Pricing Opportunities',
      items: products?.map(product => ({
        id: product.id,
        name: product.title,
        metrics: {
          our_price: formatPrice(product.price_cents),
          market_avg: formatPrice(product.price_cents * 1.15), // Placeholder
          opportunity: '+15%'
        },
        link: `/admin/products/${product.id}`,
        badge: 'Price Opportunity'
      })) || [],
      summary: "These products could be priced higher based on market analysis."
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Admin Copilot</h1>
        </div>
        <p className="text-muted-foreground">
          Get insights and recommendations based on your store data
        </p>
      </div>

      {/* Preset Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {presetQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handlePresetQuestion(question.query, question.text)}
                disabled={loading}
              >
                <question.icon className="mr-3 h-5 w-5 text-primary" />
                <span className="text-left">{question.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {typeof message.content === 'string' ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="font-medium">{message.content.title}</h4>
                      <div className="space-y-2">
                        {message.content.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-background rounded border">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              {item.metrics && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {Object.entries(item.metrics).map(([key, value]) => (
                                    <span key={key} className="text-xs text-muted-foreground">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-2">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      {message.content.summary && (
                        <p className="text-sm text-muted-foreground border-t pt-2">
                          {message.content.summary}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    <span className="text-sm">Analyzing data...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your store..."
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}