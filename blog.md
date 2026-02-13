---
layout: default
title: Poppy's Prose
description: Personal writings and reflections from Poppy.
permalink: /blog/
---
<header>
  <h1 style="font-family: var(--font-blog-header);">Poppy's Prose</h1>
  <p class="subtitle">The not-so-well-known stories of everyone's favorite town gossip</p>
</header>
---

<p class="drop-cap">Welcome to my personal archive! This corner of the site is dedicated to the stories, blog posts, and internal musings of Penelope Anne Marianus (n&eacute;e Katullin), my player character in the <em>Kingdoms of Novitas</em> LARP.</p>


While the professional work of Steamy Ink Publishing focuses on the news of the Freelands and can be used as in-character knowledge, these entries are a personal creative outlet. I invite you to grab some tea and enjoy a deeper look into Poppy's life, but please remember to leave these secrets at the door if we meet in the Freelands!

In short: **The contents found here are shared for Out of Game enjoyment only.**

{% comment %} Find the latest story for the jump link {% endcomment %}
{% assign story_posts = site.posts | where_exp: "post", "post.story" %}
{% assign standalone_posts = site.posts | where_exp: "post", "post.story == nil" %}
{% assign latest_story_post = story_posts | first %}

{% if latest_story_post %}
<p style="text-align: center;"><a href="#story-{{ latest_story_post.story | slugify }}" class="latest-entry-bar"><strong>Latest Entry &darr;</strong></a></p>
{% endif %}

---

{% comment %}
  Group published posts by story name.
  Posts without a "story" front matter are listed as standalone posts.
{% endcomment %}

{% comment %} Collect unique story names {% endcomment %}
{% assign story_names = "" %}
{% for post in story_posts %}
  {% unless story_names contains post.story %}
    {% if story_names == "" %}
      {% assign story_names = post.story %}
    {% else %}
      {% assign story_names = story_names | append: "||" | append: post.story %}
    {% endif %}
  {% endunless %}
{% endfor %}
{% assign story_names_array = story_names | split: "||" | reverse %}

{% for story_name in story_names_array %}
  {% assign chapters = site.posts | where: "story", story_name | sort: "chapter" %}
  {% assign first_chapter = chapters | first %}

  <div class="story-box" id="story-{{ story_name | slugify }}">
    <h2 class="story-box-title">{{ story_name }}</h2>
    {% if first_chapter.story_summary %}
      <p class="story-box-summary">{{ first_chapter.story_summary }}</p>
    {% endif %}
    <div class="story-box-toc">
      <h3 class="story-box-toc-heading">Chapters</h3>
      <ol class="story-box-chapter-list">
        {% for chapter in chapters %}
        <li>
          <a href="{{ chapter.url | relative_url }}">
            {% if chapter.chapter_title %}{{ chapter.chapter_title }}{% else %}Chapter {{ chapter.chapter }}{% endif %}
          </a>
          {% if chapter.ingame_date and chapter.ingame_date != "" %}<span class="chapter-date">({{ chapter.ingame_date }})</span>{% endif %}
        </li>
        {% endfor %}
      </ol>
    </div>
  </div>

{% endfor %}

{% if standalone_posts.size > 0 %}
## Other Posts

<ul class="blog-list">
  {% for post in standalone_posts %}
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
{% endif %}

{% if site.posts.size == 0 %}
<p class="coming-soon" style="text-align: center; padding: 3rem;">
  Blog posts coming soon...
</p>
{% endif %}