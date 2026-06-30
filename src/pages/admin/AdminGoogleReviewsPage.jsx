// src/pages/admin/AdminGoogleReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { collection, addDoc, setDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Plus, Trash2, Edit2, X, Star, Save } from 'lucide-react';

const AdminGoogleReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Singleton overall summary state
  const [overallRating, setOverallRating] = useState('4.9');
  const [totalCount, setTotalCount] = useState('120');

  // Form fields for individual reviews
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [relativeTimeDescription, setRelativeTimeDescription] = useState('a week ago');
  const [authorPhotoUrl, setAuthorPhotoUrl] = useState('');

  useEffect(() => {
    // 1. Subscribe to reviews collection
    const unsubReviews = onSnapshot(
      collection(db, 'googleReviews'),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error('Failed to load Google reviews.');
        setLoading(false);
      }
    );

    // 2. Subscribe to summary singleton
    const unsubSummary = onSnapshot(
      doc(db, 'siteConfig', 'googleReviewsSummary'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setOverallRating(data.averageRating || '4.9');
          setTotalCount(data.totalReviewsCount || '120');
        }
      }
    );

    return () => {
      unsubReviews();
      unsubSummary();
    };
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setAuthorName('');
    setRating(5);
    setText('');
    setRelativeTimeDescription('a week ago');
    setAuthorPhotoUrl('');
    setFormOpen(true);
  };

  const openEditForm = (review) => {
    setEditingId(review.id);
    setAuthorName(review.authorName || '');
    setRating(review.rating || 5);
    setText(review.text || '');
    setRelativeTimeDescription(review.relativeTimeDescription || 'a week ago');
    setAuthorPhotoUrl(review.authorPhotoUrl || '');
    setFormOpen(true);
  };

  const handleSaveSummary = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'siteConfig', 'googleReviewsSummary'), {
        averageRating: overallRating,
        totalReviewsCount: totalCount
      });
      toast.success('Overall ratings summary updated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update ratings summary.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!authorName || !text) {
      toast.error('Name and Review text are required.');
      return;
    }

    setSaving(true);
    const payload = {
      authorName,
      rating: Number(rating),
      text,
      relativeTimeDescription,
      authorPhotoUrl: authorPhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`,
      createdAt: new Date().toISOString()
    };

    try {
      if (editingId) {
        await setDoc(doc(db, 'googleReviews', editingId), payload, { merge: true });
        toast.success('Review updated!');
      } else {
        await addDoc(collection(db, 'googleReviews'), payload);
        toast.success('Review curated!');
      }
      setFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this curated review?')) return;
    try {
      await deleteDoc(doc(db, 'googleReviews', id));
      toast.success('Review deleted.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete review.');
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-12 text-left">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-gold">Google Reviews Curator</h1>
            <p className="font-body text-xs text-champagne/60 mt-1">Configure your public landing rating badge and curate featured review cards</p>
          </div>
          <Button onClick={openAddForm} className="px-4.5 py-2 text-xs uppercase font-bold tracking-widest flex items-center">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Curate Review</span>
          </Button>
        </div>

        {/* Singleton Summary Configuration */}
        <Card className="p-6 bg-white/5 border-white/5" hoverEffect={false}>
          <h3 className="font-display text-gold font-bold text-sm border-b border-white/5 pb-2 mb-4">
            Google Maps Rating Summary Badge
          </h3>
          <form onSubmit={handleSaveSummary} className="flex flex-col sm:flex-row items-end gap-4">
            <Input
              label="Average Rating Star Value"
              value={overallRating}
              onChange={(e) => setOverallRating(e.target.value)}
              placeholder="e.g. 4.9"
              required
            />
            <Input
              label="Total Reviews Counter"
              value={totalCount}
              onChange={(e) => setTotalCount(e.target.value)}
              placeholder="e.g. 120+"
              required
            />
            <Button type="submit" className="w-full sm:w-auto h-[48px] px-8 text-xs uppercase font-bold tracking-widest flex items-center justify-center shrink-0">
              <Save className="w-4 h-4 mr-2" />
              <span>Save Badge</span>
            </Button>
          </form>
        </Card>

        {/* Modal Form */}
        {formOpen && (
          <Card className="p-6 border-gold/25 relative animate-fadeIn" hoverEffect={false}>
            <button onClick={() => setFormOpen(false)} className="absolute top-4 right-4 text-champagne/50 hover:text-gold cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-gold font-bold text-sm border-b border-white/5 pb-2 mb-6">
              {editingId ? 'Edit Curated Review' : 'Curate New Google Review'}
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Author Full Name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
                <Input
                  label="Profile Picture URL (Optional)"
                  value={authorPhotoUrl}
                  onChange={(e) => setAuthorPhotoUrl(e.target.value)}
                  placeholder="e.g. https://domain.com/photo.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                    Review Star Rating (1 to 5)
                  </span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full input-premium py-3 px-4 text-xs"
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Relative Time Description"
                  value={relativeTimeDescription}
                  onChange={(e) => setRelativeTimeDescription(e.target.value)}
                  placeholder="e.g. 2 weeks ago"
                  required
                />
              </div>

              <div className="space-y-2">
                <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest block font-semibold">
                  Review Statement Text
                </span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the Google Maps review message here..."
                  rows={4}
                  className="w-full input-premium py-3 px-4 text-xs font-body"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <Button type="button" onClick={() => setFormOpen(false)} variant="outline" className="px-6 py-2 text-xs font-semibold">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="px-8 py-2 text-xs font-bold uppercase tracking-widest">
                  {saving ? 'Saving...' : 'Curate Review'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Curated reviews list */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : reviews.length === 0 ? (
          <Card className="p-8 text-center" hoverEffect={false}>
            <p className="font-body text-xs text-champagne/50">No curated reviews found. Click 'Curate Review' to add one.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <Card key={rev.id} className="p-6 bg-white/5 border-white/5 flex flex-col justify-between" hoverEffect={false}>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <img src={rev.authorPhotoUrl} alt={rev.authorName} className="w-10 h-10 rounded-full border border-white/10 shrink-0" />
                    <div>
                      <h4 className="font-display font-bold text-champagne text-sm">{rev.authorName}</h4>
                      <span className="text-[10px] text-champagne/50">{rev.relativeTimeDescription}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex text-gold">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold shrink-0" />
                    ))}
                  </div>

                  <p className="font-body text-xs text-champagne/80 leading-relaxed italic line-clamp-3">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-white/5">
                  <button
                    onClick={() => openEditForm(rev)}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-gold hover:text-gold cursor-pointer"
                    title="Edit Review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-champagne hover:border-danger hover:text-danger cursor-pointer"
                    title="Delete Review"
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

export default AdminGoogleReviewsPage;
