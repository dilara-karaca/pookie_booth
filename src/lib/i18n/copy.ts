import type { FilterId } from "@/features/editor/filters/filters";
import type { FrameCategory, FrameLayout } from "@/features/frames/types";

export type Locale = "tr" | "en";

export const DEFAULT_LOCALE: Locale = "tr";

export interface Copy {
  metaDescription: string;
  language: { group: string; tr: string; en: string };
  nav: {
    primary: string;
    mobile: string;
    home: string;
    how: string;
    openMenu: string;
    closeMenu: string;
    skip: string;
  };
  steps: { group: string; frame: string; camera: string; edit: string; save: string };
  home: {
    badges: [string, string, string];
    lead: string;
    accent: string;
    tagline: string;
    start: string;
    howLead: string;
    howAccent: string;
    steps: Array<{ title: string; copy: string }>;
    samples: {
      besties: string;
      night: string;
      hello: string;
    };
  };
  frames: {
    title: string;
    intro: string;
    layout: string;
    design: string;
    categories: string;
    photoCount: (count: number) => string;
    shoot: string;
    backToEditor: string;
    changeTitle: string;
    changeBody: string;
    changeConfirm: string;
    keepPhotos: string;
  };
  camera: {
    title: string;
    back: string;
    photoOf: (current: number, total: number) => string;
    retakeOf: (current: number, total: number) => string;
    ready: string;
    readyBody: (count: number) => string;
    open: string;
    opening: string;
    paused: string;
    retry: string;
    flip: string;
    flipBack: string;
    flipFront: string;
    timer: string;
    timerOff: string;
    timerSeconds: (seconds: number) => string;
    countdown: (seconds: number) => string;
    cancelTimer: string;
    space: string;
    take: (index: number) => string;
    retake: (index: number) => string;
    shots: string;
    photoAlt: (index: number) => string;
    notReady: string;
    noCanvas: string;
    captureFailed: string;
    errors: Record<
      "insecure" | "unsupported" | "preview" | "denied" | "missing" | "busy" | "overconstrained" | "unknown",
      string
    >;
  };
  editor: {
    title: string;
    heading: string;
    intro: string;
    changeFrame: string;
    filters: string;
    filtersHint: string;
    caption: string;
    captionHint: string;
    placeholder: string;
    printed: string;
    finish: string;
    retake: string;
    retakePhoto: (index: number) => string;
  };
  result: {
    title: string;
    line1: string;
    line2: string;
    download: string;
    printing: string;
    share: string;
    preparing: string;
    saved: string;
    shared: string;
    shareUnsupported: string;
    downloadFailed: string;
    shareFailed: string;
    back: string;
    startOver: string;
    startTitle: string;
    startBody: string;
    startConfirm: string;
    keep: string;
  };
  kicker: string;
  leave: { title: string; body: string; confirm: string; keep: string };
  privacy: string;
  strip: (count: number, date: string, caption: string) => string;
  pages: { how: string; frames: string; camera: string; editor: string; result: string };
  layouts: Record<FrameLayout, { name: string }>;
  categories: Record<FrameCategory, { label: string; blurb: string }>;
  filters: Record<FilterId, string>;
  designs: Record<string, string>;
}

const designsEn: Record<string, string> = {
  "classic-white": "White",
  "classic-black": "Black",
  "classic-baby-pink": "Baby Pink",
  "classic-lavender": "Lavender",
  "classic-baby-blue": "Baby Blue",
  "classic-butter": "Butter Yellow",
  "classic-mint": "Mint",
  "classic-peach": "Peach",
  "classic-burgundy": "Burgundy",
  "classic-navy": "Navy",
  "lovely-pink-hearts": "Pink Hearts",
  "lovely-red-hearts": "Red Hearts",
  "lovely-bows": "Ribbon Bows",
  "lovely-love-notes": "Love Notes",
  "sweet-strawberry": "Strawberry",
  "sweet-cherry": "Cherry",
  "sweet-daisy": "Daisy",
  "sweet-tiny-flowers": "Tiny Flowers",
  "sweet-clouds": "Cute Clouds",
  "gingham-pink": "Pink Gingham",
  "gingham-blue": "Blue Gingham",
  "gingham-yellow": "Yellow Checkered",
  "gingham-stripes": "Pastel Stripes",
  "gingham-retro": "Retro Checkers",
  "retro-stars": "Superstar",
  "retro-night-stars": "White Stars",
  "retro-disco": "Disco Ball",
  "retro-groovy": "70s Daisies",
  "retro-shapes": "Sunset",
  "retro-y2k-hearts": "Chrome",
  "special-birthday": "Birthday",
  "special-valentine": "Valentine's Day",
  "special-christmas": "Christmas",
  "special-new-year": "New Year",
};

const designsTr: Record<string, string> = {
  "classic-white": "Beyaz",
  "classic-black": "Siyah",
  "classic-baby-pink": "Bebe Pembe",
  "classic-lavender": "Lavanta",
  "classic-baby-blue": "Bebe Mavi",
  "classic-butter": "Tereyağı Sarısı",
  "classic-mint": "Nane",
  "classic-peach": "Şeftali",
  "classic-burgundy": "Bordo",
  "classic-navy": "Lacivert",
  "lovely-pink-hearts": "Pembe Kalpler",
  "lovely-red-hearts": "Kırmızı Kalpler",
  "lovely-bows": "Fiyonklar",
  "lovely-love-notes": "Aşk Notları",
  "sweet-strawberry": "Çilek",
  "sweet-cherry": "Kiraz",
  "sweet-daisy": "Papatya",
  "sweet-tiny-flowers": "Minik Çiçekler",
  "sweet-clouds": "Sevimli Bulutlar",
  "gingham-pink": "Pembe Ekose",
  "gingham-blue": "Mavi Ekose",
  "gingham-yellow": "Sarı Kareli",
  "gingham-stripes": "Pastel Çizgiler",
  "gingham-retro": "Retro Kareler",
  "retro-stars": "Süper Yıldız",
  "retro-night-stars": "Beyaz Yıldızlar",
  "retro-disco": "Disko Topu",
  "retro-groovy": "70'ler Papatya",
  "retro-shapes": "Gün Batımı",
  "retro-y2k-hearts": "Krom",
  "special-birthday": "Doğum Günü",
  "special-valentine": "Sevgililer Günü",
  "special-christmas": "Noel",
  "special-new-year": "Yeni Yıl",
};

const en: Copy = {
  metaDescription:
    "Pookie Booth is a free online photobooth. Pick a frame, snap photos in your browser, and download a cute photo strip. Photos stay on your device.",
  language: { group: "Language", tr: "Türkçe", en: "English" },
  nav: {
    primary: "Primary",
    mobile: "Mobile",
    home: "Home",
    how: "How It Works",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skip: "Skip to content",
  },
  steps: { group: "Photobooth steps", frame: "Frame", camera: "Camera", edit: "Edit", save: "Save" },
  home: {
    badges: ["No sign up", "Always free", "On your device"],
    lead: "Strike a",
    accent: "Pose!",
    tagline: "Pick your frame, capture your moments, and make cute memories!",
    start: "START PHOTOBOOTH ♡",
    howLead: "How it",
    howAccent: "works",
    steps: [
      {
        title: "Pick Your Frame",
        copy: "Choose a layout, then a color or pattern. The same design fits every cut.",
      },
      {
        title: "Strike a Pose",
        copy: "The camera opens only when you ask. You press the shutter for every photo.",
      },
      {
        title: "Download Your Memories",
        copy: "Add a filter and a caption, then save a crisp PNG. It never leaves your device.",
      },
    ],
    samples: {
      besties: "Besties",
      night: "Night",
      hello: "Hello",
    },
  },
  frames: {
    title: "Pick your frame",
    intro: "First choose how many photos, then the design. Patterns and colors work with every layout.",
    layout: "Layout",
    design: "Design",
    categories: "Frame categories",
    photoCount: (count) => `${count} photos`,
    shoot: "Let's shoot",
    backToEditor: "Back to editor",
    changeTitle: "Change the layout?",
    changeBody: "A new layout needs a new set of photos. The ones you already took will be cleared.",
    changeConfirm: "Change layout",
    keepPhotos: "Keep my photos",
  },
  camera: {
    title: "Camera",
    back: "Back",
    photoOf: (current, total) => `Photo ${current} of ${total}`,
    retakeOf: (current, total) => `Retake photo ${current} of ${total}`,
    ready: "Ready to pose?",
    readyBody: (count) =>
      `You'll take ${count} photos, one shutter press at a time. Nothing is uploaded.`,
    open: "Open camera",
    opening: "Opening camera...",
    paused: "Camera paused",
    retry: "Try again",
    flip: "Flip",
    flipBack: "Switch to back camera",
    flipFront: "Switch to front camera",
    timer: "Timer",
    timerOff: "Off",
    timerSeconds: (seconds) => `${seconds} sec`,
    countdown: (seconds) => `Photo in ${seconds}`,
    cancelTimer: "Cancel timer",
    space: "Space to shoot",
    take: (index) => `Take photo ${index}`,
    retake: (index) => `Retake photo ${index}`,
    shots: "Captured photos",
    photoAlt: (index) => `Photo ${index}`,
    notReady: "The camera is not ready yet.",
    noCanvas: "Canvas is not available in this browser.",
    captureFailed: "The photo couldn't be taken.",
    errors: {
      insecure: "Camera needs a secure page. Open this booth on localhost or HTTPS.",
      unsupported: "This browser can't open a camera. Try the latest Chrome, Safari, or Edge.",
      preview: "The camera preview couldn't be created.",
      denied: "Camera access is blocked. Allow the camera in your browser settings, then try again.",
      missing: "No camera was found on this device.",
      busy: "Your camera is busy in another app. Close it and try again.",
      overconstrained: "That camera couldn't be opened. Switch cameras and try again.",
      unknown: "The camera couldn't start. Please try again.",
    },
  },
  editor: {
    title: "Edit",
    heading: "Make it yours",
    intro: "Retake any photo, then color the set and add a short line.",
    changeFrame: "Change frame",
    filters: "Filters",
    filtersHint: "They color the photos only. Your frame stays the same.",
    caption: "Caption",
    captionHint: "Optional. It sits in the bottom center of the frame.",
    placeholder: "Best Day Ever ♡",
    printed: "Printed on the frame:",
    finish: "Finish",
    retake: "Retake",
    retakePhoto: (index) => `Retake photo ${index}`,
  },
  result: {
    title: "Your strip",
    line1: "Your memories",
    line2: "are ready! ♡",
    download: "Download",
    printing: "Printing...",
    share: "Share",
    preparing: "Preparing...",
    saved: "Saved to your downloads!",
    shared: "Share sheet opened.",
    shareUnsupported: "This browser can't open a share sheet for files. Download the PNG instead.",
    downloadFailed: "The photo strip couldn't be created. Try again.",
    shareFailed: "Sharing failed.",
    back: "Back to editor",
    startOver: "Start over",
    startTitle: "Start a new shoot?",
    startBody: "This clears the photos in this tab so you can pick a new frame.",
    startConfirm: "Start over",
    keep: "Keep this strip",
  },
  kicker: "Wait a second",
  leave: {
    title: "Leave this shoot?",
    body: "Your photos only exist in this browser tab. Leaving now clears them.",
    confirm: "Discard photos",
    keep: "Keep my photos",
  },
  privacy: "Photos stay on your device. Nothing is uploaded, stored, or shared through a server.",
  strip: (count, date, caption) => `${caption ? `${caption}. ` : ""}Photo strip with ${count} photos. ${date}`,
  pages: { how: "How it works", frames: "Frames", camera: "Camera", editor: "Edit", result: "Your strip" },
  layouts: {
    "vertical-2": { name: "Vertical 2" },
    "vertical-3": { name: "Vertical 3" },
    "vertical-4": { name: "Vertical 4" },
    "grid-4": { name: "Grid 4" },
    "grid-6": { name: "Grid 6" },
  },
  categories: {
    classic: { label: "Classic", blurb: "Clean color borders" },
    lovely: { label: "Lovely", blurb: "Hearts, bows, and love notes" },
    sweet: { label: "Sweet", blurb: "Fruit, flowers, and clouds" },
    gingham: { label: "Gingham", blurb: "Checks, stripes, and cloth" },
    retro: { label: "Retro", blurb: "Disco balls, 70s daisies, and chrome" },
    special: { label: "Special", blurb: "Little celebration themes" },
  },
  filters: {
    original: "Original",
    bw: "Black & White",
    vintage: "Vintage",
    "soft-pink": "Soft Pink",
    film: "Film",
    dreamy: "Dreamy",
  },
  designs: designsEn,
};

const tr: Copy = {
  metaDescription:
    "Pookie Booth ücretsiz bir online photobooth. Çerçeveni seç, tarayıcıdan fotoğraf çek ve şeridini indir. Fotoğraflar cihazında kalır.",
  language: { group: "Dil", tr: "Türkçe", en: "English" },
  nav: {
    primary: "Ana menü",
    mobile: "Mobil menü",
    home: "Ana sayfa",
    how: "Nasıl çalışır",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    skip: "İçeriğe geç",
  },
  steps: { group: "Photobooth adımları", frame: "Çerçeve", camera: "Kamera", edit: "Düzenle", save: "Kaydet" },
  home: {
    badges: ["Üyelik yok", "Hep ücretsiz", "Cihazında kalır"],
    lead: "Strike a",
    accent: "Pose!",
    tagline: "Çerçeveni seç, anını yakala ve tatlı bir hatıra bırak!",
    start: "PHOTOBOOTH'U BAŞLAT ♡",
    howLead: "Nasıl",
    howAccent: "çalışır",
    steps: [
      {
        title: "Çerçeveni seç",
        copy: "Önce yerleşimi, sonra rengi ya da deseni seç. Aynı tasarım her düzende durur.",
      },
      {
        title: "Poz ver",
        copy: "Kamera yalnızca sen isteyince açılır. Her fotoğraf için deklanşöre sen basarsın.",
      },
      {
        title: "Hatıranı indir",
        copy: "Filtre ve kısa bir yazı ekle, sonra net bir PNG kaydet. Cihazından çıkmaz.",
      },
    ],
    samples: {
      besties: "Kankalar",
      night: "Gece",
      hello: "Selam",
    },
  },
  frames: {
    title: "Çerçeveni seç",
    intro: "Önce kaç fotoğraf olacağını, sonra tasarımı seç. Desenler ve renkler her yerleşimde kullanılır.",
    layout: "Yerleşim",
    design: "Tasarım",
    categories: "Çerçeve kategorileri",
    photoCount: (count) => `${count} fotoğraf`,
    shoot: "Hadi çekelim",
    backToEditor: "Düzenlemeye dön",
    changeTitle: "Yerleşim değişsin mi?",
    changeBody: "Yeni yerleşim yeni bir çekim ister. Şimdiye kadar çektiğin fotoğraflar silinir.",
    changeConfirm: "Yerleşimi değiştir",
    keepPhotos: "Fotoğraflarım kalsın",
  },
  camera: {
    title: "Kamera",
    back: "Geri",
    photoOf: (current, total) => `Fotoğraf ${current} / ${total}`,
    retakeOf: (current, total) => `${current} / ${total} kareyi yeniden çek`,
    ready: "Poz vermeye hazır mısın?",
    readyBody: (count) =>
      `${count} fotoğraf çekeceksin. Her kare için deklanşöre bir kez bas. Hiçbir şey yüklenmez.`,
    open: "Kamerayı aç",
    opening: "Kamera açılıyor...",
    paused: "Kamera durdu",
    retry: "Tekrar dene",
    flip: "Çevir",
    flipBack: "Arka kameraya geç",
    flipFront: "Ön kameraya geç",
    timer: "Zamanlayıcı",
    timerOff: "Kapalı",
    timerSeconds: (seconds) => `${seconds} sn`,
    countdown: (seconds) => `${seconds} saniye kaldı`,
    cancelTimer: "Zamanlayıcıyı iptal et",
    space: "Çekmek için boşluk",
    take: (index) => `${index}. fotoğrafı çek`,
    retake: (index) => `${index}. fotoğrafı yeniden çek`,
    shots: "Çekilen fotoğraflar",
    photoAlt: (index) => `Fotoğraf ${index}`,
    notReady: "Kamera henüz hazır değil.",
    noCanvas: "Bu tarayıcıda çizim alanı kullanılamıyor.",
    captureFailed: "Fotoğraf çekilemedi.",
    errors: {
      insecure: "Kamera için güvenli bir sayfa gerekir. Booth'u localhost veya HTTPS üzerinden aç.",
      unsupported: "Bu tarayıcı kamerayı açamıyor. Güncel Chrome, Safari veya Edge dene.",
      preview: "Kamera önizlemesi oluşturulamadı.",
      denied: "Kamera izni kapalı. Tarayıcı ayarlarından izin ver, sonra tekrar dene.",
      missing: "Bu cihazda kamera bulunamadı.",
      busy: "Kameran başka bir uygulamada açık. Onu kapatıp tekrar dene.",
      overconstrained: "Bu kamera açılamadı. Kamerayı değiştirip tekrar dene.",
      unknown: "Kamera başlatılamadı. Lütfen tekrar dene.",
    },
  },
  editor: {
    title: "Düzenle",
    heading: "Sana göre olsun",
    intro: "Beğenmediğin kareyi yeniden çek, sonra filtre ve kısa bir yazı ekle.",
    changeFrame: "Çerçeveyi değiştir",
    filters: "Filtreler",
    filtersHint: "Yalnızca fotoğrafları boyar. Çerçeve aynı kalır.",
    caption: "Yazı",
    captionHint: "İsteğe bağlı. Çerçevenin alt ortasında durur.",
    placeholder: "En Güzel Gün ♡",
    printed: "Çerçevedeki saat:",
    finish: "Bitir",
    retake: "Yeniden çek",
    retakePhoto: (index) => `${index}. fotoğrafı yeniden çek`,
  },
  result: {
    title: "Şeridin",
    line1: "Hatıraların",
    line2: "hazır! ♡",
    download: "İndir",
    printing: "Hazırlanıyor...",
    share: "Paylaş",
    preparing: "Hazırlanıyor...",
    saved: "İndirilenlere kaydedildi!",
    shared: "Paylaşım menüsü açıldı.",
    shareUnsupported: "Bu tarayıcı dosya paylaşım menüsünü açamıyor. PNG olarak indir.",
    downloadFailed: "Fotoğraf şeridi oluşturulamadı. Tekrar dene.",
    shareFailed: "Paylaşılamadı.",
    back: "Düzenlemeye dön",
    startOver: "Baştan başla",
    startTitle: "Yeni çekim başlasın mı?",
    startBody: "Bu sekmedeki fotoğraflar silinir ve yeni bir çerçeve seçebilirsin.",
    startConfirm: "Baştan başla",
    keep: "Bu şerit kalsın",
  },
  kicker: "Bir saniye",
  leave: {
    title: "Bu çekimden çıkılsın mı?",
    body: "Fotoğraflar yalnızca bu sekmede duruyor. Şimdi çıkarsan silinir.",
    confirm: "Fotoğrafları sil",
    keep: "Fotoğraflarım kalsın",
  },
  privacy: "Fotoğraflar cihazında kalır. Hiçbir şey yüklenmez, saklanmaz veya bir sunucu üzerinden paylaşılmaz.",
  strip: (count, date, caption) =>
    `${caption ? `${caption}. ` : ""}${count} fotoğraflık şerit. ${date}`,
  pages: { how: "Nasıl çalışır", frames: "Çerçeveler", camera: "Kamera", editor: "Düzenle", result: "Şeridin" },
  layouts: {
    "vertical-2": { name: "Dikey 2" },
    "vertical-3": { name: "Dikey 3" },
    "vertical-4": { name: "Dikey 4" },
    "grid-4": { name: "Izgara 4" },
    "grid-6": { name: "Izgara 6" },
  },
  categories: {
    classic: { label: "Klasik", blurb: "Düz renkli kenarlar" },
    lovely: { label: "Sevimli", blurb: "Kalpler, fiyonklar ve aşk notları" },
    sweet: { label: "Tatlı", blurb: "Meyve, çiçek ve bulutlar" },
    gingham: { label: "Ekose", blurb: "Kareler, çizgiler ve kumaş" },
    retro: { label: "Retro", blurb: "Disko topu, 70'ler papatya ve krom" },
    special: { label: "Özel", blurb: "Küçük kutlama temaları" },
  },
  filters: {
    original: "Orijinal",
    bw: "Siyah Beyaz",
    vintage: "Vintage",
    "soft-pink": "Yumuşak Pembe",
    film: "Film",
    dreamy: "Rüya",
  },
  designs: designsTr,
};

export const copyByLocale: Record<Locale, Copy> = { tr, en };
