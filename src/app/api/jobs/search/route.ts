import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { JobStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('query') || ''
    const location = searchParams.get('location') || ''
    const employmentType = searchParams.get('employmentType') || ''
    const isRemote = searchParams.get('isRemote') === 'true'
    const experienceLevel = searchParams.get('experienceLevel') || ''
    const categoryId = searchParams.get('categoryId') || undefined
    const salaryMin = searchParams.get('salaryMin') ? parseFloat(searchParams.get('salaryMin')!) : undefined
    const salaryMax = searchParams.get('salaryMax') ? parseFloat(searchParams.get('salaryMax')!) : undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build the where clause dynamically
    let whereClause: any = {
      status: JobStatus.PUBLISHED,
      expiresAt: {
        gt: new Date() // Only show jobs that haven't expired
      }
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        {
          company: {
            name: { contains: query }
          }
        }
      ]
    }

    if (location) {
      whereClause.location = { contains: location }
    }

    if (employmentType) {
      whereClause.employmentType = employmentType
    }

    if (isRemote) {
      whereClause.isRemote = true
    }

    if (experienceLevel) {
      whereClause.experienceLevel = experienceLevel
    }

    if (categoryId) {
      whereClause.categoryId = categoryId
    }

    if (salaryMin !== undefined || salaryMax !== undefined) {
      const salaryFilter: any = {}
      if (salaryMin !== undefined) {
        salaryFilter.gte = salaryMin
      }
      if (salaryMax !== undefined) {
        salaryFilter.lte = salaryMax
      }
      whereClause.salary = {
        path: '$.min',
        ...salaryFilter
      }
    }

    // Get total count for pagination
    const totalCount = await db.job.count({ where: whereClause })

    // Get jobs with pagination
    const jobs = await db.job.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            companyId: true,
            name: true,
            logoUrl: true,
            isVerified: true
          }
        },
        category: {
          select: {
            categoryId: true,
            name: true,
            icon: true,
            color: true
          }
        },
        employer: {
          select: {
            employerId: true,
            fullName: true
          }
        }
      },
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    })

    // Transform the data to match the frontend interface
    const transformedJobs = jobs.map(job => {
      const salaryData = job.salary as { min: number; max: number; currency: string } | null
      
      return {
        id: job.jobId,
        title: job.title,
        company: {
          id: job.company.companyId,
          name: job.company.name,
          logo: job.company.logoUrl,
          isVerified: job.company.isVerified
        },
        category: job.category ? {
          id: job.category.categoryId,
          name: job.category.name,
          icon: job.category.icon,
          color: job.category.color
        } : null,
        location: job.location || '',
        salary: salaryData ? {
          min: salaryData.min,
          max: salaryData.max,
          currency: salaryData.currency
        } : null,
        employmentType: job.employmentType,
        isRemote: job.isRemote,
        description: job.description,
        requirements: job.requirements as {
          essential: string[];
          preferred: string[];
        },
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        expiresAt: job.expiresAt?.toISOString(),
        experienceLevel: job.experienceLevel,
        applicantCount: job.applicantCount,
        employer: {
          id: job.employer.employerId,
          name: job.employer.fullName
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedJobs,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error searching jobs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search jobs' },
      { status: 500 }
    )
  }
}