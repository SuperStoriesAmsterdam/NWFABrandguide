# Josje — Italiaanse natuurwijn (uitgeefdossier)

Static one-pager, geserveerd via nginx in Docker. Uitbreidbaar: extra pagina's als
`*.html` in de root toevoegen (clean URLs werken via de nginx `try_files`-fallback).

## Live
- Staging: https://josje.superstories.com

## Lokaal bekijken
```bash
docker build -t josje . && docker run --rm -p 8080:80 josje
# open http://localhost:8080
```

## Coolify deploy
- **Type:** Dockerfile
- **Repository:** SuperStoriesAmsterdam/josje (branch `main`)
- **Build pack:** Dockerfile (in repo root)
- **Port:** 80
- **Domain:** josje.superstories.com (Cloudflare → Coolify server-IP, proxied)

## Structuur
- `index.html` — het dossier
- `js/annotate.js` — SuperStories review-annotatietool (project `josje`). Verwijder script + config vóór finale productie.
- `llms.txt` — AI-indexering
- `Dockerfile` / `nginx.conf` — static serving
- `italiaanse-natuurwijn-dossier.{html,jsx}` — originele bron (niet geserveerd)
