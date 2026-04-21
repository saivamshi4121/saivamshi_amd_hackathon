# ─────────────────────────────────────────────────────────────
# TriggerNudge — Google Cloud Run Deployment (Windows)
# ─────────────────────────────────────────────────────────────
#
# PREREQUISITES:
#   1. Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install
#   2. Authenticate: gcloud auth login
#   3. Set project: gcloud config set project YOUR_PROJECT_ID
#   4. Enable APIs:
#        gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com
#   5. Set your Gemini key:
#        $env:GEMINI_API_KEY = "your-key-here"
#
# USAGE:
#   .\deploy.ps1
#
# ─────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

# ── Configuration ────────────────────────────────────────────
$PROJECT_ID = (gcloud config get-value project 2>$null).Trim()
$REGION = "asia-south1"        # Mumbai
$SERVICE_NAME = "triggernudge"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  TriggerNudge — Cloud Run Deploy"
Write-Host "  Project:  $PROJECT_ID"
Write-Host "  Region:   $REGION"
Write-Host "  Service:  $SERVICE_NAME"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# ── Check for GEMINI_API_KEY ─────────────────────────────────
if (-not $env:GEMINI_API_KEY) {
    # Try reading from .env.local
    if (Test-Path ".env.local") {
        $envLine = Get-Content ".env.local" | Where-Object { $_ -match "^GEMINI_API_KEY=" }
        if ($envLine) {
            $env:GEMINI_API_KEY = ($envLine -replace "^GEMINI_API_KEY=", "").Trim()
            Write-Host "  Loaded GEMINI_API_KEY from .env.local" -ForegroundColor Green
        }
    }
}

if (-not $env:GEMINI_API_KEY) {
    Write-Host "  ERROR: GEMINI_API_KEY not set. Run: `$env:GEMINI_API_KEY = 'your-key'" -ForegroundColor Red
    exit 1
}

# ── Step 1: Build with Cloud Build ───────────────────────────
Write-Host ""
Write-Host "▶ Building Docker image with Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --tag $IMAGE_NAME --timeout=600s

if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit 1 }

# ── Step 2: Deploy to Cloud Run ──────────────────────────────
Write-Host ""
Write-Host "▶ Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
    --image $IMAGE_NAME `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --set-env-vars "GEMINI_API_KEY=$($env:GEMINI_API_KEY)" `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 3 `
    --port 8080 `
    --timeout 60s

if ($LASTEXITCODE -ne 0) { Write-Host "Deploy failed!" -ForegroundColor Red; exit 1 }

# ── Done ─────────────────────────────────────────────────────
Write-Host ""
$SERVICE_URL = (gcloud run services describe $SERVICE_NAME --region $REGION --format "value(status.url)" 2>$null).Trim()
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "  ✅ Deployed successfully!"
Write-Host ""
Write-Host "  🌐 URL: $SERVICE_URL" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
