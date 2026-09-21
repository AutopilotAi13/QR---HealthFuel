import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminGetSettings, adminUpdateSettings } from '@/services/adminRepository';
import type { Settings } from '@/types/menu';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminGetSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await adminUpdateSettings({
        brand_name: settings.brand_name,
        tagline: settings.tagline,
        currency: settings.currency,
        oil_statement: settings.oil_statement,
        nutrition_disclaimer: settings.nutrition_disclaimer,
        nutrition_last_updated: settings.nutrition_last_updated,
      });
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full bg-charcoal-800 border border-charcoal-700/50 rounded-lg px-3 py-2 text-cream-50 text-sm placeholder-cream-100/30 focus:outline-none focus:border-avocado-500/50 transition-colors';
  const labelClass = 'block text-cream-100/60 text-xs font-semibold tracking-wider uppercase mb-1.5';

  if (loading) return <AdminLayout><p className="text-cream-100/40 text-sm">Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-cream-50 text-xl font-bold tracking-tight">Global Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-avocado-500 hover:bg-avocado-400 disabled:opacity-50 text-cream-50 text-sm font-semibold rounded-lg px-3 py-2 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {saved && (
        <div className="bg-avocado-500/10 border border-avocado-500/20 rounded-xl p-3 mb-4">
          <p className="text-avocado-300 text-sm font-medium">Settings saved successfully.</p>
        </div>
      )}

      {settings && (
        <div className="space-y-6">
          <div className="bg-charcoal-800/30 border border-charcoal-700/30 rounded-xl p-4 space-y-4">
            <h2 className="text-cream-100/60 text-xs font-semibold tracking-wider uppercase">Brand</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Brand Name</label>
                <input value={settings.brand_name} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Currency Symbol</label>
                <input value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Tagline</label>
                <input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="bg-charcoal-800/30 border border-charcoal-700/30 rounded-xl p-4 space-y-4">
            <h2 className="text-cream-100/60 text-xs font-semibold tracking-wider uppercase">Nutrition</h2>
            <div>
              <label className={labelClass}>Oil Statement</label>
              <input value={settings.oil_statement} onChange={(e) => setSettings({ ...settings, oil_statement: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nutrition Disclaimer</label>
              <textarea value={settings.nutrition_disclaimer} onChange={(e) => setSettings({ ...settings, nutrition_disclaimer: e.target.value })} rows={2} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nutrition Last Updated</label>
              <input value={settings.nutrition_last_updated} onChange={(e) => setSettings({ ...settings, nutrition_last_updated: e.target.value })} className={inputClass} placeholder="e.g. September 2026" />
            </div>
          </div>

          {settings.updated_at && (
            <p className="text-cream-100/30 text-xs">Last updated: {new Date(settings.updated_at).toLocaleString()}</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
