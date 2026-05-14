'use client';
import { useState, useEffect, useRef, memo } from 'react';
import { useParams } from 'next/navigation';
import { Plus, X, Upload, RotateCcw, ChevronDown, Type } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SectionPage from '@/components/editor/SectionPage';
import { Card, CardTitle, Label, Input, Textarea, ColorField } from '@/components/editor/FormControls';
import type { TemplateField } from '@/types';

interface Section { key: string; label: string; fields: TemplateField[]; }

// ── Types ──
interface StatEntry  { num: string; label: string; }
interface SkillEntry { category: string; items: string; }
interface ToolEntry  { name: string; ctx: string; image: string; }
interface MarenExpEntry  { period: string; nowLabel: string; duration: string; role: string; company: string; employmentType: string; summary: string; bullets: string; stack: string; isCurrent: boolean; }
interface MarenProjEntry { title: string; tag: string; desc: string; stack: string; liveUrl: string; githubUrl: string; }
interface MintExpEntry   { role: string; company: string; tagline: string; period: string; duration: string; isCurrent: boolean; bullets: string; stack: string; }
interface MintProjEntry  { title: string; year: string; image: string; desc: string; stack: string; impact: string; challenge: string; liveUrl: string; githubUrl: string; }
interface TestEntry  { quote: string; initials: string; name: string; role: string; }

// Apex types
interface ApexSkillEntry { category: string; items: string; }
interface ApexProfEntry  { name: string; level: number; }
interface ApexExpEntry   { period: string; nowLabel: string; duration: string; role: string; company: string; summary: string; bullets: string; stack: string; isCurrent: boolean; }
interface ApexProjEntry  { title: string; tag: string; desc: string; stack: string; liveUrl: string; githubUrl: string; }
interface ApexEduEntry   { school: string; degree: string; period: string; detail: string; }
interface ApexCertEntry  { name: string; issuer: string; year: string; url: string; }
interface ApexTestEntry  { quote: string; author: string; role: string; }

// Atelier types
interface AtelierWorkEntry { title: string; category: string; year: string; role: string; description: string; image: string; liveUrl: string; }
interface AtelierDiscEntry { number: string; title: string; description: string; items: string; }
interface AtelierProcEntry { number: string; title: string; description: string; }
interface AtelierPressEntry { publication: string; item: string; year: string; url: string; }
interface AtelierClientEntry { name: string; }
interface AtelierTestEntry { quote: string; author: string; role: string; company: string; }

// Prism types
interface PrismWorkEntry { title: string; year: string; category: string; image: string; desc: string; stack: string; impact: string; liveUrl: string; }
interface PrismProcEntry { title: string; description: string; }

// Debut types
interface DebutEduEntry { period: string; school: string; degree: string; detail: string; grade: string; }
interface DebutInternshipEntry { period: string; isCurrent: boolean; role: string; company: string; description: string; tags: string; }
interface DebutSkillItem { name: string; level: number; }
interface DebutSkillCatEntry { title: string; items: DebutSkillItem[]; }

// ── Parse helpers ──
function parseStats(content: Record<string, string>): StatEntry[] {
  if (content.heroStatsJson) { try { return JSON.parse(content.heroStatsJson); } catch {} }
  const stats: StatEntry[] = [];
  for (let i = 1; i <= 8; i++) {
    const num = content[`stat${i}Num`];
    if (num !== undefined) stats.push({ num, label: content[`stat${i}Label`] || '' });
  }
  return stats.length ? stats : [{ num: '', label: '' }];
}
function parseParagraphs(content: Record<string, string>) {
  if (content.aboutParagraphsJson) { try { return JSON.parse(content.aboutParagraphsJson); } catch {} }
  return [1, 2, 3].map(i => content[`aboutPara${i}`] || '').filter(Boolean) || [''];
}
function parseJson<T>(v: string | undefined, fallback: T[]): T[] {
  if (!v) return fallback;
  try { return JSON.parse(v); } catch { return fallback; }
}

// ── Google Fonts loader (loads each option in its own link so a font with
//    limited variants does not break the whole stylesheet request) ──
function loadGoogleFonts(families: string[]) {
  if (typeof document === 'undefined' || families.length === 0) return;
  families.forEach(f => {
    const id = 'editor-font-' + f.replace(/\s+/g, '');
    if (document.getElementById(id)) return;
    const name = f.trim().replace(/\s+/g, '+');
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${name}:ital,wght@0,400;0,500;0,700;1,400&display=swap`;
    document.head.appendChild(link);
  });
}

// ── Font picker field with live preview ──
const FontField = memo(function FontField({
  label, value, onChange, options, kind,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; kind: 'display' | 'body' | 'mono' }) {
  useEffect(() => { loadGoogleFonts(options); }, [options]);
  const previewText = kind === 'display'
    ? 'The quiet shape of an idea.'
    : kind === 'mono'
      ? 'const design = craft + restraint;'
      : 'Designed with intention, built with care — every detail considered.';
  const previewSize = kind === 'display' ? 36 : kind === 'mono' ? 14 : 17;
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none px-3 py-2 pr-9 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
      </div>
      <div className="mt-2 rounded-lg border border-dashed border-emerald-400/40 bg-emerald-50/30 px-4 py-4 overflow-hidden">
        <div className="flex items-center gap-1.5 mb-2 text-[10px] font-medium text-emerald-700 uppercase tracking-wider">
          <Type size={11}/> Preview · <span className="font-mono normal-case tracking-normal text-emerald-700/80">{value}</span>
        </div>
        <div
          style={{
            fontFamily: `'${value}', ${kind === 'mono' ? 'ui-monospace, monospace' : kind === 'display' ? 'Georgia, serif' : 'system-ui, sans-serif'}`,
            fontSize: previewSize,
            lineHeight: 1.25,
            color: '#1a1a1a',
            letterSpacing: kind === 'display' ? '-0.01em' : 'normal',
            fontWeight: kind === 'display' ? 500 : 400,
          }}
        >
          {previewText}
        </div>
        <div
          style={{
            fontFamily: `'${value}', ${kind === 'mono' ? 'ui-monospace, monospace' : kind === 'display' ? 'Georgia, serif' : 'system-ui, sans-serif'}`,
            fontSize: kind === 'display' ? 60 : 28,
            lineHeight: 1,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            fontWeight: kind === 'display' ? 500 : 500,
            marginTop: 8,
          }}
        >
          Aa Bb Cc 123
        </div>
      </div>
    </div>
  );
});

// ── Theme key list (for reset) ──
const THEME_KEYS_PREFIX = 'color';

export default function DynamicSectionPage() {
  const params = useParams();
  const sectionKey = params.section as string;
  const { toast } = useToast();

  const [section,        setSection]        = useState<Section | null>(null);
  const [content,        setContent]        = useState<Record<string, string>>({});
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [templateSlug,   setTemplateSlug]   = useState('');
  const [defaults,       setDefaults]       = useState<Record<string, unknown>>({});

  // Built-in widgets
  const [stats,      setStats]      = useState<StatEntry[]>([{ num: '', label: '' }]);
  const [paragraphs, setParagraphs] = useState<string[]>(['']);

  // Maren widgets
  const [skills,    setSkills]    = useState<SkillEntry[]>([]);
  const [marenExps, setMarenExps] = useState<MarenExpEntry[]>([]);
  const [marenProjs,setMarenProjs]= useState<MarenProjEntry[]>([]);

  // MintSlate widgets
  const [tools,     setTools]     = useState<ToolEntry[]>([]);
  const [mintExps,  setMintExps]  = useState<MintExpEntry[]>([]);
  const [mintProjs, setMintProjs] = useState<MintProjEntry[]>([]);
  const [tests,     setTests]     = useState<TestEntry[]>([]);

  // Maren education widgets
  const [marenEdu,   setMarenEdu]   = useState<ApexEduEntry[]>([]);
  const [marenCerts, setMarenCerts] = useState<ApexCertEntry[]>([]);

  // Apex widgets
  const [apexSkills, setApexSkills] = useState<ApexSkillEntry[]>([]);
  const [apexProfs,  setApexProfs]  = useState<ApexProfEntry[]>([]);
  const [apexExps,   setApexExps]   = useState<ApexExpEntry[]>([]);
  const [apexProjs,  setApexProjs]  = useState<ApexProjEntry[]>([]);
  const [apexEdu,    setApexEdu]    = useState<ApexEduEntry[]>([]);
  const [apexCerts,  setApexCerts]  = useState<ApexCertEntry[]>([]);
  const [apexTests,  setApexTests]  = useState<ApexTestEntry[]>([]);

  // Atelier widgets
  const [atelierWorks,   setAtelierWorks]   = useState<AtelierWorkEntry[]>([]);
  const [atelierDisc,    setAtelierDisc]    = useState<AtelierDiscEntry[]>([]);
  const [atelierProc,    setAtelierProc]    = useState<AtelierProcEntry[]>([]);
  const [atelierPress,   setAtelierPress]   = useState<AtelierPressEntry[]>([]);
  const [atelierClients, setAtelierClients] = useState<AtelierClientEntry[]>([]);
  const [atelierTests,   setAtelierTests]   = useState<AtelierTestEntry[]>([]);

  // Prism widgets
  const [prismWorks, setPrismWorks] = useState<PrismWorkEntry[]>([]);
  const [prismProc,  setPrismProc]  = useState<PrismProcEntry[]>([]);

  // Debut widgets
  const [debutEdu,   setDebutEdu]   = useState<DebutEduEntry[]>([]);
  const [debutInts,  setDebutInts]  = useState<DebutInternshipEntry[]>([]);
  const [debutSkillCats, setDebutSkillCats] = useState<DebutSkillCatEntry[]>([]);

  // Upload
  const toolImgRef = useRef<HTMLInputElement>(null);
  const [toolImgIdx, setToolImgIdx] = useState<number | null>(null);
  const mintProjImgRef = useRef<HTMLInputElement>(null);
  const [mintProjImgIdx, setMintProjImgIdx] = useState<number | null>(null);
  const atelierProjImgRef = useRef<HTMLInputElement>(null);
  const [atelierProjImgIdx, setAtelierProjImgIdx] = useState<number | null>(null);
  const prismWorkImgRef = useRef<HTMLInputElement>(null);
  const [prismWorkImgIdx, setPrismWorkImgIdx] = useState<number | null>(null);
  const [uploading,  setUploading]  = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/portfolio/content').then(r => r.json()),
      fetch('/api/portfolio/template-config').then(r => r.json()),
    ]).then(([contentRes, configRes]) => {
      if (contentRes.success) {
        const c: Record<string, string> = contentRes.data.content || {};
        setContent(c);
        setStats(parseStats(c));
        setParagraphs(parseParagraphs(c) || ['']);
        setSkills(parseJson<SkillEntry>(c.skillsJson, []));
        setMarenExps(parseJson<MarenExpEntry>(c.expJson, []));
        setMarenProjs(parseJson<MarenProjEntry>(c.projJson, []));
        setTools(parseJson<ToolEntry>(c.toolsJson, []));
        setMintExps(parseJson<MintExpEntry>(c.expJson, []));
        setMintProjs(parseJson<MintProjEntry>(c.projJson, []));
        setTests(parseJson<TestEntry>(c.testJson, []));
        setMarenEdu(parseJson<ApexEduEntry>(c.educationJson, []));
        setMarenCerts(parseJson<ApexCertEntry>(c.certsJson, []));
        setApexSkills(parseJson<ApexSkillEntry>(c.skillsJson, []));
        setApexProfs(parseJson<ApexProfEntry>(c.proficienciesJson, []));
        setApexExps(parseJson<ApexExpEntry>(c.expJson, []));
        setApexProjs(parseJson<ApexProjEntry>(c.projJson, []));
        setApexEdu(parseJson<ApexEduEntry>(c.educationJson, []));
        setApexCerts(parseJson<ApexCertEntry>(c.certsJson, []));
        setApexTests(parseJson<ApexTestEntry>(c.testimonialsJson, []));
        setAtelierWorks(parseJson<AtelierWorkEntry>(c.workJson, []));
        setAtelierDisc(parseJson<AtelierDiscEntry>(c.discJson, []));
        setAtelierProc(parseJson<AtelierProcEntry>(c.procJson, []));
        setAtelierPress(parseJson<AtelierPressEntry>(c.pressJson, []));
        setAtelierClients(parseJson<AtelierClientEntry>(c.clientsJson, []));
        setAtelierTests(parseJson<AtelierTestEntry>(c.testimonialsJson, []));
        setPrismWorks(parseJson<PrismWorkEntry>(c.projJson, []));
        setPrismProc(parseJson<PrismProcEntry>(c.processJson, []));
        setDebutEdu(parseJson<DebutEduEntry>(c.educationJson, []));
        setDebutInts(parseJson<DebutInternshipEntry>(c.internshipsJson, []));
        setDebutSkillCats(parseJson<DebutSkillCatEntry>(c.skillCategoriesJson, []));
      }
      if (configRes.success) {
        setTemplateSlug(configRes.data.slug);
        setDefaults(configRes.data.defaultContent || {});
        const found = configRes.data.sections.find((s: Section) => s.key === sectionKey);
        setSection(found || null);
      }
      setLoading(false);
    });
  }, [sectionKey]);

  const c   = (k: string) => content[k] || '';
  const set = (k: string, v: string) => setContent(p => ({ ...p, [k]: v }));

  async function uploadFile(file: File, fieldKey: string, onDone?: (url: string) => void) {
    setUploading(u => ({ ...u, [fieldKey]: true }));
    const fd = new FormData();
    fd.append('file', file);
    fd.append('template', templateSlug);
    const res  = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      if (onDone) onDone(data.url);
      else set(fieldKey, data.url);
    }
    setUploading(u => ({ ...u, [fieldKey]: false }));
  }

  async function handleSave() {
    setSaving(true);
    const merged = { ...content };

    if (sectionKey === 'hero' && templateSlug !== 'mintslate') {
      merged.heroStatsJson = JSON.stringify(stats);
      stats.forEach((s, i) => {
        merged[`stat${i + 1}Num`]   = s.num;
        merged[`stat${i + 1}Label`] = s.label;
      });
    }
    if (sectionKey === 'about') {
      merged.aboutParagraphsJson = JSON.stringify(paragraphs);
      paragraphs.forEach((p, i) => { merged[`aboutPara${i + 1}`] = p; });
    }

    if (templateSlug === 'maren' || templateSlug === 'quartz') {
      if (sectionKey === 'skills')     merged.skillsJson    = JSON.stringify(skills);
      if (sectionKey === 'experience') merged.expJson       = JSON.stringify(marenExps);
      if (sectionKey === 'projects')   merged.projJson      = JSON.stringify(marenProjs);
      if (sectionKey === 'education') {
        merged.educationJson = JSON.stringify(marenEdu);
        merged.certsJson     = JSON.stringify(marenCerts);
      }
    }

    if (templateSlug === 'mintslate' || templateSlug === 'nexus') {
      if (sectionKey === 'skills')       merged.toolsJson = JSON.stringify(tools);
      if (sectionKey === 'experience')   merged.expJson   = JSON.stringify(mintExps);
      if (sectionKey === 'projects')     merged.projJson  = JSON.stringify(mintProjs);
      if (sectionKey === 'testimonials') merged.testJson  = JSON.stringify(tests);
    }

    if (templateSlug === 'atelier') {
      if (sectionKey === 'work')         merged.workJson         = JSON.stringify(atelierWorks);
      if (sectionKey === 'disciplines')  merged.discJson         = JSON.stringify(atelierDisc);
      if (sectionKey === 'process')      merged.procJson         = JSON.stringify(atelierProc);
      if (sectionKey === 'recognition') {
        merged.pressJson   = JSON.stringify(atelierPress);
        merged.clientsJson = JSON.stringify(atelierClients);
      }
      if (sectionKey === 'testimonials') merged.testimonialsJson = JSON.stringify(atelierTests);
    }

    if (templateSlug === 'prism' || templateSlug === 'mosaic') {
      if (sectionKey === 'work')         merged.projJson    = JSON.stringify(prismWorks);
      if (sectionKey === 'process')      merged.processJson = JSON.stringify(prismProc);
      if (sectionKey === 'testimonials') merged.testJson    = JSON.stringify(tests);
    }

    if (templateSlug === 'debut') {
      if (sectionKey === 'work')         merged.projJson           = JSON.stringify(prismWorks);
      if (sectionKey === 'testimonials') merged.testJson           = JSON.stringify(tests);
      if (sectionKey === 'education')    merged.educationJson      = JSON.stringify(debutEdu);
      if (sectionKey === 'internships')  merged.internshipsJson    = JSON.stringify(debutInts);
      if (sectionKey === 'skills')       merged.skillCategoriesJson = JSON.stringify(debutSkillCats);
    }

    if (templateSlug === 'apex') {
      if (sectionKey === 'skills') {
        merged.skillsJson        = JSON.stringify(apexSkills);
        merged.proficienciesJson = JSON.stringify(apexProfs);
      }
      if (sectionKey === 'experience')   merged.expJson          = JSON.stringify(apexExps);
      if (sectionKey === 'projects')     merged.projJson         = JSON.stringify(apexProjs);
      if (sectionKey === 'education') {
        merged.educationJson = JSON.stringify(apexEdu);
        merged.certsJson     = JSON.stringify(apexCerts);
      }
      if (sectionKey === 'testimonials') merged.testimonialsJson = JSON.stringify(apexTests);
    }

    const res  = await fetch('/api/portfolio/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: merged }),
    });
    const data = await res.json();
    if (data.success) toast({ title: 'Saved!', description: `${section?.label || sectionKey} updated.` });
    else toast({ title: 'Error', description: data.error, variant: 'destructive' });
    setSaving(false);
  }

  function resetThemeDefaults() {
    const next = { ...content };
    Object.keys(defaults).forEach(k => {
      if (k.startsWith(THEME_KEYS_PREFIX)) next[k] = String(defaults[k] || '');
    });
    setContent(next);
    toast({ title: 'Theme reset', description: 'All theme colors reset to defaults.' });
  }

  if (loading) return <div className="p-8 text-sm text-gray-400">Loading…</div>;
  if (!section) return (
    <div className="p-8 text-sm text-gray-500">
      Section <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{sectionKey}</span> is not part of your template.
    </div>
  );

  const showStatsWidget = sectionKey === 'hero' && templateSlug !== 'mintslate';
  const apexJsonKeys = new Set(['skillsJson','proficienciesJson','expJson','projJson','educationJson','certsJson','testimonialsJson']);
  const marenEduJsonKeys = new Set(['educationJson','certsJson']);
  const fields = section.fields.filter(f => {
    if (showStatsWidget && /^stat\d(Num|Unit|Label)$/.test(f.key)) return false;
    if (/^aboutPara\d$/.test(f.key)) return false;
    if (templateSlug === 'apex' && apexJsonKeys.has(f.key)) return false;
    if ((templateSlug === 'maren' || templateSlug === 'quartz') && sectionKey === 'education' && marenEduJsonKeys.has(f.key)) return false;
    return true;
  });
  const isThemeSection = sectionKey === 'theme';

  // ── Style helpers ──
  const addBtn      = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-700 text-xs font-medium hover:bg-emerald-50 transition-colors";
  const removeBtn   = "w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-500 shrink-0 transition-colors";
  const fieldInput  = "flex-1 px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const taInput     = "w-full px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y";

  return (
    <SectionPage
      section={sectionKey}
      title={`${section.label} Section`}
      description={`Edit the ${section.label.toLowerCase()} section of your portfolio.`}
      onSave={handleSave}
      saving={saving}
    >
      {/* ── Generic fields (heading/subheadings always shown FIRST) ── */}
      {fields.length > 0 && (
        <Card>
          {isThemeSection && (
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div>
                <CardTitle>Theme &amp; Colors</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Two columns per row · click any swatch to pick a color</p>
              </div>
              <button onClick={resetThemeDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors">
                <RotateCcw size={12}/> Reset to defaults
              </button>
            </div>
          )}
          <div className={isThemeSection ? "grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4" : "space-y-4"}>
            {fields.map(field => {
              if (field.type === 'color') {
                return <ColorField key={field.key} label={field.label} value={c(field.key)} onChange={v => set(field.key, v)} placeholder={field.placeholder}/>;
              }
              if (field.type === 'image') {
                const isResume = field.key === 'resumeUrl';
                const accept = isResume ? '.pdf' : 'image/*';
                const isPhotoLike = field.key === 'photoUrl' || field.key === 'aboutPhotoUrl';
                const isUploading = uploading[field.key];
                const inputId = `imgupload-${field.key}`;
                return (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <input id={inputId} type="file" accept={accept} className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) uploadFile(f, field.key);
                        (e.target as HTMLInputElement).value = '';
                      }}/>
                    <div className="flex items-center gap-3 flex-wrap">
                      {isPhotoLike && c(field.key) && (
                        <div className="relative w-32 h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                          <img src={c(field.key)} alt="Preview" className="w-full h-full object-cover"/>
                          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/40 text-white text-[10px] font-mono text-center">Preview</div>
                        </div>
                      )}
                      <label htmlFor={inputId}
                        className={`px-4 py-2 rounded-lg border-2 border-dashed border-emerald-500/40 text-emerald-700 text-sm font-medium hover:border-emerald-500 transition-colors cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {isUploading ? 'Uploading…' : c(field.key) ? 'Change file' : `Upload ${isResume ? 'PDF' : 'image'}`}
                      </label>
                      {c(field.key) && (
                        <>
                          <span className="text-sm text-gray-500 font-mono truncate max-w-[160px]">{c(field.key).split('/').pop()}</span>
                          <a href={c(field.key)} target="_blank" className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Open</a>
                          <button onClick={() => set(field.key, '')} className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              }
              if (field.type === 'font') {
                const opts = field.options || [];
                const current = c(field.key) || field.placeholder || opts[0] || '';
                const previewKind = field.key.toLowerCase().includes('display') ? 'display'
                  : field.key.toLowerCase().includes('mono') ? 'mono' : 'body';
                return <FontField key={field.key} label={field.label} value={current} onChange={v => set(field.key, v)} options={opts} kind={previewKind}/>;
              }
              if (field.type === 'textarea') {
                return (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <Textarea value={c(field.key)} onChange={v => set(field.key, v)} placeholder={field.placeholder} rows={3}/>
                  </div>
                );
              }
              return (
                <div key={field.key}>
                  <Label>{field.label}</Label>
                  <Input value={c(field.key)} onChange={v => set(field.key, v)} placeholder={field.placeholder} type={field.type === 'url' ? 'url' : 'text'}/>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Maren: Stats widget (num + label only) ── */}
      {showStatsWidget && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Stats</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Number and label for each highlight stat</p>
            </div>
            <button onClick={() => setStats(s => [...s, { num: '', label: '' }])} className={addBtn}>
              <Plus size={12}/> Add Stat
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((st, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
                <input value={st.num} onChange={e => setStats(s => s.map((x, j) => j===i ? {...x, num: e.target.value} : x))}
                  placeholder="2+" className="w-16 px-2 py-1.5 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
                <input value={st.label} onChange={e => setStats(s => s.map((x, j) => j===i ? {...x, label: e.target.value} : x))}
                  placeholder="Experience" className="flex-1 px-2 py-1.5 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
                <button onClick={() => setStats(s => s.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Maren: Bio paragraphs widget ── */}
      {sectionKey === 'about' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Bio Paragraphs</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Each paragraph is displayed separately</p>
            </div>
            <button onClick={() => setParagraphs(p => [...p, ''])} className={addBtn}>
              <Plus size={12}/> Add Paragraph
            </button>
          </div>
          <div className="space-y-3">
            {paragraphs.map((para, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <Label className="mb-0">Paragraph {i + 1}</Label>
                  {paragraphs.length > 1 && (
                    <button onClick={() => setParagraphs(p => p.filter((_, j) => j!==i))} className="text-gray-300 hover:text-red-500 transition-colors"><X size={14}/></button>
                  )}
                </div>
                <Textarea value={para} onChange={v => setParagraphs(p => p.map((x, j) => j===i ? v : x))} rows={3}/>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Maren/Quartz: Skills (categories) widget ── */}
      {(templateSlug === 'maren' || templateSlug === 'quartz') && sectionKey === 'skills' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Skill Categories</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add categories like Languages, Tooling, etc. — each with a comma-separated list of items</p>
            </div>
            <button onClick={() => setSkills(s => [...s, { category: '', items: '' }])} className={addBtn}>
              <Plus size={12}/> Add Category
            </button>
          </div>
          <div className="space-y-3">
            {skills.map((sk, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center gap-2">
                  <input value={sk.category} onChange={e => setSkills(ss => ss.map((x, j) => j===i ? {...x, category: e.target.value} : x))}
                    placeholder="Category name (e.g. Tooling)" className={fieldInput}/>
                  <button onClick={() => setSkills(ss => ss.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <textarea value={sk.items} onChange={e => setSkills(ss => ss.map((x, j) => j===i ? {...x, items: e.target.value} : x))}
                  placeholder="Items, comma-separated (e.g. Vite, pnpm, Vitest)" rows={2} className={taInput}/>
              </div>
            ))}
            {skills.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No skill categories yet. Click &quot;Add Category&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Maren/Quartz: Experience widget ── */}
      {(templateSlug === 'maren' || templateSlug === 'quartz') && sectionKey === 'experience' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Experience Entries</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add as many roles as you need</p>
            </div>
            <button onClick={() => setMarenExps(e => [...e, { period: '', nowLabel: '', duration: '', role: '', company: '', employmentType: 'Full-time', summary: '', bullets: '', stack: '', isCurrent: false }])} className={addBtn}>
              <Plus size={12}/> Add Role
            </button>
          </div>
          <div className="space-y-4">
            {marenExps.map((exp, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role {i + 1}</span>
                  <button onClick={() => setMarenExps(e => e.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Role</Label><input value={exp.role} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, role: e.target.value} : x))} placeholder="Frontend Engineer" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Company</Label><input value={exp.company} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, company: e.target.value} : x))} placeholder="Lattice & Loom" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Employment Type</Label><input value={exp.employmentType ?? 'Full-time'} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, employmentType: e.target.value} : x))} placeholder="Full-time" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Period</Label><input value={exp.period} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, period: e.target.value} : x))} placeholder="Jul 2025 – Present" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Duration</Label><input value={exp.duration} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, duration: e.target.value} : x))} placeholder="10 months" className={`${fieldInput} w-full`}/></div>
                  <div><Label>&quot;Now&quot; Label (optional)</Label><input value={exp.nowLabel} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, nowLabel: e.target.value} : x))} placeholder="Present" className={`${fieldInput} w-full`}/></div>
                  <div className="flex items-end gap-2 pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={exp.isCurrent} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, isCurrent: e.target.checked} : x))} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"/>
                      <span className="text-sm text-gray-700">Current role</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label>Summary</Label>
                  <textarea value={exp.summary} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, summary: e.target.value} : x))} rows={2} placeholder="Short overview of the role" className={taInput}/>
                </div>
                <div>
                  <Label>Bullets (one per line)</Label>
                  <textarea value={exp.bullets} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, bullets: e.target.value} : x))} rows={4} placeholder="Rebuilt the dashboard renderer — first paint −42%&#10;Shipped 8 production features" className={taInput}/>
                </div>
                <div>
                  <Label>Tech stack (comma-sep)</Label>
                  <input value={exp.stack} onChange={e => setMarenExps(es => es.map((x, j) => j===i ? {...x, stack: e.target.value} : x))} placeholder="TypeScript, React, Next.js" className={`${fieldInput} w-full`}/>
                </div>
              </div>
            ))}
            {marenExps.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No experience entries yet. Click &quot;Add Role&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Maren/Quartz: Projects widget ── */}
      {(templateSlug === 'maren' || templateSlug === 'quartz') && sectionKey === 'projects' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Projects</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add as many projects as you need</p>
            </div>
            <button onClick={() => setMarenProjs(p => [...p, { title: '', tag: '', desc: '', stack: '', liveUrl: '', githubUrl: '' }])} className={addBtn}>
              <Plus size={12}/> Add Project
            </button>
          </div>
          <div className="space-y-4">
            {marenProjs.map((proj, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project {i + 1}</span>
                  <button onClick={() => setMarenProjs(p => p.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Title</Label><input value={proj.title} onChange={e => setMarenProjs(ps => ps.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="Project name" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Tag</Label><input value={proj.tag} onChange={e => setMarenProjs(ps => ps.map((x, j) => j===i ? {...x, tag: e.target.value} : x))} placeholder="2026 · Solo" className={`${fieldInput} w-full`}/></div>
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea value={proj.desc} onChange={e => setMarenProjs(ps => ps.map((x, j) => j===i ? {...x, desc: e.target.value} : x))} rows={3} placeholder="Short description" className={taInput}/>
                </div>
                <div>
                  <Label>Tech stack (comma-sep)</Label>
                  <input value={proj.stack} onChange={e => setMarenProjs(ps => ps.map((x, j) => j===i ? {...x, stack: e.target.value} : x))} placeholder="TypeScript, Canvas" className={`${fieldInput} w-full`}/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Live URL</Label><input type="url" value={proj.liveUrl} onChange={e => setMarenProjs(ps => ps.map((x, j) => j===i ? {...x, liveUrl: e.target.value} : x))} placeholder="https://..." className={`${fieldInput} w-full`}/></div>
                  <div><Label>GitHub URL</Label><input type="url" value={proj.githubUrl} onChange={e => setMarenProjs(ps => ps.map((x, j) => j===i ? {...x, githubUrl: e.target.value} : x))} placeholder="https://github.com/..." className={`${fieldInput} w-full`}/></div>
                </div>
              </div>
            ))}
            {marenProjs.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No projects yet. Click &quot;Add Project&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Atelier: Selected Work widget ── */}
      {templateSlug === 'atelier' && sectionKey === 'work' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Projects</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add the case studies you want featured on the portfolio</p>
            </div>
            <button onClick={() => setAtelierWorks(w => [...w, { title: '', category: '', year: '', role: '', description: '', image: '', liveUrl: '' }])} className={addBtn}>
              <Plus size={12}/> Add Project
            </button>
          </div>
          <div className="space-y-4">
            {atelierWorks.map((w, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project {i + 1}</span>
                  <button onClick={() => setAtelierWorks(w => w.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Title</Label><input value={w.title} onChange={e => setAtelierWorks(ws => ws.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="Project name" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Category</Label><input value={w.category} onChange={e => setAtelierWorks(ws => ws.map((x, j) => j===i ? {...x, category: e.target.value} : x))} placeholder="Brand · Hospitality" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Year</Label><input value={w.year} onChange={e => setAtelierWorks(ws => ws.map((x, j) => j===i ? {...x, year: e.target.value} : x))} placeholder="2025" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Role</Label><input value={w.role} onChange={e => setAtelierWorks(ws => ws.map((x, j) => j===i ? {...x, role: e.target.value} : x))} placeholder="Designer & Art Direction" className={`${fieldInput} w-full`}/></div>
                </div>
                <div><Label>Description</Label>
                  <textarea value={w.description} onChange={e => setAtelierWorks(ws => ws.map((x, j) => j===i ? {...x, description: e.target.value} : x))} rows={3} placeholder="A complete brand system for…" className={taInput}/>
                </div>
                <div>
                  <Label>Project Image</Label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {w.image && <img src={w.image} alt={w.title} className="w-24 h-16 rounded-lg border border-gray-200 object-cover"/>}
                    <button onClick={() => { setAtelierProjImgIdx(i); atelierProjImgRef.current?.click(); }}
                      className="px-4 py-2 rounded-lg border-2 border-dashed border-emerald-500/40 text-emerald-700 text-sm font-medium hover:border-emerald-500 transition-colors">
                      <Upload size={11} className="inline mr-1"/>{w.image ? 'Change image' : 'Upload image'}
                    </button>
                    {w.image && (
                      <button onClick={() => setAtelierWorks(ws => ws.map((x, j) => j===i ? {...x, image: ''} : x))}
                        className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                    )}
                    {uploading[`atelierproj-${i}`] && <span className="text-xs text-gray-400">Uploading…</span>}
                  </div>
                  <input value={w.image} onChange={e => setAtelierWorks(ws => ws.map((x, j) => j===i ? {...x, image: e.target.value} : x))} placeholder="Or paste image URL" className={`${fieldInput} w-full mt-2`}/>
                </div>
                <div><Label>Live URL</Label><input type="url" value={w.liveUrl} onChange={e => setAtelierWorks(ws => ws.map((x, j) => j===i ? {...x, liveUrl: e.target.value} : x))} placeholder="https://… (optional)" className={`${fieldInput} w-full`}/></div>
              </div>
            ))}
            {atelierWorks.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No projects yet. Click &quot;Add Project&quot; to start.</p>}
          </div>
          <input ref={atelierProjImgRef} type="file" accept="image/*" className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f && atelierProjImgIdx !== null) {
                uploadFile(f, `atelierproj-${atelierProjImgIdx}`, url => setAtelierWorks(ws => ws.map((x, j) => j===atelierProjImgIdx ? {...x, image: url} : x)));
              }
              if (atelierProjImgRef.current) atelierProjImgRef.current.value = '';
            }}/>
        </Card>
      )}

      {/* ── Atelier: Disciplines widget ── */}
      {templateSlug === 'atelier' && sectionKey === 'disciplines' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Disciplines</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add the kinds of work you take on</p>
            </div>
            <button onClick={() => setAtelierDisc(d => [...d, { number: String(d.length+1).padStart(2,'0'), title: '', description: '', items: '' }])} className={addBtn}>
              <Plus size={12}/> Add Discipline
            </button>
          </div>
          <div className="space-y-4">
            {atelierDisc.map((d, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Discipline {i + 1}</span>
                  <button onClick={() => setAtelierDisc(d => d.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label>Number</Label><input value={d.number} onChange={e => setAtelierDisc(ds => ds.map((x, j) => j===i ? {...x, number: e.target.value} : x))} placeholder="01" className={`${fieldInput} w-full`}/></div>
                  <div className="col-span-2"><Label>Title</Label><input value={d.title} onChange={e => setAtelierDisc(ds => ds.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="Brand Systems" className={`${fieldInput} w-full`}/></div>
                </div>
                <div><Label>Description</Label>
                  <textarea value={d.description} onChange={e => setAtelierDisc(ds => ds.map((x, j) => j===i ? {...x, description: e.target.value} : x))} rows={2} placeholder="Identity, type, palette, voice…" className={taInput}/>
                </div>
                <div><Label>Items / Tags (comma-separated)</Label>
                  <input value={d.items} onChange={e => setAtelierDisc(ds => ds.map((x, j) => j===i ? {...x, items: e.target.value} : x))} placeholder="Naming, Wordmarks, Type, Guidelines" className={`${fieldInput} w-full`}/>
                </div>
              </div>
            ))}
            {atelierDisc.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No disciplines yet. Click &quot;Add Discipline&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Atelier: Process widget ── */}
      {templateSlug === 'atelier' && sectionKey === 'process' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Process Steps</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Walk visitors through how you work</p>
            </div>
            <button onClick={() => setAtelierProc(p => [...p, { number: String(p.length+1).padStart(2,'0'), title: '', description: '' }])} className={addBtn}>
              <Plus size={12}/> Add Step
            </button>
          </div>
          <div className="space-y-4">
            {atelierProc.map((p, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Step {i + 1}</span>
                  <button onClick={() => setAtelierProc(p => p.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label>Number</Label><input value={p.number} onChange={e => setAtelierProc(ps => ps.map((x, j) => j===i ? {...x, number: e.target.value} : x))} placeholder="01" className={`${fieldInput} w-full`}/></div>
                  <div className="col-span-2"><Label>Title</Label><input value={p.title} onChange={e => setAtelierProc(ps => ps.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="Listen" className={`${fieldInput} w-full`}/></div>
                </div>
                <div><Label>Description</Label>
                  <textarea value={p.description} onChange={e => setAtelierProc(ps => ps.map((x, j) => j===i ? {...x, description: e.target.value} : x))} rows={2} placeholder="A long conversation. I want to understand…" className={taInput}/>
                </div>
              </div>
            ))}
            {atelierProc.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No steps yet. Click &quot;Add Step&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Atelier: Recognition & Clients widgets ── */}
      {templateSlug === 'atelier' && sectionKey === 'recognition' && (<>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Press & Awards</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Publications, awards, and recognition</p>
            </div>
            <button onClick={() => setAtelierPress(p => [...p, { publication: '', item: '', year: '', url: '' }])} className={addBtn}>
              <Plus size={12}/> Add Entry
            </button>
          </div>
          <div className="space-y-3">
            {atelierPress.map((p, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center gap-2">
                  <input value={p.publication} onChange={e => setAtelierPress(ps => ps.map((x, j) => j===i ? {...x, publication: e.target.value} : x))} placeholder="Publication (e.g. It's Nice That)" className={fieldInput}/>
                  <button onClick={() => setAtelierPress(ps => ps.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <input value={p.item} onChange={e => setAtelierPress(ps => ps.map((x, j) => j===i ? {...x, item: e.target.value} : x))} placeholder="What they featured (e.g. Feature on…)" className={`${fieldInput} w-full`}/>
                <div className="grid grid-cols-2 gap-2">
                  <input value={p.year} onChange={e => setAtelierPress(ps => ps.map((x, j) => j===i ? {...x, year: e.target.value} : x))} placeholder="Year" className={`${fieldInput} w-full`}/>
                  <input type="url" value={p.url} onChange={e => setAtelierPress(ps => ps.map((x, j) => j===i ? {...x, url: e.target.value} : x))} placeholder="Link (optional)" className={`${fieldInput} w-full`}/>
                </div>
              </div>
            ))}
            {atelierPress.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No press entries yet.</p>}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Selected Clients</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">A list of brands or studios you have worked with</p>
            </div>
            <button onClick={() => setAtelierClients(c => [...c, { name: '' }])} className={addBtn}>
              <Plus size={12}/> Add Client
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {atelierClients.map((cl, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 bg-gray-50">
                <input value={cl.name} onChange={e => setAtelierClients(cs => cs.map((x, j) => j===i ? {...x, name: e.target.value} : x))} placeholder="Client name" className={fieldInput}/>
                <button onClick={() => setAtelierClients(cs => cs.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
              </div>
            ))}
            {atelierClients.length === 0 && <p className="text-xs text-gray-400 text-center py-4 col-span-2">No clients yet.</p>}
          </div>
        </Card>
      </>)}

      {/* ── Atelier: Testimonials widget ── */}
      {templateSlug === 'atelier' && sectionKey === 'testimonials' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Testimonials</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Kind words from collaborators</p>
            </div>
            <button onClick={() => setAtelierTests(t => [...t, { quote: '', author: '', role: '', company: '' }])} className={addBtn}>
              <Plus size={12}/> Add Testimonial
            </button>
          </div>
          <div className="space-y-4">
            {atelierTests.map((t, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Testimonial {i + 1}</span>
                  <button onClick={() => setAtelierTests(ts => ts.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div><Label>Quote</Label>
                  <textarea value={t.quote} onChange={e => setAtelierTests(ts => ts.map((x, j) => j===i ? {...x, quote: e.target.value} : x))} rows={3} placeholder="What they said…" className={taInput}/>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label>Author</Label><input value={t.author} onChange={e => setAtelierTests(ts => ts.map((x, j) => j===i ? {...x, author: e.target.value} : x))} placeholder="Mariana Costa" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Role</Label><input value={t.role} onChange={e => setAtelierTests(ts => ts.map((x, j) => j===i ? {...x, role: e.target.value} : x))} placeholder="Founder" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Company</Label><input value={t.company} onChange={e => setAtelierTests(ts => ts.map((x, j) => j===i ? {...x, company: e.target.value} : x))} placeholder="Maison Quaí" className={`${fieldInput} w-full`}/></div>
                </div>
              </div>
            ))}
            {atelierTests.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No testimonials yet.</p>}
          </div>
        </Card>
      )}

      {/* ── Maren/Quartz: Education & Certifications widget ── */}
      {(templateSlug === 'maren' || templateSlug === 'quartz') && sectionKey === 'education' && (<>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Education</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Degrees, institutions, and study details</p>
            </div>
            <button onClick={() => setMarenEdu(e => [...e, { school: '', degree: '', period: '', detail: '' }])} className={addBtn}>
              <Plus size={12}/> Add Entry
            </button>
          </div>
          <div className="space-y-4">
            {marenEdu.map((edu, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry {i + 1}</span>
                  <button onClick={() => setMarenEdu(e => e.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Institution</Label><input value={edu.school} onChange={e => setMarenEdu(es => es.map((x, j) => j===i ? {...x, school: e.target.value} : x))} placeholder="Technical University of Berlin" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Degree / Program</Label><input value={edu.degree} onChange={e => setMarenEdu(es => es.map((x, j) => j===i ? {...x, degree: e.target.value} : x))} placeholder="B.Sc. Computer Science" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Period</Label><input value={edu.period} onChange={e => setMarenEdu(es => es.map((x, j) => j===i ? {...x, period: e.target.value} : x))} placeholder="2020 – 2024" className={`${fieldInput} w-full`}/></div>
                </div>
                <div><Label>Detail / Notes</Label>
                  <textarea value={edu.detail} onChange={e => setMarenEdu(es => es.map((x, j) => j===i ? {...x, detail: e.target.value} : x))} rows={2} placeholder="GPA, clubs, achievements, thesis topic…" className={taInput}/>
                </div>
              </div>
            ))}
            {marenEdu.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No education entries yet. Click &quot;Add Entry&quot; to start.</p>}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Certifications</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Courses, certificates, and credentials</p>
            </div>
            <button onClick={() => setMarenCerts(c => [...c, { name: '', issuer: '', year: '', url: '' }])} className={addBtn}>
              <Plus size={12}/> Add Certification
            </button>
          </div>
          <div className="space-y-3">
            {marenCerts.map((cert, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center gap-2">
                  <input value={cert.name} onChange={e => setMarenCerts(cs => cs.map((x, j) => j===i ? {...x, name: e.target.value} : x))} placeholder="Certification name" className={fieldInput}/>
                  <button onClick={() => setMarenCerts(cs => cs.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2"><input value={cert.issuer} onChange={e => setMarenCerts(cs => cs.map((x, j) => j===i ? {...x, issuer: e.target.value} : x))} placeholder="Issuing body (e.g. Meta · Coursera)" className={`${fieldInput} w-full`}/></div>
                  <div><input value={cert.year} onChange={e => setMarenCerts(cs => cs.map((x, j) => j===i ? {...x, year: e.target.value} : x))} placeholder="Year" className={`${fieldInput} w-full`}/></div>
                  <div className="col-span-3"><input type="url" value={cert.url} onChange={e => setMarenCerts(cs => cs.map((x, j) => j===i ? {...x, url: e.target.value} : x))} placeholder="Certificate URL (optional)" className={`${fieldInput} w-full`}/></div>
                </div>
              </div>
            ))}
            {marenCerts.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No certifications yet. Click &quot;Add Certification&quot; to start.</p>}
          </div>
        </Card>
      </>)}

      {/* ── MintSlate: Tools widget ── */}
      {(templateSlug === 'mintslate' || templateSlug === 'nexus') && sectionKey === 'skills' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Tools</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add tools with name, context, and an icon image</p>
            </div>
            <button onClick={() => setTools(t => [...t, { name: '', ctx: '', image: '' }])} className={addBtn}>
              <Plus size={12}/> Add Tool
            </button>
          </div>
          <div className="space-y-3">
            {tools.map((t, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center gap-2">
                  <input value={t.name} onChange={e => setTools(ts => ts.map((x, j) => j===i ? {...x, name: e.target.value} : x))}
                    placeholder="Tool name (e.g. VS Code)" className={fieldInput}/>
                  <input value={t.ctx} onChange={e => setTools(ts => ts.map((x, j) => j===i ? {...x, ctx: e.target.value} : x))}
                    placeholder="Context (e.g. Primary IDE)" className={fieldInput}/>
                  <button onClick={() => setTools(ts => ts.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="flex items-center gap-2">
                  {t.image && <img src={t.image} alt={t.name} className="w-9 h-9 rounded-lg border border-gray-200 object-contain bg-white p-1"/>}
                  <button onClick={() => { setToolImgIdx(i); toolImgRef.current?.click(); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 border-dashed border-emerald-400/50 text-emerald-700 text-xs font-medium hover:border-emerald-500 transition-colors">
                    <Upload size={11}/> {t.image ? 'Change icon' : 'Upload icon'}
                  </button>
                  {t.image && (
                    <button onClick={() => setTools(ts => ts.map((x, j) => j===i ? {...x, image: ''} : x))}
                      className="px-2.5 py-1 text-xs rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors">Remove</button>
                  )}
                  {uploading[`tool-${i}`] && <span className="text-xs text-gray-400">Uploading…</span>}
                </div>
              </div>
            ))}
            {tools.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No tools yet. Click &quot;Add Tool&quot; to get started.</p>}
          </div>
          <input ref={toolImgRef} type="file" accept="image/*" className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f && toolImgIdx !== null) {
                uploadFile(f, `tool-${toolImgIdx}`, url => setTools(ts => ts.map((x, j) => j===toolImgIdx ? {...x, image: url} : x)));
              }
              if (toolImgRef.current) toolImgRef.current.value = '';
            }}/>
        </Card>
      )}
      <input ref={mintProjImgRef} type="file" accept="image/*" className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f && mintProjImgIdx !== null) {
            uploadFile(f, `mintproj-${mintProjImgIdx}`, url => setMintProjs(ps => ps.map((x, j) => j===mintProjImgIdx ? {...x, image: url} : x)));
          }
          if (mintProjImgRef.current) mintProjImgRef.current.value = '';
        }}/>

      {/* ── MintSlate: Experience widget ── */}
      {(templateSlug === 'mintslate' || templateSlug === 'nexus') && sectionKey === 'experience' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Experience Entries</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add as many roles as you need</p>
            </div>
            <button onClick={() => setMintExps(e => [...e, { role: '', company: '', tagline: '', period: '', duration: '', isCurrent: false, bullets: '', stack: '' }])} className={addBtn}>
              <Plus size={12}/> Add Role
            </button>
          </div>
          <div className="space-y-4">
            {mintExps.map((exp, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role {i + 1}</span>
                  <button onClick={() => setMintExps(e => e.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Role / Title</Label><input value={exp.role} onChange={e => setMintExps(es => es.map((x, j) => j===i ? {...x, role: e.target.value} : x))} placeholder="Senior Engineer" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Company</Label><input value={exp.company} onChange={e => setMintExps(es => es.map((x, j) => j===i ? {...x, company: e.target.value} : x))} placeholder="Acme Inc" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Tagline</Label><input value={exp.tagline} onChange={e => setMintExps(es => es.map((x, j) => j===i ? {...x, tagline: e.target.value} : x))} placeholder="Team focus / product context" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Period</Label><input value={exp.period} onChange={e => setMintExps(es => es.map((x, j) => j===i ? {...x, period: e.target.value} : x))} placeholder="2023 – Present" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Duration label</Label><input value={exp.duration} onChange={e => setMintExps(es => es.map((x, j) => j===i ? {...x, duration: e.target.value} : x))} placeholder="2 yrs" className={`${fieldInput} w-full`}/></div>
                  <div className="flex items-end gap-2 pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={exp.isCurrent} onChange={e => setMintExps(es => es.map((x, j) => j===i ? {...x, isCurrent: e.target.checked} : x))} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"/>
                      <span className="text-sm text-gray-700">Current role</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label>Bullets (one per line, use **text** for highlights)</Label>
                  <textarea value={exp.bullets} onChange={e => setMintExps(es => es.map((x, j) => j===i ? {...x, bullets: e.target.value} : x))}
                    rows={4} placeholder="Reduced cold start times by **40%**&#10;Built edge middleware for A/B testing"
                    className={taInput}/>
                </div>
                <div>
                  <Label>Tech stack (comma-separated)</Label>
                  <input value={exp.stack} onChange={e => setMintExps(es => es.map((x, j) => j===i ? {...x, stack: e.target.value} : x))}
                    placeholder="TypeScript, React, Node.js" className={`${fieldInput} w-full`}/>
                </div>
              </div>
            ))}
            {mintExps.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No experience entries yet. Click &quot;Add Role&quot; to get started.</p>}
          </div>
        </Card>
      )}

      {/* ── MintSlate: Projects widget ── */}
      {(templateSlug === 'mintslate' || templateSlug === 'nexus') && sectionKey === 'projects' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Projects</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add as many projects as you need</p>
            </div>
            <button onClick={() => setMintProjs(p => [...p, { title: '', year: '', image: '', desc: '', stack: '', impact: '', challenge: '', liveUrl: '', githubUrl: '' }])} className={addBtn}>
              <Plus size={12}/> Add Project
            </button>
          </div>
          <div className="space-y-4">
            {mintProjs.map((proj, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project {i + 1}</span>
                  <button onClick={() => setMintProjs(p => p.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2"><Label>Title</Label><input value={proj.title} onChange={e => setMintProjs(ps => ps.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="Project name" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Year</Label><input value={proj.year} onChange={e => setMintProjs(ps => ps.map((x, j) => j===i ? {...x, year: e.target.value} : x))} placeholder="2024" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Impact</Label><input value={proj.impact} onChange={e => setMintProjs(ps => ps.map((x, j) => j===i ? {...x, impact: e.target.value} : x))} placeholder="10k users" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Challenge solved</Label><input value={proj.challenge} onChange={e => setMintProjs(ps => ps.map((x, j) => j===i ? {...x, challenge: e.target.value} : x))} placeholder="Real-time at scale" className={`${fieldInput} w-full`}/></div>
                </div>
                <div>
                  <Label>Project Image</Label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {proj.image && <img src={proj.image} alt={proj.title} className="w-24 h-16 rounded-lg border border-gray-200 object-cover"/>}
                    <button onClick={() => { setMintProjImgIdx(i); mintProjImgRef.current?.click(); }}
                      className="px-4 py-2 rounded-lg border-2 border-dashed border-emerald-500/40 text-emerald-700 text-sm font-medium hover:border-emerald-500 transition-colors">
                      <Upload size={11} className="inline mr-1"/>{proj.image ? 'Change image' : 'Upload image'}
                    </button>
                    {proj.image && (
                      <button onClick={() => setMintProjs(ps => ps.map((x, j) => j===i ? {...x, image: ''} : x))}
                        className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea value={proj.desc} onChange={e => setMintProjs(ps => ps.map((x, j) => j===i ? {...x, desc: e.target.value} : x))} rows={2} placeholder="Short description" className={taInput}/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Tech stack (comma-sep)</Label><input value={proj.stack} onChange={e => setMintProjs(ps => ps.map((x, j) => j===i ? {...x, stack: e.target.value} : x))} placeholder="React, TypeScript" className={`${fieldInput} w-full`}/></div>
                  <div></div>
                  <div><Label>Live URL</Label><input type="url" value={proj.liveUrl} onChange={e => setMintProjs(ps => ps.map((x, j) => j===i ? {...x, liveUrl: e.target.value} : x))} placeholder="https://..." className={`${fieldInput} w-full`}/></div>
                  <div><Label>GitHub URL</Label><input type="url" value={proj.githubUrl} onChange={e => setMintProjs(ps => ps.map((x, j) => j===i ? {...x, githubUrl: e.target.value} : x))} placeholder="https://github.com/..." className={`${fieldInput} w-full`}/></div>
                </div>
              </div>
            ))}
            {mintProjs.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No projects yet. Click &quot;Add Project&quot; to get started.</p>}
          </div>
        </Card>
      )}

      {/* ── Apex: Skills widget ── */}
      {templateSlug === 'apex' && sectionKey === 'skills' && (<>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Skill Categories</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add categories like Languages, Frameworks, etc. — comma-separated items</p>
            </div>
            <button onClick={() => setApexSkills(s => [...s, { category: '', items: '' }])} className={addBtn}>
              <Plus size={12}/> Add Category
            </button>
          </div>
          <div className="space-y-3">
            {apexSkills.map((sk, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center gap-2">
                  <input value={sk.category} onChange={e => setApexSkills(ss => ss.map((x, j) => j===i ? {...x, category: e.target.value} : x))}
                    placeholder="Category (e.g. Languages)" className={fieldInput}/>
                  <button onClick={() => setApexSkills(ss => ss.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <textarea value={sk.items} onChange={e => setApexSkills(ss => ss.map((x, j) => j===i ? {...x, items: e.target.value} : x))}
                  placeholder="Items comma-separated (e.g. TypeScript, JavaScript, Python)" rows={2} className={taInput}/>
              </div>
            ))}
            {apexSkills.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No skill categories yet. Click &quot;Add Category&quot; to start.</p>}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Core Mastery</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Key skills shown with a mastery level bar (1–5)</p>
            </div>
            <button onClick={() => setApexProfs(p => [...p, { name: '', level: 3 }])} className={addBtn}>
              <Plus size={12}/> Add Skill
            </button>
          </div>
          <div className="space-y-2">
            {apexProfs.map((pr, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
                <input value={pr.name} onChange={e => setApexProfs(ps => ps.map((x, j) => j===i ? {...x, name: e.target.value} : x))}
                  placeholder="Skill name (e.g. React / Next.js)" className={fieldInput}/>
                <select value={pr.level} onChange={e => setApexProfs(ps => ps.map((x, j) => j===i ? {...x, level: Number(e.target.value)} : x))}
                  className="px-2 py-1.5 rounded-md border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} / 5</option>)}
                </select>
                <button onClick={() => setApexProfs(ps => ps.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
              </div>
            ))}
            {apexProfs.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No mastery skills yet. Click &quot;Add Skill&quot; to start.</p>}
          </div>
        </Card>
      </>)}

      {/* ── Apex: Experience widget ── */}
      {templateSlug === 'apex' && sectionKey === 'experience' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Experience Entries</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add as many roles as you need</p>
            </div>
            <button onClick={() => setApexExps(e => [...e, { period: '', nowLabel: '', duration: '', role: '', company: '', summary: '', bullets: '', stack: '', isCurrent: false }])} className={addBtn}>
              <Plus size={12}/> Add Role
            </button>
          </div>
          <div className="space-y-4">
            {apexExps.map((exp, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role {i + 1}</span>
                  <button onClick={() => setApexExps(e => e.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Role / Title</Label><input value={exp.role} onChange={e => setApexExps(es => es.map((x, j) => j===i ? {...x, role: e.target.value} : x))} placeholder="Frontend Engineer" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Company</Label><input value={exp.company} onChange={e => setApexExps(es => es.map((x, j) => j===i ? {...x, company: e.target.value} : x))} placeholder="Acme Labs · Series A SaaS" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Period</Label><input value={exp.period} onChange={e => setApexExps(es => es.map((x, j) => j===i ? {...x, period: e.target.value} : x))} placeholder="Jan 2025 – Present" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Duration label</Label><input value={exp.duration} onChange={e => setApexExps(es => es.map((x, j) => j===i ? {...x, duration: e.target.value} : x))} placeholder="11 months" className={`${fieldInput} w-full`}/></div>
                  <div><Label>&quot;Now&quot; label (if current)</Label><input value={exp.nowLabel} onChange={e => setApexExps(es => es.map((x, j) => j===i ? {...x, nowLabel: e.target.value} : x))} placeholder="Present" className={`${fieldInput} w-full`}/></div>
                  <div className="flex items-end gap-2 pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={exp.isCurrent} onChange={e => setApexExps(es => es.map((x, j) => j===i ? {...x, isCurrent: e.target.checked} : x))} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"/>
                      <span className="text-sm text-gray-700">Current role</span>
                    </label>
                  </div>
                </div>
                <div><Label>Summary</Label>
                  <textarea value={exp.summary} onChange={e => setApexExps(es => es.map((x, j) => j===i ? {...x, summary: e.target.value} : x))} rows={2} placeholder="Short overview of your impact in this role" className={taInput}/>
                </div>
                <div><Label>Bullets (one per line)</Label>
                  <textarea value={exp.bullets} onChange={e => setApexExps(es => es.map((x, j) => j===i ? {...x, bullets: e.target.value} : x))} rows={4} placeholder={"Redesigned onboarding → +28% activation\nMigrated design system across 80+ components"} className={taInput}/>
                </div>
                <div><Label>Tech stack (comma-separated)</Label>
                  <input value={exp.stack} onChange={e => setApexExps(es => es.map((x, j) => j===i ? {...x, stack: e.target.value} : x))} placeholder="TypeScript, React, Next.js, Postgres" className={`${fieldInput} w-full`}/>
                </div>
              </div>
            ))}
            {apexExps.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No experience entries yet. Click &quot;Add Role&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Apex: Projects widget ── */}
      {templateSlug === 'apex' && sectionKey === 'projects' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Projects</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add as many projects as you need</p>
            </div>
            <button onClick={() => setApexProjs(p => [...p, { title: '', tag: '', desc: '', stack: '', liveUrl: '', githubUrl: '' }])} className={addBtn}>
              <Plus size={12}/> Add Project
            </button>
          </div>
          <div className="space-y-4">
            {apexProjs.map((proj, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project {i + 1}</span>
                  <button onClick={() => setApexProjs(p => p.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Title</Label><input value={proj.title} onChange={e => setApexProjs(ps => ps.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="Project name" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Tag</Label><input value={proj.tag} onChange={e => setApexProjs(ps => ps.map((x, j) => j===i ? {...x, tag: e.target.value} : x))} placeholder="2025 · Solo" className={`${fieldInput} w-full`}/></div>
                </div>
                <div><Label>Description</Label>
                  <textarea value={proj.desc} onChange={e => setApexProjs(ps => ps.map((x, j) => j===i ? {...x, desc: e.target.value} : x))} rows={3} placeholder="What you built and why it matters" className={taInput}/>
                </div>
                <div><Label>Tech stack (comma-separated)</Label>
                  <input value={proj.stack} onChange={e => setApexProjs(ps => ps.map((x, j) => j===i ? {...x, stack: e.target.value} : x))} placeholder="Next.js, TypeScript, Postgres" className={`${fieldInput} w-full`}/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Live URL</Label><input type="url" value={proj.liveUrl} onChange={e => setApexProjs(ps => ps.map((x, j) => j===i ? {...x, liveUrl: e.target.value} : x))} placeholder="https://..." className={`${fieldInput} w-full`}/></div>
                  <div><Label>GitHub URL</Label><input type="url" value={proj.githubUrl} onChange={e => setApexProjs(ps => ps.map((x, j) => j===i ? {...x, githubUrl: e.target.value} : x))} placeholder="https://github.com/..." className={`${fieldInput} w-full`}/></div>
                </div>
              </div>
            ))}
            {apexProjs.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No projects yet. Click &quot;Add Project&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Apex: Education & Certifications widget ── */}
      {templateSlug === 'apex' && sectionKey === 'education' && (<>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Education</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Degrees, institutions, and study details</p>
            </div>
            <button onClick={() => setApexEdu(e => [...e, { school: '', degree: '', period: '', detail: '' }])} className={addBtn}>
              <Plus size={12}/> Add Entry
            </button>
          </div>
          <div className="space-y-4">
            {apexEdu.map((edu, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry {i + 1}</span>
                  <button onClick={() => setApexEdu(e => e.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Institution</Label><input value={edu.school} onChange={e => setApexEdu(es => es.map((x, j) => j===i ? {...x, school: e.target.value} : x))} placeholder="Anna University" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Degree / Program</Label><input value={edu.degree} onChange={e => setApexEdu(es => es.map((x, j) => j===i ? {...x, degree: e.target.value} : x))} placeholder="B.E. in Computer Science" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Period</Label><input value={edu.period} onChange={e => setApexEdu(es => es.map((x, j) => j===i ? {...x, period: e.target.value} : x))} placeholder="2020 – 2024" className={`${fieldInput} w-full`}/></div>
                </div>
                <div><Label>Detail / Notes</Label>
                  <textarea value={edu.detail} onChange={e => setApexEdu(es => es.map((x, j) => j===i ? {...x, detail: e.target.value} : x))} rows={2} placeholder="CGPA, clubs, achievements, highlights…" className={taInput}/>
                </div>
              </div>
            ))}
            {apexEdu.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No education entries yet. Click &quot;Add Entry&quot; to start.</p>}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Certifications</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Courses, certificates, and credentials</p>
            </div>
            <button onClick={() => setApexCerts(c => [...c, { name: '', issuer: '', year: '', url: '' }])} className={addBtn}>
              <Plus size={12}/> Add Certification
            </button>
          </div>
          <div className="space-y-3">
            {apexCerts.map((cert, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center gap-2">
                  <input value={cert.name} onChange={e => setApexCerts(cs => cs.map((x, j) => j===i ? {...x, name: e.target.value} : x))} placeholder="Certification name" className={fieldInput}/>
                  <button onClick={() => setApexCerts(cs => cs.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2"><input value={cert.issuer} onChange={e => setApexCerts(cs => cs.map((x, j) => j===i ? {...x, issuer: e.target.value} : x))} placeholder="Issuing body (e.g. Meta · Coursera)" className={`${fieldInput} w-full`}/></div>
                  <div><input value={cert.year} onChange={e => setApexCerts(cs => cs.map((x, j) => j===i ? {...x, year: e.target.value} : x))} placeholder="Year" className={`${fieldInput} w-full`}/></div>
                  <div className="col-span-3"><input type="url" value={cert.url} onChange={e => setApexCerts(cs => cs.map((x, j) => j===i ? {...x, url: e.target.value} : x))} placeholder="Certificate URL (optional)" className={`${fieldInput} w-full`}/></div>
                </div>
              </div>
            ))}
            {apexCerts.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No certifications yet. Click &quot;Add Certification&quot; to start.</p>}
          </div>
        </Card>
      </>)}

      {/* ── Apex: Testimonials widget ── */}
      {templateSlug === 'apex' && sectionKey === 'testimonials' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Testimonials</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add kind words from colleagues, clients, or managers</p>
            </div>
            <button onClick={() => setApexTests(t => [...t, { quote: '', author: '', role: '' }])} className={addBtn}>
              <Plus size={12}/> Add Testimonial
            </button>
          </div>
          <div className="space-y-4">
            {apexTests.map((t, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Testimonial {i + 1}</span>
                  <button onClick={() => setApexTests(ts => ts.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div><Label>Quote</Label>
                  <textarea value={t.quote} onChange={e => setApexTests(ts => ts.map((x, j) => j===i ? {...x, quote: e.target.value} : x))} rows={3} placeholder="What they said about working with you…" className={taInput}/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Author name</Label><input value={t.author} onChange={e => setApexTests(ts => ts.map((x, j) => j===i ? {...x, author: e.target.value} : x))} placeholder="Priya Menon" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Role / Company</Label><input value={t.role} onChange={e => setApexTests(ts => ts.map((x, j) => j===i ? {...x, role: e.target.value} : x))} placeholder="Engineering Lead · Arcadia Labs" className={`${fieldInput} w-full`}/></div>
                </div>
              </div>
            ))}
            {apexTests.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No testimonials yet. Click &quot;Add Testimonial&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── MintSlate / Nexus / Prism / Mosaic / Debut: Testimonials widget ── */}
      {(templateSlug === 'mintslate' || templateSlug === 'nexus' || templateSlug === 'prism' || templateSlug === 'mosaic' || templateSlug === 'debut') && sectionKey === 'testimonials' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Testimonials</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add as many testimonials as you need</p>
            </div>
            <button onClick={() => setTests(t => [...t, { quote: '', initials: '', name: '', role: '' }])} className={addBtn}>
              <Plus size={12}/> Add Testimonial
            </button>
          </div>
          <div className="space-y-4">
            {tests.map((t, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Testimonial {i + 1}</span>
                  <button onClick={() => setTests(ts => ts.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div>
                  <Label>Quote</Label>
                  <textarea value={t.quote} onChange={e => setTests(ts => ts.map((x, j) => j===i ? {...x, quote: e.target.value} : x))}
                    rows={3} placeholder="What they said about working with you…" className={taInput}/>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label>Initials</Label><input value={t.initials} onChange={e => setTests(ts => ts.map((x, j) => j===i ? {...x, initials: e.target.value} : x))} placeholder="SK" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Full Name</Label><input value={t.name} onChange={e => setTests(ts => ts.map((x, j) => j===i ? {...x, name: e.target.value} : x))} placeholder="Sarah Kim" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Role / Company</Label><input value={t.role} onChange={e => setTests(ts => ts.map((x, j) => j===i ? {...x, role: e.target.value} : x))} placeholder="Engineer, Vercel" className={`${fieldInput} w-full`}/></div>
                </div>
              </div>
            ))}
            {tests.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No testimonials yet. Click &quot;Add Testimonial&quot; to get started.</p>}
          </div>
        </Card>
      )}

      {/* ── Prism / Mosaic / Debut: Selected Work widget ── */}
      {(templateSlug === 'prism' || templateSlug === 'mosaic' || templateSlug === 'debut') && sectionKey === 'work' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Selected Work</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Add project case studies — they appear as alternating featured cards</p>
            </div>
            <button onClick={() => setPrismWorks(p => [...p, { title: '', year: '', category: '', image: '', desc: '', stack: '', impact: '', liveUrl: '' }])} className={addBtn}>
              <Plus size={12}/> Add Project
            </button>
          </div>
          <div className="space-y-4">
            {prismWorks.map((proj, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project {i + 1}</span>
                  <button onClick={() => setPrismWorks(p => p.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2"><Label>Title</Label><input value={proj.title} onChange={e => setPrismWorks(ps => ps.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="Lumen Studio" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Year</Label><input value={proj.year} onChange={e => setPrismWorks(ps => ps.map((x, j) => j===i ? {...x, year: e.target.value} : x))} placeholder="2024" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Category</Label><input value={proj.category} onChange={e => setPrismWorks(ps => ps.map((x, j) => j===i ? {...x, category: e.target.value} : x))} placeholder="Brand identity" className={`${fieldInput} w-full`}/></div>
                  <div className="col-span-2"><Label>Impact / Outcome</Label><input value={proj.impact} onChange={e => setPrismWorks(ps => ps.map((x, j) => j===i ? {...x, impact: e.target.value} : x))} placeholder="Series A close" className={`${fieldInput} w-full`}/></div>
                </div>
                <div>
                  <Label>Project Image</Label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {proj.image && <img src={proj.image} alt={proj.title} className="w-24 h-16 rounded-lg border border-gray-200 object-cover"/>}
                    <button onClick={() => { setPrismWorkImgIdx(i); prismWorkImgRef.current?.click(); }}
                      className="px-4 py-2 rounded-lg border-2 border-dashed border-emerald-500/40 text-emerald-700 text-sm font-medium hover:border-emerald-500 transition-colors">
                      <Upload size={11} className="inline mr-1"/>{proj.image ? 'Change image' : 'Upload image'}
                    </button>
                    {proj.image && (
                      <button onClick={() => setPrismWorks(ps => ps.map((x, j) => j===i ? {...x, image: ''} : x))}
                        className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea value={proj.desc} onChange={e => setPrismWorks(ps => ps.map((x, j) => j===i ? {...x, desc: e.target.value} : x))} rows={2} placeholder="Short story — what was the brief, what did you make?" className={taInput}/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Stack / Tags (comma-sep)</Label><input value={proj.stack} onChange={e => setPrismWorks(ps => ps.map((x, j) => j===i ? {...x, stack: e.target.value} : x))} placeholder="Identity, Web, Print" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Live URL / Case Study</Label><input type="url" value={proj.liveUrl} onChange={e => setPrismWorks(ps => ps.map((x, j) => j===i ? {...x, liveUrl: e.target.value} : x))} placeholder="https://..." className={`${fieldInput} w-full`}/></div>
                </div>
              </div>
            ))}
            {prismWorks.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No projects yet. Click &quot;Add Project&quot; to get started.</p>}
          </div>
          <input ref={prismWorkImgRef} type="file" accept="image/*" className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f && prismWorkImgIdx !== null) {
                uploadFile(f, `prism-work-${prismWorkImgIdx}`, url => setPrismWorks(ps => ps.map((x, j) => j===prismWorkImgIdx ? {...x, image: url} : x)));
              }
              if (prismWorkImgRef.current) prismWorkImgRef.current.value = '';
            }}/>
        </Card>
      )}

      {/* ── Prism: Process Steps widget ── */}
      {templateSlug === 'prism' && sectionKey === 'process' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Process Steps</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Walk visitors through how you work — each step gets its own tile</p>
            </div>
            <button onClick={() => setPrismProc(p => [...p, { title: '', description: '' }])} className={addBtn}>
              <Plus size={12}/> Add Step
            </button>
          </div>
          <div className="space-y-3">
            {prismProc.map((step, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Step 0{i + 1}</span>
                  <button onClick={() => setPrismProc(p => p.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div><Label>Title</Label>
                  <input value={step.title} onChange={e => setPrismProc(ps => ps.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="Discover" className={`${fieldInput} w-full`}/>
                </div>
                <div><Label>Description</Label>
                  <textarea value={step.description} onChange={e => setPrismProc(ps => ps.map((x, j) => j===i ? {...x, description: e.target.value} : x))} rows={2} placeholder="What this step involves and why it matters." className={taInput}/>
                </div>
              </div>
            ))}
            {prismProc.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No steps yet. Click &quot;Add Step&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Debut: Education widget ── */}
      {templateSlug === 'debut' && sectionKey === 'education' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Education</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Schools, degrees, periods, and grades</p>
            </div>
            <button onClick={() => setDebutEdu(e => [...e, { period: '', school: '', degree: '', detail: '', grade: '' }])} className={addBtn}>
              <Plus size={12}/> Add Entry
            </button>
          </div>
          <div className="space-y-4">
            {debutEdu.map((ed, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry {i + 1}</span>
                  <button onClick={() => setDebutEdu(es => es.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Institution</Label><input value={ed.school} onChange={e => setDebutEdu(es => es.map((x, j) => j===i ? {...x, school: e.target.value} : x))} placeholder="NID Ahmedabad" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Degree / Program</Label><input value={ed.degree} onChange={e => setDebutEdu(es => es.map((x, j) => j===i ? {...x, degree: e.target.value} : x))} placeholder="BDes · Communication Design" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Period</Label><input value={ed.period} onChange={e => setDebutEdu(es => es.map((x, j) => j===i ? {...x, period: e.target.value} : x))} placeholder="2022 – 2026" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Grade / CGPA</Label><input value={ed.grade} onChange={e => setDebutEdu(es => es.map((x, j) => j===i ? {...x, grade: e.target.value} : x))} placeholder="8.7" className={`${fieldInput} w-full`}/></div>
                </div>
                <div><Label>Detail / Notes</Label>
                  <textarea value={ed.detail} onChange={e => setDebutEdu(es => es.map((x, j) => j===i ? {...x, detail: e.target.value} : x))} rows={2} placeholder="Capstone topic, achievements, focus areas…" className={taInput}/>
                </div>
              </div>
            ))}
            {debutEdu.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No education entries yet. Click &quot;Add Entry&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Debut: Internships widget ── */}
      {templateSlug === 'debut' && sectionKey === 'internships' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Internships</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Past internships and short-term roles</p>
            </div>
            <button onClick={() => setDebutInts(it => [...it, { period: '', isCurrent: false, role: '', company: '', description: '', tags: '' }])} className={addBtn}>
              <Plus size={12}/> Add Internship
            </button>
          </div>
          <div className="space-y-4">
            {debutInts.map((it, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Internship {i + 1}</span>
                  <button onClick={() => setDebutInts(is => is.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Role</Label><input value={it.role} onChange={e => setDebutInts(is => is.map((x, j) => j===i ? {...x, role: e.target.value} : x))} placeholder="Visual Design Intern" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Company / Studio</Label><input value={it.company} onChange={e => setDebutInts(is => is.map((x, j) => j===i ? {...x, company: e.target.value} : x))} placeholder="Studio Lumen" className={`${fieldInput} w-full`}/></div>
                  <div><Label>Period</Label><input value={it.period} onChange={e => setDebutInts(is => is.map((x, j) => j===i ? {...x, period: e.target.value} : x))} placeholder="May – Aug 2025" className={`${fieldInput} w-full`}/></div>
                  <div className="flex items-end gap-2 pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={it.isCurrent} onChange={e => setDebutInts(is => is.map((x, j) => j===i ? {...x, isCurrent: e.target.checked} : x))} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"/>
                      <span className="text-sm text-gray-700">Currently here</span>
                    </label>
                  </div>
                </div>
                <div><Label>Description</Label>
                  <textarea value={it.description} onChange={e => setDebutInts(is => is.map((x, j) => j===i ? {...x, description: e.target.value} : x))} rows={2} placeholder="What you worked on and what you learned" className={taInput}/>
                </div>
                <div><Label>Tags (comma-separated)</Label>
                  <input value={it.tags} onChange={e => setDebutInts(is => is.map((x, j) => j===i ? {...x, tags: e.target.value} : x))} placeholder="Brand, Type, Packaging" className={`${fieldInput} w-full`}/>
                </div>
              </div>
            ))}
            {debutInts.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No internships yet. Click &quot;Add Internship&quot; to start.</p>}
          </div>
        </Card>
      )}

      {/* ── Debut: Skill Categories widget ── */}
      {templateSlug === 'debut' && sectionKey === 'skills' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Skill Categories</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Group skills into categories with proficiency dots (1–5)</p>
            </div>
            <button onClick={() => setDebutSkillCats(cs => [...cs, { title: '', items: [] }])} className={addBtn}>
              <Plus size={12}/> Add Category
            </button>
          </div>
          <div className="space-y-4">
            {debutSkillCats.map((cat, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-center gap-2">
                  <input value={cat.title} onChange={e => setDebutSkillCats(cs => cs.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="Category name (e.g. Design tools)" className={fieldInput}/>
                  <button onClick={() => setDebutSkillCats(cs => cs.filter((_, j) => j!==i))} className={removeBtn}><X size={14}/></button>
                </div>
                <div className="space-y-2">
                  {cat.items.map((item, k) => (
                    <div key={k} className="flex items-center gap-2 p-2 rounded-md border border-gray-200 bg-white">
                      <input value={item.name} onChange={e => setDebutSkillCats(cs => cs.map((x, j) => j===i ? {...x, items: x.items.map((y, m) => m===k ? {...y, name: e.target.value} : y)} : x))} placeholder="Skill name (e.g. Figma)" className={fieldInput}/>
                      <select value={item.level} onChange={e => setDebutSkillCats(cs => cs.map((x, j) => j===i ? {...x, items: x.items.map((y, m) => m===k ? {...y, level: Number(e.target.value)} : y)} : x))}
                        className="px-2 py-1.5 rounded-md border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>● ● ● ● ● {n}/5</option>)}
                      </select>
                      <button onClick={() => setDebutSkillCats(cs => cs.map((x, j) => j===i ? {...x, items: x.items.filter((_, m) => m!==k)} : x))} className={removeBtn}><X size={14}/></button>
                    </div>
                  ))}
                  <button onClick={() => setDebutSkillCats(cs => cs.map((x, j) => j===i ? {...x, items: [...x.items, { name: '', level: 3 }]} : x))}
                    className="text-xs text-emerald-700 font-medium hover:underline flex items-center gap-1">
                    <Plus size={11}/> Add skill to {cat.title || 'this category'}
                  </button>
                </div>
              </div>
            ))}
            {debutSkillCats.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No skill categories yet. Click &quot;Add Category&quot; to start.</p>}
          </div>
        </Card>
      )}
    </SectionPage>
  );
}
