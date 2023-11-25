# Stage 1: Compile and Build angular codebase
FROM node:latest as build

WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

RUN npm install
RUN npm run build


# Stage 2: Serve app with nginx server
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80
