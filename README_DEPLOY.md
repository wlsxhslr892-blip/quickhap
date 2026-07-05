# QuickPass Deploy Notes

## What To Upload

Upload every file inside this folder:

```text
outputs/quickpass-mvp
```

The site is static. It does not need a build command.

## Cloudflare Pages Settings

```text
Framework preset: None
Build command: leave empty
Build output directory: /
```

## Preview URLs

```text
Home: /index.html
Certificate list: /certifications.html
Certificate page: /certificate.html?id=wihummul-gineungsa
Study mode: /quiz.html?id=wihummul-gineungsa&set=set-01&mode=study
Exam mode: /quiz.html?id=wihummul-gineungsa&set=set-01&mode=exam
```

## Ad Placeholders

Ad placeholders are hidden by default for public release.

To preview ad slots while developing, add this query parameter:

```text
?ads=1
```

Example:

```text
/quiz.html?id=wihummul-gineungsa&set=set-01&mode=study&ads=1
```

When AdSense is approved, replace the placeholder elements with ad code.

## Before Search Console

If the deployed URL is not `https://quickpass.pages.dev`, update these files:

```text
robots.txt
sitemap.xml
```
