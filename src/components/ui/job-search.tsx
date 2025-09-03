'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, Filter, X } from 'lucide-react'

interface SearchFilters {
  query: string
  location: string
  positionType: string
  remotePolicy: string
  experienceLevel: string
  salaryMin: string
  salaryMax: string
}

interface JobSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClearFilters: () => void
  className?: string
}

const positionTypes = [
  { value: '', label: 'Any Position Type' },
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
]

const remotePolicies = [
  { value: '', label: 'Any Work Policy' },
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' }
]

const experienceLevels = [
  { value: '', label: 'Any Experience Level' },
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' }
]

export function JobSearch({ onSearch, onClearFilters, className }: JobSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    positionType: '',
    remotePolicy: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: ''
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const hasActiveFilters = () => {
    return filters.location || filters.positionType || filters.remotePolicy || 
           filters.experienceLevel || filters.salaryMin || filters.salaryMax
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleClearFilters = () => {
    setFilters({
      query: '',
      location: '',
      positionType: '',
      remotePolicy: '',
      experienceLevel: '',
      salaryMin: '',
      salaryMax: ''
    })
    onClearFilters()
  }

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getActiveFiltersCount = () => {
    return [
      filters.location,
      filters.positionType,
      filters.remotePolicy,
      filters.experienceLevel,
      filters.salaryMin,
      filters.salaryMax
    ].filter(Boolean).length
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Main Search Row */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Location..."
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Search Jobs
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Select value={filters.positionType} onValueChange={(value) => updateFilter('positionType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Position Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.remotePolicy} onValueChange={(value) => updateFilter('remotePolicy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Work Policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {remotePolicies.map((policy) => (
                      <SelectItem key={policy.value} value={policy.value}>
                        {policy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.experienceLevel} onValueChange={(value) => updateFilter('experienceLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min Salary"
                    value={filters.salaryMin}
                    onChange={(e) => updateFilter('salaryMin', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Salary"
                    value={filters.salaryMax}
                    onChange={(e) => updateFilter('salaryMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters() && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filters.location && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Location: {filters.location}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter('location', '')}
                      />
                    </Badge>
                  )}
                  {filters.positionType && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {positionTypes.find(t => t.value === filters.positionType)?.label}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter('positionType', '')}
                      />
                    </Badge>
                  )}
                  {filters.remotePolicy && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {remotePolicies.find(p => p.value === filters.remotePolicy)?.label}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter('remotePolicy', '')}
                      />
                    </Badge>
                  )}
                  {filters.experienceLevel && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {experienceLevels.find(l => l.value === filters.experienceLevel)?.label}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter('experienceLevel', '')}
                      />
                    </Badge>
                  )}
                  {(filters.salaryMin || filters.salaryMax) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Salary: {filters.salaryMin || '0'} - {filters.salaryMax || '∞'}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => {
                          updateFilter('salaryMin', '')
                          updateFilter('salaryMax', '')
                        }}
                      />
                    </Badge>
                  )}
                </div>
              )}

              {/* Clear Filters Button */}
              {hasActiveFilters() && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}