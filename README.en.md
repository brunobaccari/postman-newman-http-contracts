# Postman / Newman — HTTP contracts

[Versão em português](README.md)

A collection running against [Postman Echo](https://postman-echo.com). Seven requests check what reaches the server: Unicode and reserved query characters, JSON types, URL-encoded forms, nested objects, HTTP 404 and Basic Auth with/without credentials. No local application.

## Run

Node.js 22 or newer and Python 3 for the summary.

```bash
npm ci
cp .env.example .env
npm test
```

On PowerShell use `Copy-Item .env.example .env`. Process environment variables take precedence. You can also import the collection into Postman: set `base_url`, `demo_username` and `demo_password` to the public example values. The `postman/password` account belongs to the demo; never send real credentials or personal data to an echo service.

## Test decisions

Every request checks status and relevant content, not just HTTP 200. Inputs include `false`, `null`, zero, an empty array, `+`, `&` and accented text to detect type or encoding loss. Basic Auth is tested separately from body serialization. There is no storage: an echoed PUT proves neither persistence nor authorization between users.

The runner requires seven requests and seven contract tests. Failures, script errors, timeouts and incomplete runs fail CI. No automatic retry or silent redirects. A public service outage fails the run; inspect the response before changing the expectation.

## Results

[Actions](https://github.com/brunobaccari/postman-newman-http-contracts/actions) publishes a per-scenario table and the `results` artifact containing `junit.xml` and `summary.md`, retained for 14 days, including after failure. Missing, invalid, empty, skipped or wrong-count reports block the gate. `python scripts/summary.py --self-test` checks the parser. `.env`, logs and results stay out of Git.

This is not a load test, complete security assessment or business-rule suite. References: [Postman Echo](https://learning.postman.com/docs/reference/developer-resources/echo-api/) and [Newman's built-in reporters](https://learning.postman.com/docs/reference/newman-cli/newman-built-in-reporters).

Dependencies: on October 6, 2026, compatible overrides removed the critical advisory and other transitive warnings. `npm audit` still reports ten affected dependencies (six high and four moderate), including Newman internals. The collection uses owned scripts and synthetic data; do not run untrusted collections in this runner. This does not eliminate the remaining advisories.

The Actions summary lists every scenario, duration, totals and blocking reason. The gate requires the count configured in the workflow, with no failures or skips; missing or invalid JUnit fails the gate. The summary is also included in the artifact.
