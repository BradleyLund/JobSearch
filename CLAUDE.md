# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does

Job application tracker that integrates Claude Code with Google Sheets. The user pastes a job posting URL or text into Claude Code, Claude extracts job details, and pushes them to a Google Sheet via a Google Apps Script web app.

## Architecture

- **`appscript.gs`** — Google Apps Script deployed as a web app from the user's Google Sheet. Receives POST requests with JSON job data and appends a row to the "Sheet1" tab. This file is a reference copy; the live version runs inside Google Sheets.
- **`post-job.mjs`** — Local Node.js script (no dependencies, uses Node 22 built-in `fetch` and `process.loadEnvFile()`). Accepts JSON via CLI argument or stdin, POSTs to the Apps Script endpoint.
- **`.env`** — Contains `APPS_SCRIPT_URL` (the deployed Apps Script web app URL). Not committed.

## Commands

```bash
# Post job data to Google Sheets
node post-job.mjs '{"company":"Acme","jobRole":"Engineer","dateFound":"2026-02-10","applicationSent":"No"}'

# Alternative: pipe JSON via stdin (useful for large payloads)
echo '{"company":"Acme","jobRole":"Engineer"}' | node post-job.mjs
```

## Google Sheet Column Mapping (JSON keys)

`company`, `companyWebsite`, `companyDescription`, `recruitmentAgency`, `location`, `hybrid`, `jobRole`, `jobPosting`, `networkConnection`, `cvUsed`, `qualificationsMissing`, `dateFound`, `applicationSent`, `dateApplied`, `response` — followed by 8 blank interview columns.

- `companyDescription`: Brief summary of what the company does
- `recruitmentAgency`: "Yes" if the posting company is a middleman/recruiter (e.g., Robert Half, Perfict), "No" if it's the actual employer

## Workflow for Claude Code

When the user pastes a job posting URL or text:
1. If URL: use **WebFetch** to scrape the page and extract fields
2. If text: parse directly
3. Build JSON with extracted fields. Auto-fill `dateFound` (today, YYYY-MM-DD) and `applicationSent` ("No")
4. Present extracted data to user for confirmation
5. Run `node post-job.mjs '<json>'` via Bash to push to Google Sheets
