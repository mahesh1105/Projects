import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router'

import { getActivityDetail } from '../services/api'

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string' && value.trim()) return [value]
  return []
}

const ActivityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [activity, setActivity] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const location = useLocation()
  const activityFromList = location.state?.activity

  useEffect(() => {
    const fetchActivityDetail = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        const response = await getActivityDetail(id)
        console.log(response)
        setActivity(response.data)
        setRecommendation(response.data?.recommendation ?? null)
      } catch (error) {
        console.error(error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivityDetail()
  }, [id])

  const activityType = activity?.type ?? activityFromList?.type ?? '-'
  const activityDuration = activity?.duration ?? activityFromList?.duration ?? '-'
  const activityCalories = activity?.caloriesBurned ?? activityFromList?.caloriesBurned ?? '-'

  const recommendationSummary = useMemo(() => {
    if (typeof recommendation === 'string') return recommendation
    if (typeof activity?.recommendation === 'string') return activity.recommendation
    if (typeof recommendation?.analysis === 'string') return recommendation.analysis
    return 'Detailed recommendation data is available below when returned by the service.'
  }, [activity?.recommendation, recommendation])

  const improvements = normalizeList(activity?.improvements ?? recommendation?.improvements)
  const suggestions = normalizeList(activity?.suggestions ?? recommendation?.suggestions)
  const safetyGuidelines = normalizeList(activity?.safety ?? recommendation?.safety)

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ py: 8 }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={36} />
            <Typography color="text.secondary">Loading activity details...</Typography>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  if (hasError || !activity) {
    return (
      <Card>
        <CardContent sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Unable to load activity details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The data request failed, so the details page cannot be rendered right now.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
        <Box>
          <Typography variant="h4" gutterBottom>
            Activity details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review the workout snapshot along with the generated guidance.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Chip label={`ID: ${activity.id ?? id}`} variant="outlined" />
          <Button variant="outlined" onClick={() => navigate('/activities')}>
            Back to dashboard
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <MetricCard label="Activity" value={activityType} />
        <MetricCard label="Duration" value={activityDuration === '-' ? '-' : `${activityDuration} minutes`} />
        <MetricCard label="Calories Burned" value={activityCalories} />
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={1.25}>
            <Typography variant="h5">Workout overview</Typography>
            <Typography variant="body2" color="text.secondary">
              Logged on {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Unavailable'}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {recommendationSummary}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <RecommendationSection
          title="Improvements"
          subtitle="Areas to focus on in your next sessions"
          items={improvements}
          emptyMessage="No specific improvements were returned for this activity."
        />
        <RecommendationSection
          title="Suggestions"
          subtitle="Practical tips generated from the activity data"
          items={suggestions}
          emptyMessage="No additional suggestions were returned for this activity."
        />
        <RecommendationSection
          title="Safety Guidelines"
          subtitle="Precautions and best practices to keep in mind"
          items={safetyGuidelines}
          emptyMessage="No safety notes were returned for this activity."
        />
      </Box>
    </Stack>
  )
}

const MetricCard = ({ label, value }) => (
  <Card>
    <CardContent sx={{ p: 2.5 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </CardContent>
  </Card>
)

const RecommendationSection = ({ title, subtitle, items, emptyMessage }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        {subtitle}
      </Typography>

      {items.length ? (
        <Stack spacing={1.5}>
          {items.map((item, index) => (
            <Box
              key={`${title}-${index}`}
              sx={{
                p: 1.5,
                borderRadius: 1,
                backgroundColor: 'rgba(248, 250, 252, 0.94)',
                border: '1px solid rgba(148, 163, 184, 0.16)',
              }}
            >
              <Typography variant="body2">• {item}</Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      )}
    </CardContent>
  </Card>
)

export default ActivityDetail
