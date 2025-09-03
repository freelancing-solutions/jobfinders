'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/ui/job-card'
import { JobSearch } from '@/components/ui/job-search'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Briefcase, Clock, DollarSign, Building2, Users, TrendingUp } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  positionType: string
  remotePolicy: string
  description: string
  postedAt: string
  isFeatured: boolean
  isUrgent: boolean
  companyLogo?: string
  experienceLevel?: string
  applicationCount: number
  viewCount: number
  matchScore?: number
}

interface JobCategory {
  id: string
  name: string
  icon: string
  color: string
}

interface SearchFilters {
  query: string
  location: string
  positionType: string
  remotePolicy: string
  experienceLevel: string
  salaryMin: string
  salaryMax: string
}

const jobCategories: JobCategory[] = [
  { id: '1', name: 'Technology', icon: '💻', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Marketing', icon: '📈', color: 'bg-green-100 text-green-800' },
  { id: '3', name: 'Design', icon: '🎨', color: 'bg-purple-100 text-purple-800' },
  { id: '4', name: 'Sales', icon: '💼', color: 'bg-orange-100 text-orange-800' },
  { id: '5', name: 'Finance', icon: '💰', color: 'bg-yellow-100 text-yellow-800' },
  { id: '6', name: 'Healthcare', icon: '🏥', color: 'bg-red-100 text-red-800' }
]

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async (filters?: SearchFilters) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })
      }
      
      const response = await fetch(`/api/jobs/search?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }
      
      const data = await response.json()
      if (data.success) {
        setJobs(data.data)
        setFilteredJobs(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch jobs')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
      // Fallback to empty array on error
      setJobs([])
      setFilteredJobs([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (filters: SearchFilters) => {
    fetchJobs(filters)
  }

  const handleClearFilters = () => {
    fetchJobs()
  }

  const handleApply = (jobId: string) => {
    // Placeholder for apply functionality
    console.log('Applying to job:', jobId)
    // In a real app, this would navigate to an application page or open a modal
  }

  const handleViewDetails = (jobId: string) => {
    // Placeholder for view details functionality
    console.log('Viewing details for job:', jobId)
    // In a real app, this would navigate to a job details page
  }

  const handleSaveJob = (jobId: string) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
    } else {
      newSavedJobs.add(jobId)
    }
    setSavedJobs(newSavedJobs)
  }

  const featuredJobs = filteredJobs.filter(job => job.isFeatured)
  const recentJobs = filteredJobs.filter(job => !job.isFeatured)

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Dream Job in South Africa
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with top companies and discover opportunities that match your skills and aspirations
            </p>
            
            {/* Quick Search */}
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    placeholder="Search jobs, companies, or keywords..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch({
                          query: (e.target as HTMLInputElement).value,
                          location: '',
                          positionType: '',
                          remotePolicy: '',
                          experienceLevel: '',
                          salaryMin: '',
                          salaryMax: ''
                        })
                      }
                    }}
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Briefcase className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">10,000+</h3>
              <p className="text-gray-600">Active Jobs</p>
            </div>
            <div className="flex flex-col items-center">
              <Building2 className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">2,500+</h3>
              <p className="text-gray-600">Companies</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">50,000+</h3>
              <p className="text-gray-600">Job Seekers</p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <JobSearch 
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
          />
        </div>
      </section>

      {/* Loading and Error States */}
      {loading && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </section>
      )}

      {error && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => fetchJobs()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Job Categories */}
      {!loading && !error && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {jobCategories.map((category) => (
                <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Jobs */}
      {!loading && !error && featuredJobs.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Jobs</h2>
              <Button variant="outline">View All Jobs</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onViewDetails={handleViewDetails}
                  showActions={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Jobs */}
      {!loading && !error && recentJobs.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Recent Jobs</h2>
              <div className="flex gap-2">
                <Button variant="outline">View All Jobs</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onViewDetails={handleViewDetails}
                  showActions={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Jobs State */}
      {!loading && !error && filteredJobs.length === 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-gray-50 rounded-lg p-8">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or check back later for new opportunities.</p>
              <Button onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who have found their dream jobs through our platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Browse Jobs
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Post a Job
            </Button>
          </div>
        </div>
      </section>
      </div>
    </AppLayout>
  )
}