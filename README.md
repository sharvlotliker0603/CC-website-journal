# NOIR — Dark responsive blog + Google Sheets form

A responsive static blog website using HTML, Tailwind CSS (CDN), custom CSS, and vanilla JavaScript. Story submissions are stored in Google Sheets through Google Apps Script.

## Files

- `index.html` — page layout, sample stories, and submission form
- `style.css` — responsive dark theme and visual styling
- `script.js` — mobile menu, story filters, and form submission
- `apps-script/Code.gs` — Google Apps Script endpoint to write submissions to a spreadsheet

## 1. Set up Google Sheets

1. Create a new spreadsheet in Google Sheets.
2. Rename a sheet tab to `Submissions` (the script can also create it automatically).
3. Open **Extensions → Apps Script**.
4. Replace the editor contents with the code in `apps-script/Code.gs`.
5. Click **Save**.

## 2. Deploy Apps Script as a Web App

1. In Apps Script, click **Deploy → New deployment**.
2. Select the gear icon / deployment type and choose **Web app**.
3. Set **Execute as** to **Me**.
4. For **Who has access**, choose **Anyone** if you want a public website form to submit without visitors signing in. This makes the endpoint publicly callable; only use this for non-sensitive submissions and consider adding spam protection before publishing.
5. Click **Deploy**, authorize access when prompted, and copy the Web App URL. It normally ends in `/exec`.
6. If you change the script later, create a new deployment version or update the deployment so the live endpoint receives your changes.

## 3. Connect the website

Open `script.js` and replace:

```js
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with your deployed Web App URL, for example:

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

Use your real URL, not the example. Save the file.

## 4. Test it

1. Open `index.html` in a browser, or deploy the folder to GitHub Pages / Netlify / Vercel as a static site.
2. Fill every required field, tick the consent checkbox, and submit.
3. Open your Google Sheet and check the `Submissions` tab. A header row should be created automatically and each form submission should append a new row.
4. If it doesn't save, verify the `/exec` URL, deployment access, Apps Script authorization, and deployment version. Open the Web App URL directly to check that the endpoint responds.

## Important notes

- This starter uses `fetch(..., { mode: "no-cors" })` because Apps Script web apps commonly do not provide browser CORS headers. The browser cannot read the response in this mode, so the success message means the request was dispatched—not that the sheet write was independently verified. Always test by checking the spreadsheet.
- Do not collect passwords, payment card data, or sensitive personal information through this public endpoint.
- For a public production site, add spam/rate limiting, input validation, and a privacy notice. A public Apps Script endpoint can receive unwanted submissions.
- Tailwind is loaded from its CDN for easy setup. For a production build, install Tailwind with a build tool.
