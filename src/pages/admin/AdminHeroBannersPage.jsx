import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import ImageUploadWithCompressor from '../../components/common/ImageUploadWithCompressor';
import {
  createHeroBanner,
  deleteHeroBanner,
  reorderHeroBanners,
  subscribeHeroBanners,
  updateHeroBanner,
} from '../../services/heroBannerService';
import {
  HERO_BANNER_PAGES,
  HERO_BANNER_STORAGE_ROOT,
  getHeroBannerPage,
} from '../../utils/heroBannerPages';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Layers,
  Save,
  Trash2,
  UploadCloud,
  X,
  Loader2,
} from 'lucide-react';

const sanitizeFileName = (fileName) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');

const getTitleFromFile = (fileName) => fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');

const AdminHeroBannersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page') || 'home';
  const selectedPage = HERO_BANNER_PAGES.some((page) => page.key === pageParam)
    ? pageParam
    : 'home';
  const selectedPageConfig = getHeroBannerPage(selectedPage);

  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [saving, setSaving] = useState(false);
  const [draggingId, setDraggingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeHeroBanners(
      selectedPage,
      { activeOnly: false },
      (items) => {
        setBanners(items);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error('Failed to load hero banners.');
        setBanners([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [selectedPage]);

  const nextDisplayOrder = useMemo(() => {
    const maxOrder = banners.reduce(
      (max, banner) => Math.max(max, Number(banner.displayOrder) || 0),
      0
    );
    return maxOrder + 1;
  }, [banners]);

  const activeCount = banners.filter((banner) => banner.isActive !== false).length;

  const resetBannerForm = () => {
    setEditingBanner(null);
    setTitle('');
    setIsActive(true);
    setUploadedUrls([]);
  };

  const openCreateForm = () => {
    resetBannerForm();
    setFormOpen(true);
  };

  const openEditForm = (banner) => {
    setEditingBanner(banner);
    setTitle(banner.title || '');
    setIsActive(banner.isActive !== false);
    setUploadedUrls(banner.imageUrl ? [banner.imageUrl] : []);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    resetBannerForm();
  };

  const handlePageSelect = (pageKey) => {
    setSearchParams({ page: pageKey });
    closeForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const cleanTitle = title.trim();

      if (editingBanner) {
        if (!cleanTitle) {
          toast.error('Banner title is required.');
          return;
        }

        const updatePayload = {
          title: cleanTitle,
          isActive,
        };

        if (uploadedUrls[0]) {
          updatePayload.imageUrl = uploadedUrls[0];
          updatePayload.storagePath = '';
        }

        await updateHeroBanner(editingBanner.id, updatePayload);
        toast.success('Hero banner updated.');
      } else {
        if (uploadedUrls.length === 0) {
          toast.error('Choose or upload at least one banner image.');
          return;
        }

        for (let index = 0; index < uploadedUrls.length; index += 1) {
          const url = uploadedUrls[index];
          const bannerTitle =
            uploadedUrls.length > 1
              ? `${cleanTitle || selectedPageConfig.label} ${index + 1}`
              : cleanTitle || `${selectedPageConfig.label} Hero`;

          await createHeroBanner({
            page: selectedPage,
            title: bannerTitle,
            imageUrl: url,
            storagePath: '',
            fileName: `banner_${index + 1}.webp`,
            isActive,
            displayOrder: nextDisplayOrder + index,
          });
        }

        toast.success(
          uploadedUrls.length === 1
            ? 'Hero banner uploaded.'
            : `${uploadedUrls.length} hero banners uploaded.`
        );
      }

      closeForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save hero banner.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (banner) => {
    if (!window.confirm(`Delete "${banner.title || 'this banner'}"?`)) {
      return;
    }

    try {
      await deleteHeroBanner(banner);
      toast.success('Hero banner deleted.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete hero banner.');
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await updateHeroBanner(banner.id, {
        isActive: banner.isActive === false,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update banner status.');
    }
  };

  const handleDrop = async (targetId) => {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      return;
    }

    const sourceIndex = banners.findIndex((banner) => banner.id === draggingId);
    const targetIndex = banners.findIndex((banner) => banner.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggingId(null);
      return;
    }

    const nextBanners = [...banners];
    const [movedBanner] = nextBanners.splice(sourceIndex, 1);
    nextBanners.splice(targetIndex, 0, movedBanner);

    const orderedBanners = nextBanners.map((banner, index) => ({
      ...banner,
      displayOrder: index + 1,
    }));

    setBanners(orderedBanners);
    setDraggingId(null);

    try {
      await reorderHeroBanners(orderedBanners);
      toast.success('Banner order updated.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save banner order.');
    }
  };

  const previewItems =
    uploadedUrls.length > 0
      ? uploadedUrls.map((url, index) => ({
          src: url,
          label: `Uploaded Image ${index + 1}`,
        }))
      : editingBanner
        ? [{ src: editingBanner.imageUrl, label: editingBanner.title || 'Current banner' }]
        : [];

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              Content Management
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-champagne">
              Hero Banners
            </h3>
            <p className="mt-2 max-w-2xl font-body text-xs leading-relaxed text-champagne/65">
              Manage independent hero carousel images for every public page.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold/20"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Upload Hero Banner
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
          <aside className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
              <Layers className="h-4 w-4 text-gold" />
              <div>
                <p className="font-body text-[10px] font-bold uppercase tracking-widest text-gold">
                  Hero Banners
                </p>
                <p className="font-body text-[10px] text-champagne/50">
                  Page-wise sections
                </p>
              </div>
            </div>

            <div className="space-y-1">
              {HERO_BANNER_PAGES.map((page) => (
                <button
                  key={page.key}
                  type="button"
                  onClick={() => handlePageSelect(page.key)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-body text-xs transition-colors ${
                    selectedPage === page.key
                      ? 'bg-gold/15 text-gold'
                      : 'text-champagne/70 hover:bg-white/5 hover:text-gold'
                  }`}
                >
                  <span>{page.label}</span>
                  {selectedPage === page.key && <CheckCircle2 className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            {formOpen && (
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-gold/15 bg-white/5 p-5 shadow-lg"
              >
                <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h4 className="font-display text-base font-bold text-gold">
                      {editingBanner ? 'Edit Hero Banner' : `Upload to ${selectedPageConfig.label}`}
                    </h4>
                    <p className="mt-1 font-body text-[11px] text-champagne/55">
                      Preview the image before saving it to this page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-lg border border-white/10 p-2 text-champagne/70 transition-colors hover:border-gold/30 hover:text-gold"
                    aria-label="Close banner form"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label className="font-body text-xs font-semibold tracking-wider text-champagne/80">
                        Banner Title {editingBanner && <span className="text-danger">*</span>}
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Welcome Banner"
                        className="input-premium"
                        required={!!editingBanner}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="font-body text-xs font-semibold tracking-wider text-champagne/80">
                        {editingBanner ? 'Replacement Image' : 'Hero Banner Images'}
                      </label>
                      <ImageUploadWithCompressor
                        onUploadSuccess={(urlsOrUrl) => {
                          if (Array.isArray(urlsOrUrl)) {
                            setUploadedUrls(urlsOrUrl);
                          } else {
                            setUploadedUrls(urlsOrUrl ? [urlsOrUrl] : []);
                          }
                        }}
                        multiple={!editingBanner}
                        currentImageUrl={editingBanner ? (uploadedUrls[0] || editingBanner.imageUrl) : ''}
                      />
                    </div>
 
                    <label className="inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-xs text-champagne/75">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(event) => setIsActive(event.target.checked)}
                        className="h-4 w-4 accent-[#D4AF37]"
                      />
                      Enabled on frontend carousel
                    </label>
 
                    {saving && (
                      <div className="rounded-lg border border-white/10 bg-charcoal/40 p-3">
                        <div className="flex items-center space-x-2 text-gold text-xs font-body font-semibold">
                          <Loader2 className="w-4 h-4 animate-spin text-gold" />
                          <span>Saving banner configurations to database...</span>
                        </div>
                      </div>
                    )}
 
                    <Button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 text-xs font-semibold"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {editingBanner ? 'Save Changes' : 'Save Banner'}
                    </Button>
                  </div>

                  <div>
                    <p className="mb-2 font-body text-[10px] font-bold uppercase tracking-widest text-gold">
                      Preview
                    </p>
                    <div className="space-y-3">
                      {previewItems.length === 0 ? (
                        <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-white/10 bg-charcoal/40 text-center font-body text-[11px] text-champagne/45">
                          No image selected
                        </div>
                      ) : (
                        previewItems.map((item, index) => (
                          <div
                            key={`${item.src}-${index}`}
                            className="overflow-hidden rounded-xl border border-white/10 bg-charcoal/40"
                          >
                            <img
                              src={item.src}
                              alt={item.label}
                              className="aspect-[4/3] w-full object-cover"
                            />
                            <p className="truncate px-3 py-2 font-body text-[10px] text-champagne/60">
                              {item.label}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}

            <section className="rounded-xl border border-white/10 bg-white/5">
              <div className="flex flex-col gap-2 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-display text-lg font-bold text-champagne">
                    {selectedPageConfig.label}
                  </h4>
                  <p className="font-body text-[11px] text-champagne/55">
                    {banners.length} total banners, {activeCount} active
                  </p>
                </div>
                <p className="font-body text-[10px] uppercase tracking-widest text-gold/80">
                  Drag rows to reorder
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-14">
                  <Spinner size="lg" />
                </div>
              ) : banners.length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <p className="font-display text-base font-semibold text-champagne">
                    No hero banners for {selectedPageConfig.label}.
                  </p>
                  <p className="mt-2 font-body text-xs text-champagne/55">
                    Upload any number of images for this page.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      draggable
                      onDragStart={() => setDraggingId(banner.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleDrop(banner.id)}
                      className={`grid gap-4 p-4 transition-colors sm:grid-cols-[auto_96px_1fr_auto] sm:items-center ${
                        draggingId === banner.id ? 'bg-gold/10' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="hidden cursor-grab text-champagne/35 sm:block">
                        <GripVertical className="h-5 w-5" />
                      </div>

                      <img
                        src={banner.imageUrl}
                        alt={banner.title || 'Hero banner'}
                        className="aspect-[16/10] w-full rounded-lg border border-white/10 object-cover sm:w-24"
                      />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="truncate font-display text-sm font-bold text-champagne">
                            {banner.title || 'Untitled Banner'}
                          </h5>
                          <span
                            className={`rounded-full px-2 py-0.5 font-body text-[9px] font-bold uppercase tracking-widest ${
                              banner.isActive === false
                                ? 'bg-white/5 text-champagne/45'
                                : 'bg-success/10 text-success'
                            }`}
                          >
                            {banner.isActive === false ? 'Disabled' : 'Active'}
                          </span>
                        </div>
                        <p className="mt-1 font-body text-[10px] text-champagne/50">
                          Page: {selectedPageConfig.label} | Order: {banner.displayOrder || 1}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(banner)}
                          className="rounded-lg border border-white/10 p-2 text-champagne/70 transition-colors hover:border-gold/30 hover:text-gold"
                          title={banner.isActive === false ? 'Enable banner' : 'Disable banner'}
                        >
                          {banner.isActive === false ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditForm(banner)}
                          className="rounded-lg border border-white/10 p-2 text-champagne/70 transition-colors hover:border-gold/30 hover:text-gold"
                          title="Edit banner"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(banner)}
                          className="rounded-lg border border-danger/20 p-2 text-danger transition-colors hover:bg-danger hover:text-white"
                          title="Delete banner"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminHeroBannersPage;
