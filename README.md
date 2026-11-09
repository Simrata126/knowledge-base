# My Knowledge Base

A static site for tracking projects, learnings and papers. No build step.

## Use it
1. Open `data.js` and replace the sample entries with your own.
2. Open `index.html` in a browser to preview.

## Add things
- **Project**: title, summary, status (`idea|active|done|paused`), tags, links.
- **Paper**: title, authors, year, venue, url, status (`to-read|reading|read`), rating 1-5, takeaways, tags.
- **Learning**: title, date (`YYYY-MM-DD`), summary, tags.
- Crosslink any two items by putting one's `id` in the other's `related` list.

## Publish on GitHub Pages
1. Create a repo (e.g. `kb`) and push these files to the `main` branch.
2. Repo Settings > Pages > Deploy from branch > `main` / root.
3. Your site appears at `https://<username>.github.io/kb/`.
