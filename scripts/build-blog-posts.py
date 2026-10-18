"""Render the long-form blog articles as static pages: blog-<slug>.html.

Edit an article body in content/blog-posts/<slug>.html (or its metadata below),
then run:  python scripts/build-blog-posts.py
Uses only the Python standard library; the hosted site needs no build step.

Body shorthand expanded by this script:
  [[fig name | caption]]              figure from assets/images/blog/<slug>/name.webp
  [[fig other-slug/name | caption]]   figure from another article's folder
  [[fig name | caption | narrow]]     narrower figure for tall images
  [[gallery]] ... [[/gallery]]        two-column group of figures
The shared navigation and footer are copied from blog.html so every page matches.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.nitinmane.me"
ARROW = ('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
         'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/>'
         '<polyline points="12 5 19 12 12 19"/></svg>')
EXTERNAL = ('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'
            '<polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>')

POSTS = [
    dict(slug="aws-ai-ml-scholars-journey", series="Agentic AI on AWS · Part 0",
         title="From Scholar to Agent Engineer: My AWS AI & ML Scholars Journey",
         lede="How a free AWS learning challenge became a funded Udacity Nanodegree, three agent systems on Amazon Bedrock AgentCore and a set of engineering habits I now use everywhere.",
         date="2026-10-16", date_label="October 2026", tags=["Agentic AI", "AWS AI & ML Scholars", "Udacity"],
         hero="agentcore-support-chatbot/architecture",
         hero_alt="Architecture of the first Nanodegree project, a guarded customer support chatbot on Amazon Bedrock AgentCore",
         facts=[("3", "Agent systems built"), ("120/120", "Capstone test score"), ("0.95", "Chatbot correctness"), ("Oct 8, 2026", "Nanodegree completed")],
         links=[("Verify the certificate", "https://www.udacity.com/certificate/e/ba1d41ec-900d-11f1-9972-03d0f79bde06"),
                ("Credential spotlight", "aws-agent-engineer")]),
    dict(slug="agentcore-support-chatbot", series="Agentic AI on AWS · Part 1",
         title="Three Routes, One Guard: A Support Chatbot That Knows When Not to Write",
         lede="Building a customer support chatbot on Amazon Bedrock AgentCore where the model chooses what to say and deterministic code decides what gets saved.",
         date="2026-10-16", date_label="October 2026", tags=["Bedrock AgentCore", "Amazon Nova", "Evaluation"],
         hero="architecture", hero_alt="Customer support chatbot architecture on Amazon Bedrock AgentCore",
         facts=[("0.95", "Bedrock correctness"), ("0.00", "Harmfulness"), ("34/34", "Automated tests"), ("0", "Resources left running")],
         links=[("View the repository", "https://github.com/Nitin-Mane/customer-support-chatbot"),
                ("Project case study", "aws-agent-engineer#customer-support-chatbot")]),
    dict(slug="tool-right-answer-wrong", series="Agentic AI on AWS · Part 2",
         title="The Tool Was Right. The Answer Was Wrong.",
         lede="A customer support agent with six AgentCore capabilities, and the four-dollar bug that changed how I test agents.",
         date="2026-10-16", date_label="October 2026", tags=["Strands Agents", "Code Interpreter", "Testing"],
         hero="discount", hero_alt="Recorded discount calculation from the deployed AgentCore Runtime",
         facts=[("6/6", "Live scenarios passed"), ("$99.00", "Correct discount total"), ("$139.99", "Refund approved"), ("2", "Sessions, one memory")],
         links=[("View the repository", "https://github.com/Nitin-Mane/AI-Support-Agent"),
                ("Project case study", "aws-agent-engineer#ai-support-agent")]),
    dict(slug="novamart-multi-agent-rag", series="Agentic AI on AWS · Part 3",
         title="Five Agents, One Customer: Multi-Agent RAG Without the Chaos",
         lede="NovaMart, the Nanodegree capstone: a supervisor and four specialist agents, parallel search over three knowledge bases, and shared state that cannot be silently overwritten.",
         date="2026-10-16", date_label="October 2026", tags=["Multi-Agent RAG", "Strands Agents", "S3 Vectors"],
         hero="architecture", hero_alt="NovaMart multi-agent architecture on Amazon Bedrock AgentCore",
         facts=[("120/120", "Official test score"), ("5", "Cooperating agents"), ("3", "Knowledge bases in parallel"), ("0", "Failed trace nodes")],
         links=[("View the repository", "https://github.com/Nitin-Mane/Multi-Agent-E-commerce-RAG"),
                ("Project case study", "aws-agent-engineer#multi-agent-ecommerce-rag")]),
    dict(slug="smart-weed-remover-robot", series="Robotics & Edge AI",
         title="Smart Weed Remover Robot: YOLOv5 on Jetson Nano with a 3-DOF Delta Robot",
         lede="From a 2,822-image dataset to TensorRT inference and safe pluck trajectories: the full chain from seeing a weed to moving a parallel robot to remove it.",
         date="2026-06-15", date_label="June 2026", tags=["Robotics", "NVIDIA Jetson", "YOLOv5", "TensorRT"],
         hero="dashboard", hero_alt="Weed detection and Delta robot project summary dashboard",
         facts=[("0.701", "Test mAP@0.5 (YOLOv5m)"), ("2,822", "Images · 14,919 boxes"), ("17.1 ms", "TensorRT inference"), ("56 FPS", "Simulated control loop")],
         links=[("View the repository", "https://github.com/Nitin-Mane/weedcrop-jetson-delta-robot")]),
    dict(slug="ultraedge-aipc-studio", series="AI PC & Edge AI",
         title="UltraEdge AIPC Studio: A Local Multimodal AI Lab on an Intel AI PC",
         lede="A local-first developer console that turns an Intel Core Ultra machine into a small AI lab: model management, OpenVINO inference across CPU, GPU and NPU, multimodal assistants and benchmarks.",
         date="2026-08-01", date_label="August 2026", tags=["AI PC", "OpenVINO", "Local AI"],
         hero="dashboard", hero_alt="UltraEdge AIPC Studio dashboard",
         facts=[("CPU · GPU · NPU", "OpenVINO targets"), ("Local-first", "Data stays on device"), ("v0.1.1", "Alpha release"), ("Apache 2.0", "Open source")],
         links=[("View the repository", "https://github.com/Nitin-Mane/ultraedge-aipc-studio")]),
]


def esc(value):
    return html.escape(str(value), quote=True)


def img_path(slug, name):
    return f"assets/images/blog/{name if '/' in name else slug + '/' + name}.webp"


def figure(slug, name, caption, extra=""):
    src = img_path(slug, name)
    alt = re.sub(r"<[^>]+>", "", caption).strip()
    narrow = " post-figure--narrow" if extra.strip() == "narrow" else ""
    return (f'<figure class="post-figure{narrow}">'
            f'<a class="post-figure__zoom" href="{src}" data-zoom aria-label="Enlarge figure: {esc(alt)}">'
            f'<img src="{src}" alt="{esc(alt)}" loading="lazy" decoding="async"></a>'
            f'<figcaption><b>Fig. {{n}}</b> {caption}</figcaption></figure>')


def render_body(post):
    body = (ROOT / "content" / "blog-posts" / f"{post['slug']}.html").read_text(encoding="utf-8")
    body = body.replace("[[gallery]]", '<div class="post-gallery">').replace("[[/gallery]]", "</div>")

    def fig(m):
        parts = [p.strip() for p in m.group(1).split("|")]
        return figure(post["slug"], parts[0], parts[1], parts[2] if len(parts) > 2 else "")

    body = re.sub(r"\[\[fig ([^\]]+)\]\]", fig, body)
    counter = iter(range(1, 100))
    body = re.sub(r"\{n\}", lambda _: str(next(counter)), body)
    for src in re.findall(r'src="(assets/images/blog/[^"]+)"', body):
        if not (ROOT / src).exists():
            raise SystemExit(f"Missing image for {post['slug']}: {src}")
    toc = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body)
    return body, toc


def words(text):
    return len(re.sub(r"<[^>]+>", " ", text).split())


blog = (ROOT / "blog.html").read_text(encoding="utf-8")
shell_top = blog[blog.index('  <a href="#main" class="skip-link">'):blog.index("  </header>") + len("  </header>")]
footer = blog[blog.index("  <footer class=\"footer\">"):blog.index("  <script src=\"assets/js/main.js\"")]

for i, post in enumerate(POSTS):
    slug = post["slug"]
    body, toc = render_body(post)
    minutes = max(3, round(words(body) / 220))
    url = f"{SITE}/blog-{slug}"
    hero_src = img_path(slug, post["hero"])
    prev_post = POSTS[i - 1] if i > 0 else None
    next_post = POSTS[i + 1] if i + 1 < len(POSTS) else None
    schema = {
        "@context": "https://schema.org", "@type": "BlogPosting", "headline": post["title"],
        "description": post["lede"], "datePublished": post["date"], "dateModified": "2026-10-18",
        "image": f"{SITE}/{hero_src}", "url": url, "keywords": ", ".join(post["tags"]),
        "author": {"@type": "Person", "name": "Nitin Mane", "url": f"{SITE}/"},
        "isPartOf": {"@type": "Blog", "name": "Engineering Blog | Nitin Mane", "url": f"{SITE}/blog"},
    }
    tags = "".join(f'<span class="tag{" tag--amber" if n == 0 else ""}">{esc(t)}</span>' for n, t in enumerate(post["tags"]))
    facts = "".join(f'<div class="stat reveal reveal--scale" style="--reveal-delay:{n * 60}ms"><span class="stat__value">{esc(v)}</span>'
                    f'<span class="stat__label">{esc(l)}</span></div>' for n, (v, l) in enumerate(post["facts"]))
    toc_html = "".join(f'<li><a href="#{a}">{t}</a></li>' for a, t in toc)
    side_links = "".join(
        f'<a href="{esc(u)}" class="project-card__link"{" target=\"_blank\" rel=\"noopener\"" if u.startswith("http") else ""}>{esc(t)} '
        f'{EXTERNAL if u.startswith("http") else ARROW}</a>' for t, u in post["links"])
    nav_cards = ""
    for label, p in (("Previous article", prev_post), ("Next article", next_post)):
        if p:
            nav_cards += f'<a class="card" href="blog-{p["slug"]}"><span>{label}</span><strong>{esc(p["title"])}</strong></a>'
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{esc(post['title'])} | Nitin Mane</title>
  <meta name="description" content="{esc(post['lede'])}" />
  <meta name="keywords" content="Nitin Mane, {esc(', '.join(post['tags']))}" />
  <meta name="author" content="Nitin Mane" />
  <link rel="canonical" href="{url}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#060a12" />
  <script src="assets/js/theme-init.js"></script>

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Nitin Mane" />
  <meta property="og:title" content="{esc(post['title'])}" />
  <meta property="og:description" content="{esc(post['lede'])}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:image" content="{SITE}/{hero_src}" />
  <meta property="article:published_time" content="{post['date']}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{esc(post['title'])}" />
  <meta name="twitter:description" content="{esc(post['lede'])}" />
  <meta name="twitter:image" content="{SITE}/{hero_src}" />

  <!-- Icons -->
  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml" />
  <link rel="alternate icon" href="assets/images/favicon.svg" />
  <link rel="apple-touch-icon" href="assets/images/profile_nitinmane.png" />
  <link rel="manifest" href="site.webmanifest" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <!-- Styles -->
  <link rel="stylesheet" href="assets/css/variables.css" />
  <link rel="stylesheet" href="assets/css/base.css" />
  <link rel="stylesheet" href="assets/css/components.css" />
  <link rel="stylesheet" href="assets/css/animations.css" />
  <link rel="stylesheet" href="assets/css/blog.css" />
  <link rel="stylesheet" href="assets/css/blog-post.css" />

  <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
</head>
<body class="post-page">
  <!-- Generated by scripts/build-blog-posts.py from content/blog-posts/{slug}.html -->
{shell_top}
  <div class="post-progress" data-post-progress aria-hidden="true"></div>

  <main id="main">
    <header class="container post-header">
      <div class="page-header__crumbs reveal">
        <a href="/">Home</a>
        <span>/</span>
        <a href="blog">Blog</a>
        <span>/</span>
        <span class="text-cyan">Article</span>
      </div>
      <span class="post-header__series reveal">{esc(post['series'])}</span>
      <h1 class="post-header__title reveal" style="--reveal-delay:60ms">{esc(post['title'])}</h1>
      <p class="post-header__lede reveal" style="--reveal-delay:100ms">{esc(post['lede'])}</p>
      <div class="post-meta reveal" style="--reveal-delay:140ms">
        <span><strong>Nitin Mane</strong></span>
        <span>Published {esc(post['date_label'])}</span>
        <span>{minutes} min read</span>
      </div>
      <div class="tag-row reveal" style="margin-top: var(--space-4); --reveal-delay:160ms">{tags}</div>
      <div class="post-facts">{facts}</div>
      <figure class="post-figure post-hero reveal reveal--scale">
        <a class="post-figure__zoom" href="{hero_src}" data-zoom aria-label="Enlarge figure: {esc(post['hero_alt'])}">
          <img src="{hero_src}" alt="{esc(post['hero_alt'])}" fetchpriority="high" decoding="async">
        </a>
      </figure>
    </header>

    <div class="container post-layout">
      <article class="post-body" data-post-body>
{body}
      </article>

      <aside class="post-toc" aria-label="On this page">
        <nav data-post-toc aria-label="Article sections">
          <p class="post-toc__title">On this page</p>
          <ol>{toc_html}</ol>
        </nav>
        <div class="post-toc__links">{side_links}<a href="blog#{slug}" class="project-card__link">Article summary {ARROW}</a></div>
      </aside>
    </div>

    <section class="section section--tight">
      <div class="container">
        <div class="post-next">{nav_cards}</div>
      </div>
    </section>
  </main>

  <dialog class="post-lightbox" data-post-lightbox aria-label="Enlarged figure">
    <img alt="" />
    <div class="post-lightbox__bar"><span data-lightbox-caption></span><button type="button" class="post-lightbox__close" data-lightbox-close>Close</button></div>
  </dialog>

{footer}  <script src="assets/js/main.js" defer></script>
  <script src="assets/js/blog-post.js" defer></script>
</body>
</html>
"""
    (ROOT / f"blog-{slug}.html").write_text(page, encoding="utf-8", newline="\n")
    print(f"blog-{slug}.html  {minutes} min  {len(toc)} sections")

# Sitemap entries for the article pages
sitemap = ROOT / "sitemap.xml"
xml = sitemap.read_text(encoding="utf-8")
for post in POSTS:
    loc = f"{SITE}/blog-{post['slug']}"
    if f"<loc>{loc}</loc>" not in xml:
        xml = xml.replace("</urlset>", f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>2026-10-18</lastmod>\n"
                                       f"    <changefreq>yearly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>")
sitemap.write_text(xml, encoding="utf-8", newline="\n")
