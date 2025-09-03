'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Briefcase, Clock, DollarSign, Building2 } from 'lucide-react'

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
}

interface JobCardProps {
  job: Job
  onApply?: (jobId: string) => void
  onViewDetails?: (jobId: string) => void
  showActions?: boolean
}

export function JobCard({ job, onApply, onViewDetails, showActions = true }: JobCardProps) {
  const formatSalary = (min?: number, max?: number, currency: string = 'ZAR') => {
    if (!min && !max) return 'Salary not specified'
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
    if (min) return `${currency} ${min.toLocaleString()}+`
    if (max) return `Up to ${currency} ${max.toLocaleString()}`
    return 'Salary not specified'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getPositionTypeLabel = (type: string) => {
    switch (type) {
      case 'full_time': return 'Full Time'
      case 'part_time': return 'Part Time'
      case 'contract': return 'Contract'
      case 'internship': return 'Internship'
      default: return type.replace('_', ' ')
    }
  }

  const getRemotePolicyLabel = (policy: string) => {
    switch (policy) {
      case 'remote': return 'Remote'
      case 'onsite': return 'On-site'
      case 'hybrid': return 'Hybrid'
      default: return policy.replace('_', ' ')
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
              {job.title}
            </CardTitle>
            <CardDescription className="text-lg font-medium text-gray-700 flex items-center gap-2 mt-1">
              {job.companyLogo && (
                <img 
                  src={job.companyLogo} 
                  alt={job.company}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              {job.company}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1">
            {job.isFeatured && (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                Featured
              </Badge>
            )}
            {job.isUrgent && (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                Urgent
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{job.location}</span>
          </div>
          
          {/* Salary */}
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
            </span>
          </div>
          
          {/* Position Type & Remote Policy */}
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">{getPositionTypeLabel(job.positionType)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">{getRemotePolicyLabel(job.remotePolicy)}</span>
            </div>
          </div>
          
          {/* Posted Date */}
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Posted {formatDate(job.postedAt)}</span>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {job.description}
          </p>
          
          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => onApply?.(job.id)}
              >
                Apply Now
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewDetails?.(job.id)}
              >
                View Details
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}