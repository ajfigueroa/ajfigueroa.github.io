---
layout: post
title: 'Open-sourcing Schematic'
excerpt_separator: <!--break-->
categories: Blog
---

In March of 2018, I started work on an Auto Layout wrapper library called Schematic. The goal was to help simplify creating views for the development teams at Wattpad.

<!--break-->

Before SwiftUI was announced, it was a common trend in the iOS community to build Auto Layout wrappers.
Auto Layout has improved over the years but around this time the API was quite verbose even with Layout Anchors.

During my time at Wattpad, I had a really great Engineering Manager who pushed me to follow my passions with developing infrastructure for the mobile teams at Wattpad.
One of my first projects in this space was identifying problem with the teams and how we can simplify UI creation so developers can focus on moving fast.

The project I worked on originally called "Breakdown" was [Schematic](https://github.com/Wattpad/Schematic). It was a wrapper over Auto Layout specifically for Wattpad and I had a great time measuring the performance and usefulness of the library. I was able to get adoption for it internally and from what I've last heard, it's still being used today. 

I go into a lot of detail about why I decided to make another Auto Layout wrapper in the [Schematic Wiki](https://github.com/Wattpad/Schematic/wiki/Explanation-for-how-this-framework-came-to-be). It was originally called "Breakdown".

After I left Wattpad, I was really hoping to see it open-sourced and it finally was in late 2019.
It reminded me of why I enjoy developing in the mobile infra space as there are very interesting problems to solve to help improve developer experience across multiple teams.

With the introduction of SwiftUI, it probably doesn't make sense to include an Auto Layout wrapper at this time but it's unlikely we'll see mass adoption of SwiftUI until the minimum iOS target most companies deploy for includes SwiftUI. 

Given most companies still need to support at least iOS 10 and some still need to adopt Swift, it's unlikely we'll see more SwiftUI adoption until iOS 13 is the minimum deploy target. 

However, keep in mind I haven't written much Swift in over a year now as I primarily write Objective-C/C++ these days.
