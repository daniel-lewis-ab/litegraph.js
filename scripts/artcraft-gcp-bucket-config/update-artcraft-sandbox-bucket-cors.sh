#!/bin/sh
# You need to authenticate with gcloud tradecraft-361200 before running this script
# gcloud config set project tradecraft-361200
# gcloud auth login
gcloud storage buckets update gs://artcraftapi-worker-runner-sandbox --cors-file=artcraftapi-worker-runner-sandbox-cors.json