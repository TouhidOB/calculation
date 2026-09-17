import type { Metadata } from "next"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Link from "next/link"
import GlobalNavbar from "@/components/GlobalNavbar"
import SecurityIcon from "@mui/icons-material/Security"

export const metadata: Metadata = {
  title: "Privacy Policy — TryCalc.net",
  description:
    "TryCalc Privacy Policy. Understand how we handle data, our use of cookies, third-party advertising partners including Google AdSense, and your privacy rights under GDPR and CCPA.",
  alternates: {
    canonical: "https://trycalc.net/privacy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <GlobalNavbar />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
            <SecurityIcon sx={{ color: "#4f46e5", fontSize: 28 }} />
            <Typography variant="overline" sx={{ fontWeight: 800, color: "#4f46e5", letterSpacing: 1 }}>
              Legal Compliance &amp; Transparency
            </Typography>
          </Stack>

          <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#0f172a", mb: 1, fontSize: { xs: 28, md: 36 } }}>
            Privacy Policy
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b", mb: 4 }}>
            Last Updated: September 17, 2026 · Effective Immediately
          </Typography>

          <Divider sx={{ mb: 4, borderColor: "#e2e8f0" }} />

          <Stack spacing={3.5} sx={{ color: "#334155", lineHeight: 1.8 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                1. Overview &amp; Our Commitment to Privacy
              </Typography>
              <Typography variant="body1">
                At TryCalc (accessible at <strong>https://trycalc.net</strong>), your privacy is of paramount importance to us. As an online calculator and computation utility platform, our core philosophy is to provide instant computational tools without requiring user registration, accounts, or personal data submission.
              </Typography>
              <Typography variant="body1" sx={{ mt: 1.5 }}>
                This Privacy Policy outlines the types of information TryCalc collects, records, and how we use it, specifically regarding cookies, server logs, analytics, and third-party advertising partners such as Google AdSense.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                2. Calculation Inputs &amp; Zero Data Storage
              </Typography>
              <Typography variant="body1">
                When you enter numbers, formulas, or parameters into any of our 689+ online calculators (e.g. loan figures, health metrics, dimensions, mathematical expressions), <strong>your calculations are computed dynamically in your browser or through ephemeral, stateless memory execution</strong>. We do NOT save, log, store, or profile your personal calculation figures, financial numbers, or health parameters on our persistent databases.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                3. Cookies, Web Beacons &amp; Third-Party Advertising (Google AdSense)
              </Typography>
              <Typography variant="body1">
                Like most modern web platforms, TryCalc uses cookies to store information about visitor preferences and pages visited, optimizing user experience by customizing content according to browser type and settings.
              </Typography>
              <Typography variant="body1" sx={{ mt: 1.5 }}>
                <strong>Google AdSense &amp; DoubleClick DART Cookies:</strong>
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1, pl: 2, borderLeft: "3px solid #4f46e5", bgcolor: "#f8fafc", p: 2, borderRadius: 2 }}>
                <ul>
                  <li>Google is a third-party vendor on TryCalc. It uses cookies, commonly known as DoubleClick DART cookies, to serve advertisements to visitors based on their visit to trycalc.net and other sites across the internet.</li>
                  <li>Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on TryCalc, which are sent directly to users&apos; browsers. They automatically receive your IP address when this occurs.</li>
                  <li>These technologies are used to measure the effectiveness of advertising campaigns and/or to personalize advertising content that you see on websites that you visit.</li>
                  <li>TryCalc has no access to or control over these cookies that are used by third-party advertisers.</li>
                </ul>
              </Typography>
              <Typography variant="body1" sx={{ mt: 1.5 }}>
                <strong>Opting Out of Personalized Advertising:</strong> You can opt out of personalized advertising by visiting Google&apos;s Ads Settings at{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "#4f46e5", fontWeight: 700 }}>
                  https://www.google.com/settings/ads
                </a>{" "}
                or by visiting{" "}
                <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: "#4f46e5", fontWeight: 700 }}>
                  aboutads.info
                </a>
                .
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                4. Log Files &amp; Analytics
              </Typography>
              <Typography variant="body1">
                TryCalc follows standard industry practices of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of this information is to analyze trends, administer the site, prevent malicious bot abuse, track users&apos; movement on the website, and gather demographic information.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                5. CCPA Privacy Rights (Do Not Sell My Personal Information)
              </Typography>
              <Typography variant="body1">
                Under the California Consumer Privacy Act (CCPA), California consumers have the right to:
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1, pl: 2 }}>
                <ul>
                  <li>Request that a business disclose the categories and specific pieces of personal data collected about consumers.</li>
                  <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
                  <li>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data. <strong>TryCalc does not sell your personal data.</strong></li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                6. GDPR Data Protection Rights
              </Typography>
              <Typography variant="body1">
                We ensure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR). Every European Union user is entitled to:
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1, pl: 2 }}>
                <ul>
                  <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                  <li><strong>The right to rectification:</strong> You have the right to request correction of any inaccurate information.</li>
                  <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                  <li><strong>The right to restrict processing:</strong> You have the right to request restriction of processing of your data.</li>
                </ul>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                7. Children&apos;s Information (COPPA Compliance)
              </Typography>
              <Typography variant="body1">
                Protecting children while using the internet is a priority. TryCalc does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe your child has provided personal information on our website, please contact us immediately, and we will promptly remove such information.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                8. Contact Information
              </Typography>
              <Typography variant="body1">
                If you have any questions, inquiries, or suggestions about our Privacy Policy or data handling practices, please contact our administrative team at:
              </Typography>
              <Box sx={{ mt: 2, p: 2.5, bgcolor: "#f8fafc", borderRadius: 2.5, border: "1px solid #e2e8f0" }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  TryCalc Data Protection &amp; Legal Team
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  Email: <strong>contact@trycalc.net</strong> or <strong>support@trycalc.net</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  Official Web Portal: <Link href="/contact" style={{ color: "#4f46e5", fontWeight: 700 }}>https://trycalc.net/contact</Link>
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
