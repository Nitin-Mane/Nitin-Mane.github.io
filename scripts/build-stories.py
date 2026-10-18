"""Render the portfolio collections as static HTML. Run from any directory.

Edit content/stories.json, then run python scripts/build-stories.py.
Uses only Python's standard library; hosting needs no build step or runtime.
"""
import html
import json
import re
from pathlib import Path
from urllib.parse import quote_plus

ROOT = Path(__file__).resolve().parents[1]
STORIES = json.loads((ROOT / 'content/stories.json').read_text(encoding='utf-8'))
PAGES = {
    'speakers': dict(label='Speaking', number='01', title='Ideas, shared.', accent='Skills, multiplied.',
        intro='From a first line of Python to AI running at the edge. I turn technical ideas into hands-on experiences for students, engineers and developer communities.',
        hero='openvino-pune', caption='Hands-on AI · SIT Pune', primary=('Explore the sessions', '#stories'), secondary=('Invite me to speak', 'contact'),
        signals=[('14 sessions', 'Selected talks & workshops'), ('Learn by building', 'Python · OpenVINO · Generative AI'), ('Campus to community', 'Practical, approachable teaching')],
        heading='In the room. At the keyboard.', lede='Workshops, conversations and the people behind them.',
        cta='Let’s make your next session hands-on.', ctabody='Planning a workshop, campus talk or developer meetup? Let’s shape a session around your audience and what they want to build.', ctalabel='Invite me to speak'),
    'awards': dict(label='Awards', number='02', title='Work that earns', accent='recognition.',
        intro='Milestones in engineering, continuous learning and volunteer leadership. A closer look at the work and communities behind the recognition.',
        hero='ieee-volt', heroImage=1, caption='IEEE VoLT · Class of 2023', primary=('Explore the milestones', '#stories'), secondary=('View experience', 'experience'),
        signals=[('4 milestones', 'Selected recognition'), ('Technical craft', 'AI · MATLAB · Accelerated computing'), ('Volunteer leadership', 'Learning with a global community')],
        heading='The story behind each milestone.', lede='Professional recognition, technical challenges and learning achievements.',
        cta='Explore the work behind the recognition.', ctabody='See how my experience in software engineering, applied AI and community leadership connects to the problems I work on.', ctalabel='View my experience', ctahref='experience'),
    'conferences': dict(label='Conferences', number='03', title='New perspectives.', accent='Shared purpose.',
        intro='Good engineering grows through conversation. These are moments of learning and exchange with developer communities and humanitarian technology leaders.',
        hero='ieee-hta-malaysia', caption='IEEE Region 10 · Kuala Lumpur', primary=('Explore the gatherings', '#stories'), secondary=('Discuss collaboration', 'contact'),
        signals=[('2 gatherings', 'Selected conference experiences'), ('India & Malaysia', 'Connecting across communities'), ('Technology for people', 'Arm developers · IEEE SIGHT')],
        heading='Beyond the conference badge.', lede='The topics, communities and conversations that stay with me.',
        cta='Bring people and ideas together.', ctabody='I welcome conversations about developer programs, humanitarian technology and opportunities to contribute to technical communities.', ctalabel='Start a conversation'),
    'mentor': dict(label='Mentoring', number='04', title='Build with clarity.', accent='Grow with support.',
        intro='From hackathon ideas to global student challenges, I help emerging developers find a practical next step. Explore the stories, then find a session that fits your goals.',
        hero='hackbyte', caption='Student mentoring · HackByte 3.0', primary=('Find a mentoring session', '#sessions'), secondary=('Explore the stories', '#stories'),
        signals=[('Student teams', 'Hackathons & global challenges'), ('Practical guidance', 'Projects · Careers · Research'), ('Shared progress', 'Learning through collaboration')],
        heading='People first. Progress together.', lede='A few moments from mentoring teams and supporting student-led projects.'),
    'research': dict(label='Research', number='05', title='Curiosity, engineered.', accent='Purpose, applied.',
        intro='Exploring the space between software, intelligent systems and real-world needs. From research publications to laboratory and humanitarian collaborations.',
        hero='chromatography', caption='Software × laboratory automation', primary=('Read the publications', '#publications'), secondary=('Explore collaborations', '#stories'),
        signals=[('2 publications', 'Programming education & vision'), ('Applied research', 'Edge AI · Robotics · Automation'), ('Cross-discipline', 'Engineering with real-world context')],
        heading='Research beyond the paper.', lede='Collaborations connecting software and engineering to practical needs.'),
    'webinars': dict(label='Webinars', number='06', title='Technical ideas.', accent='Wider conversations.',
        intro='Online sessions connecting AI concepts with engineering practice. Making space for students and technical communities to learn, question and explore together.',
        hero='ai-electrical-webinar', caption='Invited session · IEEE PES Day', primary=('Explore the session', '#stories'), secondary=('Plan a webinar', 'contact'),
        signals=[('Invited speaker', 'IEEE Power & Energy Society'), ('Applied AI', 'Electrical technology & maintenance'), ('Online learning', 'Connecting with student engineers')],
        heading='Learning beyond the classroom.', lede='An expert session at the intersection of artificial intelligence and electrical engineering.',
        cta='Have an audience curious about AI?', ctabody='Let’s discuss an online session on applied AI, computer vision or edge deployment, shaped around your community’s interests.', ctalabel='Plan a webinar'),
}

def esc(value):
    return html.escape(str(value), quote=True)

def navigation(page):
    return '<nav class="story-nav container" aria-label="Explore my work"><div class="story-nav__inner"><span class="story-nav__label">The portfolio</span><div class="story-nav__links">' + ''.join(
        f'<a href="{route}"' + (' aria-current="page"' if route == page else '') + f'>{esc(config["label"])}</a>' for route, config in PAGES.items()) + '</div></div></nav>'

def hero(page, cfg):
    featured = next(s for s in STORIES if s['id'] == cfg['hero'])
    img = featured['images'][cfg.get('heroImage',0)]
    signals = ''.join(f'<div><strong>{esc(a)}</strong><span>{esc(b)}</span></div>' for a,b in cfg['signals'])
    actions = ''.join(f'<a class="btn btn--{style}" href="{url}">{esc(label)} <span aria-hidden="true">↗</span></a>' for style,(label,url) in [('primary',cfg['primary']),('ghost',cfg['secondary'])])
    return f'''<!-- STORIES HERO START -->
{navigation(page)}
<section class="story-hero container" aria-labelledby="story-page-title">
  <div class="story-hero__grid">
    <div><span class="story-kicker">{cfg['number']} / {cfg['label']} · Nitin Mane</span>
      <h1 id="story-page-title">{esc(cfg['title'])}<br><em>{esc(cfg['accent'])}</em></h1>
      <p class="story-hero__intro">{esc(cfg['intro'])}</p>
      <div class="story-hero__actions">{actions}</div>
    </div>
    <figure class="story-hero__visual{' story-hero__visual--contain' if featured['contain'] else ''}">
      <img src="{img['src']}" alt="{esc(img['alt'])}" width="800" height="600" fetchpriority="high">
      <figcaption><div><span>A moment from the work</span><strong>{esc(cfg['caption'])}</strong></div><a href="#{featured['id']}" aria-label="Read the story: {esc(featured['title'])}">↗</a></figcaption>
    </figure>
  </div>
  <div class="story-signals">{signals}</div>
</section>
<!-- STORIES HERO END -->'''

PIN = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'

def place(s):
    """Venue (linked), location (opens Google Maps) and related links; falls back to the plain place line."""
    venue=s.get('venue')
    if not venue:
        return f'<p class="story-card__place">{esc(s["place"])}</p>'
    name=(f'<a href="{esc(venue["url"])}" target="_blank" rel="noopener">{esc(venue["name"])}</a>'
          if venue.get('url') else esc(venue['name']))
    location=esc(s.get('location',''))
    if s.get('map'):
        where=(f'<a class="story-card__map" href="https://www.google.com/maps/search/?api=1&amp;query={quote_plus(s["map"])}" '
               f'target="_blank" rel="noopener" aria-label="Open {location} in Google Maps">{PIN}{location}</a>')
    else:
        where=f'<span class="story-card__map">{PIN}{location}</span>'
    links=''.join(f'<a href="{esc(l["url"])}" target="_blank" rel="noopener">{esc(l["label"])}<span aria-hidden="true"> ↗</span></a>'
                  for l in s.get('links',[]))
    related=f'<p class="story-card__links"><span>Related</span>{links}</p>' if links else ''
    return f'<div class="story-card__place"><p class="story-card__venue">{name}</p><p>{where}</p>{related}</div>'

def card(s):
    image=s['images'][0]
    cover=s.get('cover',image['src'])
    detail=''.join(f'<h4>{heading}</h4><p>{esc(text)}</p>' for heading,text in [('The work',s['detail']),('The contribution',s['outcome'])] if text)
    tags=''.join(f'<span>{esc(tag)}</span>' for tag in s['topics'])
    permalink=f'<a href="#{s["id"]}" class="story-permalink">Link to this story <span aria-hidden="true">↗</span></a>'
    more=f'<details><summary>Explore the story</summary>{detail}{permalink}</details>' if detail else permalink
    return f'''<article class="story-card" id="{s['id']}" data-story data-topics="{esc('|'.join(s['topics']))}" data-date="{s['date']}">
  <a class="story-card__media{' story-card__media--contain' if s['contain'] else ''}" href="{image['src']}" data-story-gallery="{s['id']}" aria-label="Open gallery: {esc(s['title'])}">
    <img src="{cover}" alt="{esc(image['alt'])}" width="720" height="480" loading="lazy" decoding="async">
    <span class="story-photo-count">↗ View gallery · {len(s['images']):02}</span>
  </a>
  <div class="story-card__body">
    <div class="story-card__meta"><span>{esc(s['role'])}</span><span>{esc(s['dateLabel'])}</span></div>
    <h3>{esc(s['title'])}</h3>{place(s)}
    <p class="story-card__summary">{esc(s['summary'])}</p><div class="story-tags">{tags}</div>
    {more}
  </div>
</article>'''

def collection(page,cfg):
    entries=[s for s in STORIES if s['page']==page]
    topics=list(dict.fromkeys(t for s in entries for t in s['topics']))
    filters='<button type="button" data-topic="all" aria-pressed="true">All stories</button>'+''.join(f'<button type="button" data-topic="{esc(t)}" aria-pressed="false">{esc(t)}</button>' for t in topics)
    return f'''<!-- STORIES COLLECTION START -->
<section class="story-collection container" id="stories" data-story-collection aria-labelledby="story-collection-title">
  <div class="story-section-heading"><div><span class="story-kicker">Selected experiences</span><h2 id="story-collection-title">{esc(cfg['heading'])}</h2><p>{esc(cfg['lede'])}</p></div><span class="story-index">{len(entries):02} STORIES / {cfg['label'].upper()}</span></div>
  <div class="story-tools" data-story-controls hidden>
    <div class="story-tools__row"><label class="story-search"><span>Search the stories</span><input type="search" data-story-search placeholder="Try a topic, organization or city…" aria-controls="story-list"></label>
      <label class="story-sort"><span>Display order</span><select data-story-sort aria-controls="story-list"><option value="featured">Featured first</option><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div>
    <div class="story-filters" role="group" aria-label="Filter by topic">{filters}</div>
  </div>
  <div class="story-result-line"><p data-story-count role="status" aria-live="polite" aria-atomic="true">{len(entries)} stories</p><span>Open a photo. Explore the story.</span></div>
  <div class="story-grid" id="story-list" data-story-list>{''.join(card(s) for s in entries)}</div>
  <div class="story-empty" data-story-empty hidden><h3>No stories match just yet.</h3><p>Try another keyword or clear your filters to see everything.</p><button type="button" class="btn btn--ghost" data-story-reset>Clear filters</button></div>
</section>
<!-- STORIES COLLECTION END -->'''

def dialog(page):
    data={s['id']:dict(title=s['title'],images=s['images']) for s in STORIES if s['page']==page}
    return '''<!-- STORIES GALLERY START -->
<dialog class="story-dialog" data-story-dialog aria-labelledby="gallery-title">
  <div class="story-dialog__head"><h2 id="gallery-title" data-gallery-title>Photo gallery</h2><button type="button" data-gallery-close aria-label="Close gallery" autofocus>×</button></div>
  <figure><img data-gallery-image alt="" width="1600" height="1000"><figcaption data-gallery-caption></figcaption></figure>
  <div class="story-dialog__foot"><a data-gallery-original target="_blank" rel="noopener">Open image ↗</a><div class="story-dialog__controls"><button type="button" data-gallery-prev aria-label="Previous photo">←</button><span data-gallery-counter role="status" aria-live="polite"></span><button type="button" data-gallery-next aria-label="Next photo">→</button></div></div>
</dialog>
<script type="application/json" id="story-gallery-data">''' + json.dumps(data,ensure_ascii=False).replace('<','\\u003c') + '''</script>
<!-- STORIES GALLERY END -->'''

def cta(cfg):
    return f'''<div class="container"><section class="story-next"><div><span class="story-kicker">Keep the conversation going</span><h2>{esc(cfg['cta'])}</h2><p>{esc(cfg['ctabody'])}</p></div><a href="{cfg.get('ctahref','contact')}" class="btn btn--primary">{esc(cfg['ctalabel'])} ↗</a></section></div>'''

def replace_block(text, name, value):
    return re.sub(rf'<!-- STORIES {name} START -->.*?<!-- STORIES {name} END -->', lambda _: value, text, flags=re.S)

template=(ROOT/'speakers.html').read_text(encoding='utf-8')
for page,cfg in PAGES.items():
    file=ROOT/f'{page}.html'
    source=file.read_text(encoding='utf-8') if file.exists() else template
    if page in ['mentor','research']:
        if '<!-- STORIES HERO START -->' in source:
            source=replace_block(source,'HERO',hero(page,cfg))
            source=replace_block(source,'COLLECTION',collection(page,cfg))
        else:
            source=re.sub(r'<section class="page-header">.*?</section>',lambda _: hero(page,cfg),source,count=1,flags=re.S)
            if page=='mentor':
                source=source.replace('<!-- STORIES HERO END -->','<!-- STORIES HERO END -->\n'+collection(page,cfg),1)
            else:
                source=source.replace('<section class="section section--tight">','<section class="section section--tight" id="publications">',1)
                source=source.replace('<section class="section cta">',collection(page,cfg)+'\n<section class="section cta">',1)
    else:
        source=re.sub(r'<main\b[^>]*>.*?</main>',lambda _: '<main id="main">\n'+hero(page,cfg)+collection(page,cfg)+cta(cfg)+'\n</main>',source,count=1,flags=re.S)
    if '<!-- STORIES GALLERY START -->' in source:
        source=replace_block(source,'GALLERY',dialog(page))
    else:
        source=source.replace('</body>',dialog(page)+'\n</body>')
    source=re.sub(r'<body[^>]*>',f'<body class="story-page story-page--{page}">',source,count=1)
    if 'assets/css/stories.css' not in source:
        source=source.replace('</head>','  <link rel="stylesheet" href="assets/css/stories.css">\n</head>')
    if 'assets/js/stories.js' not in source:
        source=source.replace('</body>','  <script src="assets/js/stories.js" defer></script>\n</body>')
    title=f'{cfg["label"]} | Nitin Mane'
    source=re.sub(r'<title>.*?</title>',f'<title>{title}</title>',source,count=1)
    for field,value in [('description',cfg['intro']),('og:title',title),('og:description',cfg['intro']),('og:url',f'https://www.nitinmane.me/{page}'),('twitter:title',title),('twitter:description',cfg['intro'])]:
        source=re.sub(rf'(<meta (?:name|property)="{field}" content=")[^"]*("\s*/?>)',lambda m:m[1]+esc(value)+m[2],source)
    source=re.sub(r'<link rel="canonical" href="[^"]+"\s*/?>',f'<link rel="canonical" href="https://www.nitinmane.me/{page}">',source)
    if page not in ['mentor','research']:
        source=re.sub(r'\s*<script type="application/ld\+json">.*?</script>','',source,flags=re.S)
        source=re.sub(r'\s*<meta name="keywords"[^>]+>','',source)
        schema={'@context':'https://schema.org','@type':'CollectionPage','name':title,'url':f'https://www.nitinmane.me/{page}','description':cfg['intro']}
        source=source.replace('</head>','<script type="application/ld+json">'+json.dumps(schema)+'</script>\n</head>')
    file.write_text(source,encoding='utf-8')

# Put the three new destinations in the existing navigation on every root page.
for file in ROOT.glob('*.html'):
    source=file.read_text(encoding='utf-8')
    for menu,route,label,description in [('about','awards','Awards','Recognition & learning milestones'),('community','conferences','Conferences','Communities & global connections'),('community','webinars','Webinars','Online talks & expert sessions')]:
        pattern=rf'(<div class="nav__menu" id="nav-menu-{menu}">)(.*?)(</div>)'
        def insert(m):
            if f'href="{route}"' in m[2]: return m[0]
            return m[1]+m[2]+f'  <a href="{route}" class="nav__menu-link"><span class="nav__menu-title">{label}</span><span class="nav__menu-desc">{description}</span></a>\n          '+m[3]
        source=re.sub(pattern,insert,source,flags=re.S)
        if f'<li><a href="{route}">' not in source:
            source=source.replace('<li><a href="contact">Contact</a></li>',f'<li><a href="{route}">{label}</a></li>\n          <li><a href="contact">Contact</a></li>')
    file.write_text(source,encoding='utf-8')

sitemap=ROOT/'sitemap.xml'
xml=sitemap.read_text(encoding='utf-8')
for page in PAGES:
    if f'<loc>https://www.nitinmane.me/{page}</loc>' not in xml:
        xml=xml.replace('</urlset>',f'  <url>\n    <loc>https://www.nitinmane.me/{page}</loc>\n    <lastmod>2026-10-18</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>')
    else:
        xml=re.sub(rf'(<loc>https://www.nitinmane.me/{page}</loc>\s*<lastmod>)[^<]+',r'\g<1>2026-10-18',xml)
sitemap.write_text(xml,encoding='utf-8')
print(f'Rendered {len(PAGES)} pages with {len(STORIES)} stories; updated navigation and sitemap.')
