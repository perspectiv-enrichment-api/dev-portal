export interface Developer {
  id: string
  email: string
  name: string
  company: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  joinedAt: string
}

export interface APIKey {
  id: string
  key: string
  name: string
  createdAt: string
  lastUsed: string
  status: 'active' | 'inactive'
  rateLimit: number
}

export interface UsageLog {
  id: string
  timestamp: string
  merchantName: string
  endpoint: string
  statusCode: number
  latency: number
  country: string
  apiKeyId: string
}

export interface MerchantData {
  id: string
  name: string
  logo: string
  industry: string
  country: string
  website?: string
}

// Mock developer data
export const mockDeveloper: Developer = {
  id: 'dev_123',
  email: 'alex.johnson@company.com',
  name: 'Alex Johnson',
  company: 'TechCorp Inc',
  plan: 'pro',
  joinedAt: '2024-01-15',
}

// Mock API Keys
export const mockAPIKeys: APIKey[] = [
  {
    id: 'key_1',
    key: 'pk_live_abc123xyz789def456',
    name: 'Production API Key',
    createdAt: '2024-01-20',
    lastUsed: '2024-04-02',
    status: 'active',
    rateLimit: 10000,
  },
  {
    id: 'key_2',
    key: 'pk_test_test123test456test789',
    name: 'Development API Key',
    createdAt: '2024-01-20',
    lastUsed: '2024-03-28',
    status: 'active',
    rateLimit: 1000,
  },
  {
    id: 'key_3',
    key: 'pk_live_old987654321oldkey',
    name: 'Legacy Integration',
    createdAt: '2023-11-10',
    lastUsed: '2024-02-15',
    status: 'inactive',
    rateLimit: 5000,
  },
]

// Mock merchants database
export const mockMerchants: MerchantData[] = [
  {
    id: 'merchant_1',
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    industry: 'E-commerce',
    country: 'US',
    website: 'amazon.com',
  },
  {
    id: 'merchant_2',
    name: 'Apple',
    logo: 'https://logo.clearbit.com/apple.com',
    industry: 'Technology',
    country: 'US',
    website: 'apple.com',
  },
  {
    id: 'merchant_3',
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    industry: 'Software',
    country: 'US',
    website: 'microsoft.com',
  },
  {
    id: 'merchant_4',
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    industry: 'Technology',
    country: 'US',
    website: 'google.com',
  },
  {
    id: 'merchant_5',
    name: 'Netflix',
    logo: 'https://logo.clearbit.com/netflix.com',
    industry: 'Entertainment',
    country: 'US',
    website: 'netflix.com',
  },
  {
    id: 'merchant_6',
    name: 'Spotify',
    logo: 'https://logo.clearbit.com/spotify.com',
    industry: 'Music',
    country: 'SE',
    website: 'spotify.com',
  },
  {
    id: 'merchant_7',
    name: 'Stripe',
    logo: 'https://logo.clearbit.com/stripe.com',
    industry: 'Fintech',
    country: 'US',
    website: 'stripe.com',
  },
  {
    id: 'merchant_8',
    name: 'Uber',
    logo: 'https://logo.clearbit.com/uber.com',
    industry: 'Transportation',
    country: 'US',
    website: 'uber.com',
  },
  {
    id: 'merchant_9',
    name: 'Airbnb',
    logo: 'https://logo.clearbit.com/airbnb.com',
    industry: 'Travel',
    country: 'US',
    website: 'airbnb.com',
  },
  {
    id: 'merchant_10',
    name: 'PayPal',
    logo: 'https://logo.clearbit.com/paypal.com',
    industry: 'Fintech',
    country: 'US',
    website: 'paypal.com',
  },
  {
    id: 'merchant_11',
    name: 'Nike',
    logo: 'https://logo.clearbit.com/nike.com',
    industry: 'Retail',
    country: 'US',
    website: 'nike.com',
  },
  {
    id: 'merchant_12',
    name: 'Adidas',
    logo: 'https://logo.clearbit.com/adidas.com',
    industry: 'Retail',
    country: 'DE',
    website: 'adidas.com',
  },
  {
    id: 'merchant_13',
    name: 'Starbucks',
    logo: 'https://logo.clearbit.com/starbucks.com',
    industry: 'Food & Beverage',
    country: 'US',
    website: 'starbucks.com',
  },
  {
    id: 'merchant_14',
    name: 'McDonald\'s',
    logo: 'https://logo.clearbit.com/mcdonalds.com',
    industry: 'Food & Beverage',
    country: 'US',
    website: 'mcdonalds.com',
  },
  {
    id: 'merchant_15',
    name: 'Tesla',
    logo: 'https://logo.clearbit.com/tesla.com',
    industry: 'Automotive',
    country: 'US',
    website: 'tesla.com',
  },
  {
    id: 'merchant_16',
    name: 'BMW',
    logo: 'https://logo.clearbit.com/bmw.com',
    industry: 'Automotive',
    country: 'DE',
    website: 'bmw.com',
  },
  {
    id: 'merchant_17',
    name: 'Visa',
    logo: 'https://logo.clearbit.com/visa.com',
    industry: 'Financial Services',
    country: 'US',
    website: 'visa.com',
  },
  {
    id: 'merchant_18',
    name: 'Mastercard',
    logo: 'https://logo.clearbit.com/mastercard.com',
    industry: 'Financial Services',
    country: 'US',
    website: 'mastercard.com',
  },
]

// Generate realistic usage logs
function generateUsageLogs(): UsageLog[] {
  const logs: UsageLog[] = []
  const merchants = mockMerchants
  const countries = ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU', 'SE']
  const now = new Date()

  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const hoursAgo = Math.floor(Math.random() * 24)
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000)

    logs.push({
      id: `log_${i}`,
      timestamp: timestamp.toISOString(),
      merchantName: merchants[Math.floor(Math.random() * merchants.length)].name,
      endpoint: '/api/enrich',
      statusCode: Math.random() > 0.05 ? 200 : 400,
      latency: Math.floor(Math.random() * 500) + 50,
      country: countries[Math.floor(Math.random() * countries.length)],
      apiKeyId: 'key_1',
    })
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const mockUsageLogs = generateUsageLogs()

// Calculate analytics
export function getAnalytics() {
  const totalRequests = mockUsageLogs.length
  const successfulRequests = mockUsageLogs.filter((log) => log.statusCode === 200).length
  const failedRequests = totalRequests - successfulRequests
  const averageLatency = Math.round(
    mockUsageLogs.reduce((sum, log) => sum + log.latency, 0) / totalRequests
  )

  const countryCounts = mockUsageLogs.reduce(
    (acc, log) => {
      acc[log.country] = (acc[log.country] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const merchantCounts = mockUsageLogs.reduce(
    (acc, log) => {
      acc[log.merchantName] = (acc[log.merchantName] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    successRate: ((successfulRequests / totalRequests) * 100).toFixed(2),
    averageLatency,
    countryCounts,
    merchantCounts,
  }
}

// Subscription tier limits
export const tierLimits = {
  free: { requestsPerMonth: 10000, rateLimit: 100, cost: 0 },
  starter: { requestsPerMonth: 100000, rateLimit: 1000, cost: 29 },
  pro: { requestsPerMonth: 1000000, rateLimit: 10000, cost: 99 },
  enterprise: { requestsPerMonth: 10000000, rateLimit: 100000, cost: 'custom' },
}
