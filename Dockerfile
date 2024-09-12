# Use the official Node.js image
FROM node:18 AS build

# Create and change to the app directory
WORKDIR /usr/src/app


# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the app source code
COPY . .

# Build the React app
RUN npm run build

# Serve the React app
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]