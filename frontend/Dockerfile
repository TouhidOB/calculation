FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
RUN mkdir .next && chown nextjs:nodejs .next

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
