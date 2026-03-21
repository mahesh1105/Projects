import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router'

import { getActivities } from '../services/api'

const formatActivityType = (type = '') =>
  type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()

const ActivityList = () => {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const navigate = useNavigate()

  const fetchActivities = async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      const response = await getActivities()
      setActivities(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ py: 6 }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={32} />
            <Typography variant="body1" color="text.secondary">
              Loading your activity history...
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  if (hasError) {
    return (
      <Card>
        <CardContent sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Unable to load activities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The UI is intact, but the activity list could not be fetched right now.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  if (!activities.length) {
    return (
      <Card>
        <CardContent sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No activities yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add your first workout from the form above to populate the dashboard.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
        <Box>
          <Typography variant="h5">Recent activities</Typography>
          <Typography variant="body2" color="text.secondary">
            Click any card to view detailed AI-backed recommendations.
          </Typography>
        </Box>
        <Chip label={`${activities.length} total`} color="primary" variant="outlined" />
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {activities.map((activity) => (
          <Card key={activity.id} sx={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
            <CardActionArea
              onClick={() => navigate(`/activities/${activity.id}`, {state: {activity}} )}
              sx={{
                height: '100%',
                alignItems: 'stretch',
                '&:hover .activity-card': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent className="activity-card" sx={{ p: 2.5, transition: 'transform 0.2s ease' }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {formatActivityType(activity.type)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Review workout details and improvement suggestions.
                    </Typography>
                  </Box>
                  <Chip size="small" label={activity.id ? `#${activity.id}` : 'Saved'} />
                </Stack>

                <Stack spacing={1.5} sx={{ mt: 3 }}>
                  <StatRow label="Duration" value={`${activity.duration ?? '-'} min`} />
                  <StatRow label="Calories" value={activity.caloriesBurned ?? '-'} />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

const StatRow = ({ label, value }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{
      p: 1.5,
      borderRadius: 3,
      border: '1px solid rgba(148, 163, 184, 0.16)',
      backgroundColor: 'rgba(248, 250, 252, 0.92)',
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle2">{value}</Typography>
  </Stack>
)

export default ActivityList
