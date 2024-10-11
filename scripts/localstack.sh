#!/bin/bash

export $(grep -v '^#' .env | xargs)

echo "Executing the localstack.sh script..."

echo "Creating the SQS queue..."

awslocal sqs create-queue --queue-name hello-world.fifo --attributes FifoQueue=true
awslocal sqs create-queue --queue-name hello-world-dlq.fifo  --attributes FifoQueue=true

echo "SQS queue created successfully."