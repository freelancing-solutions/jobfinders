import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Calendar,
  Building2,
  Users,
  Star,
  CheckCircle2
} from 'lucide-react'

const prisma = new PrismaClient()

interface JobParams {
  params: {
    id: string
  }
}

async function getJobDetails(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      employer: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
  })

  if (!job) {
    notFound()
  }

  return job
}

export default async function JobDetailsPage({ params }: JobParams) {
  const job = await getJobDetails(params.id)
  const session = await getServerSession(authOptions)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatSalary = (min: number, max: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    })
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {job.employer.name}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {job.isUrgent && (
                    <Badge variant="destructive">Urgent Hiring</Badge>
                  )}
                  {job.isFeatured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Briefcase className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">{job.positionType}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">{job.remotePolicy}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Star className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">{job.experienceLevel}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <DollarSign className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">
                    {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {job.requirements.split('\n').map((requirement, index) => (
                  <div key={index} className="flex items-start mb-2">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                    <p>{requirement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          {job.benefits && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {job.benefits.split('\n').map((benefit, index) => (
                    <div key={index} className="flex items-start mb-2">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                      <p>{benefit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">Posted on</p>
                  <p className="font-medium">{formatDate(job.postedAt)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Application Deadline</p>
                  <p className="font-medium">{formatDate(job.applicationDeadline)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Applications</p>
                  <p className="font-medium">{job._count.applications}</p>
                </div>
                {session ? (
                  <Button className="w-full" size="lg">
                    Apply Now
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" variant="outline">
                    Sign in to Apply
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Card */}
          <Card>
            <CardHeader>
              <CardTitle>About the Company</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {job.employer.logo && (
                  <div className="flex justify-center">
                    <img
                      src={job.employer.logo}
                      alt={job.employer.name}
                      className="h-16 w-auto"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-center">{job.employer.name}</h3>
                <p className="text-muted-foreground">
                  {job.companyDescription}
                </p>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    View Company Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
