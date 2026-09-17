"use client"

import * as React from "react"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import Alert from "@mui/material/Alert"
import GlobalNavbar from "@/components/GlobalNavbar"
import EmailIcon from "@mui/icons-material/Email"
import SendIcon from "@mui/icons-material/Send"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BugReportIcon from "@mui/icons-material/BugReport"
import HandshakeIcon from "@mui/icons-material/Handshake"

export default function ContactUsPage() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [topic, setTopic] = React.useState("general")
  const [message, setMessage] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setSubmitted(true)
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <GlobalNavbar />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* Left Column: Contact Channels & FAQ */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="overline" sx={{ fontWeight: 800, color: "#4f46e5", letterSpacing: 1 }}>
                Get In Touch
              </Typography>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#0f172a", mb: 2, fontSize: { xs: 28, md: 36 } }}>
                Contact TryCalc
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.7 }}>
                Have feedback, questions about our formulas, or want to suggest a new calculator? Our editorial and engineering teams are ready to help.
              </Typography>
            </Box>

            <Stack spacing={2.5}>
              <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #e2e8f0", borderRadius: 3, bgcolor: "#ffffff" }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "rgba(79, 70, 229, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4f46e5" }}>
                    <EmailIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      Direct Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4f46e5", fontWeight: 600 }}>
                      contact@trycalc.net
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Typical response within 24–48 business hours
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #e2e8f0", borderRadius: 3, bgcolor: "#ffffff" }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
                    <BugReportIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      Bug Reports &amp; Formula Inquiries
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      support@trycalc.net
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Include the calculator URL and input values tested
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #e2e8f0", borderRadius: 3, bgcolor: "#ffffff" }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                    <HandshakeIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      Partnerships &amp; Advertising
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      partners@trycalc.net
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Widgets, API syndication, and sponsorships
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column: Interactive Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                Send Us a Message
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mb: 3.5 }}>
                Fill out the form below and our editorial or developer support team will get back to you promptly.
              </Typography>

              {submitted ? (
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  sx={{ borderRadius: 3, py: 3, px: 2.5 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Message Received!
                  </Typography>
                  <Typography variant="body2">
                    Thank you, <strong>{name}</strong>. Your feedback regarding <em>&quot;{topic}&quot;</em> has been submitted to the TryCalc team. We will review it shortly.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSubmitted(false)
                      setMessage("")
                    }}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Send Another Message
                  </Button>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Your Name"
                      fullWidth
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Smith"
                    />

                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      helperText="We will never share your email address with third parties."
                    />

                    <TextField
                      select
                      label="Subject / Category"
                      fullWidth
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      <MenuItem value="general">General Question</MenuItem>
                      <MenuItem value="suggestion">Suggest a New Calculator</MenuItem>
                      <MenuItem value="bug">Report a Calculation / Formula Bug</MenuItem>
                      <MenuItem value="embed">Embed Widget or API Integration</MenuItem>
                      <MenuItem value="legal">Privacy / Legal Inquiry</MenuItem>
                    </TextField>

                    <TextField
                      label="Your Message"
                      fullWidth
                      required
                      multiline
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide as much detail as possible..."
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendIcon />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2.5,
                        fontWeight: 800,
                        bgcolor: "#4f46e5",
                        "&:hover": { bgcolor: "#4338ca" },
                      }}
                    >
                      Send Message
                    </Button>
                  </Stack>
                </form>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
