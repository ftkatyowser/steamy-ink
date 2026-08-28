---
layout: default
title: Loose Pages
description: Standalone stories and one-offs that aren't part of a longer series.
permalink: /loose-pages/
---
<header>
  <h1 style="font-family: var(--font-blog-header);">Loose Pages</h1>
  <p class="subtitle">Standalone stories that don't belong to a longer series</p>
</header>
---

<p class="drop-cap">Not every story needs seven chapters. These are the one-offs: complete in a single sitting, and not tied to any of the ongoing serials over on Poppy's Prose.</p>

---

{% assign loose_page_posts = site.posts | where_exp: "post", "post.loose_page" | sort: "date" | reverse %}

{% if loose_page_posts.size > 0 %}
<ul class="blog-list">
  {% for post in loose_page_posts %}
  <li class="blog-item">
    <h2 class="blog-item-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <p class="blog-item-meta">
      {{ post.date | date: "%B %d, %Y" }}
      {% if post.ingame_date %} ({{ post.ingame_date }}){% endif %}
    </p>
    <p class="blog-item-excerpt">
      {% if post.summary %}{{ post.summary }}{% else %}{{ post.excerpt | strip_html | truncate: 200 }}{% endif %}
    </p>
    <a href="{{ post.url | relative_url }}" class="blog-item-link">Continue reading &rarr;</a>
  </li>
  {% endfor %}
</ul>
{% else %}
<p><em>Nothing here yet — check back soon!</em></p>
{% endif %}
