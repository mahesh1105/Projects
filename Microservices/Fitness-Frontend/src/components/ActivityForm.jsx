import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { addActivity } from '../services/api'

const initialActivityState = {
  type: 'RUNNING',
  duration: '',
  caloriesBurned: '',
  additionalMetrics: {},
}

const ActivityForm = ({ onActivitiesAdded }) => {
  const [activity, setActivity] = useState(initialActivityState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addActivity(activity)
      onActivitiesAdded()
      setActivity(initialActivityState)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box
        sx={{
          px: { xs: 2.5, md: 3 },
          py: 2.25,
          borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(15,118,110,0.08))',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Log a new activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add workout details
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="activity-type-label">Activity Type</InputLabel>
                <Select
                  labelId="activity-type-label"
                  label="Activity Type"
                  value={activity.type}
                  onChange={(e) => {
                    setActivity({ ...activity, type: e.target.value })
                  }}
                >
                  <MenuItem value="RUNNING">Running</MenuItem>
                  <MenuItem value="WALKING">Walking</MenuItem>
                  <MenuItem value="CYCLING">Cycling</MenuItem>
                  <MenuItem value="SWIMMING">Swimming</MenuItem>
                  <MenuItem value="YOGA">Yoga</MenuItem>
                  <MenuItem value="CARDIO">Cardio</MenuItem>
                  <MenuItem value="STRETCHING">Stretching</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Duration"
                type="number"
                value={activity.duration}
                onChange={(e) => {
                  setActivity({ ...activity, duration: e.target.value })
                }}
                helperText="Enter time in minutes"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                value={activity.caloriesBurned}
                onChange={(e) => {
                  setActivity({ ...activity, caloriesBurned: e.target.value })
                }}
                helperText="Enter calories burned"
              />
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mt: 3 }}
          >
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Adding activity...' : 'Add Activity'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ActivityForm
