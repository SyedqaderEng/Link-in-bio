'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Edit2, Trash2, DollarSign, Package, TrendingUp, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'

interface Product {
  id: string
  name: string
  description: string | null
  type: string
  price: number
  currency: string
  imageUrl: string | null
  downloadUrl: string | null
  isActive: boolean
  salesCount: number
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'digital',
    price: '',
    currency: 'usd',
    imageUrl: '',
    downloadUrl: '',
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const { user } = await response.json()

      const productsResponse = await fetch(`/api/products?userId=${user.id}`)
      if (!productsResponse.ok) throw new Error('Failed to load products')

      const { products: userProducts } = await productsResponse.json()
      setProducts(userProducts || [])
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Name and price are required')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

      toast.success('Product created successfully!')
      setShowCreateModal(false)
      setFormData({
        name: '',
        description: '',
        type: 'digital',
        price: '',
        currency: 'usd',
        imageUrl: '',
        downloadUrl: '',
      })
      loadProducts()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete product')

      toast.success('Product deleted successfully!')
      loadProducts()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const toggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !product.isActive }),
      })

      if (!response.ok) throw new Error('Failed to update product')

      toast.success(`Product ${product.isActive ? 'disabled' : 'enabled'}`)
      loadProducts()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product')
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-400">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold mb-2">
              <span className="gradient-text">Products</span>
            </h1>
            <p className="text-gray-400">Sell digital products through your LinkBio page</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            Create Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6 text-primary-cyan" />
              <h3 className="text-lg font-semibold">Total Products</h3>
            </div>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold">Total Sales</h3>
            </div>
            <p className="text-3xl font-bold">
              {products.reduce((sum, p) => sum + p.salesCount, 0)}
            </p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">Revenue</h3>
            </div>
            <p className="text-3xl font-bold">
              $
              {products
                .reduce((sum, p) => sum + Number(p.price) * p.salesCount, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="glass p-12 rounded-2xl text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold mb-2">No products yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first digital product to start selling
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition"
              >
                Create Your First Product
              </button>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="glass p-6 rounded-2xl">
                <div className="flex items-start gap-4">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        {product.description && (
                          <p className="text-gray-400 text-sm mt-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-cyan">
                          {formatPrice(Number(product.price), product.currency)}
                        </p>
                        <p className="text-sm text-gray-400 capitalize">
                          {product.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-400 mt-4">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {product.salesCount} sales
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.isActive
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-gray-500/20 text-gray-500'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`p-2 rounded-lg transition ${
                        product.isActive
                          ? 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30'
                          : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                      }`}
                      title={product.isActive ? 'Disable' : 'Enable'}
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Product Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6 gradient-text">
                Create New Product
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    placeholder="My Awesome Product"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    rows={3}
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                      placeholder="9.99"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="gbp">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                  >
                    <option value="digital">Digital Product</option>
                    <option value="service">Service</option>
                    <option value="subscription">Subscription</option>
                    <option value="donation">Donation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    placeholder="https://example.com/product-image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Download URL (for digital products)
                  </label>
                  <input
                    type="url"
                    value={formData.downloadUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, downloadUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    placeholder="https://example.com/download/product.zip"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCreateProduct}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Product'}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={saving}
                  className="px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
