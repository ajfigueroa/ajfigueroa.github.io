---
layout: post
title: 'Ad-hoc experimention with Gatsby'
excerpt_separator: <!--break-->
categories: Blog
---

I recently converted my website to Gatsby and back to Jekyll. These are some notes for myself if I ever decide to rewrite my website again.

<!--break-->

## Gatsby

If you're familiar with the React community, you might have heard of [overreacted.io](https://overreacted.io/) by [@dan_abramov](https://mobile.twitter.com/dan_abramov).
It was built with [Gatsby](https://www.gatsbyjs.org/) and has many engrossing articles. 

However, the main thing that stood out to me was the "Dark Mode" toggle. It turns out that this comes for free with the Getting Started template Gatsby provides.

There are two areas that I find could be improved with my website: 
1. Dark Mode support and;
2. Code Syntax Highlighting

I was hoping Gatsby would make this process a lot easier for me and for the most part it did solve those two problems for me.

Unfortunately, I found the setup with Github pages a bit too complex for my liking.
I wasn't a fan of having to maintain separate branches: one to act as source code and one to contain the generated code required for the static website.

As you can tell by the following screenshot I've since reverted back to my initial Jekyll static site setup:

<img src="/assets/img/posts/20200515/commit_history.png" width="75%" height="75%">

With all things with software, just because Gatsby didn't work for me does not mean it's a bad solution.
There are a lot of great sites that are powered by Gatsby and I am a huge fan of the React architecture that powers it.

## Setting up Jekyll (again)

It's been a while since I've had to setup this website to test locally.

I looked into my README and saw the following cryptic steps:

```
npm install
bundle install
gulp [default] 
```

On my current personal laptop, I didn't have npm, bundler, or gulp installed. My README makes no mention about how to set these tools up so I had to do some searching to figure this out again.

This got me thinking that perhaps I went a bit overboard with the infra required to setup my website. I needed to audit my current setup.

I'm soley using npm to install gulp. Gulp has been super handly for automating tasks with JavaScript such as minifying CSS and launching my website with pre-configured commands.

Bundler is being used to install both Jekyll and Rake. The former is definitely required for this website but I wonder if I could leverage Rake instead to automate the tasks that I'm currently using gulp for.

I'll need to set some time to investigate that and that should simplify the website infra to be soley Ruby-based.
