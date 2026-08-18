import { SavedResource } from '../types';
import { SAMPLE_SAVED_RESOURCES } from '../data/presets';

const STORAGE_KEY = 'eduspark_saved_resources_v1';
const ROSTER_KEY = 'eduspark_class_roster_v1';

export function getSavedResources(): SavedResource[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SAVED_RESOURCES));
      return SAMPLE_SAVED_RESOURCES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved resources:', e);
    return SAMPLE_SAVED_RESOURCES;
  }
}

export function saveResource(resource: Omit<SavedResource, 'id' | 'createdAt'> & { id?: string }): SavedResource {
  const current = getSavedResources();
  const newResource: SavedResource = {
    ...resource,
    id: resource.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
  };

  const existingIndex = current.findIndex(r => r.id === newResource.id);
  let updated: SavedResource[];
  if (existingIndex >= 0) {
    updated = current.map((r, i) => i === existingIndex ? newResource : r);
  } else {
    updated = [newResource, ...current];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newResource;
}

export function deleteResource(id: string): void {
  const current = getSavedResources();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function toggleFavoriteResource(id: string): boolean {
  const current = getSavedResources();
  let nextState = false;
  const updated = current.map(r => {
    if (r.id === id) {
      nextState = !r.isFavorite;
      return { ...r, isFavorite: nextState };
    }
    return r;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return nextState;
}

export function exportAsDoc(title: string, content: string): void {
  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; line-height: 1.6; color: #111827; padding: 20px; }
  h1 { color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
  h2 { color: #1e40af; margin-top: 24px; border-bottom: 1px solid #e5e7eb; }
  h3 { color: #2563eb; }
  pre, code { background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; }
  th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
  th { background-color: #f9fafb; }
</style>
</head>
<body>
  ${convertMarkdownToSimpleHtml(content)}
</body>
</html>`;

  const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(title)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsMarkdown(title: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(title)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 40) || '教学教研材料';
}

export function convertMarkdownToSimpleHtml(md: string): string {
  let html = md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
    .replace(/^\s*\*\s+(.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/gim, '<br><br>')
    .replace(/\n/gim, '<br>');
  return html;
}
