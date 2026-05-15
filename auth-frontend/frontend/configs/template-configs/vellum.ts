import type { TemplateConfig } from '@/types';

const vellumConfig: TemplateConfig = {
  slug: 'vellum',
  name: 'Vellum',
  sections: [
    {
      key: 'hero',
      label: 'Hero / Masthead',
      fields: [
        { key: 'issueLabel', label: 'Issue Label (masthead)', type: 'text', placeholder: 'Issue No. XII', section: 'hero' },
        { key: 'heroDate', label: 'Hero Dateline', type: 'text', placeholder: 'Spring — Summer 2026', section: 'hero' },
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Vellum Marchetti', section: 'hero' },
        { key: 'title', label: 'Role / Title', type: 'text', placeholder: 'Designer & Art Director', section: 'hero' },
        { key: 'tagline', label: 'Hero Tagline', type: 'textarea', placeholder: 'Editorial systems for considered brands.', section: 'hero' },
        { key: 'location', label: 'Location', type: 'text', placeholder: 'Paris — London', section: 'hero' },
        { key: 'availability', label: 'Availability', type: 'text', placeholder: 'Accepting commissions for Autumn 2026', section: 'hero' },
        { key: 'yearsExperience', label: 'Stat — Years of Experience', type: 'text', placeholder: '12', section: 'hero' },
        { key: 'projectsCount', label: 'Stat — Projects Shipped', type: 'text', placeholder: '84', section: 'hero' },
        { key: 'awardsCount', label: 'Stat — Awards', type: 'text', placeholder: '17', section: 'hero' },
        { key: 'clientsCount', label: 'Stat — Clients Served', type: 'text', placeholder: '46', section: 'hero' },
      ],
    },
    {
      key: 'about',
      label: 'About',
      fields: [
        { key: 'aboutP1', label: 'About — Paragraph 1', type: 'textarea', placeholder: 'Studio Vellum is the independent practice…', section: 'about' },
        { key: 'aboutP2', label: 'About — Paragraph 2', type: 'textarea', placeholder: 'Over the last decade…', section: 'about' },
        { key: 'aboutP3', label: 'About — Paragraph 3', type: 'textarea', placeholder: 'Beyond the studio…', section: 'about' },
        { key: 'aboutQuote', label: 'Pull Quote / Philosophy', type: 'textarea', placeholder: 'A brand is a kept promise, set in type and bound in cloth.', section: 'about' },
        { key: 'born', label: 'Born In', type: 'text', placeholder: 'Marseille', section: 'about' },
        { key: 'trained', label: 'Trained At', type: 'text', placeholder: 'ECAL, Lausanne', section: 'about' },
        { key: 'practiceSince', label: 'Practising Since (year)', type: 'text', placeholder: '2014', section: 'about' },
      ],
    },
    {
      key: 'disciplines',
      label: 'Disciplines',
      fields: [],
    },
    {
      key: 'work',
      label: 'Selected Work',
      fields: [],
    },
    {
      key: 'process',
      label: 'Process',
      fields: [],
    },
    {
      key: 'press',
      label: 'Press & Recognition',
      fields: [],
    },
    {
      key: 'clients',
      label: 'Clients',
      fields: [],
    },
    {
      key: 'testimonials',
      label: 'Testimonials',
      fields: [],
    },
    {
      key: 'contact',
      label: 'Contact',
      fields: [
        { key: 'email', label: 'Email Address', type: 'text', placeholder: 'studio@vellum.design', section: 'contact' },
        { key: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/studio.vellum', section: 'contact' },
        { key: 'behance', label: 'Behance URL', type: 'url', placeholder: 'https://behance.net/studio.vellum', section: 'contact' },
        { key: 'dribbble', label: 'Dribbble URL', type: 'url', placeholder: 'https://dribbble.com/studio.vellum', section: 'contact' },
        { key: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/vellum.marchetti', section: 'contact' },
        { key: 'twitter', label: 'Twitter / X URL', type: 'url', placeholder: 'https://x.com/studio_vellum', section: 'contact' },
      ],
    },
    {
      key: 'theme',
      label: 'Theme & Colors',
      fields: [
        { key: 'colorBg', label: 'Background (Ivory)', type: 'color', placeholder: '#f5f0e8', section: 'theme' },
        { key: 'colorBgElev', label: 'Background Elevated', type: 'color', placeholder: '#ece4d3', section: 'theme' },
        { key: 'colorBgCard', label: 'Background Card', type: 'color', placeholder: '#fbf7ef', section: 'theme' },
        { key: 'colorFg', label: 'Foreground (Ink)', type: 'color', placeholder: '#3a2a20', section: 'theme' },
        { key: 'colorFgMuted', label: 'Foreground Muted', type: 'color', placeholder: '#5a4a3e', section: 'theme' },
        { key: 'colorFgFaint', label: 'Foreground Faint', type: 'color', placeholder: '#8e7e6a', section: 'theme' },
        { key: 'colorLine', label: 'Line / Border', type: 'color', placeholder: '#d8cdb6', section: 'theme' },
        { key: 'colorLineStrong', label: 'Line Strong', type: 'color', placeholder: '#a89776', section: 'theme' },
        { key: 'colorAccent', label: 'Accent (Gold)', type: 'color', placeholder: '#b8915a', section: 'theme' },
        { key: 'colorPrimary', label: 'Primary (Burgundy)', type: 'color', placeholder: '#5e1f1f', section: 'theme' },
      ],
    },
  ],
  defaultContent: {
    // Hero / masthead
    issueLabel: 'Issue No. XII',
    heroDate: 'Spring — Summer 2026',
    name: 'Vellum Marchetti',
    title: 'Designer & Art Director',
    tagline: 'Editorial systems for considered brands — typeset slowly, bound in cloth, built to outlast the season.',
    location: 'Paris — Milan',
    availability: 'Accepting commissions for Autumn 2026',
    yearsExperience: '12',
    projectsCount: '84',
    awardsCount: '17',
    clientsCount: '46',

    // About
    aboutP1: 'Studio Vellum is the independent practice of Vellum Marchetti, a designer working at the considered intersection of editorial, identity, and art direction. The work is unhurried; the typography deliberate; the references drawn widely from a personal library of midcentury monographs and well-loved magazines.',
    aboutP2: 'Over the last decade the studio has built enduring visual systems for parfumeries, small publishing houses, fashion ateliers, and a handful of patient founders across Europe. The approach is print-first, typographically literate, and committed to the long view — to objects and brands that read better in five years than in five minutes.',
    aboutP3: 'Beyond the studio, the practice contributes essays to typography journals, lectures occasionally at ECAL and Central Saint Martins, and maintains a private archive of vernacular ephemera — menus, matchbooks, and shop signage — sourced quietly from flea markets and inherited attics.',
    aboutQuote: '“A brand is a kept promise, set in type and bound in cloth.”',
    born: 'Marseille',
    trained: 'ECAL, Lausanne',
    practiceSince: '2014',

    // Disciplines
    disciplinesJson: JSON.stringify([
      { number: '01', title: 'Brand Identity', description: 'Considered visual systems built around enduring narrative — typography, voice, and the quiet apparatus that holds a brand together over decades.', items: 'Naming, Wordmarks, Typography, Stationery, Guidelines' },
      { number: '02', title: 'Editorial Design', description: 'Magazines, monographs, and printed objects with measured cadence and a sympathy for paper. Designed to be held, re-read, and shelved.', items: 'Magazines, Books, Catalogues, Typesetting, Print Direction' },
      { number: '03', title: 'Art Direction', description: 'Cinematic styling and conceptual direction for campaigns, lookbooks, and editorial features — from casting to set to final crop.', items: 'Concept, Casting, Styling, Set, Photography' },
      { number: '04', title: 'Packaging', description: 'Bottles, boxes, and labels designed for hand and shelf — restrained, tactile, and printed on stock chosen with the same care as the typography.', items: 'Structure, Labels, Stock, Print Production' },
    ]),

    // Selected Work
    workJson: JSON.stringify([
      { title: 'Maison Aurelle', category: 'Brand Identity', year: '2025', role: 'Creative Direction', description: 'A heritage parfumerie rebrand grounded in restraint and ritual — a custom serif, a hand-foiled mark, and a campaign shot entirely on uncut velvet.', image: '', liveUrl: '' },
      { title: 'The Atlas Quarterly', category: 'Editorial', year: '2025', role: 'Art Direction', description: 'A quarterly travel journal printed on uncoated stock with a tipped-in colour signature. Four issues, three covers, and one stubborn opening spread.', image: '', liveUrl: '' },
      { title: 'Verre & Or', category: 'Packaging', year: '2024', role: 'Design Lead', description: 'A champagne packaging system inspired by Belle Époque ironwork. Foiled, debossed, and bound in a paper that ages handsomely with the bottle.', image: '', liveUrl: '' },
      { title: 'Linden & Co.', category: 'Editorial · Publishing', year: '2024', role: 'Designer', description: 'A monograph for a quietly celebrated Danish painter — 312 pages, two binding methods, and a sympathetic essay set in twelve-point Garamond.', image: '', liveUrl: '' },
      { title: 'House of Linen', category: 'Brand · Fashion', year: '2023', role: 'Brand Director', description: 'A complete visual system for a small Provençal linen house — lookbooks, hangtags, a unified seasonal language, and a website that reads like a journal.', image: '', liveUrl: '' },
      { title: 'Cellier Paris', category: 'Identity · Hospitality', year: '2023', role: 'Designer & Art Direction', description: 'Identity, menus, and a slow-loading website for a sixth-arrondissement wine cellar — pressed in two foils and set entirely in metal type.', image: '', liveUrl: '' },
    ]),

    // Process
    processJson: JSON.stringify([
      { number: '01', title: 'Discover', description: 'Listen, read, walk the room. Locate the brief inside the brand — and the brand inside its own history — before a single line is drawn.' },
      { number: '02', title: 'Define', description: 'Sharpen the concept into a one-line proposition the rest of the work can carry. Anything that does not serve it is gently set aside.' },
      { number: '03', title: 'Design', description: 'Iterate quietly until the form serves the idea without ornament. Two directions become one; one becomes a system; the system gets pressure-tested in context.' },
      { number: '04', title: 'Deliver', description: 'Hand off with care — guidelines, working files, print specs, and the kind of follow-through that keeps a brand looking like itself a decade later.' },
    ]),

    // Press & Recognition
    pressJson: JSON.stringify([
      { publication: 'It’s Nice That', item: 'Feature — A Year in Print: Studio Vellum', year: '2025', url: '' },
      { publication: 'Communication Arts', item: 'Typography Annual — Award of Excellence', year: '2025', url: '' },
      { publication: 'Eye Magazine', item: 'Interview — Issue 104, On Slow Practice', year: '2024', url: '' },
      { publication: 'Brand New', item: 'Noted — Maison Aurelle Identity', year: '2024', url: '' },
      { publication: 'D&AD Awards', item: 'Wood Pencil — Editorial Design', year: '2023', url: '' },
    ]),

    // Clients
    clientsJson: JSON.stringify([
      { name: 'Maison Aurelle' },
      { name: 'The Atlas Quarterly' },
      { name: 'Verre & Or' },
      { name: 'Linden & Co.' },
      { name: 'House of Linen' },
      { name: 'Cellier Paris' },
      { name: 'Studio Verdant' },
      { name: 'Numero Journal' },
      { name: 'Atelier Brun' },
      { name: 'North Cape Press' },
      { name: 'Casa Fiori' },
      { name: 'Lume Skincare' },
    ]),

    // Testimonials
    testJson: JSON.stringify([
      { quote: 'A rare designer who reads the room and the brief in the same breath. The work feels inevitable — which is, I think, the highest compliment one can pay a designer of any generation.', author: 'Camille Roux', role: 'Founder', company: 'Maison Aurelle' },
      { quote: 'Patient, exacting, generous to a fault. The identity has carried us through three seasons without a wrinkle, and the typography still surprises me in the right places.', author: 'Tomas Linden', role: 'Editor-in-Chief', company: 'The Atlas Quarterly' },
      { quote: 'Vellum designs the way good editors edit — by removing, listening, then removing again. We are quietly better because of the work.', author: 'Hélène Bonnard', role: 'Creative Director', company: 'House of Linen' },
    ]),

    // Contact
    email: 'studio@vellum.design',
    instagram: 'https://instagram.com/studio.vellum',
    behance: 'https://behance.net/studio.vellum',
    dribbble: 'https://dribbble.com/studio.vellum',
    linkedin: 'https://linkedin.com/in/vellum.marchetti',
    twitter: 'https://x.com/studio_vellum',

    // Theme — ivory, ink, gold, burgundy
    colorBg: '#f5f0e8',
    colorBgElev: '#ece4d3',
    colorBgCard: '#fbf7ef',
    colorFg: '#3a2a20',
    colorFgMuted: '#5a4a3e',
    colorFgFaint: '#8e7e6a',
    colorLine: '#d8cdb6',
    colorLineStrong: '#a89776',
    colorAccent: '#b8915a',
    colorPrimary: '#5e1f1f',
  },
};

export default vellumConfig;
