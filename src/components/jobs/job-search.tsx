'use client'

import { useState } from 'react'
import { useJobSearch } from '@/hooks/use-job-search'
import { JobGrid } from './job-grid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Search, MapPin, Briefcase, Filter } from 'lucide-react'
import type { SearchFilters } from '@/types/jobs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const filterSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  isRemote: z.boolean().optional(),
  experienceLevel: z.string().optional(),
  categoryId: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
})

const defaultValues: SearchFilters = {
  query: '',
  location: '',
  employmentType: '',
  isRemote: false,
  experienceLevel: '',
  categoryId: '',
  page: 1,
  limit: 10,
}

export function JobSearch() {
  const [filters, setFilters] = useState<SearchFilters>(defaultValues)
  const { data, isLoading } = useJobSearch(filters)
  
  const form = useForm<SearchFilters>({
    resolver: zodResolver(filterSchema),
    defaultValues,
  })

  const onSubmit = (values: SearchFilters) => {
    setFilters({
      ...values,
      page: 1, // Reset to first page on new search
    })
  }

  return (
    <div className="space-y-6">
      {/* Quick Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            className="pl-9"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value, page: 1 })}
          />
        </div>
        <div className="relative sm:w-[200px]">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Location..."
            className="pl-9"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value, page: 1 })}
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
              <SheetDescription>
                Refine your job search with additional filters
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <option value="">Any</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRemote"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Remote Only</FormLabel>
                        <FormDescription>
                          Show only remote positions
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <option value="">Any</option>
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                        <option value="lead">Lead</option>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Apply Filters
                </Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results */}
      <JobGrid
        jobs={data?.data || []}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page! - 1 })}
            disabled={!data.pagination.hasPrev}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page! + 1 })}
            disabled={!data.pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
