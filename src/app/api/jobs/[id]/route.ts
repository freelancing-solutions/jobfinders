import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    // Get job details
    const job = await db.job.findUnique({
      where: { jobId },
      include: {
        company: {
          select: {
            companyId: true,
            name: true,
            description: true,
            logoUrl: true,
            website: true,
            isVerified: true,
            industry: true,
            employeeCount: true,
            foundedYear: true,
            city: true,
            province: true,
            country: true
          }
        },
        employer: {
          select: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        category: {
          select: {
            categoryId: true,
            name: true,
            slug: true,
            description: true
          }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await db.job.update({
      where: { jobId },
      data: { viewCount: { increment: 1 } }
    })

    // Transform the data to match the frontend interface
    const transformedJob = {
      id: job.jobId,
      title: job.title,
      company: job.company.name,
      location: job.city ? `${job.city}, ${job.province || ''}`.replace(/, $/, '') : job.province || job.country || 'Remote',
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.salaryCurrency,
      positionType: job.positionType,
      remotePolicy: job.remotePolicy,
      description: job.description,
      postedAt: job.postedAt.toISOString(),
      expiresAt: job.expiresAt?.toISOString(),
      experienceLevel: job.experienceLevel,
      educationRequirements: job.educationRequirements,
      requiredSkills: job.requiredSkills,
      preferredSkills: job.preferredSkills,
      requiredDocuments: job.requiredDocuments,
      isFeatured: job.isFeatured,
      isUrgent: job.isUrgent,
      companyLogo: job.company.logoUrl,
      companyDescription: job.company.description,
      companyWebsite: job.company.website,
      applicationCount: job.applicationCount,
      viewCount: job.viewCount + 1, // Include the incremented view count
      matchScore: job.matchScore
    }

    return NextResponse.json(transformedJob)

  } catch (error) {
    console.error('Error fetching job details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id
    const body = await request.json()
    const {
      title,
      description,
      positionType,
      remotePolicy,
      salaryMin,
      salaryMax,
      city,
      province,
      country,
      experienceLevel,
      educationRequirements,
      requiredSkills,
      preferredSkills,
      requiredDocuments,
      expiresAt,
      isFeatured,
      isUrgent,
      status,
      categoryId
    } = body

    // Check if job exists
    const existingJob = await db.job.findUnique({
      where: { jobId }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Update the job
    const updatedJob = await db.job.update({
      where: { jobId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(positionType && { positionType }),
        ...(remotePolicy && { remotePolicy }),
        ...(salaryMin !== undefined && { salaryMin: salaryMin ? parseFloat(salaryMin) : null }),
        ...(salaryMax !== undefined && { salaryMax: salaryMax ? parseFloat(salaryMax) : null }),
        ...(city !== undefined && { city }),
        ...(province !== undefined && { province }),
        ...(country !== undefined && { country }),
        ...(experienceLevel !== undefined && { experienceLevel }),
        ...(educationRequirements !== undefined && { educationRequirements }),
        ...(requiredSkills !== undefined && { requiredSkills }),
        ...(preferredSkills !== undefined && { preferredSkills }),
        ...(requiredDocuments !== undefined && { requiredDocuments }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isUrgent !== undefined && { isUrgent }),
        ...(status && { status }),
        ...(categoryId !== undefined && { categoryId })
      },
      include: {
        company: {
          select: {
            companyId: true,
            name: true,
            logoUrl: true,
            website: true,
            isVerified: true
          }
        },
        employer: {
          select: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        category: {
          select: {
            categoryId: true,
            name: true,
            slug: true
          }
        }
      }
    })

    // Transform the response
    const transformedJob = {
      id: updatedJob.jobId,
      title: updatedJob.title,
      company: updatedJob.company.name,
      location: updatedJob.city ? `${updatedJob.city}, ${updatedJob.province || ''}`.replace(/, $/, '') : updatedJob.province || updatedJob.country || 'Remote',
      salaryMin: updatedJob.salaryMin,
      salaryMax: updatedJob.salaryMax,
      currency: updatedJob.salaryCurrency,
      positionType: updatedJob.positionType,
      remotePolicy: updatedJob.remotePolicy,
      description: updatedJob.description,
      postedAt: updatedJob.postedAt.toISOString(),
      expiresAt: updatedJob.expiresAt?.toISOString(),
      experienceLevel: updatedJob.experienceLevel,
      educationRequirements: updatedJob.educationRequirements,
      requiredSkills: updatedJob.requiredSkills,
      preferredSkills: updatedJob.preferredSkills,
      requiredDocuments: updatedJob.requiredDocuments,
      isFeatured: updatedJob.isFeatured,
      isUrgent: updatedJob.isUrgent,
      companyLogo: updatedJob.company.logoUrl,
      companyDescription: updatedJob.company.description,
      companyWebsite: updatedJob.company.website,
      applicationCount: updatedJob.applicationCount,
      viewCount: updatedJob.viewCount,
      matchScore: updatedJob.matchScore
    }

    return NextResponse.json(transformedJob)

  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    // Check if job exists
    const existingJob = await db.job.findUnique({
      where: { jobId }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Delete the job (this will cascade delete related applications and saved jobs)
    await db.job.delete({
      where: { jobId }
    })

    return NextResponse.json({ message: 'Job deleted successfully' })

  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}