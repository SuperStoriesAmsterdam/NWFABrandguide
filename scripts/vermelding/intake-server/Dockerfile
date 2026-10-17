# Build context = repo root (so it can copy both the server and the registry).
# In Coolify set "Base Directory" to / and "Dockerfile Location" to
# scripts/vermelding/intake-server/Dockerfile.
FROM node:22-alpine
WORKDIR /app

# the service itself (no npm deps)
COPY scripts/vermelding/intake-server/ ./

# bake the current registry in as a fallback; REGISTRY_URL (if set) refreshes it live
COPY natuurwijn-kaart/vermelding/registry.js ./registry.js
ENV REGISTRY_PATH=/app/registry.js
ENV PORT=8788
EXPOSE 8788

CMD ["node", "server.mjs"]
