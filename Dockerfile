FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/ /app/src
EXPOSE 1234

# Start the app
CMD ["npm", "start", "--", "--no-daemon"]
