# AWS Lambda image for node.js 14
FROM public.ecr.aws/lambda/nodejs:14

# Where to store all of the data
WORKDIR /bg/

# Copy production files to container
COPY dist package*.json ./

# Install the required packages
RUN npm install