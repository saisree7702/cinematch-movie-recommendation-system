import { useState, useEffect } from 'react';
import { User, Mail, Save, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { updateProfile, getUserPreferences, upsertUserPreferences } from '@/services/profileService';
import { GENRES, LANGUAGES, MOODS } from '@/types';
import type { UserPreferences } from '@/types';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [formGenres, setFormGenres] = useState<string[]>([]);
  const [formLanguages, setFormLanguages] = useState<string[]>([]);
  const [formMoods, setFormMoods] = useState<string[]>([]);
  const [formMinRating, setFormMinRating] = useState(0);
  const [formYearFrom, setFormYearFrom] = useState<number | null>(null);
  const [formYearTo, setFormYearTo] = useState<number | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setAvatarUrl(profile?.avatar_url ?? '');
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    getUserPreferences(user.id).then((p) => {
      if (p) {
        setPrefs(p);
        setFormGenres(p.preferred_genres);
        setFormLanguages(p.preferred_languages);
        setFormMoods(p.preferred_moods);
        setFormMinRating(p.minimum_rating);
        setFormYearFrom(p.preferred_year_from);
        setFormYearTo(p.preferred_year_to);
      }
    });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfile(user.id, { full_name: fullName, avatar_url: avatarUrl });
      await refreshProfile();
      showToast('Profile updated', 'success');
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePrefs = async () => {
    if (!user) return;
    setSavingPrefs(true);
    try {
      const saved = await upsertUserPreferences(user.id, {
        preferred_genres: formGenres,
        preferred_languages: formLanguages,
        preferred_moods: formMoods,
        minimum_rating: formMinRating,
        preferred_year_from: formYearFrom,
        preferred_year_to: formYearTo,
      });
      setPrefs(saved);
      showToast('Preferences saved', 'success');
    } catch {
      showToast('Failed to save preferences', 'error');
    } finally {
      setSavingPrefs(false);
    }
  };

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
        active
          ? 'bg-cin-gold/20 text-cin-gold border border-cin-gold/40'
          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">My Profile</h1>

      {/* Profile info */}
      <div className="p-6 rounded-2xl glass mb-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-5">
          <User className="w-5 h-5 text-cin-gold" />
          Profile Information
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cin-gold to-cin-rose flex items-center justify-center text-black font-bold text-xl">
            {(fullName || user?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold">{fullName || 'Your Name'}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cin-gold/40 transition"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cin-gold/40 transition"
            />
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cin-gold to-cin-rose text-black font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="p-6 rounded-2xl glass">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-5">
          <Settings className="w-5 h-5 text-cin-gold" />
          Recommendation Preferences
        </h2>

        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Favorite Genres</h4>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Chip key={g} label={g} active={formGenres.includes(g)} onClick={() => setFormGenres(toggleArr(formGenres, g))} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Preferred Languages</h4>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <Chip key={l} label={l} active={formLanguages.includes(l)} onClick={() => setFormLanguages(toggleArr(formLanguages, l))} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Preferred Mood</h4>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip key={m} label={m} active={formMoods.includes(m)} onClick={() => setFormMoods(toggleArr(formMoods, m))} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Minimum Rating</h4>
              <select
                value={formMinRating}
                onChange={(e) => setFormMinRating(parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cin-gold/40"
              >
                <option value={0}>Any rating</option>
                <option value={5}>5+</option>
                <option value={6}>6+</option>
                <option value={7}>7+</option>
                <option value={8}>8+</option>
                <option value={9}>9+</option>
              </select>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Year From</h4>
              <input
                type="number"
                placeholder="1950"
                value={formYearFrom ?? ''}
                onChange={(e) => setFormYearFrom(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cin-gold/40"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Year To</h4>
              <input
                type="number"
                placeholder="2025"
                value={formYearTo ?? ''}
                onChange={(e) => setFormYearTo(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cin-gold/40"
              />
            </div>
          </div>
          <button
            onClick={handleSavePrefs}
            disabled={savingPrefs}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cin-gold to-cin-rose text-black font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {savingPrefs ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
