# ─────────────────────────────────────────────────────────────
# TriggerNudge — Google Cloud Run Deployment
# ─────────────────────────────────────────────────────────────
#
# This script builds the Docker image using Cloud Build,
# pushes it to Artifact Registry, and deploys to Cloud Run.
#
# PREREQUISITES:
#   1. Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install
#   2. Authenticate: gcloud auth login
#   3. Set your project: gcloud config set project YOUR_PROJECT_ID
#   4. Enable required APIs:
#        gcloud services enable \
#          cloudbuild.googleapis.com \
#          run.googleapis.com \
#          artifactregistry.googleapis.com
#
# USAGE:
#   ./deploy.sh
#
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Configuration ────────────────────────────────────────────
PROJECT_ID=$(gcloud config get-value project)
REGION="asia-south1"                          # Mumbai — closest to India
SERVICE_NAME="triggernudge"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  TriggerNudge — Cloud Run Deploy"
echo "  Project:  ${PROJECT_ID}"
echo "  Region:   ${REGION}"
echo "  Service:  ${SERVICE_NAME}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Step 1: Build the image with Cloud Build ─────────────────
echo ""
echo "▶ Building Docker image with Cloud Build..."
gcloud builds submit \
  --tag "${IMAGE_NAME}" \
  --timeout=600s

# ── Step 2: Deploy to Cloud Run ──────────────────────────────
echo ""
echo "▶ Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_NAME}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=${GEMINI_API_KEY}" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --port 8080 \
  --timeout 60s

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Deployed successfully!"
echo ""
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" \
  --format "value(status.url)")
echo "  🌐 URL: ${SERVICE_URL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
