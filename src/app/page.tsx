import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { JobSearch } from '@/components/jobs/job-search'
import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, Building2, Users, TrendingUp, Search } from 'lucide-react'
import Link from 'next/link'

// This can be fetched from a database in the future
const jobCategories = [
  { id: '1', name: 'Technology', icon: '💻' },
  { id: '2', name: 'Marketing', icon: '📈' },
  { id: '3', name: 'Design', icon: '🎨' },
  { id: '4', name: 'Sales', icon: '💼' },
  { id: '5', name: 'Finance', icon: '💰' },
  { id: '6', name: 'Healthcare', icon: '🏥' }
]

export default function Home() {
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

              {/* Quick Search placeholder - real search is below */}
              <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      placeholder="Search jobs, companies, or keywords..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="#job-search-section">Search</Link>
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

        {/* Job Search Section */}
        <section id="job-search-section" className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Find Your Next Opportunity</h2>
            <JobSearch />
          </div>
        </section>

        {/* Job Categories */}
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

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of professionals who have found their dream jobs through our platform
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="#job-search-section">Browse Jobs</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/employer/post">Post a Job</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}