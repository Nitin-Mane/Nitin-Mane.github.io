<!-- ========================================================= -->
<!-- Personal Website README.md                               -->
<!-- Static HTML/CSS Website Hosted on Namecheap              -->
<!-- ========================================================= -->

<div align="center">

# 🌐 Personal Website

[![Website Deploy](https://github.com/Nitin-Mane/Nitin-Mane.github.io/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/USERNAME/REPOSITORY/actions/workflows/deploy.yml)
![HTML](https://img.shields.io/badge/HTML5-Static_Webpages-orange?style=for-the-badge&logo=html5)
![CSS](https://img.shields.io/badge/CSS3-Custom_Theme-blue?style=for-the-badge&logo=css3)
![Hosting](https://img.shields.io/badge/Hosted_on-Namecheap-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)

<br>

### A responsive personal portfolio website built using static HTML and CSS.

🔗 **Live Website:** [https://nitinmane.me](https://nitinmane.me)

</div>

---

## 📌 Project Overview

This repository contains the source code for my personal website.  
The website is developed using **static HTML and CSS webpages** and is hosted on **Namecheap hosting**.

The purpose of this website is to present my profile, technical work, research projects, portfolio, achievements, and contact information in a clean and professional format.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 Frontend
- Static HTML pages
- Custom CSS styling
- Responsive layout
- Clean navigation structure
- Lightweight and fast loading

</td>
<td width="50%">

### 🌍 Deployment
- Hosted on Namecheap
- Domain-based access
- GitHub version control
- Simple file-based deployment
- Easy maintenance

</td>
</tr>
</table>

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Webpage structure |
| **CSS3** | Styling and layout |
| **GitHub** | Source code management |
| **GitHub Actions** | Build/status tracking |
| **Namecheap** | Domain and hosting |
| **cPanel / File Manager / FTP** | Website deployment |

---

## 📁 Project Structure

````markdown
## 📁 Project Structure

```text
PERSONAL_WEBSITE/
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── docs/
│   │   ├── Nitin_Mane_CV.pdf
│   │   └── Nitin_Mane_Resume.pdf
│   │
│   ├── images/
│   │   └── website images and profile assets
│   │
│   └── js/
│       └── JavaScript files
│
├── 404.html
├── about.html
├── blog.html
├── case-study-anomaly-detection.html
├── contact.html
├── education.html
├── experience.html
├── index.html
├── projects.html
├── research.html
│
├── .htaccess
├── CNAME
├── robots.txt
├── site.webmanifest
├── sitemap.xml
│
└── README.md
````

### Folder Description

| Path               | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `index.html`       | Main homepage of the personal website                   |
| `about.html`       | About/profile section                                   |
| `case-study-anomaly-detection.html` | Case study: Realtime Industrial Anomaly Detection project |
| `education.html`   | Academic background and qualifications                  |
| `experience.html`  | Professional experience and roles                       |
| `projects.html`    | Projects and technical work                             |
| `research.html`    | Research work, publications, and academic contributions |
| `blog.html`        | Blog or article section                                 |
| `contact.html`     | Contact details and communication links                 |
| `404.html`         | Custom error page for broken or missing links           |
| `assets/css/`      | CSS files used for styling the website                  |
| `assets/js/`       | JavaScript files used for interactivity                 |
| `assets/images/`   | Images, profile photos, icons, and visual assets        |
| `assets/docs/`     | Resume, CV, and downloadable documents                  |
| `.htaccess`        | Apache rewrite rules for clean (extensionless) URLs      |
| `CNAME`            | Custom domain configuration file                        |
| `robots.txt`       | Search engine crawling instructions                     |
| `sitemap.xml`      | Website sitemap for search engines                      |
| `site.webmanifest` | Web app/site metadata file                              |

```
---

## 🔗 Clean URLs

The site is configured to hide the `.html` extension from every page using
the included `.htaccess` (Apache / cPanel hosting on Namecheap):

| File             | Live URL                          |
| ----------------- | ---------------------------------- |
| `index.html`       | `https://nitinmane.me/`            |
| `about.html`       | `https://nitinmane.me/about`       |
| `experience.html`  | `https://nitinmane.me/experience`  |
| `case-study-anomaly-detection.html` | `https://nitinmane.me/case-study-anomaly-detection` |
| `projects.html`    | `https://nitinmane.me/projects`    |
| `research.html`    | `https://nitinmane.me/research`    |
| `blog.html`        | `https://nitinmane.me/blog`        |
| `education.html`   | `https://nitinmane.me/education`   |
| `contact.html`     | `https://nitinmane.me/contact`     |
| `404.html`         | Served automatically for unknown paths |

All internal links, the sitemap, and canonical/Open Graph URLs use these
extensionless paths. Requests made directly to a `*.html` URL are
301-redirected to the clean URL.

> **Note:** `.htaccess` rewrite rules only take effect on Apache-based
> hosting (Namecheap/cPanel). They have no effect when previewing with
> `python -m http.server`, so local previews will still need the `.html`
> extension in the address bar.

---

## 🎨 Documentation Theme

The documentation follows a clean professional theme suitable for a personal academic and technical portfolio.

### Theme Colors

| Element    | Color     | Usage                      |
| ---------- | --------- | -------------------------- |
| Primary    | `#0F172A` | Headings and dark sections |
| Accent     | `#2563EB` | Links, buttons, highlights |
| Background | `#F8FAFC` | Page background            |
| Text       | `#334155` | Main content               |
| Success    | `#16A34A` | Status indicators          |
| Border     | `#E2E8F0` | Cards and sections         |

---

## 🎨 CSS Theme Reference

The website uses a simple and modern CSS theme.

```css
:root {
  --primary-color: #0F172A;
  --accent-color: #2563EB;
  --background-color: #F8FAFC;
  --text-color: #334155;
  --success-color: #16A34A;
  --border-color: #E2E8F0;
  --card-bg: #FFFFFF;
}

body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

header {
  background-color: var(--primary-color);
  color: #FFFFFF;
  padding: 20px;
  text-align: center;
}

nav a {
  color: #FFFFFF;
  margin: 0 12px;
  text-decoration: none;
  font-weight: 600;
}

nav a:hover {
  color: var(--accent-color);
}

.container {
  width: 90%;
  max-width: 1100px;
  margin: auto;
  padding: 30px 0;
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
}

.btn {
  display: inline-block;
  background-color: var(--accent-color);
  color: #FFFFFF;
  padding: 10px 18px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.btn:hover {
  opacity: 0.9;
}

footer {
  background-color: var(--primary-color);
  color: #FFFFFF;
  text-align: center;
  padding: 15px;
  margin-top: 40px;
}
```

---

## 🚀 Deployment

The website is hosted on **Namecheap**.
The static files can be uploaded using **cPanel File Manager** or **FTP**.

### Deployment Steps

1. Build or update the static files locally.
2. Push the updated files to GitHub.
3. Login to Namecheap hosting cPanel.
4. Open **File Manager**.
5. Go to the website root folder, usually:

```text
public_html/
```

6. Upload the updated files.
7. Clear browser cache and reload the website.

---

## 🔁 GitHub Actions Status

This repository uses GitHub Actions to track the project status.

Workflow badge used in this README:

```markdown
[![Website Deploy](https://github.com/USERNAME/REPOSITORY/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/USERNAME/REPOSITORY/actions/workflows/deploy.yml)
```

Make sure this file exists:

```text
.github/workflows/deploy.yml
```

Example workflow:

```yaml
name: Website Deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  website-check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Validate Website Files
        run: |
          echo "Checking website files..."
          ls -la
          test -f index.html
          echo "Website files verified successfully."

      - name: Deployment Status
        run: |
          echo "Static website source updated successfully."
          echo "Upload latest files to Namecheap public_html folder if manual hosting is used."
```

---

## 🧪 Local Preview

To preview the website locally, open `index.html` directly in the browser.

You can also run a simple local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## 📌 Important Notes

* GitHub stores the source code.
* Namecheap hosts the live website.
* If deployment is manual, GitHub updates will not automatically update the domain.
* To update the live website, upload the latest files to Namecheap hosting.
* Browser cache may show the old version for some time, so use hard refresh.

Hard refresh:

```text
Ctrl + F5
```

---

## 📷 Website Sections

| Page            | Description                       |
| --------------- | --------------------------------- |
| `index.html`    | Homepage and introduction         |
| `about.html`    | Personal and professional profile |
| `projects.html` | Technical projects and portfolio  |
| `research.html` | Research work and publications    |
| `contact.html`  | Contact details and links         |

---

## 📬 Contact

For any query or collaboration, please visit the contact section of the website.

🌐 Website: https://nitinmane.me

---

<div align="center">

### ⭐ Personal Website Repository

Built with HTML, CSS, GitHub, and Namecheap Hosting.

</div>
```
