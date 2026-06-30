// src/pages/admin/AdminGalleryPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import ImageUploadWithCompressor from '../../components/common/ImageUploadWithCompressor';
import { useStorage } from '../../hooks/useStorage';
import { useFirestore } from '../../hooks/useFirestore';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import { PlusCircle, Image, Trash } from 'lucide-react';

const AdminGalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('wedding');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const { uploadFileWithProgress, progress, uploading } = useStorage();
  const { deleteDocument } = useFirestore('gallery');

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'gallery'));
      const list = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPhotos(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select and optimize an image first.');
      return;
    }
    if (!caption) {
      toast.error('Image caption is required.');
      return;
    }

    try {
      // 1. Upload the pre-compressed blob to storage
      // Use jpeg suffix since output of compressor is image/jpeg blob
      const path = `gallery/${Date.now()}_image.jpg`;
      const downloadUrl = await uploadFileWithProgress(selectedFile, path);

      // 2. Save document to firestore
      const docId = 'IMG_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      await setDoc(doc(db, 'gallery', docId), {
        id: docId,
        src: downloadUrl,
        caption,
        category,
        createdAt: new Date().toISOString()
      });

      toast.success('Gallery photo uploaded successfully!');
      setCaption('');
      setSelectedFile(null);
      setShowAddForm(false);
      fetchPhotos();
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image.');
    }
  };

  const handleDelete = async (photo) => {
    if (!window.confirm("Are you sure you want to delete this photo from the gallery?")) return;
    try {
      await deleteDocument(photo.id);
      toast.success("Image deleted.");
      fetchPhotos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image.");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-champagne text-sm font-semibold tracking-wide uppercase">
            Event Gallery Management
          </h3>
          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="flex items-center space-x-1 px-4 py-1.5 bg-white/5 border border-gold/20 rounded-lg text-xs font-semibold text-gold hover:bg-gold/15 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            <span>{showAddForm ? 'Close Form' : 'Upload Image'}</span>
          </button>
        </div>

        {/* Upload Form */}
        {showAddForm && (
          <form onSubmit={handleUpload} className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-4 max-w-xl animate-scaleIn">
            <h4 className="font-display text-gold text-xs font-bold uppercase tracking-wider">Upload New Event Shot</h4>
            <div className="space-y-4 font-body text-xs text-champagne/80">
              <div className="flex flex-col space-y-1">
                <label className="font-semibold mb-1">Select and Optimize Image</label>
                <ImageUploadWithCompressor 
                  onUploadReady={(blob, name) => {
                    setSelectedFile(blob);
                    if (name && !caption) {
                      // Suggest caption from filename
                      const cleanName = name.split('.')[0].replace(/[-_]/g, ' ');
                      setCaption(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
                    }
                  }}
                  multiple={false}
                />
              </div>
              <Input
                label="Image Caption / Description"
                name="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Traditional stage setup Vijayawada"
                required
              />
              <Select
                label="Gallery Category / Folder"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'wedding', label: 'Wedding' },
                  { value: 'birthday', label: 'Birthdays' },
                  { value: 'engagement', label: 'Engagement' },
                  { value: 'corporate', label: 'Corporate' },
                  { value: 'catering', label: 'Catering' },
                  { value: 'receptions', label: 'Receptions' },
                  { value: 'mehndi', label: 'Mehndi Night' },
                  { value: 'dj-events', label: 'DJ Events' },
                  { value: 'photography', label: 'Photography' },
                  { value: 'stage-decor', label: 'Stage Decor' },
                  { value: 'general', label: 'General / Other' },
                ]}
              />
            </div>
            {uploading && (
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-gold h-full" style={{ width: `${progress}%` }} />
              </div>
            )}
            <Button type="submit" disabled={uploading || !selectedFile} className="px-6 py-2.5 text-xs font-semibold">
              {uploading ? `Uploading ${progress}%` : 'Save to Gallery'}
            </Button>
          </form>
        )}

        {/* List */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center text-champagne/50 py-12">No photos in database.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {photos.map((p) => (
              <div key={p.id} className="relative rounded-lg overflow-hidden border border-white/5 bg-white/5 aspect-square group shadow-lg">
                <img src={p.src} alt={p.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <span className="text-[9px] text-gold uppercase tracking-wider font-semibold self-start bg-velvet/80 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                  <div className="flex items-center justify-between w-full mt-auto">
                    <p className="text-[10px] text-champagne font-bold truncate max-w-24 text-left">{p.caption}</p>
                    <button
                      onClick={() => handleDelete(p)}
                      className="p-1 bg-danger text-white rounded hover:bg-danger/80 transition-colors cursor-pointer"
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
