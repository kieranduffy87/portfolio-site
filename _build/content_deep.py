# -*- coding: utf-8 -*-
# Flagship deep-dives: process phases, annotated decisions and a bespoke exhibit per project.
# Everything here is drawn from the real project facts; exhibits are rendered live in HTML
# so they read as design documentation, not decoration.

FLAGSHIP = ["mistara", "mjflood", "asl", "raycooke", "engineers-ireland"]

DEEP = {
"mistara": {
 "phases": [
  ("Strategy sprint", "Positioning workshops with the MJ Flood team to find space between cafe quality and workplace practicality."),
  ("Identity & brand world", "Wordmark, palette and a visual language drawn from mist, steam and the rhythm of the working day."),
  ("Packaging system", "A pack architecture that extends across roasts and formats without losing recognition."),
  ("Digital platform", "An editorial-led site built for B2B enquiry, calm on the surface, conversion-focused underneath."),
  ("Phased launch", "Anticipation, reveal, enquiry: a three-step rollout across Instagram, Facebook and LinkedIn."),
 ],
 "decisions": [
  ("Mist, not machinery",
   "Workplace coffee usually sells machines and logistics. I positioned Mistara around atmosphere instead: ritual, warmth, the pause in a working day. The risk was feeling too abstract for B2B buyers, so the practical proof (machines, service, MJ Flood's backing) sits one click deeper, at the enquiry level, where the buying decision actually happens."),
  ("One system, three contexts",
   "The identity had to work on a shelf, in an office and on a screen. That argued for restraint: a quiet palette and minimal typography that let one system flex across packaging, workplace environments and digital without three separate dialects. Range growth is handled by the pack system, not by new layouts."),
  ("Hold the product back",
   "The launch deliberately withheld the offering. Pre-launch content built the mist-and-ritual world with no product detail at all, which cost some early lead generation but meant the reveal landed with recognition already in place. Enquiries opened only in phase three, once the brand had an atmosphere to sell from."),
 ],
 "exhibit": {
  "type": "brandworld",
  "title": "The brand world, distilled",
  "note": "Core palette and principles from the delivered identity.",
  "accent": "#4a3630",
  "swatches": [("Charcoal", "#171513"), ("Mist", "#d8d5ce"), ("Cream", "#f0ede7"), ("Roast", "#4a3630"), ("Sage", "#5f604a")],
  "principles": [("Ritual", "moments, not transactions"), ("Mist", "warmth, movement, atmosphere"), ("Momentum", "the phases of a working day")],
 },
},
"mjflood": {
 "phases": [
  ("Brand audit", "Mapping five decades of equity: what the market recognised, and what the mark no longer said."),
  ("Architecture", "A masterbrand structure with endorsed divisions, built to absorb future businesses."),
  ("Masterbrand refresh", "Typography, colour and motion modernised around the recognition the group already owned."),
  ("Sub-brand system", "Coffee and Security expressed as specialists, unmistakably part of one group."),
  ("Three-site ecosystem", "Corporate, Coffee and Security platforms sharing one design system and navigation logic."),
 ],
 "decisions": [
  ("Masterbrand, not house of brands",
   "The group's biggest asset was recognition, so the divisions endorse the masterbrand rather than standing alone. The trade-off is real: Coffee and Security give up some creative freedom. What they gain is fifty years of credibility on day one, which matters more in the B2B rooms where these brands are bought."),
  ("Modernise without erasing",
   "A clean-sheet mark would have thrown away the equity the audit found. Instead I kept the recognition cues and redrew everything around them, so a customer who knew the old MJ Flood still recognises the new one, and a new customer sees a contemporary technology group."),
  ("One design system, three sites",
   "Building three websites as one component system cost more upfront and repaid it immediately: consistent experience wherever a customer enters, and a group that can stand up the next division's site without a redesign."),
 ],
 "exhibit": {
  "type": "architecture",
  "title": "Brand architecture",
  "note": "The endorsed structure delivered with the rebrand.",
  "accent": "#481878",
  "parent": "MJ Flood",
  "parent_note": "Masterbrand",
  "children": [("MJ Flood", "Core technology & print"), ("MJ Flood Coffee", "Workplace coffee"), ("MJ Flood Security", "Security systems"), ("Next division", "Room to grow")],
 },
},
"asl": {
 "phases": [
  ("Global workshops", "Stakeholder sessions across countries, designing live in Figma during each call."),
  ("Brand architecture", "One framework holding nine airlines and four sub-brands in a single visual system."),
  ("UX framework", "Universal Design principles applied as the spec for navigation, hierarchy and language."),
  ("Content production", "The group's own aircraft and people, shot and rendered instead of stock."),
  ("Fourteen-week delivery", "Live ahead of a major investment milestone, with a CMS the team runs themselves."),
 ],
 "decisions": [
  ("Consistency before character",
   "With nine airlines wanting their own voice, the tempting route was nine page designs. I locked the shared framework first (livery treatment, logo rules, tone of voice) and only then gave each airline room to personalise inside it. The group reads as one company to an investor and as individual operators to their own customers."),
  ("No stock photography, anywhere",
   "Every image on the platform is ASL: their aircraft, their people, their operations, in photography, CGI and film. It was slower and more expensive than a stock library, and it is exactly why the site feels credible to the investment audience it was built for."),
  ("Universal Design as acceptance criteria",
   "The seven principles were not a poster on the wall. Each one became a test the interface had to pass: equitable use, flexibility, intuitive structure, perceptible information, tolerance for error, low effort, generous space. Accessibility as the spec, not the retrofit."),
 ],
 "exhibit": {
  "type": "architecture",
  "title": "One group, thirteen expressions",
  "note": "The framework that holds the fleet together.",
  "accent": "#2a5d7c",
  "parent": "ASL Aviation Group",
  "parent_note": "Global masterbrand",
  "children": [("Operating airlines", "Nine carriers, one framework"), ("Partner brands", "Four sub-brands"), ("Group platform", "Investor & client audiences"), ("Local expression", "Per-airline personality")],
 },
},
"raycooke": {
 "phases": [
  ("Positioning & identity", "The red dot: completeness of service, carried through a typographic identity."),
  ("Platform architecture", "Publish-once data design: one entry, every channel, in real time."),
  ("UI system", "A light interface that gets out of the way of the properties."),
  ("Integration & testing", "A purpose-built test bench for the third-party data hand-offs nobody else would sandbox."),
  ("Rollout", "First in Ireland to syndicate live to portals and office window displays together."),
 ],
 "decisions": [
  ("Publish once, everywhere",
   "The real product is the pipeline. An agent enters a property once, on an iPad, video included, and the platform's API pushes it live to the website, Daft, MyHome and the window display units in each office at the same moment. That single decision removed the duplicate-entry workload that was capping how fast the office network could grow."),
  ("Open source, enterprise discipline",
   "The budget ruled out heavy licensing, so the build used an open-source stack, then treated it with enterprise seriousness: hardened security protocols and hosting specified for zero downtime. The saving went into the parts customers feel, speed and reliability, not into licence fees."),
  ("Build the missing test bench",
   "The property portals offered no sandbox for testing data hand-offs, which is how launches break. I had a dedicated testing zone built so every integration could be debugged before go-live. Unglamorous, and the reason launch day was quiet."),
 ],
 "exhibit": {
  "type": "platform",
  "title": "The platform, mapped",
  "note": "One property entry syndicated to every channel in real time.",
  "accent": "#d43d2a",
  "source": ("Agent entry", "iPad or laptop, on location, video included"),
  "hub": ("Platform API", "Validates and publishes in real time"),
  "targets": [("raycooke.ie", "Map-first property search"), ("Daft & MyHome", "Portal syndication"), ("Window displays", "Live in every office"), ("Future channels", "Apps & connected screens")],
 },
},
"engineers-ireland": {
 "phases": [
  ("UX research & IA", "Priority journeys mapped with members: join, renew, CPD, accreditation, resources."),
  ("Design tokens", "Colour, type and spacing decisions captured once, applied everywhere."),
  ("Component library", "Reusable patterns for news, events, case studies and member actions."),
  ("Templates & governance", "Content models so new programmes slot in without a designer in the room."),
  ("Handover", "A documented system the in-house team publishes with, at scale, unaided."),
 ],
 "decisions": [
  ("Journeys before pages",
   "The old site was organised around the institution; the new one is organised around what 30,000 members come to do. Join and upgrade, book CPD, find accreditation, check a standard. Navigation, templates and content models all follow those journeys, which is why the high-value actions got faster."),
  ("Components before screens",
   "Instead of designing pages, I designed the system that makes pages: tokens for colour, type and spacing, then a component library built from them. The payoff is governance. Two years of publishing later, the site still looks like it did at handover, because the team assembles from the system rather than improvising."),
  ("Accessibility as default",
   "Semantic structure, keyboard paths and contrast rules live inside the components themselves, so every new page inherits accessibility instead of needing an audit. For a professional body, being usable by every member is not a feature, it is the brief."),
 ],
 "exhibit": {
  "type": "system",
  "title": "Inside the design system",
  "note": "Documentation extract: the tokens and components the platform is assembled from.",
  "accent": "#00355e",
  "colors": [("Navy", "#00355e"), ("Slate", "#36424a"), ("Teal", "#00718e"), ("Steel", "#667c8e"), ("Mist", "#efefef"), ("Paper", "#ffffff")],
  "type_scale": [("Display", "56/60", "600"), ("Heading 1", "40/46", "600"), ("Heading 2", "28/34", "600"), ("Body", "17/28", "400"), ("Caption", "13/18", "500")],
  "spacing": ["4", "8", "16", "24", "40", "64"],
 },
},
}
