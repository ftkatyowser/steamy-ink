---
layout: default
title: Poppy's Prose
description: Personal writings and reflections from Poppy.
permalink: /blog/
---
# Poppy's Prose

<p class="drop-cap">Welcome to my personal archive. This corner of the site is dedicated to the stories, blog posts, and internal musings of Penelope Anne Marianus (née Katullin), my player character in the <em>Kingdoms of Novitas</em> LARP.</p>


While the professional work of Steamy Ink Publishing focuses on the news of the Freelands and can be used as in-character knowledge, these entries are a personal creative outlet. I invite you to grab some tea and enjoy a deeper look into Poppy's life, but please remember to leave these secrets at the door if we meet in the Freelands!

In short: **The contents found here are shared for Out of Game enjoyment only.**

---

## Posts

<ul class="blog-list">
  {% for post in site.posts %}
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
    <a href="{{ post.url | relative_url }}" class="blog-item-link">Continue reading →</a>
  </li>
  {% endfor %}
</ul>

{% if site.posts.size == 0 %}
<p class="coming-soon" style="text-align: center; padding: 3rem;">
  Blog posts coming soon...
</p>
{% endif %}