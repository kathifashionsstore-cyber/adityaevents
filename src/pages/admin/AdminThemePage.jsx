// src/pages/admin/AdminThemePage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';
import { 
  THEME_PRESETS, seedDefaultTheme, saveActiveTheme, 
  getThemeHistory, hexToRgbaStr 
} from '../../services/themeService';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Palette, History, RotateCcw, AlertTriangle, Check } from 'lucide-react';

const AdminThemePage = () => {
  const { activeThemeData } = useTheme();
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'custom'
  
  // Custom colors form state
  const [customColors, setCustomColors] = useState({
    primary: '#C76D7A',
    secondary: '#EBB4A0',
    background: '#FFFBF7',
    surface: '#FFFFFF',
    darkSection: '#3B2F2F',
    accentGold: '#D4AF37',
    textPrimary: '#2D2D2D',
    textSecondary: '#6B7280',
    success: '#22C55E'
  });

  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, preset: null });

  // Initialize and seed on mount
  useEffect(() => {
    const init = async () => {
      await seedDefaultTheme();
      loadHistory();
    };
    init();
  }, []);

  // Sync custom colors state when active theme data loads
  useEffect(() => {
    if (activeThemeData) {
      setCustomColors({
        primary: activeThemeData.primary || '#C76D7A',
        secondary: activeThemeData.secondary || '#EBB4A0',
        background: activeThemeData.background || '#FFFBF7',
        surface: activeThemeData.surface || '#FFFFFF',
        darkSection: activeThemeData.darkSection || '#3B2F2F',
        accentGold: activeThemeData.accentGold || '#D4AF37',
        textPrimary: activeThemeData.textPrimary || '#2D2D2D',
        textSecondary: activeThemeData.textSecondary || '#6B7280',
        success: activeThemeData.success || '#22C55E'
      });
    }
  }, [activeThemeData]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const history = await getThemeHistory();
      setHistoryList(history);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleApplyPresetClick = (preset) => {
    setConfirmModal({ open: true, preset });
  };

  const confirmApplyPreset = async () => {
    const { preset } = confirmModal;
    if (!preset) return;

    try {
      await saveActiveTheme(preset);
      toast.success(`Theme updated! Preset "${preset.templateName}" is now active.`);
      loadHistory();
      setConfirmModal({ open: false, preset: null });
    } catch (error) {
      console.error(error);
      toast.error('Failed to apply preset theme.');
    }
  };

  const handleCustomColorChange = (key, val) => {
    // Validate hex format slightly
    setCustomColors(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveCustomTheme = async () => {
    try {
      await saveActiveTheme({
        ...customColors,
        templateName: 'Custom'
      });
      toast.success('Custom theme active! Applied successfully.');
      loadHistory();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save custom colors.');
    }
  };

  const handleResetToLastSaved = () => {
    if (activeThemeData) {
      setCustomColors({
        primary: activeThemeData.primary,
        secondary: activeThemeData.secondary,
        background: activeThemeData.background,
        surface: activeThemeData.surface,
        darkSection: activeThemeData.darkSection,
        accentGold: activeThemeData.accentGold,
        textPrimary: activeThemeData.textPrimary,
        textSecondary: activeThemeData.textSecondary,
        success: activeThemeData.success
      });
      toast.success('Restored values to current active configuration.');
    }
  };

  const handleRestoreFromHistory = async (historyItem) => {
    try {
      await saveActiveTheme(historyItem);
      toast.success(`Reverted back to theme snapshot from ${new Date(historyItem.archivedAt).toLocaleDateString('en-IN')}`);
      loadHistory();
    } catch (error) {
      console.error(error);
      toast.error('Failed to restore history snapshot.');
    }
  };

  // WCAG Luminance Contrast Calculations
  const getLuminance = (hex) => {
    if (!hex || typeof hex !== 'string') return 0;
    const cleanHex = hex.replace('#', '');
    let r = 255, g = 255, b = 255;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (hex1, hex2) => {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const bright = Math.max(l1, l2);
    const dark = Math.min(l1, l2);
    return (bright + 0.05) / (dark + 0.05);
  };

  // Contrast evaluations
  const textBgContrast = getContrastRatio(customColors.textPrimary, customColors.background);
  const textSecBgContrast = getContrastRatio(customColors.textSecondary, customColors.background);
  
  const textSurfaceContrast = getContrastRatio(customColors.textPrimary, customColors.surface);
  const textSecSurfaceContrast = getContrastRatio(customColors.textSecondary, customColors.surface);

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-primaryRose">Theme & Appearance</h1>
            <p className="font-body text-xs text-textSecondary mt-1">
              Select built-in style templates or customize hex colors in real time.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border-soft space-x-6 font-body text-xs">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'presets' 
                ? 'border-primaryRose text-primaryRose' 
                : 'border-transparent text-textSecondary hover:text-primaryRose'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Template Presets</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'custom' 
                ? 'border-primaryRose text-primaryRose' 
                : 'border-transparent text-textSecondary hover:text-primaryRose'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Custom Colors Override</span>
          </button>
        </div>

        {/* Tab content 1: Preset gallery */}
        {activeTab === 'presets' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {THEME_PRESETS.map((preset) => {
                const isActive = activeThemeData?.templateName === preset.templateName;
                return (
                  <Card 
                    key={preset.id} 
                    className={`flex flex-col justify-between border transition-all ${
                      isActive ? 'border-primaryRose shadow-md' : 'border-border-soft'
                    }`}
                    hoverEffect={!isActive}
                  >
                    <div>
                      {/* Title & Badge */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display text-sm font-bold text-textPrimary leading-none">
                          {preset.templateName}
                        </h3>
                        {isActive && (
                          <span className="badge-rose text-[8px] tracking-widest uppercase flex items-center py-0.5 px-2 leading-none">
                            <Check className="w-2.5 h-2.5 mr-1" /> Active
                          </span>
                        )}
                      </div>
                      
                      <p className="font-body text-[10px] text-textSecondary leading-normal mb-6">
                        {preset.description}
                      </p>
                      
                      {/* Swatch previews */}
                      <div className="flex space-x-2 mb-6">
                        <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: preset.primary }} title="Primary" />
                        <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: preset.secondary }} title="Secondary" />
                        <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: preset.background }} title="Background" />
                        <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: preset.surface }} title="Surface" />
                        <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: preset.darkSection }} title="Dark Section" />
                        <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: preset.accentGold }} title="Accent Gold" />
                      </div>
                    </div>

                    <Button
                      onClick={() => handleApplyPresetClick(preset)}
                      className={`w-full text-[10px] uppercase font-bold tracking-wider py-2 ${
                        isActive ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isActive}
                    >
                      {isActive ? 'Currently Active' : 'Apply Template'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab content 2: Custom colors override */}
        {activeTab === 'custom' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            {/* Color Pickers Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="p-6 border-border-soft space-y-4">
                <h3 className="font-display text-sm font-bold text-textPrimary border-b border-border-soft pb-2 mb-4">
                  Theme Customization Form
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Color */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-body text-[10px] font-bold text-textPrimary uppercase tracking-wider">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={customColors.primary} 
                        onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                        className="w-10 h-10 border border-border-soft rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customColors.primary} 
                        onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                        className="input-premium py-2 text-xs"
                      />
                    </div>
                    <span className="text-[9px] text-textSecondary leading-none">Main buttons, active links, heading decorations.</span>
                  </div>

                  {/* Secondary Color */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-body text-[10px] font-bold text-textPrimary uppercase tracking-wider">
                      Secondary Accent Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={customColors.secondary} 
                        onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                        className="w-10 h-10 border border-border-soft rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customColors.secondary} 
                        onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                        className="input-premium py-2 text-xs"
                      />
                    </div>
                    <span className="text-[9px] text-textSecondary leading-none">Secondary badge backdrops, subtle outlines.</span>
                  </div>

                  {/* Background Color */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-body text-[10px] font-bold text-textPrimary uppercase tracking-wider">
                      Page Background
                    </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={customColors.background} 
                        onChange={(e) => handleCustomColorChange('background', e.target.value)}
                        className="w-10 h-10 border border-border-soft rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customColors.background} 
                        onChange={(e) => handleCustomColorChange('background', e.target.value)}
                        className="input-premium py-2 text-xs"
                      />
                    </div>
                    <span className="text-[9px] text-textSecondary leading-none">Main light background across all pages.</span>
                  </div>

                  {/* Surface Color */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-body text-[10px] font-bold text-textPrimary uppercase tracking-wider">
                      Card Surface Backdrop
                    </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={customColors.surface} 
                        onChange={(e) => handleCustomColorChange('surface', e.target.value)}
                        className="w-10 h-10 border border-border-soft rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customColors.surface} 
                        onChange={(e) => handleCustomColorChange('surface', e.target.value)}
                        className="input-premium py-2 text-xs"
                      />
                    </div>
                    <span className="text-[9px] text-textSecondary leading-none">Backdrop of components, dialogs, cards.</span>
                  </div>

                  {/* Dark Section */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-body text-[10px] font-bold text-textPrimary uppercase tracking-wider">
                      Dark Section Backdrop
                    </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={customColors.darkSection} 
                        onChange={(e) => handleCustomColorChange('darkSection', e.target.value)}
                        className="w-10 h-10 border border-border-soft rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customColors.darkSection} 
                        onChange={(e) => handleCustomColorChange('darkSection', e.target.value)}
                        className="input-premium py-2 text-xs"
                      />
                    </div>
                    <span className="text-[9px] text-textSecondary leading-none">Footer background, hero dark zones.</span>
                  </div>

                  {/* Accent Gold */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-body text-[10px] font-bold text-textPrimary uppercase tracking-wider">
                      Accent Gold equivalent
                    </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={customColors.accentGold} 
                        onChange={(e) => handleCustomColorChange('accentGold', e.target.value)}
                        className="w-10 h-10 border border-border-soft rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customColors.accentGold} 
                        onChange={(e) => handleCustomColorChange('accentGold', e.target.value)}
                        className="input-premium py-2 text-xs"
                      />
                    </div>
                    <span className="text-[9px] text-textSecondary leading-none">Star ratings, special highlights, gold borders.</span>
                  </div>

                  {/* Text Primary */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-body text-[10px] font-bold text-textPrimary uppercase tracking-wider">
                      Primary Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={customColors.textPrimary} 
                        onChange={(e) => handleCustomColorChange('textPrimary', e.target.value)}
                        className="w-10 h-10 border border-border-soft rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customColors.textPrimary} 
                        onChange={(e) => handleCustomColorChange('textPrimary', e.target.value)}
                        className="input-premium py-2 text-xs"
                      />
                    </div>
                    {textBgContrast < 4.5 && (
                      <span className="text-[9px] text-primaryRose font-bold flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Low contrast with BG ({textBgContrast.toFixed(1)}:1)
                      </span>
                    )}
                    {textSurfaceContrast < 4.5 && (
                      <span className="text-[9px] text-primaryRose font-bold flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Low contrast with Surface ({textSurfaceContrast.toFixed(1)}:1)
                      </span>
                    )}
                  </div>

                  {/* Text Secondary */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-body text-[10px] font-bold text-textPrimary uppercase tracking-wider">
                      Secondary Muted Text
                    </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={customColors.textSecondary} 
                        onChange={(e) => handleCustomColorChange('textSecondary', e.target.value)}
                        className="w-10 h-10 border border-border-soft rounded-lg cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customColors.textSecondary} 
                        onChange={(e) => handleCustomColorChange('textSecondary', e.target.value)}
                        className="input-premium py-2 text-xs"
                      />
                    </div>
                    {textSecBgContrast < 4.5 && (
                      <span className="text-[9px] text-primaryRose font-bold flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Low contrast with BG ({textSecBgContrast.toFixed(1)}:1)
                      </span>
                    )}
                  </div>
                </div>

                {/* Form Controls */}
                <div className="flex space-x-3 pt-4 border-t border-border-soft">
                  <Button 
                    type="button" 
                    onClick={handleSaveCustomTheme}
                    className="px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest"
                  >
                    Save Custom Theme
                  </Button>
                  <button 
                    type="button" 
                    onClick={handleResetToLastSaved}
                    className="btn-premium btn-outline-gold flex items-center space-x-2 px-6 py-2 text-[10px] uppercase font-bold tracking-widest cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Colors</span>
                  </button>
                </div>

              </Card>
            </div>

            {/* Live Preview panel (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div 
                className="rounded-2xl p-6 border shadow-sm flex flex-col space-y-4"
                style={{ 
                  backgroundColor: customColors.background, 
                  borderColor: hexToRgbaStr(customColors.primary, 0.18),
                  color: customColors.textPrimary 
                }}
              >
                <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: hexToRgbaStr(customColors.primary, 0.15) }}>
                  <h4 className="font-display text-[10px] font-bold uppercase tracking-widest" style={{ color: customColors.primary }}>
                    Live Preview Mockup
                  </h4>
                  <span className="font-body text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: hexToRgbaStr(customColors.primary, 0.1), color: customColors.primary }}>
                    Preview Mode
                  </span>
                </div>

                {/* Mock Navbar */}
                <div className="rounded-lg p-3 border flex items-center justify-between" style={{ backgroundColor: customColors.surface, borderColor: hexToRgbaStr(customColors.primary, 0.15) }}>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: customColors.primary }} />
                    <span className="font-display text-[9px] font-bold">Adithya Events</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[8px] font-bold">
                    <span style={{ color: customColors.primary }}>HOME</span>
                    <span>SERVICES</span>
                    <div className="px-3 py-1 rounded-full text-[8px] uppercase font-bold text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary} 100%)` }}>
                      BOOK NOW
                    </div>
                  </div>
                </div>

                {/* Mock Card */}
                <div 
                  className="rounded-xl p-5 border flex flex-col space-y-2 text-left" 
                  style={{ 
                    backgroundColor: customColors.surface, 
                    borderColor: hexToRgbaStr(customColors.primary, 0.18),
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-display text-xs font-bold">Royal Stage Decor</h5>
                    <span className="text-[8px] px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: customColors.accentGold }}>★ 5.0</span>
                  </div>
                  <p className="font-body text-[9px] leading-relaxed" style={{ color: customColors.textSecondary }}>
                    Bespoke stage backdrops and mandapam floral layouts.
                  </p>
                  <span className="text-[8px] font-bold uppercase tracking-wider flex items-center pt-1 cursor-pointer" style={{ color: customColors.primary }}>
                    Explore Services →
                  </span>
                </div>

                {/* Mock Footer (Dark section) */}
                <div 
                  className="rounded-lg p-4 text-left flex justify-between items-center" 
                  style={{ 
                    backgroundColor: customColors.darkSection, 
                    color: '#ffffff'
                  }}
                >
                  <div className="flex flex-col space-y-1">
                    <span className="font-display text-[9px] font-bold" style={{ color: customColors.secondary }}>Adithya Events</span>
                    <span className="text-[7px] text-white/50">© 2026. All rights reserved.</span>
                  </div>
                  <div className="flex space-x-1.5">
                    <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[7px]" style={{ borderColor: hexToRgbaStr(customColors.secondary, 0.3) }}>IG</div>
                    <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[7px]" style={{ borderColor: hexToRgbaStr(customColors.secondary, 0.3) }}>FB</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* History / Rolback snapshot section */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center space-x-2 mb-4 text-primaryRose">
            <History className="w-4.5 h-4.5" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider leading-none">
              Recent Theme History
            </h3>
          </div>

          <Card className="p-0 border-border-soft overflow-hidden">
            {loadingHistory ? (
              <div className="p-6 text-center text-xs text-textSecondary animate-pulse">
                Loading history snapshots...
              </div>
            ) : historyList.length === 0 ? (
              <div className="p-6 text-center text-xs text-textSecondary font-body">
                No recent theme overrides archived in history yet.
              </div>
            ) : (
              <table className="admin-table text-xs">
                <thead>
                  <tr>
                    <th>Archived Date</th>
                    <th>Template Preset Name</th>
                    <th>Color Swatches</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono">
                        {new Date(item.archivedAt).toLocaleString('en-IN')}
                      </td>
                      <td className="font-semibold text-textPrimary">
                        {item.templateName}
                      </td>
                      <td>
                        <div className="flex space-x-1">
                          <div className="w-4 h-4 rounded-full border border-black/5" style={{ backgroundColor: item.primary }} />
                          <div className="w-4 h-4 rounded-full border border-black/5" style={{ backgroundColor: item.secondary }} />
                          <div className="w-4 h-4 rounded-full border border-black/5" style={{ backgroundColor: item.background }} />
                          <div className="w-4 h-4 rounded-full border border-black/5" style={{ backgroundColor: item.surface }} />
                          <div className="w-4 h-4 rounded-full border border-black/5" style={{ backgroundColor: item.darkSection }} />
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleRestoreFromHistory(item)}
                          className="text-[10px] text-primaryRose hover:text-secondaryRoseGold font-bold uppercase tracking-wider bg-transparent border-none cursor-pointer"
                        >
                          Restore This
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && confirmModal.preset && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 border-border-soft relative animate-fadeIn" hoverEffect={false}>
            <h3 className="font-display text-textPrimary font-bold text-sm border-b border-border-soft pb-2 mb-4">
              Apply Preset Template?
            </h3>
            <p className="font-body text-xs text-textSecondary leading-relaxed mb-6">
              Are you sure you want to apply the template <strong>"{confirmModal.preset.templateName}"</strong>? This will instantly change the color palette across the entire public website.
            </p>
            
            {/* Swatch preview */}
            <div className="flex space-x-2.5 justify-center mb-8 bg-[#FFFBF7] p-4 border border-border-soft rounded-xl">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-7 h-7 rounded-full border" style={{ backgroundColor: confirmModal.preset.primary }} />
                <span className="text-[7px] text-textSecondary uppercase font-bold">Primary</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-7 h-7 rounded-full border" style={{ backgroundColor: confirmModal.preset.secondary }} />
                <span className="text-[7px] text-textSecondary uppercase font-bold">Accent</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-7 h-7 rounded-full border" style={{ backgroundColor: confirmModal.preset.background }} />
                <span className="text-[7px] text-textSecondary uppercase font-bold">BG</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-7 h-7 rounded-full border" style={{ backgroundColor: confirmModal.preset.surface }} />
                <span className="text-[7px] text-textSecondary uppercase font-bold">Surface</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-7 h-7 rounded-full border" style={{ backgroundColor: confirmModal.preset.darkSection }} />
                <span className="text-[7px] text-textSecondary uppercase font-bold">Dark</span>
              </div>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setConfirmModal({ open: false, preset: null })}
                className="btn-premium btn-outline-gold px-5 py-2 text-[10px] uppercase font-bold tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <Button
                onClick={confirmApplyPreset}
                className="px-5 py-2 text-[10px] uppercase font-bold tracking-widest"
              >
                Yes, Apply Theme
              </Button>
            </div>
          </Card>
        </div>
      )}

    </PageTransition>
  );
};

export default AdminThemePage;
