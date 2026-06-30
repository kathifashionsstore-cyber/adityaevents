// src/pages/admin/AdminGalleryPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import ImageUploadWithCompressor from '../../components/common/ImageUploadWithCompressor';
import { db } from '../../firebase/config';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { PlusCircle, Image as ImageIcon, Trash, Star, ToggleLeft, ToggleRight, X } from 'lucide-react';

const CATEGORIES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthdays' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'catering', label: 'Catering Feasts' },
  { value: 'receptions', label: 'Receptions' },
  { value: 'mehndi', label: 'Mehndi Night' },
  { value: 'dj-events', label: 'DJ Sound Events' },
  { value: 'photography', label: 'Photography Shots' },
  { value: 'stage-decor', label: 'Stage Decor' },
  { value: 'general', label: 'General / Other' },
];

const AdminGalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Add Form fields
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('wedding');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    // Real-time listener on gallery collection
    const unsubscribe = onSnapshot(
      collection(db, 'gallery'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        // Sort by newest
        setPhotos(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      },
      (error) => {
        console.error('Gallery collection sync error:', error);
        toast.error('Failed to sync gallery database.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleUploadSuccess = (url) => {
    setImageUrl(url);
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error('Please upload an image first.');
      return;
    }
    if (!caption.trim()) {
      toast.error('Image caption description is required.');
      return;
    }

    try {
      const docId = 'IMG_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      await setDoc(doc(db, 'gallery', docId), {
        id: docId,
        src: imageUrl,
        caption: caption.trim(),
        category,
        isActive,
        isFeatured,
        createdAt: new Date().toISOString()
      });

      toast.success('Gallery photo published successfully!');
      setCaption('');
      setImageUrl('');
      setIsActive(true);
      setIsFeatured(false);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save gallery document to database.');
    }
  };

  const handleDelete = async (photo) => {
    if (!window.confirm(`Are you sure you want to delete this photo "${photo.caption}" from the gallery?`)) return;
    try {
      await deleteDoc(doc(db, 'gallery', photo.id));
      toast.success('Gallery photo deleted.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete photo.');
    }
  };

  const handleToggleState = async (photo, field) => {
    try {
      const updatedVal = !photo[field];
      await setDoc(doc(db, 'gallery', photo.id), { [field]: updatedVal }, { merge: true });
      toast.success(`Photo state updated successfully.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update state.');
    }
  };

  // Filtering local grid lists
  const filteredPhotos = activeFilter === 'all'
    ? photos
    : photos.filter(p => p.category === activeFilter);

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-gold animate-fadeIn">Event Gallery</h1>
            <p className="font-body text-xs text-champagne/60 mt-1">Upload event decoration showcases and filter public site grids</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(prev => !prev);
            }}
            className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-gold-deep to-gold-rich rounded-lg text-xs font-bold text-velvet uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-gold/15"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span>{showAddForm ? 'Close Form' : 'Upload Shot'}</span>
          </button>
        </div>

        {/* Form panel */}
        {showAddForm && (
          <Card className="p-6 border-gold/25 relative animate-fadeIn" hoverEffect={false}>
            <button onClick={() => setShowAddForm(false)} className="absolute top-4 right-4 text-champagne/40 hover:text-gold cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-gold font-bold text-sm border-b border-white/5 pb-2 mb-6">
              Curate Gallery Showcase Image
            </h3>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                    Showcase Cover Image (WebP Under 500KB Pipeline)
                  </span>
                  <ImageUploadWithCompressor 
                    onUploadSuccess={handleUploadSuccess}
                    currentImageUrl={imageUrl}
                  />
                </div>

                <div className="space-y-4">
                  <Input
                    label="Image Caption / Description"
                    name="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g. Elegant Traditional Mandap Setup"
                    required
                  />
                  
                  <Select
                    label="Showcase Category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={CATEGORIES}
                  />

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {/* Active toggle */}
                    <div className="flex items-center space-x-3">
                      <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                        Active Publicly:
                      </span>
                      <button type="button" onClick={() => setIsActive(!isActive)} className="text-gold cursor-pointer">
                        {isActive ? <ToggleRight className="w-8 h-8 text-success" /> : <ToggleLeft className="w-8 h-8 text-champagne/40" />}
                      </button>
                    </div>

                    {/* Featured toggle */}
                    <div className="flex items-center space-x-3">
                      <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                        Homepage Featured:
                      </span>
                      <button type="button" onClick={() => setIsFeatured(!isFeatured)} className="text-gold cursor-pointer">
                        {isFeatured ? <ToggleRight className="w-8 h-8 text-gold" /> : <ToggleLeft className="w-8 h-8 text-champagne/40" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <Button type="button" onClick={() => setShowAddForm(false)} variant="outline" className="px-6 py-2 text-xs font-semibold">
                  Cancel
                </Button>
                <Button type="submit" disabled={!imageUrl} className="px-8 py-2 text-xs font-bold uppercase tracking-widest">
                  Save to Gallery
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters bar */}
        <div className="flex justify-start space-x-2.5 overflow-x-auto pb-2 border-b border-white/5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider shrink-0 transition-colors cursor-pointer ${
              activeFilter === 'all' ? 'bg-gold text-velvet' : 'bg-white/5 hover:bg-white/10 text-champagne'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider shrink-0 transition-colors cursor-pointer ${
                activeFilter === cat.value ? 'bg-gold text-velvet' : 'bg-white/5 hover:bg-white/10 text-champagne'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Display Grid */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <Card className="p-8 text-center" hoverEffect={false}>
            <p className="font-body text-xs text-champagne/50">
              No images curated in this category. Click 'Upload Shot' to seed images.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((p) => (
              <div 
                key={p.id} 
                className="relative rounded-xl overflow-hidden border border-white/5 bg-white/5 aspect-square group shadow-lg"
              >
                <img src={p.src} alt={p.caption} className="w-full h-full object-cover" />
                
                {/* Hover metadata overlays */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[8px] text-gold uppercase tracking-wider font-bold bg-velvet/85 px-1.5 py-0.5 rounded border border-gold/15">
                      {CATEGORIES.find(c => c.value === p.category)?.label || p.category}
                    </span>
                  </div>

                  <p className="text-[10px] text-champagne font-semibold text-left line-clamp-2 leading-relaxed">
                    {p.caption}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2.5 mt-2">
                    {/* Controls inside hover */}
                    <div className="flex items-center space-x-1">
                      {/* Active Status */}
                      <button
                        onClick={() => handleToggleState(p, 'isActive')}
                        className={`p-1 rounded text-[8px] uppercase font-bold ${
                          p.isActive !== false ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                        } cursor-pointer`}
                        title="Toggle Active"
                      >
                        {p.isActive !== false ? 'Active' : 'Hidden'}
                      </button>

                      {/* Featured Status */}
                      <button
                        onClick={() => handleToggleState(p, 'isFeatured')}
                        className={`p-1 rounded ${
                          p.isFeatured ? 'bg-gold/15 text-gold' : 'bg-white/5 text-champagne/40'
                        } cursor-pointer`}
                        title="Toggle Home Featured"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(p)}
                      className="p-1.5 bg-danger/20 hover:bg-danger text-white rounded transition-colors cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminGalleryPage;
