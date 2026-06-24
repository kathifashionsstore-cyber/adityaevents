// src/pages/admin/AdminFAQPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useFirestore } from '../../hooks/useFirestore';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import { PlusCircle, HelpCircle, Trash } from 'lucide-react';

const AdminFAQPage = () => {
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  
  const { deleteDocument } = useFirestore('faqs');

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'faqs'));
      const list = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setFaqs(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!question || !answer) {
      toast.error('Question and answer are required.');
      return;
    }

    try {
      const id = 'FAQ_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      await setDoc(doc(db, 'faqs', id), {
        id,
        question,
        answer,
        createdAt: new Date().toISOString()
      });
      toast.success('FAQ logged successfully!');
      setQuestion('');
      setAnswer('');
      setShowAddForm(false);
      fetchFaqs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create FAQ.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteDocument(id);
      toast.success('FAQ deleted.');
      fetchFaqs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete FAQ.');
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left animate-fadeIn">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-champagne text-sm font-semibold tracking-wide uppercase">
            Manage FAQs Accordion
          </h3>
          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="flex items-center space-x-1 px-4 py-1.5 bg-white/5 border border-gold/20 rounded-lg text-xs font-semibold text-gold hover:bg-gold/15 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            <span>{showAddForm ? 'Close Form' : 'Add FAQ'}</span>
          </button>
        </div>

        {/* Form */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-4 max-w-xl animate-scaleIn">
            <h4 className="font-display text-gold text-xs font-bold uppercase tracking-wider">New FAQ Setup</h4>
            <div className="space-y-3 font-body text-xs text-champagne/80">
              <Input
                label="Question Topic"
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Do you support drone shoots?"
                required
              />
              <div className="flex flex-col space-y-1">
                <label className="font-semibold">Answer Explanation</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="e.g. Yes, drone footage can be selected as a media addon..."
                  rows={4}
                  className="input-premium resize-none"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="px-6 py-2.5 text-xs font-semibold">
              Create FAQ
            </Button>
          </form>
        )}

        {/* List */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center text-champagne/50 py-12">No FAQs in database.</div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="p-6 relative flex justify-between items-start" hoverEffect={false}>
                <div className="space-y-2 text-left">
                  <h4 className="font-display text-champagne text-sm font-semibold flex items-center">
                    <HelpCircle className="w-4 h-4 text-gold mr-2 shrink-0" />
                    <span>{faq.question}</span>
                  </h4>
                  <p className="font-body text-xs text-champagne/70 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-1.5 bg-danger/10 border border-danger/20 text-danger rounded-lg hover:bg-danger hover:text-white transition-all ml-4 shrink-0 cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default AdminFAQPage;
