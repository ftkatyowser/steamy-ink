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

{% assign musing_posts = site.posts | where_exp: "post", "post.musing" | sort: "date" | reverse %}

{% if musing_posts.size > 0 %}
  {% for post in musing_posts %}
  <div class="story-box">
    <h2 class="story-box-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    {% if post.summary %}
      <p class="story-box-summary">{{ post.summary }}</p>
    {% elsif post.excerpt %}
      <p class="story-box-summary">{{ post.excerpt | strip_html | truncate: 200 }}</p>
    {% endif %}
    <p class="blog-item-meta">{{ post.date | date: "%B %d, %Y" }}</p>
    <a href="{{ post.url | relative_url }}" class="blog-item-link">Read more &rarr;</a>
  </div>
  {% endfor %}
{% else %}
<p><em>Nothing here yet — check back soon!</em></p>
{% endif %}
