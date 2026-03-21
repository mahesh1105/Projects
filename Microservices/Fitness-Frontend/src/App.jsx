import { useContext, useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useDispatch } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router'

import ActivityForm from './components/ActivityForm'
import ActivityList from './components/ActivityList'
import ActivityDetails from './components/ActivityDetails'
import { logout, setCredentials } from './store/authSlice'

const ActivitiesPage = () => {
  return (
    <Stack spacing={3}>
      <Card
        sx={{
          overflow: 'hidden',
          borderRadius: 1,
          border: '1px solid rgba(148, 163, 184, 0.16)',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  mb: 0.75,
                }}
              >
                Activity Dashboard
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 760, lineHeight: 1.7 }}
              >
                Track workouts, Review logged activities, and Gemini AI-generated
                recommendations for each session.
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ pt: { xs: 1, md: 0 } }}
            >
              <Chip label="Workout logging" color="primary" variant="outlined" />
              <Chip label="Activity history" color="primary" variant="outlined" />
              <Chip label="AI recommendations" color="primary" variant="outlined" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            xl: '380px minmax(0, 1fr)',
          },
          alignItems: 'start',
        }}
      >
        <Box
          sx={{
            position: { xl: 'sticky' },
            top: { xl: 96 },
          }}
        >
          <ActivityForm onActivitiesAdded={() => window.location.reload()} />
        </Box>

        <ActivityList />
      </Box>
    </Stack>
  )
}

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext)
  const dispatch = useDispatch()
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }))
      setAuthReady(true)
    } else {
      setAuthReady(false)
    }
  }, [token, tokenData, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    logOut()
  }

  if (token && !authReady) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={36} />
          <Typography color="text.secondary">Preparing your dashboard...</Typography>
        </Stack>
      </Box>
    )
  }

  if (!token) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Main Card */}
        <Card
          sx={{
            overflow: 'hidden',
            borderRadius: 1,
            border: '1px solid rgba(148, 163, 184, 0.14)',
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.10)',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(14px)',
          }}
        >
          {/* Main Box - Generic Container*/}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.9fr' },
            }}
          >
            {/* Left Side Box */}
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                background:
                  'linear-gradient(135deg, rgba(239,246,255,0.95) 0%, rgba(248,250,252,0.92) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Chip
                label="Fitness Activity Tracker"
                color="primary"
                variant="outlined"
                sx={{
                  mb: 2.5,
                  fontWeight: 600,
                  width: 'fit-content',
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: '2.2rem', md: '3.1rem' },
                  lineHeight: { xs: 1.08, md: 1.02 },
                  letterSpacing: '-0.05em',
                  fontWeight: 800,
                  maxWidth: 540,
                  mb: 2.5,
                }}
              >
                Track workouts.
                <br />
                Review progress.
                <br />
                Get smarter insights.
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  fontSize: { xs: '1rem', md: '1.05rem' },
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                A full-stack fitness platform for logging activities, monitoring workout
                history, and viewing AI-generated recommendations based on recorded
                sessions.
              </Typography>

              <Stack spacing={1.5} sx={{ maxWidth: 560 }}>
                {[
                  'Log activity type, duration, and calories burned quickly.',
                  'View activity history in a clean dashboard layout.',
                  'Open activity details with AI-powered recommendations.',
                  'Secure sign-in using the existing Keycloak flow.',
                ].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        mt: '9px',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '1rem',
                        lineHeight: 1.7,
                        color: 'text.primary',
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
              
            {/* Right Side Box */}
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
              }}
            >
              {/* Inside Card */}
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 430,
                  borderRadius: 1,
                  border: '1px solid rgba(148, 163, 184, 0.16)',
                  boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
                  background: 'rgba(255,255,255,0.96)',
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      mb: 1,
                    }}
                  >
                    Welcome back
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, mb: 3 }}
                  >
                    Sign in to access your activity dashboard, log workouts, and review
                    personalized fitness recommendations.
                  </Typography>

                  <Box
                    sx={{
                      borderRadius: 1,
                      p: 2,
                      mb: 3,
                      background: 'rgba(241,245,249,0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.16)',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.8 }}
                    >
                      Secure login is handled through the Keycloak authentication flow.
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => logIn()}
                    sx={{
                      minHeight: 54,
                      borderRadius: 1,
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    Login
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Card>
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(244, 247, 251, 0.82)',
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Container
            maxWidth="xl"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
          >
            <Box>
              <Typography variant="h6">Fitness Activity Tracker</Typography>
            </Box>

            <Stack direction="row" spacing={1.25} alignItems="center">
              <Button variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Routes>
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
          <Route path="/" element={token ? <Navigate to="/activities" replace /> : <div>Welcome! Please Login</div>} />
        </Routes>
      </Container>
    </Box>
  )
}

const FeatureLine = ({ text }) => (
  <Stack direction="row" spacing={1.25} alignItems="center">
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2563eb, #0f766e)',
        flexShrink: 0,
      }}
    />
    <Typography variant="body1">{text}</Typography>
  </Stack>
)

export default App
