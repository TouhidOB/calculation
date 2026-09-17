import type { Metadata } from "next"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Link from "next/link"
import GlobalNavbar from "@/components/GlobalNavbar"
import GavelIcon from "@mui/icons-material/Gavel"

export const metadata: Metadata = {
  title: "Terms of Service — TryCalc.net",
  description:
    "Terms of Service governing the use of TryCalc.net free online calculators, computational algorithms, and digital tools.",
  alternates: {
    canonical: "https://trycalc.net/terms",
  },
}

export default function TermsOfServicePage() {
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
            <GavelIcon sx={{ color: "#4f46e5", fontSize: 28 }} />
            <Typography variant="overline" sx={{ fontWeight: 800, color: "#4f46e5", letterSpacing: 1 }}>
              Legal Agreement
            </Typography>
          </Stack>

          <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#0f172a", mb: 1, fontSize: { xs: 28, md: 36 } }}>
            Terms of Service
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b", mb: 4 }}>
            Last Updated: September 17, 2026 · Effective Date: September 17, 2026
          </Typography>

          <Divider sx={{ mb: 4, borderColor: "#e2e8f0" }} />

          <Stack spacing={3.5} sx={{ color: "#334155", lineHeight: 1.8 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body1">
                By accessing or using TryCalc (accessible via <strong>https://trycalc.net</strong>) and any of its 689+ online calculators, web tools, or APIs, you agree to be legally bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                2. Nature of Service &amp; Free Usage
              </Typography>
              <Typography variant="body1">
                TryCalc provides free computational tools, algorithms, and simulation utilities across diverse categories including finance, mathematics, health, engineering, and unit conversions. All tools are provided free of charge for personal, academic, and business informational use. No subscription, user registration, or payment is required.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                3. Financial, Medical &amp; Professional Disclaimer
              </Typography>
              <Typography variant="body1">
                <strong>Not Professional Financial Advice:</strong> Financial calculators (such as Mortgage, Loan, Interest, Tax, Investment, and Retirement calculators) are designed solely as mathematical simulation tools. They do not constitute certified financial, tax, investment, or legal advice. Real-world financial figures vary based on lender underwriting, regional taxes, interest amortizations, and economic conditions.
              </Typography>
              <Typography variant="body1" sx={{ mt: 1.5 }}>
                <strong>Not Medical Advice:</strong> Health and fitness calculators (such as BMI, Calorie, Body Fat, and BMR calculators) are based on general public health formulas (such as Mifflin-St Jeor or WHO standards). They are intended for educational and general fitness awareness and must never replace medical evaluation or diagnosis from certified healthcare professionals.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                4. Intellectual Property &amp; Embed Widget Policy
              </Typography>
              <Typography variant="body1">
                The TryCalc brand, logos, user interface design, custom styling, documentation, and underlying computation scripts are the intellectual property of TryCalc.
              </Typography>
              <Typography variant="body1" sx={{ mt: 1.5 }}>
                <strong>Embeddable Widgets:</strong> You may embed TryCalc tools into your own website using our official embed iframe codes (`https://trycalc.net/embed/[calcId]`), provided you retain the reciprocal attribution link to TryCalc.net intact without modification or concealment.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                5. Limitation of Liability
              </Typography>
              <Typography variant="body1">
                To the maximum extent permitted by applicable law, TryCalc, its operators, creators, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, use of, or inability to use the tools or any mathematical errors or omissions contained within calculation results.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                6. Modifications to the Service &amp; Terms
              </Typography>
              <Typography variant="body1">
                We reserve the right to modify, update, replace, or discontinue any calculator or feature at any time without prior notice. Your continued use of the website following any changes to these Terms constitutes acceptance of the new terms.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                7. Governing Law
              </Typography>
              <Typography variant="body1">
                These terms shall be governed by and construed in accordance with generally applicable international commercial laws, without regard to conflict of law principles.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                8. Contact &amp; Inquiries
              </Typography>
              <Typography variant="body1">
                For questions regarding our Terms of Service, please visit our <Link href="/contact" style={{ color: "#4f46e5", fontWeight: 700 }}>Contact Page</Link> or email <strong>legal@trycalc.net</strong>.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
