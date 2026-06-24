// src/pages/admin/AdminMarketingPage.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageTransition from '../../components/common/PageTransition';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ImageUploadWithCompressor from '../../components/common/ImageUploadWithCompressor';
import { useStorage } from '../../hooks/useStorage';
import toast from 'react-hot-toast';
import { Megaphone, Save, Trash2, PlusCircle, Sparkles } from 'lucide-react';

const AdminMarketingPage = () => {
  const [activeTab, setActiveTab] = useState('announcements'); // announcements, festival
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [cycleSpeed, setCycleSpeed] = useState(4000);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  // 2. Festival state
  const [festivalConfig, setFestivalConfig] = useState({
    active: false,
    title: '',
    greeting: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    showCredits: true
  });

  const { uploadFileWithProgress, progress, uploading } = useStorage();

  // Load configuration details from Firestore
  const loadConfigData = async () => {
    setLoading(true);
    try {
      // Load Announcements
      const annSnap = await getDoc(doc(db, 'settings', 'announcements'));
      if (annSnap.exists()) {
        const data = annSnap.data();
        setAnnouncements(data.items || []);
        setCycleSpeed(data.speed || 4000);
      } else {
        setAnnouncements([
          "✨ Book your Royal Wedding slots now! Special custom decors available for Vuyyuru & surrounding areas.",
          "🍲 Treat your guests to our premium Live Buffet Catering spreads.",
          "⚡ High-energy intelligent lighting, LED backdrop wall, and line-array DJ sounds now live!"
        ]);
        setCycleSpeed(4000);
      }

      // Load Festival Banner Config
      const festSnap = await getDoc(doc(db, 'settings', 'festival'));
      if (festSnap.exists()) {
        setFestivalConfig(festSnap.data());
      } else {
        setFestivalConfig({
          active: false,
          title: 'Happy Vijayadashami!',
          greeting: 'Wishing you and your family a festive season filled with joy, prosperity, and beautiful celebrations.',
          imageUrl: 'https://images.unsplash.com/photo-1608976451613-2d2745195b0c?q=80&w=1200',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          showCredits: true
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load marketing configs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigData();
  }, []);

  // Announcements handlers
  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setAnnouncements((prev) => [...prev, newAnnouncement.trim()]);
    setNewAnnouncement('');
  };

  const handleRemoveAnnouncement = (index) => {
    setAnnouncements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAnnouncements = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'announcements'), {
        items: announcements,
        speed: Number(cycleSpeed),
        updatedAt: new Date().toISOString()
      });
      toast.success('Announcements configuration updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save announcements.');
    } finally {
      setSaving(false);
    }
  };

  // Festival handlers
  const handleFestivalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFestivalConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFestivalImageUpload = async (blob) => {
    try {
      const path = `settings/festival_backdrop_${Date.now()}.jpg`;
      const downloadUrl = await uploadFileWithProgress(blob, path);
      setFestivalConfig((prev) => ({ ...prev, imageUrl: downloadUrl }));
      toast.success('Festival backdrop image uploaded!');
    } catch (err) {
      console.error(err);
      toast.error('Backdrop upload failed.');
    }
  };

  const handleSaveFestival = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'festival'), {
        ...festivalConfig,
        updatedAt: new Date().toISOString()
      });
      toast.success('Festival Banner settings updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save festival configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-display text-champagne text-sm font-semibold tracking-wide uppercase">
            Marketing & Engagement Options
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-gold text-velvet'
                  : 'bg-white/5 hover:bg-white/10 text-champagne/80 border border-white/15'
              }`}
            >
              Announcement Bar
            </button>
            <button
              onClick={() => setActiveTab('festival')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'festival'
                  ? 'bg-gold text-velvet'
                  : 'bg-white/5 hover:bg-white/10 text-champagne/80 border border-white/15'
              }`}
            >
              Festival Banner Overlay
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
          </div>
        ) : activeTab === 'announcements' ? (
          
          /* TAB 1: Announcement Bar */
          <form onSubmit={handleSaveAnnouncements} className="space-y-6 animate-fadeIn">
            <Card className="p-6 space-y-5" hoverEffect={false}>
              <div className="flex items-center space-x-2 text-gold font-display font-bold text-sm uppercase tracking-wider border-b border-white/5 pb-2 mb-2">
                <Megaphone className="w-4 h-4" />
                <span>Top Announcement List</span>
              </div>

              <div className="space-y-3 font-body text-xs">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Input
                      label="Add New Announcement Message"
                      name="newAnn"
                      value={newAnnouncement}
                      onChange={(e) => setNewAnnouncement(e.target.value)}
                      placeholder="e.g. Wedding bookings open for Winter season..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAnnouncement}
                    className="p-3 bg-gold/10 border border-gold/30 hover:bg-gold/20 text-gold rounded-lg flex items-center justify-center transition-colors h-[38px] cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-semibold text-champagne/80 block">Active Messages List:</span>
                  {announcements.length === 0 ? (
                    <p className="text-champagne/40 italic">No announcements configured. Bar will be hidden.</p>
                  ) : (
                    <div className="space-y-2">
                      {announcements.map((msg, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg text-champagne">
                          <span className="truncate flex-1 pr-4">{msg}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAnnouncement(index)}
                            className="p-1 bg-danger/15 border border-danger/30 text-danger rounded hover:bg-danger hover:text-velvet transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-48 pt-4">
                  <Input
                    label="Rotation Speed (ms)"
                    name="speed"
                    type="number"
                    value={cycleSpeed}
                    onChange={(e) => setCycleSpeed(e.target.value)}
                    placeholder="e.g. 4000"
                    required
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="px-6 py-2.5 text-xs font-semibold flex items-center space-x-2">
                <Save className="w-4 h-4 mr-2" />
                <span>{saving ? 'Saving...' : 'Save Announcements'}</span>
              </Button>
            </div>
          </form>
        ) : (
          
          /* TAB 2: Festival Banner */
          <form onSubmit={handleSaveFestival} className="space-y-6 animate-fadeIn">
            <Card className="p-6 space-y-5" hoverEffect={false}>
              <div className="flex items-center justify-between text-gold font-display font-bold text-sm uppercase tracking-wider border-b border-white/5 pb-2 mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Festival Overlay configuration</span>
                </div>
                
                {/* Active switch toggle */}
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="active"
                    checked={festivalConfig.active}
                    onChange={handleFestivalChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 border border-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-champagne after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold relative transition-all duration-300" />
                  <span className="ml-2 text-xs font-semibold text-champagne/85">
                    {festivalConfig.active ? 'Active' : 'Disabled'}
                  </span>
                </label>
              </div>

              <div className="space-y-4 font-body text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Festival Greeting Header"
                    name="title"
                    value={festivalConfig.title}
                    onChange={handleFestivalChange}
                    placeholder="e.g. Happy Vijayadashami!"
                    required={festivalConfig.active}
                  />
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={festivalConfig.startDate}
                        onChange={handleFestivalChange}
                        required={festivalConfig.active}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={festivalConfig.endDate}
                        onChange={handleFestivalChange}
                        required={festivalConfig.active}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-body text-xs font-semibold text-champagne/80">
                    Greeting Content
                  </label>
                  <textarea
                    name="greeting"
                    rows={3}
                    value={festivalConfig.greeting}
                    onChange={handleFestivalChange}
                    placeholder="Detailed greeting text displayed on splash banner..."
                    className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-lg p-3 text-xs text-champagne font-body outline-none transition-colors"
                    required={festivalConfig.active}
                  />
                </div>

                {/* Image upload segment */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
                  <div className="sm:col-span-4 space-y-2">
                    <span className="font-semibold text-champagne/80 block">Backdrop preview:</span>
                    {festivalConfig.imageUrl ? (
                      <div className="relative aspect-[16/9] w-full rounded overflow-hidden border border-white/10 bg-black/20">
                        <img src={festivalConfig.imageUrl} alt="Festival Backdrop preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] w-full bg-white/5 border border-dashed border-white/15 rounded flex items-center justify-center text-champagne/30 italic text-[10px]">
                        No image selected
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-8 space-y-3">
                    <Input
                      label="Backdrop Image URL"
                      name="imageUrl"
                      value={festivalConfig.imageUrl}
                      onChange={handleFestivalChange}
                      placeholder="Paste image link directly..."
                    />

                    <div className="flex flex-col space-y-1 pt-1">
                      <span className="font-body text-[10px] font-semibold text-champagne/60 mb-1">
                        OR Upload Custom image (optimized under 300KB):
                      </span>
                      <ImageUploadWithCompressor
                        onUploadReady={handleFestivalImageUpload}
                        multiple={false}
                      />
                      {uploading && (
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-1">
                          <div className="bg-gold h-full" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Show credits check */}
                <div className="pt-4 border-t border-white/5 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showCredits"
                    name="showCredits"
                    checked={festivalConfig.showCredits}
                    onChange={handleFestivalChange}
                    className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-gold focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="showCredits" className="font-semibold text-champagne/70 cursor-pointer select-none">
                    Show company branding credits at the bottom ("Powered by WayzenTech 9398724704")
                  </label>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving || uploading} className="px-6 py-2.5 text-xs font-semibold flex items-center space-x-2">
                <Save className="w-4 h-4 mr-2" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminMarketingPage;
