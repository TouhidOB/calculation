import type { Metadata } from "next"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Link from "next/link"
import GlobalNavbar from "@/components/GlobalNavbar"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"

export const metadata: Metadata = {
  title: "Disclaimer & Accuracy Notice — TryCalc.net",
  description:
    "TryCalc mathematical calculation accuracy policy, financial disclaimer, health disclaimer, and terms of estimation.",
  alternates: {
    canonical: "https://trycalc.net/disclaimer",
  },
}

export default function DisclaimerPage() {
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
            <WarningAmberIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
            <Typography variant="overline" sx={{ fontWeight: 800, color: "#d97706", letterSpacing: 1 }}>
              Accuracy &amp; Legal Advisory
            </Typography>
          </Stack>

          <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#0f172a", mb: 1, fontSize: { xs: 28, md: 36 } }}>
            Disclaimer &amp; Accuracy Statement
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b", mb: 4 }}>
            Last Reviewed: September 17, 2026
          </Typography>

          <Divider sx={{ mb: 4, borderColor: "#e2e8f0" }} />

          <Stack spacing={3.5} sx={{ color: "#334155", lineHeight: 1.8 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                1. General Purpose
              </Typography>
              <Typography variant="body1">
                All calculators, computation scripts, algorithms, formulas, and estimates provided across TryCalc (<strong>https://trycalc.net</strong>) are presented in good faith solely for educational, simulation, and general informational purposes.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                2. Financial Estimation Disclaimer
              </Typography>
              <Typography variant="body1">
                Calculations regarding mortgages, personal loans, vehicle loans, amortization schedules, compound interest, capital gains, tax brackets, and retirement projections are mathematical models. They do not account for individual credit scores, private mortgage insurance (PMI) tier adjustments, regional tax law changes, local closing costs, or specific lender terms. Always consult a licensed Financial Advisor, CPA, or certified lending institution before making major financial commitments.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                3. Health, Diet &amp; Fitness Notice
              </Typography>
              <Typography variant="body1">
                Health-related calculators (including Body Mass Index (BMI), Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), Target Heart Rate, and Calorie Intake calculators) utilize statistical generalizations established by organizations like the World Health Organization (WHO) and CDC. They do not account for muscle-to-fat ratios, preexisting medical conditions, pregnancy, or metabolic disorders. None of the results should be considered medical diagnostics. Consult a licensed physician or registered dietitian for medical advice.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                4. Construction, Engineering &amp; Conversions
              </Typography>
              <Typography variant="body1">
                Calculations for concrete volume, roofing materials, gravel, paint coverage, and electrical conversions provide nominal material estimates. Real-world construction jobs involve waste factors (typically 5% to 15%), structural settling, temperature variations, and specific building code mandates. Certified structural engineers and licensed contractors should verify all construction specifications.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                5. Mathematical Accuracy &amp; Bug Reporting
              </Typography>
              <Typography variant="body1">
                While our engineering team rigorously tests all formula implementations against established mathematical standards (such as NIST and IEEE floating-point standards), we make no warranty or guarantee of complete accuracy or error-free execution. If you notice any formula discrepancy or unexpected output, please submit a report via our <Link href="/contact" style={{ color: "#4f46e5", fontWeight: 700 }}>Contact Form</Link> so our team can immediately inspect and patch it.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
