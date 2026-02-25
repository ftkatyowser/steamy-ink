---
layout: default
title: Random Musings
description: Random things written by Poppy.
permalink: /musings/
---
<header>
  <h1 style="font-family: var(--font-blog-header);">Random Musings</h1>
  <p class="subtitle">Things I've written that don't quite fit anywhere else</p>
</header>
---

<p class="drop-cap">No grand narrative here, just words that needed somewhere to go. Snippets, thoughts, and whatever else ends up on paper.</p>

{% assign musing_posts = site.posts | where: "type", "musing" | sort: "date" | reverse %}

{% if musing_posts.size > 0 %}
<ul class="blog-list">
  {% for post in musing_posts %}
  <li class="blog-item">
    <h2 class="blog-item-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <p class="blog-item-meta">
      {{ post.date | date: "%B %d, %Y" }}
      {% if post.ingame_date %} ({{ post.ingame_date }}){% endif %}
    </p>
    <p class="blog-item-excerpt">
      {{ post.excerpt | strip_html | truncate: 200 }}
    </p>
    <a href="{{ post.url | relative_url }}" class="blog-item-link">Read more →</a>
  </li>
  {% endfor %}
</ul>
{% else %}
<p><em>Nothing here yet — check back soon!</em></p>
{% endif %}
