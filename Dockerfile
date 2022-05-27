# Base image
FROM node:14-alpine
# Creating a directory inside the base image and defining as the base directory
WORKDIR /app
# Copying the files of the root directory into the base directory
ADD . /app
# Exposing the RestAPI port
EXPOSE 80

# Installing the project dependencies
RUN npm install

# Starting the pm2 process and keeping the docker container alive
CMD ["npm", "start"]
