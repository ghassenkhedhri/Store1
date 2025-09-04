import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'

interface DashboardStats {
  revenue: {
    today: number
    week: number
    month: number
  }
  orders: {
    today: number
    week: number
    month: number
  }
  customers: {
    total: number
    new: number
  }
  products: {
    total: number
    lowStock: number
  }
  aov: number
  conversionRate: number
}

export function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
    
    // Set up realtime subscription for live updates
    const subscription = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchDashboardStats()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchDashboardStats()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Revenue stats
      const { data: revenueToday } = await supabase
        .from('orders')
        .select('total_cents')
        .gte('created_at', today.toISOString())
        .eq('status', 'paid')

      const { data: revenueWeek } = await supabase
        .from('orders')
        .select('total_cents')
        .gte('created_at', weekAgo.toISOString())
        .eq('status', 'paid')

      const { data: revenueMonth } = await supabase
        .from('orders')
        .select('total_cents')
        .gte('created_at', monthAgo.toISOString())
        .eq('status', 'paid')

      // Order stats
      const { count: ordersToday } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      const { count: ordersWeek } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString())

      const { count: ordersMonth } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString())

      // Customer stats
      const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: newCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString())

      // Product stats
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)

      const { data: lowStockVariants } = await supabase
        .from('variants')
        .select('product_id')
        .lt('stock', 10)

      const lowStockProducts = new Set(lowStockVariants?.map(v => v.product_id) || []).size

      const dashboardStats: DashboardStats = {
        revenue: {
          today: revenueToday?.reduce((sum, order) => sum + order.total_cents, 0) || 0,
          week: revenueWeek?.reduce((sum, order) => sum + order.total_cents, 0) || 0,
          month: revenueMonth?.reduce((sum, order) => sum + order.total_cents, 0) || 0,
        },
        orders: {
          today: ordersToday || 0,
          week: ordersWeek || 0,
          month: ordersMonth || 0,
        },
        customers: {
          total: totalCustomers || 0,
          new: newCustomers || 0,
        },
        products: {
          total: totalProducts || 0,
          lowStock: lowStockProducts,
        },
        aov: ordersMonth && ordersMonth > 0 
          ? (revenueMonth?.reduce((sum, order) => sum + order.total_cents, 0) || 0) / ordersMonth
          : 0,
        conversionRate: 0.024, // Placeholder - would calculate from events
      }

      setStats(dashboardStats)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (30d)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.revenue.month)}</div>
            <p className="text-xs text-muted-foreground">
              Today: {formatPrice(stats.revenue.today)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders (30d)</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.month}</div>
            <p className="text-xs text-muted-foreground">
              Today: {stats.orders.today}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.customers.new} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AOV</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.aov)}</div>
            <p className="text-xs text-muted-foreground">
              {(stats.conversionRate * 100).toFixed(1)}% conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.products.lowStock > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-200">
                    Low Stock Alert
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    {stats.products.lowStock} products need restocking
                  </p>
                </div>
                <Badge variant="outline" className="border-orange-200 text-orange-800">
                  {stats.products.lowStock}
                </Badge>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Pending Orders
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Orders waiting for fulfillment
                </p>
              </div>
              <Badge variant="outline" className="border-blue-200 text-blue-800">
                {stats.orders.today}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/products/new">
                <Package className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Process Orders
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/marketing">
                <Mail className="mr-2 h-4 w-4" />
                Create Campaign
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/copilot">
                <Bot className="mr-2 h-4 w-4" />
                Ask Copilot
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-sm">New order #1001 received</span>
              </div>
              <span className="text-xs text-muted-foreground">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                <span className="text-sm">Product "Wireless Headphones" updated</span>
              </div>
              <span className="text-xs text-muted-foreground">15 minutes ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full" />
                <span className="text-sm">New customer registered</span>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}