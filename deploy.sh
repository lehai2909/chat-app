#!/bin/bash

npm run build
aws s3 sync dist/ s3://staging-chat-frontend-bucket --profile staging
aws cloudfront create-invalidation \
    --distribution-id E11OUK4C49WFEE \
    --paths "/*" --profile staging