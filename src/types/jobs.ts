import { JobStatus } from '@prisma/client'

export interface Company {
  id: string
  name: string
  logo: string | null
  isVerified: boolean
}

export interface Category {
  id: string
  name: string
  icon: string | null
  color: string | null
}

export interface Employer {
  id: string
  name: string | null
}

export interface Salary {
  min: number
  max: number
  currency: string
}

export interface JobRequirements {
  essential: string[]
  preferred: string[]
}

export interface Job {
  id: string
  title: string
  company: Company
  category: Category | null
  location: string
  salary: Salary | null
  employmentType: string | null
  isRemote: boolean
  description: string
  requirements: JobRequirements
  experienceLevel: string | null
  applicantCount: number
  createdAt: string
  updatedAt: string
  expiresAt: string | null
  employer: Employer
}

export interface SearchFilters {
  query?: string
  location?: string
  employmentType?: string
  isRemote?: boolean
  experienceLevel?: string
  categoryId?: string
  salaryMin?: number
  salaryMax?: number
  page?: number
  limit?: number
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface SearchResponse {
  success: boolean
  data: Job[]
  pagination: PaginationInfo
}
