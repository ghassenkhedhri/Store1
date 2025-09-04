import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from '@/components/ui/use-toast'
import type { Database } from '@/lib/database.types'

type Cart = Database['public']['Tables']['carts']['Row']
type CartItem = Database['public']['Tables']['cart_items']['Row'] & {
  products: {
    title: string
    price_cents: number
    product_images: { url: string }[]
  }
  variants?: {
    name: string
    price_delta_cents: number
  }
}

export function useCart() {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      // Handle guest cart from localStorage
      const guestCartId = localStorage.getItem('guestCartId')
      if (guestCartId) {
        fetchGuestCart(guestCartId)
      }
    }
  }, [user])

  const fetchCart = async () => {
    setLoading(true)
    try {
      // Get or create active cart
      let { data: existingCart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user?.id || null)
        .eq('status', 'active')
        .single()

      if (!existingCart) {
        const { data: newCart, error } = await supabase
          .from('carts')
          .insert({
            user_id: user?.id || null,
            status: 'active'
          })
          .select()
          .single()

        if (error) throw error
        existingCart = newCart
      }

      setCart(existingCart)
      await fetchCartItems(existingCart.id)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGuestCart = async (cartId: string) => {
    setLoading(true)
    try {
      const { data: guestCart } = await supabase
        .from('carts')
        .select('*')
        .eq('id', cartId)
        .eq('status', 'active')
        .single()

      if (guestCart) {
        setCart(guestCart)
        await fetchCartItems(guestCart.id)
      }
    } catch (error) {
      console.error('Error fetching guest cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCartItems = async (cartId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          title,
          price_cents,
          product_images (url)
        ),
        variants (
          name,
          price_delta_cents
        )
      `)
      .eq('cart_id', cartId)

    if (error) {
      console.error('Error fetching cart items:', error)
      return
    }

    setItems(data as CartItem[])
  }

  const addToCart = async (productId: string, variantId?: string, qty = 1) => {
    try {
      if (!cart) {
        await fetchCart()
        return
      }

      // Get product price
      const { data: product } = await supabase
        .from('products')
        .select('price_cents')
        .eq('id', productId)
        .single()

      if (!product) throw new Error('Product not found')

      let priceSnapshot = product.price_cents
      
      if (variantId) {
        const { data: variant } = await supabase
          .from('variants')
          .select('price_delta_cents')
          .eq('id', variantId)
          .single()
        
        if (variant) {
          priceSnapshot += variant.price_delta_cents
        }
      }

      // Check if item already exists
      const existingItem = items.find(
        item => item.product_id === productId && item.variant_id === variantId
      )

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ qty: existingItem.qty + qty })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id: productId,
            variant_id: variantId,
            qty,
            price_cents_snapshot: priceSnapshot
          })

        if (error) throw error
      }

      await fetchCartItems(cart.id)
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (itemId: string, qty: number) => {
    if (qty <= 0) {
      await removeItem(itemId)
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ qty })
        .eq('id', itemId)

      if (error) throw error

      if (cart) {
        await fetchCartItems(cart.id)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      if (cart) {
        await fetchCartItems(cart.id)
      }

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      console.error('Error removing item:', error)
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    if (!cart) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)

      if (error) throw error

      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price_cents_snapshot * item.qty),
    0
  )

  return {
    cart,
    items,
    loading,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refetch: () => cart && fetchCartItems(cart.id)
  }
}