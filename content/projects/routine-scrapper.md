---
title: "Routine Scrapper"
weight: 2
tag: "University Scheduling Automation"
role: "Creator & Maintainer"
period: "Web + Android"
status: "LIVE"
live: "https://routine.zohirrayhan.me/"
description: "Centralised routine automation for Daffodil International University — scraping, precomputed schedules and live room booking."
stack: ["Python", "Flask", "SocketIO", "Firebase FCM", "pandas", "ReportLab", "Java / Android"]
highlights:
  - "Scrapes official routines & precomputes batch/teacher/room schedules"
  - "Real-time room availability & booking over SocketIO"
  - "Companion Android app with FCM push & background sync"
---

A centralised automation platform for Daffodil International University. It
scrapes the official routines, builds the CSE database, and precomputes batch,
teacher and room-wise schedules so any view loads instantly instead of being
derived on request.

On top of that sits real-time room booking over SocketIO and a companion
Android app that syncs in the background and pushes notifications through FCM
when a schedule changes.
