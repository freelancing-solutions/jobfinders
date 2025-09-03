import { useQuery } from '@tanstack/react-query'
import { SearchFilters, SearchResponse } from '@/types/jobs'

export function useJobSearch(filters: SearchFilters) {
  const queryParams = new URLSearchParams()

  // Add filters to query params
  if (filters.query) queryParams.set('query', filters.query)
  if (filters.location) queryParams.set('location', filters.location)
  if (filters.employmentType) queryParams.set('employmentType', filters.employmentType)
  if (filters.isRemote !== undefined) queryParams.set('isRemote', String(filters.isRemote))
  if (filters.experienceLevel) queryParams.set('experienceLevel', filters.experienceLevel)
  if (filters.categoryId) queryParams.set('categoryId', filters.categoryId)
  if (filters.salaryMin) queryParams.set('salaryMin', String(filters.salaryMin))
  if (filters.salaryMax) queryParams.set('salaryMax', String(filters.salaryMax))
  if (filters.page) queryParams.set('page', String(filters.page))
  if (filters.limit) queryParams.set('limit', String(filters.limit))

  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/search?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }
      return response.json() as Promise<SearchResponse>
    },
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    placeholderData: keepPreviousData => keepPreviousData // Keep old data while fetching new data
  })
}
