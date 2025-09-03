import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('query') || ''
    const location = searchParams.get('location') || ''
    const positionType = searchParams.get('positionType') || ''
    const remotePolicy = searchParams.get('remotePolicy') || ''
    const experienceLevel = searchParams.get('experienceLevel') || ''
    const salaryMin = searchParams.get('salaryMin') ? parseFloat(searchParams.get('salaryMin')!) : undefined
    const salaryMax = searchParams.get('salaryMax') ? parseFloat(searchParams.get('salaryMax')!) : undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build the where clause dynamically
    let whereClause: any = {
      status: 'active'
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { company: { name: { contains: query, mode: 'insensitive' } } }
      ]
    }

    if (location) {
      whereClause.OR = whereClause.OR || []
      whereClause.OR.push(
        { city: { contains: location, mode: 'insensitive' } },
        { province: { contains: location, mode: 'insensitive' } },
        { country: { contains: location, mode: 'insensitive' } }
      )
    }

    if (positionType) {
      whereClause.positionType = positionType
    }

    if (remotePolicy) {
      whereClause.remotePolicy = remotePolicy
    }

    if (experienceLevel) {
      whereClause.experienceLevel = experienceLevel
    }

    if (salaryMin !== undefined || salaryMax !== undefined) {
      whereClause.AND = []
      if (salaryMin !== undefined) {
        whereClause.AND.push({ salaryMin: { gte: salaryMin } })
      }
      if (salaryMax !== undefined) {
        whereClause.AND.push({ salaryMax: { lte: salaryMax } })
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
        { isFeatured: 'desc' },
        { isUrgent: 'desc' },
        { postedAt: 'desc' }
      ],
      skip: offset,
      take: limit
    })

    // Transform the data to match the frontend interface
    const transformedJobs = jobs.map(job => ({
      id: job.jobId,
      title: job.title,
      company: job.company.name,
      location: `${job.city}, ${job.province}`.trim(),
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.salaryCurrency,
      positionType: job.positionType,
      remotePolicy: job.remotePolicy,
      description: job.description,
      postedAt: job.postedAt.toISOString(),
      isFeatured: job.isFeatured,
      isUrgent: job.isUrgent,
      companyLogo: job.company.logoUrl,
      experienceLevel: job.experienceLevel,
      requiredSkills: job.requiredSkills,
      preferredSkills: job.preferredSkills,
      requiredDocuments: job.requiredDocuments,
      applicationCount: job.applicationCount,
      viewCount: job.viewCount,
      matchScore: job.matchScore
    }))

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