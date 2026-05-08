'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Plus, X, Upload, RotateCcw } from 'lucide-react';
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

  // Upload
  const resumeRef  = useRef<HTMLInputElement>(null);
  const photoRef   = useRef<HTMLInputElement>(null);
  const toolImgRef = useRef<HTMLInputElement>(null);
  const [toolImgIdx, setToolImgIdx] = useState<number | null>(null);
  const mintProjImgRef = useRef<HTMLInputElement>(null);
  const [mintProjImgIdx, setMintProjImgIdx] = useState<number | null>(null);
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

    if (templateSlug === 'maren') {
      if (sectionKey === 'skills')     merged.skillsJson = JSON.stringify(skills);
      if (sectionKey === 'experience') merged.expJson    = JSON.stringify(marenExps);
      if (sectionKey === 'projects')   merged.projJson   = JSON.stringify(marenProjs);
    }

    if (templateSlug === 'mintslate') {
      if (sectionKey === 'skills')       merged.toolsJson = JSON.stringify(tools);
      if (sectionKey === 'experience')   merged.expJson   = JSON.stringify(mintExps);
      if (sectionKey === 'projects')     merged.projJson  = JSON.stringify(mintProjs);
      if (sectionKey === 'testimonials') merged.testJson  = JSON.stringify(tests);
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
  const fields = section.fields.filter(f => {
    if (showStatsWidget && /^stat\d(Num|Unit|Label)$/.test(f.key)) return false;
    if (/^aboutPara\d$/.test(f.key)) return false;
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
                const isResume  = field.key === 'resumeUrl';
                const isPhoto   = field.key === 'photoUrl';
                const fileRef   = isResume ? resumeRef : isPhoto ? photoRef : null;
                const accept    = isResume ? '.pdf' : 'image/*';
                const isUploading = uploading[field.key];
                return (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {isPhoto && c(field.key) && (
                        <div className="relative w-32 h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                          <img src={c(field.key)} alt="Profile" className="w-full h-full object-cover"/>
                          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/40 text-white text-[10px] font-mono text-center">Profile preview</div>
                        </div>
                      )}
                      <button onClick={() => fileRef?.current?.click()} disabled={isUploading}
                        className="px-4 py-2 rounded-lg border-2 border-dashed border-emerald-500/40 text-emerald-700 text-sm font-medium hover:border-emerald-500 transition-colors disabled:opacity-50">
                        {isUploading ? 'Uploading…' : c(field.key) ? 'Change file' : `Upload ${isResume ? 'PDF' : 'photo'}`}
                      </button>
                      <input ref={fileRef || undefined} type="file" accept={accept} className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, field.key); }}/>
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

      {/* ── Maren: Skills (categories) widget ── */}
      {templateSlug === 'maren' && sectionKey === 'skills' && (
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

      {/* ── Maren: Experience widget ── */}
      {templateSlug === 'maren' && sectionKey === 'experience' && (
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

      {/* ── Maren: Projects widget ── */}
      {templateSlug === 'maren' && sectionKey === 'projects' && (
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

      {/* ── MintSlate: Tools widget ── */}
      {templateSlug === 'mintslate' && sectionKey === 'skills' && (
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
      {templateSlug === 'mintslate' && sectionKey === 'experience' && (
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
      {templateSlug === 'mintslate' && sectionKey === 'projects' && (
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

      {/* ── MintSlate: Testimonials widget ── */}
      {templateSlug === 'mintslate' && sectionKey === 'testimonials' && (
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
    </SectionPage>
  );
}
