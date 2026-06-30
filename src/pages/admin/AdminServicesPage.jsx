// src/pages/admin/AdminServicesPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { subscribeServicesCatalog, createServiceItem, updateServiceItem, deleteServiceItem, reorderServiceItems } from '../../services/servicesCatalogService';
import { uploadFile } from '../../services/storageService';
import { compressImage } from '../../utils/imageCompressor';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, ToggleLeft, ToggleRight, X, Image as ImageIcon, Star } from 'lucide-react';

const CATEGORIES = [
  'Stage Decor',
  'Catering & Dining',
  'Media & Coverage',
  'Sound & Lights',
  'Logistics & Coordination',
  'Event Specialties'
];

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Stage Decor');
  const [description, setDescription] = useState('');
  const [inclusionInput, setInclusionInput] = useState('');
  const [inclusions, setInclusions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeServicesCatalog(
      (data) => {
        setServices(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error('Failed to load services catalog.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setName('');
    setCategory('Stage Decor');
    setDescription('');
    setInclusionInput('');
    setInclusions([]);
    setSelectedFile(null);
    setCurrentImageUrl('');
    setIsActive(true);
    setIsFeatured(false);
    setFormOpen(true);
  };

  const openEditForm = (srv) => {
    setEditingId(srv.id);
    setName(srv.name || '');
    setCategory(srv.category || 'Stage Decor');
    setDescription(srv.description || '');
    setInclusionInput('');
    setInclusions(srv.inclusions || []);
    setSelectedFile(null);
    setCurrentImageUrl(srv.imageUrl || '');
    setIsActive(srv.isActive !== false);
    setIsFeatured(!!srv.isFeatured);
    setFormOpen(true);
  };

  const handleAddInclusion = () => {
    if (!inclusionInput.trim()) return;
    setInclusions(prev => [...prev, inclusionInput.trim()]);
    setInclusionInput('');
  };

  const handleRemoveInclusion = (idx) => {
    setInclusions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error('File size exceeds the 3MB limit.');
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !currentImageUrl) {
      toast.error('Please upload a cover image.');
      return;
    }

    setSaving(true);
    let imageUrl = currentImageUrl;

    try {
      if (selectedFile) {
        toast.loading('Compressing cover image...', { id: 'serviceUpload' });
        const compressed = await compressImage(selectedFile, 800, 600, 0.75); // catalog previews can be smaller resolution
        imageUrl = await uploadFile(compressed, `services/${Date.now()}_${selectedFile.name}`);
      }

      const srvData = {
        name,
        category,
        description,
        inclusions,
        isActive,
        isFeatured,
        imageUrl,
        displayOrder: editingId ? (services.find(s => s.id === editingId)?.displayOrder || 1) : (services.length + 1)
      };

      toast.loading(editingId ? 'Updating service...' : 'Creating service...', { id: 'serviceUpload' });

      if (editingId) {
        await updateServiceItem(editingId, srvData);
        toast.success('Service updated successfully!', { id: 'serviceUpload' });
      } else {
        await createServiceItem(srvData);
        toast.success('New service created successfully!', { id: 'serviceUpload' });
      }

      setFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save service.', { id: 'serviceUpload' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteServiceItem(id);
      toast.success('Service deleted.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete service.');
    }
  };

  const handleToggleStatus = async (srv, field) => {
    try {
      const updatedVal = !srv[field];
      await updateServiceItem(srv.id, { [field]: updatedVal });
      toast.success(`Service set to ${updatedVal ? 'Active/Featured' : 'Inactive/Standard'}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status.');
    }
  };

  const handleMove = async (index, direction) => {
    const updated = [...services];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setServices(updated);
    try {
      await reorderServiceItems(updated);
      toast.success('Services catalog reordered.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save reordering.');
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-gold">Services Catalog Manager</h1>
            <p className="font-body text-xs text-champagne/60 mt-1">Configure your public alternating blocks services page and homepage featured icons</p>
          </div>
          <Button onClick={openAddForm} className="px-4.5 py-2 text-xs uppercase font-bold tracking-widest flex items-center">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Service</span>
          </Button>
        </div>

        {/* Add/Edit Form Card */}
        {formOpen && (
          <Card className="p-6 border-gold/25 relative animate-fadeIn" hoverEffect={false}>
            <button onClick={() => setFormOpen(false)} className="absolute top-4 right-4 text-champagne/50 hover:text-gold cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-gold font-bold text-sm border-b border-white/5 pb-2 mb-6">
              {editingId ? 'Edit Service Details' : 'Add New Service Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Service Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Traditional Mandapam Decor"
                  required
                />
                <div className="space-y-2">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                    Category Group
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full input-premium py-3 px-4 text-xs font-body"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                  Service Description
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown explaining what this service delivers..."
                  rows={3}
                  className="w-full input-premium py-3 px-4 text-xs font-body"
                  required
                />
              </div>

              {/* Inclusions array builder */}
              <div className="space-y-2">
                <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                  Package Inclusions & Bullet Points
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inclusionInput}
                    onChange={(e) => setInclusionInput(e.target.value)}
                    placeholder="e.g. Free delivery within city limits"
                    className="input-premium py-2 px-3 text-xs flex-1"
                  />
                  <Button type="button" onClick={handleAddInclusion} className="px-4 py-2 text-xs">
                    Add
                  </Button>
                </div>
                {inclusions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {inclusions.map((inc, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-white/5 border border-white/10 text-champagne text-[10px] font-body">
                        <span>{inc}</span>
                        <button type="button" onClick={() => handleRemoveInclusion(i)} className="ml-1.5 text-danger hover:text-white cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* File upload */}
                <div className="space-y-2">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                    Cover Preview Graphic
                  </span>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center justify-center border border-white/10 hover:border-gold/30 rounded-lg p-3 bg-white/5 cursor-pointer text-xs text-champagne/80 font-body transition-colors">
                      <ImageIcon className="w-4 h-4 mr-2 text-gold" />
                      <span>Upload cover</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    {selectedFile && (
                      <span className="font-mono text-[10px] text-success truncate max-w-40 font-semibold">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center space-x-3">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                    Active Catalog:
                  </span>
                  <button type="button" onClick={() => setIsActive(!isActive)} className="text-gold cursor-pointer">
                    {isActive ? <ToggleRight className="w-8 h-8 text-success" /> : <ToggleLeft className="w-8 h-8 text-champagne/40" />}
                  </button>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center space-x-3">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                    Homepage Featured:
                  </span>
                  <button type="button" onClick={() => setIsFeatured(!isFeatured)} className="text-gold cursor-pointer">
                    {isFeatured ? <ToggleRight className="w-8 h-8 text-gold" /> : <ToggleLeft className="w-8 h-8 text-champagne/40" />}
                  </button>
                </div>
              </div>

              {currentImageUrl && (
                <div className="pt-2">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold mb-2">
                    Current Loaded Preview:
                  </span>
                  <img src={currentImageUrl} alt="Current preview" className="h-28 w-44 rounded-lg object-cover border border-white/10" />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <Button type="button" onClick={() => setFormOpen(false)} variant="outline" className="px-6 py-2 text-xs font-semibold">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="px-8 py-2 text-xs font-bold uppercase tracking-widest">
                  {saving ? 'Saving...' : 'Save Service'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Catalog List */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : services.length === 0 ? (
          <Card className="p-8 text-center" hoverEffect={false}>
            <p className="font-body text-xs text-champagne/50">No service catalog items found. Click 'Add Service' to seed items.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {services.map((srv, index) => (
              <Card key={srv.id} className="p-4 bg-white/5 border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4" hoverEffect={false}>
                <div className="flex items-center space-x-4">
                  <img src={srv.imageUrl} alt={srv.name} className="h-14 w-20 rounded-md object-cover border border-white/10 shrink-0" />
                  <div className="text-left space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-display font-bold text-sm text-champagne truncate">{srv.name}</span>
                      <Badge status={srv.isActive !== false ? 'success' : 'warning'}>
                        {srv.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                      {srv.isFeatured && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] bg-gold/10 border border-gold/20 text-gold uppercase tracking-wider font-semibold">
                          <Star className="w-2.5 h-2.5 fill-gold mr-0.5" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="font-body text-[10px] text-gold/80 uppercase tracking-widest font-semibold">{srv.category}</p>
                    <p className="font-body text-xs text-champagne/60 line-clamp-1 max-w-xl">{srv.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-auto">
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
                    disabled={index === services.length - 1}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-gold hover:text-gold disabled:opacity-20 cursor-pointer"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(srv, 'isActive')}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-gold cursor-pointer"
                    title="Toggle Active status"
                  >
                    {srv.isActive !== false ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4 text-champagne/40" />}
                  </button>
                  <button
                    onClick={() => openEditForm(srv)}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-gold hover:text-gold cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id)}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-danger hover:text-danger cursor-pointer"
                    title="Delete Service"
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

export default AdminServicesPage;
