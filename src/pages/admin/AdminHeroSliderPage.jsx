// src/pages/admin/AdminHeroSliderPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { subscribeHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide, reorderHeroSlides } from '../../services/heroSlidesService';
import { uploadFile } from '../../services/storageService';
import { compressImage } from '../../utils/imageCompressor';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, ToggleLeft, ToggleRight, X, Image as ImageIcon } from 'lucide-react';

const AdminHeroSliderPage = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [btnText, setBtnText] = useState('Book Your Event');
  const [btnLink, setBtnLink] = useState('/booking');
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeHeroSlides(
      (data) => {
        setSlides(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching hero slides:', error);
        toast.error('Failed to load hero slides from database.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setBtnText('Book Your Event');
    setBtnLink('/booking');
    setIsActive(true);
    setSelectedFile(null);
    setCurrentImageUrl('');
    setFormOpen(true);
  };

  const openEditForm = (slide) => {
    setEditingId(slide.id);
    setTitle(slide.title || '');
    setSubtitle(slide.subtitle || '');
    setDescription(slide.description || '');
    setBtnText(slide.btnText || '');
    setBtnLink(slide.btnLink || '');
    setIsActive(slide.isActive !== false);
    setSelectedFile(null);
    setCurrentImageUrl(slide.imageUrl || '');
    setFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Block files exceeding 3MB
    if (file.size > 3 * 1024 * 1024) {
      toast.error('File size exceeds the 3MB limit. Please upload a smaller image.');
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !currentImageUrl) {
      toast.error('Please upload a slide background image.');
      return;
    }

    setSaving(true);
    let imageUrl = currentImageUrl;

    try {
      // 1. Process and upload image if a new one is selected
      if (selectedFile) {
        toast.loading('Compressing slide image...', { id: 'slideUpload' });
        const compressed = await compressImage(selectedFile, 1920, 1080, 0.75);
        
        // Final verification that compressed file is under 300KB
        if (compressed.size > 350 * 1024) {
          toast.loading('Applying extra compression...', { id: 'slideUpload' });
          // Force lower quality for large images
          const extraCompressed = await compressImage(selectedFile, 1600, 900, 0.6);
          imageUrl = await uploadFile(extraCompressed, `heroSlides/${Date.now()}_${selectedFile.name}`);
        } else {
          imageUrl = await uploadFile(compressed, `heroSlides/${Date.now()}_${selectedFile.name}`);
        }
      }

      const slideData = {
        title,
        subtitle,
        description,
        btnText,
        btnLink,
        isActive,
        imageUrl,
        displayOrder: editingId ? (slides.find(s => s.id === editingId)?.displayOrder || 1) : (slides.length + 1)
      };

      toast.loading(editingId ? 'Updating slide...' : 'Creating slide...', { id: 'slideUpload' });

      if (editingId) {
        await updateHeroSlide(editingId, slideData);
        toast.success('Hero slide updated successfully!', { id: 'slideUpload' });
      } else {
        await createHeroSlide(slideData);
        toast.success('New hero slide created!', { id: 'slideUpload' });
      }

      setFormOpen(false);
    } catch (error) {
      console.error('Slide save error:', error);
      toast.error('Failed to save slide configurations.', { id: 'slideUpload' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero slide?')) return;
    try {
      await deleteHeroSlide(id);
      toast.success('Slide deleted from database.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete slide.');
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      await updateHeroSlide(slide.id, { isActive: !slide.isActive });
      toast.success(`Slide set to ${!slide.isActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to toggle active status.');
    }
  };

  const handleMove = async (index, direction) => {
    const updated = [...slides];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    // Swap elements
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setSlides(updated);
    try {
      await reorderHeroSlides(updated);
      toast.success('Slides reordered successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save updated sorting order.');
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-gold">Home Hero Slideshow</h1>
            <p className="font-body text-xs text-champagne/60 mt-1">Manage dynamic autoplaying slides on your website landing hero</p>
          </div>
          <Button onClick={openAddForm} className="px-4.5 py-2 text-xs uppercase font-bold tracking-widest flex items-center">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Slide</span>
          </Button>
        </div>

        {/* Form Modal/Section */}
        {formOpen && (
          <Card className="p-6 border-gold/25 relative animate-fadeIn" hoverEffect={false}>
            <button 
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 text-champagne/50 hover:text-gold cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-gold font-bold text-sm border-b border-white/5 pb-2 mb-6">
              {editingId ? 'Edit Hero Slide Configurations' : 'Add New Landing Slide'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Slide Main Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Creating Royal Celebrations"
                  required
                />
                <Input
                  label="Subtitle Tag Badge"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. #1 Event Planner in Vijayawada"
                />
              </div>

              <Input
                label="Slide Brief Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description about this slide tier..."
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Button CTA Text"
                  value={btnText}
                  onChange={(e) => setBtnText(e.target.value)}
                  placeholder="e.g. Book Your Event"
                />
                <Input
                  label="Button Destination Link"
                  value={btnLink}
                  onChange={(e) => setBtnLink(e.target.value)}
                  placeholder="e.g. /booking"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Image upload */}
                <div className="space-y-2">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                    Background Image (Max 3MB, Compressed to 300KB)
                  </span>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center justify-center border border-white/10 hover:border-gold/30 rounded-lg p-3 bg-white/5 cursor-pointer text-xs text-champagne/80 font-body transition-colors">
                      <ImageIcon className="w-4 h-4 mr-2 text-gold" />
                      <span>Upload Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </label>
                    {selectedFile && (
                      <span className="font-mono text-[10px] text-success font-semibold truncate max-w-40">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center space-x-3">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                    Slide Active Status:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="text-gold focus:outline-none cursor-pointer"
                  >
                    {isActive ? (
                      <ToggleRight className="w-8 h-8 text-success" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-champagne/40" />
                    )}
                  </button>
                </div>
              </div>

              {currentImageUrl && (
                <div className="pt-2">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold mb-2">
                    Current Loaded Preview:
                  </span>
                  <img 
                    src={currentImageUrl} 
                    alt="Current preview" 
                    className="h-28 w-56 rounded-lg object-cover border border-white/10" 
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <Button 
                  type="button" 
                  onClick={() => setFormOpen(false)} 
                  variant="outline" 
                  className="px-6 py-2 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving} 
                  className="px-8 py-2 text-xs font-bold uppercase tracking-widest"
                >
                  {saving ? 'Saving...' : 'Save Slide'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Slides list */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : slides.length === 0 ? (
          <Card className="p-8 text-center" hoverEffect={false}>
            <p className="font-body text-xs text-champagne/50">No slides configured. Default fallbacks will show on public site.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <Card key={slide.id} className="p-4 bg-white/5 border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4" hoverEffect={false}>
                <div className="flex items-center space-x-4">
                  {/* Thumbnail */}
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title} 
                    className="h-14 w-24 rounded-md object-cover border border-white/10 shrink-0" 
                  />
                  <div className="text-left space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-display font-bold text-sm text-champagne truncate">{slide.title}</span>
                      <Badge status={slide.isActive !== false ? 'success' : 'warning'}>
                        {slide.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {slide.subtitle && (
                      <p className="font-body text-[10px] text-gold/80 uppercase tracking-widest">{slide.subtitle}</p>
                    )}
                    <p className="font-body text-xs text-champagne/60 line-clamp-1 max-w-xl">{slide.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-auto">
                  {/* Sorting actions */}
                  <button
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-gold hover:text-gold disabled:opacity-20 cursor-pointer"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 1)}
                    disabled={index === slides.length - 1}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-gold hover:text-gold disabled:opacity-20 cursor-pointer"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-gold hover:text-gold cursor-pointer"
                    title="Toggle Active Status"
                  >
                    {slide.isActive !== false ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4 text-champagne/40" />}
                  </button>

                  {/* Edit/Delete */}
                  <button
                    onClick={() => openEditForm(slide)}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-gold hover:text-gold cursor-pointer"
                    title="Edit Slide"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-danger hover:text-danger cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminHeroSliderPage;
