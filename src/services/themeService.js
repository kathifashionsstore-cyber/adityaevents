// src/services/themeService.js
import { db } from '../firebase/config';
import { 
  doc, getDoc, setDoc, collection, addDoc, query, 
  orderBy, getDocs, deleteDoc, onSnapshot 
} from 'firebase/firestore';

// 6 built-in template presets
export const THEME_PRESETS = [
  {
    id: 'rose-gold',
    templateName: 'Rose Gold Premium',
    description: 'Romantic, soft rose + gold, and warm neutrals.',
    primary: '#C76D7A',
    secondary: '#EBB4A0',
    background: '#FFFBF7',
    surface: '#FFFFFF',
    darkSection: '#3B2F2F',
    accentGold: '#D4AF37',
    textPrimary: '#2D2D2D',
    textSecondary: '#6B7280',
    success: '#22C55E',
    gradientPrimary: 'linear-gradient(135deg, #C76D7A 0%, #EBB4A0 100%)',
    gradientDark: 'linear-gradient(135deg, #3B2F2F 0%, #2A2020 100%)',
    gradientGold: 'linear-gradient(135deg, #D4AF37 0%, #EBB4A0 100%)',
    shadowRose: 'rgba(199, 109, 122, 0.25)',
    borderSoft: 'rgba(199, 109, 122, 0.18)'
  },
  {
    id: 'royal-purple',
    templateName: 'Royal Purple Gold',
    description: 'Luxurious deep amethyst + gold and rich velvet tones.',
    primary: '#6B2FA0',
    secondary: '#A170D6',
    background: '#F7F2FB',
    surface: '#FFFFFF',
    darkSection: '#1C0A2E',
    accentGold: '#D4AF37',
    textPrimary: '#1C0A2E',
    textSecondary: '#5B4F73',
    success: '#22C55E',
    gradientPrimary: 'linear-gradient(135deg, #6B2FA0 0%, #A170D6 100%)',
    gradientDark: 'linear-gradient(135deg, #1C0A2E 0%, #0E0517 100%)',
    gradientGold: 'linear-gradient(135deg, #D4AF37 0%, #A170D6 100%)',
    shadowRose: 'rgba(107, 47, 160, 0.25)',
    borderSoft: 'rgba(107, 47, 160, 0.18)'
  },
  {
    id: 'emerald-elegance',
    templateName: 'Emerald Elegance',
    description: 'Deep forest greens + ivory and upscale gold highlighting.',
    primary: '#0F5132',
    secondary: '#A3C1AD',
    background: '#F4F7F4',
    surface: '#FFFFFF',
    darkSection: '#072C1C',
    accentGold: '#D4AF37',
    textPrimary: '#072C1C',
    textSecondary: '#4E655B',
    success: '#198754',
    gradientPrimary: 'linear-gradient(135deg, #0F5132 0%, #A3C1AD 100%)',
    gradientDark: 'linear-gradient(135deg, #072C1C 0%, #03140D 100%)',
    gradientGold: 'linear-gradient(135deg, #D4AF37 0%, #A3C1AD 100%)',
    shadowRose: 'rgba(15, 81, 50, 0.25)',
    borderSoft: 'rgba(15, 81, 50, 0.18)'
  },
  {
    id: 'classic-burgundy',
    templateName: 'Classic Ivory & Burgundy',
    description: 'Traditional deep wine/burgundy + warm cream and formal gold.',
    primary: '#722F37',
    secondary: '#E8C5C8',
    background: '#FCF9F5',
    surface: '#FFFFFF',
    darkSection: '#36161A',
    accentGold: '#B8860B',
    textPrimary: '#36161A',
    textSecondary: '#786062',
    success: '#28A745',
    gradientPrimary: 'linear-gradient(135deg, #722F37 0%, #E8C5C8 100%)',
    gradientDark: 'linear-gradient(135deg, #36161A 0%, #1F0D0F 100%)',
    gradientGold: 'linear-gradient(135deg, #B8860B 0%, #E8C5C8 100%)',
    shadowRose: 'rgba(114, 47, 55, 0.25)',
    borderSoft: 'rgba(114, 47, 55, 0.18)'
  },
  {
    id: 'sapphire-celebration',
    templateName: 'Sapphire Celebration',
    description: 'Navy blue + champagne gold and crisp ice white.',
    primary: '#0B3C5D',
    secondary: '#98D7C2',
    background: '#F5F8FA',
    surface: '#FFFFFF',
    darkSection: '#06223F',
    accentGold: '#D4AF37',
    textPrimary: '#0B3C5D',
    textSecondary: '#526A7E',
    success: '#2ECC71',
    gradientPrimary: 'linear-gradient(135deg, #0B3C5D 0%, #98D7C2 100%)',
    gradientDark: 'linear-gradient(135deg, #06223F 0%, #031120 100%)',
    gradientGold: 'linear-gradient(135deg, #D4AF37 0%, #98D7C2 100%)',
    shadowRose: 'rgba(11, 60, 93, 0.25)',
    borderSoft: 'rgba(11, 60, 93, 0.18)'
  },
  {
    id: 'blush-champagne',
    templateName: 'Blush & Champagne',
    description: 'Light bridal pastel pink + warm champagne and minimal grey.',
    primary: '#E8A5A5',
    secondary: '#F0D3B7',
    background: '#FAF7F5',
    surface: '#FFFFFF',
    darkSection: '#4A3535',
    accentGold: '#E0A96D',
    textPrimary: '#4A3535',
    textSecondary: '#826F6F',
    success: '#2ECC71',
    gradientPrimary: 'linear-gradient(135deg, #E8A5A5 0%, #F0D3B7 100%)',
    gradientDark: 'linear-gradient(135deg, #4A3535 0%, #302222 100%)',
    gradientGold: 'linear-gradient(135deg, #E0A96D 0%, #F0D3B7 100%)',
    shadowRose: 'rgba(232, 165, 165, 0.25)',
    borderSoft: 'rgba(232, 165, 165, 0.18)'
  }
];

// Helper to convert hex to RGBA
export const hexToRgbaStr = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') return `rgba(199, 109, 122, ${alpha})`;
  const cleanHex = hex.replace('#', '');
  let r = 199, g = 109, b = 122;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Seed default Rose Gold theme if none exists
export const seedDefaultTheme = async () => {
  const docRef = doc(db, 'siteConfig', 'activeTheme');
  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        ...THEME_PRESETS[0],
        updatedAt: new Date().toISOString()
      });
      console.log('Seeded initial Rose Gold Premium theme in Firestore.');
    }
  } catch (error) {
    console.error('Failed to seed default theme:', error);
  }
};

// Live active theme snapshot listener
export const subscribeActiveTheme = (onUpdate, onError) => {
  const docRef = doc(db, 'siteConfig', 'activeTheme');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      onUpdate(snap.data());
    } else {
      // Default to Rose Gold Premium
      onUpdate(THEME_PRESETS[0]);
    }
  }, onError);
};

// Save a new active theme and archive snapshot
export const saveActiveTheme = async (themeData) => {
  const docRef = doc(db, 'siteConfig', 'activeTheme');
  
  // 1. Fetch current theme to snapshot
  try {
    const currentSnap = await getDoc(docRef);
    if (currentSnap.exists()) {
      const oldData = currentSnap.data();
      
      // Save snapshot to history
      const historyCollection = collection(db, 'siteConfig', 'activeTheme', 'history');
      await addDoc(historyCollection, {
        ...oldData,
        archivedAt: new Date().toISOString()
      });

      // 2. Limit history size to 10
      const historyQuery = query(historyCollection, orderBy('archivedAt', 'asc'));
      const historySnap = await getDocs(historyQuery);
      if (historySnap.size > 10) {
        const deleteCount = historySnap.size - 10;
        for (let i = 0; i < deleteCount; i++) {
          await deleteDoc(doc(db, 'siteConfig', 'activeTheme', 'history', historySnap.docs[i].id));
        }
      }
    }
  } catch (e) {
    console.warn('History archiving failed:', e);
  }

  // 3. Write activeTheme
  // Auto-fill calculated fields if missing
  const completeTheme = {
    ...themeData,
    gradientPrimary: themeData.gradientPrimary || `linear-gradient(135deg, ${themeData.primary} 0%, ${themeData.secondary} 100%)`,
    gradientDark: themeData.gradientDark || `linear-gradient(135deg, ${themeData.darkSection} 0%, #1a1515 100%)`,
    gradientGold: themeData.gradientGold || `linear-gradient(135deg, ${themeData.accentGold} 0%, ${themeData.secondary} 100%)`,
    shadowRose: themeData.shadowRose || hexToRgbaStr(themeData.primary, 0.25),
    borderSoft: themeData.borderSoft || hexToRgbaStr(themeData.primary, 0.18),
    updatedAt: new Date().toISOString()
  };

  await setDoc(docRef, completeTheme);
};

// Fetch snapshots history
export const getThemeHistory = async () => {
  const historyCollection = collection(db, 'siteConfig', 'activeTheme', 'history');
  const historyQuery = query(historyCollection, orderBy('archivedAt', 'desc'));
  const snap = await getDocs(historyQuery);
  const list = [];
  snap.forEach((doc) => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list;
};
