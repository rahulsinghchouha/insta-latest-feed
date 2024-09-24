FROM node:18-alpine

EXPOSE 3000

WORKDIR /app
COPY . .

ENV NODE_ENV=production

RUN npm install --omit=dev
# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN npm run build


CMD ["npm", "run", "docker-start"]
