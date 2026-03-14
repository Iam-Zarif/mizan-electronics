export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export const categoryEnLabels: Record<string, string> = {
  "cleaning-maintenance": "AC Cleaning & Maintenance",
  installation: "AC Installation & Re-Installation",
  repair: "AC Repair & Troubleshooting",
  gas: "AC Gas & Cooling System",
  shifting: "AC Shifting & Removal",
  spares: "AC Compressor & Spares",
};

export type ServiceItem = {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  price: string;
  slug: string;
  images: string[];
  process: string[];
};

export const serviceEnText: Record<string, { title: string; summary: string }> = {
  "basic-ac-cleaning": {
    title: "Basic AC Cleaning",
    summary: "Filter wash, condenser brush and baseline performance check.",
  },
  "deep-ac-cleaning": {
    title: "Deep AC Cleaning",
    summary: "Jet wash indoor/outdoor, blower disassembly and drain sanitizing.",
  },
  "jet-wash-ac-cleaning": {
    title: "Jet Wash AC Cleaning",
    summary: "High-pressure jet for coils/fins with drain flush and sanitizing.",
  },
  "indoor-unit-cleaning": {
    title: "Indoor Unit Cleaning",
    summary: "Detailed clean of indoor filter, coil and blower.",
  },
  "outdoor-unit-cleaning": {
    title: "Outdoor Unit Cleaning",
    summary: "Condenser fin, fan and housing cleaning with pressure wash.",
  },
  "filter-coil-cleaning": {
    title: "Filter & Coil Cleaning",
    summary: "Sanitize filters and degrease coils for quick performance boost.",
  },
  "anti-bacterial-ac-cleaning": {
    title: "Anti-Bacterial AC Cleaning",
    summary: "Deep sanitization using anti-microbial solution.",
  },
  "ac-performance-check": {
    title: "AC Performance Check",
    summary: "Cooling output, pressure and energy draw snapshot report.",
  },
  "split-ac-installation": {
    title: "Split AC Installation",
    summary: "Mounting, vacuum, correct copper layout and cable management.",
  },
  "window-ac-installation": {
    title: "Window AC Installation",
    summary: "Rebar support, sealing, drain setup and vibration control.",
  },
  "cassette-ac-installation": {
    title: "Cassette AC Installation",
    summary: "Grid/gypsum cutout, suspension, drain and vacuum test.",
  },
  "floor-standing-ac-installation": {
    title: "Floor Standing AC Installation",
    summary: "Heavy unit seating, copper/drain routing and test run.",
  },
  "commercial-ac-installation": {
    title: "Commercial AC Installation",
    summary: "Multi-unit/VRF setup with load balancing on site.",
  },
  "ac-re-installation": {
    title: "AC Re-Installation",
    summary: "Move old unit and reinstall at new spot with full vacuuming.",
  },
  "ac-cooling-repair": {
    title: "AC Cooling Issue Fix",
    summary: "Diagnostics and fix when cooling is low or not working.",
  },
  "ac-water-leak-repair": {
    title: "AC Water Leak Repair",
    summary: "Solve drain block or condensate issues causing leaks.",
  },
  "ac-noise-problem-fix": {
    title: "AC Noise Problem Fix",
    summary: "Address fan/compressor vibration and noise sources.",
  },
  "ac-fan-motor-repair": {
    title: "AC Fan Motor Repair",
    summary: "Repair/replace indoor or outdoor fan motors.",
  },
  "ac-pcb-repair": {
    title: "AC PCB Repair",
    summary: "Diagnose and repair control board faults.",
  },
  "ac-electrical-repair": {
    title: "AC Electrical Repair",
    summary: "Fix wiring, contactor and power issues safely.",
  },
  "ac-sensor-repair": {
    title: "AC Sensor Repair",
    summary: "Thermistor and sensor troubleshooting and replacement.",
  },
  "ac-remote-fix": {
    title: "AC Remote Problem Fix",
    summary: "Repair or replace AC remote and receiver alignment.",
  },
  "ac-gas-topup": {
    title: "AC Gas Top-Up",
    summary: "Small recharge with pressure tuning for better cooling.",
  },
  "ac-gas-refill": {
    title: "AC Gas Refill",
    summary: "Full refrigerant recharge with vacuum and leak checks.",
  },
  "ac-gas-leak-detection": {
    title: "Gas Leak Detection",
    summary: "Trace and identify refrigerant leak points accurately.",
  },
  "ac-gas-leak-repair": {
    title: "Gas Leak Repair",
    summary: "Seal leaks, pressure test and recharge as needed.",
  },
  "refrigerant-pressure-check": {
    title: "Refrigerant Pressure Check",
    summary: "Measure and balance system pressure for optimal cooling.",
  },
  "ac-uninstallation": {
    title: "AC Uninstallation",
    summary: "Safe removal of indoor/outdoor units with gas recovery.",
  },
  "ac-dismantle": {
    title: "AC Dismantling",
    summary: "Disassemble units for storage or relocation readiness.",
  },
  "ac-shifting-service": {
    title: "AC Shifting Service",
    summary: "Move AC to new location with transport and reinstall support.",
  },
  "ac-relocation": {
    title: "AC Relocation",
    summary: "Complete relocation with re-fit and testing.",
  },
  "ac-compressor-replacement": {
    title: "AC Compressor Replacement",
    summary: "Replace compressor, vacuum, recharge and test thoroughly.",
  },
  "ac-spare-parts-replacement": {
    title: "AC Spare Parts Replacement",
    summary: "Replace PCB, fan, sensor, remote or other required parts.",
  },
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "cleaning-maintenance",
    name: "এসি পরিষ্কার ও রক্ষণাবেক্ষণ",
    description: "রুটিন ক্লিনিং, জেট ওয়াশ ও পারফরম্যান্স চেক।",
    image:
      "https://i0.wp.com/24sevendays.com/wp-content/uploads/2019/02/split-ac-jet-pump-service-by-experts.png?fit=600%2C800&ssl=1",
  },
  {
    id: "installation",
    name: "এসি ইনস্টলেশন ও রি-ইনস্টলেশন",
    description:
      "স্প্লিট, উইন্ডো, ক্যাসেট, ফ্লোর-স্ট্যান্ডিং ও কমার্শিয়াল ইনস্টল।",
    image:
      "https://www.beachandsons.com/app/uploads/2022/12/71844429-ac-808x606-1.jpeg",
  },
  {
    id: "repair",
    name: "এসি মেরামত",
    description:
      "কুলিং, লিক, শব্দ, ফ্যান/PCB/ইলেকট্রিক্যাল ও রিমোট সমস্যা সমাধান।",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2021/8/XL/OQ/KR/35540727/inverter-ac-repairing-service.jpg",
  },
  {
    id: "gas",
    name: "এসি গ্যাস ও কুলিং সিস্টেম",
    description: "গ্যাস টপ-আপ/রিফিল, লিক ডিটেকশন ও প্রেসার চেক।",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2023/5/307730546/CY/MN/MJ/48593301/ac-gas-refilling-services.jpeg",
  },
  {
    id: "shifting",
    name: "এসি শিফটিং ও আনইনস্টল",
    description: "আনইনস্টল, ডিসম্যান্টল, শিফটিং ও রিলোকেশন।",
    image:
      "https://www.patnarepair.com/x_images/medias/1619177002ac_uninstallation-window4.jpg",
  },
  {
    id: "spares",
    name: "এসি কম্প্রেসর ও স্পেয়ার পার্টস",
    description: "কম্প্রেসর ও বিভিন্ন স্পেয়ার পার্টস রিপ্লেসমেন্ট।",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxn1HnpqTQMZOMlPH4uRBUqSljz21z8M9J7Q&s",
  },
];

export const serviceItems: ServiceItem[] = [
  // 1. Cleaning & Maintenance
  {
    id: "basic-cleaning",
    categoryId: "cleaning-maintenance",
    title: "বেসিক এসি ক্লিনিং",
    summary: "ফিল্টার পরিষ্কার, কনডেনসার ব্রাশ ও বেসিক পারফরম্যান্স চেক।",
    price: "৳১,২০০ - ৳১,৮০০",
    slug: "basic-ac-cleaning",
    images: ["https://www.urbanmop.com/public/uploads/blog/1744692553.jpg"],
    process: [
      "পরিদর্শন",
      "ফিল্টার ক্লিন",
      "কনডেনসার ব্রাশ",
      "প্রেসার চেক",
      "ফাইনাল টেস্ট",
    ],
  },
  {
    id: "deep-cleaning",
    categoryId: "cleaning-maintenance",
    title: "ডিপ এসি ক্লিনিং",
    summary:
      "ইনডোর/আউটডোর জেট ওয়াশ, ব্লোয়ার ডিসঅ্যাসেম্বলি ও ড্রেন স্যানিটাইজ।",
    price: "৳১,৮০০ - ৳২,৮০০",
    slug: "deep-ac-cleaning",
    images: [
      "https://deax38zvkau9d.cloudfront.net/prod/assets/images/uploads/services/1690540430ac-cleaning-service.webp",
    ],
    process: [
      "পূর্ণ পরিদর্শন",
      "ব্লোয়ার খুলে ওয়াশ",
      "জেট ওয়াশ",
      "ড্রেন স্যানিটাইজ",
      "প্রেসার ব্যালেন্স",
    ],
  },
  {
    id: "jet-wash",
    categoryId: "cleaning-maintenance",
    title: "জেট ওয়াশ এসি ক্লিনিং",
    summary: "হাই-প্রেশার জেট দিয়ে কয়েল/ফিন ক্লিনিং ও ড্রেন ফ্লাশ।",
    price: "৳২,২০০ - ৳৩,২০০",
    slug: "jet-wash-ac-cleaning",
    images: [
      "https://5.imimg.com/data5/ANDROID/Default/2025/3/499134795/MF/WW/SA/12846670/product-jpeg-500x500.jpg",
    ],
    process: [
      "সেফটি কভার",
      "হাই প্রেশার জেট",
      "কয়েল ডিগ্রিজ",
      "ড্রেন ফ্লাশ",
      "স্যানিটাইজ",
    ],
  },
  {
    id: "indoor-clean",
    categoryId: "cleaning-maintenance",
    title: "ইনডোর ইউনিট ক্লিনিং",
    summary: "ইনডোর ফিল্টার, কয়েল ও ব্লোয়ার ডিটেইল ক্লিন।",
    price: "৳৯০০ - ৳১,৪০০",
    slug: "indoor-unit-cleaning",
    images: [
      "https://dwphome.pk/blog/wp-content/uploads/sites/2/2022/12/gettyimagesamixstudio.webp",
    ],
    process: ["ফিল্টার ক্লিন", "কয়েল ব্রাশ", "ব্লোয়ার ওয়াশ", "ড্রেন চেক"],
  },
  {
    id: "outdoor-clean",
    categoryId: "cleaning-maintenance",
    title: "আউটডোর ইউনিট ক্লিনিং",
    summary: "কনডেনসার ফিন, ফ্যান ও হাউজিং ক্লিনিং ও প্রেসার ওয়াশ।",
    price: "৳১,০০০ - ৳১,৬০০",
    slug: "outdoor-unit-cleaning",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH9ALvw5aDqZAIchURsQ84gmCJmsGGggjJDA&s",
    ],
    process: ["ডাস্ট ব্লো", "ফিন ওয়াশ", "ফ্যান ক্লিন", "ক্যাবিনেট রি-ফিট"],
  },
  {
    id: "filter-coil",
    categoryId: "cleaning-maintenance",
    title: "ফিল্টার ও কয়েল ক্লিনিং",
    summary: "ফিল্টার স্যানিটাইজ ও কয়েল ডিগ্রিজ—কুইক পারফরম্যান্স বুস্ট।",
    price: "৳৮০০ - ৳১,২০০",
    slug: "filter-coil-cleaning",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq3o2iPyuSTfkaSPk7ke-u92NqkwPx9C0y3w&s",
    ],
    process: ["ফিল্টার ওয়াশ", "কয়েল স্প্রে", "ড্রেন চেক", "টেস্ট"],
  },
  {
    id: "anti-bac",
    categoryId: "cleaning-maintenance",
    title: "অ্যান্টি-ব্যাকটেরিয়াল এসি ক্লিনিং",
    summary: "অ্যান্টি-মাইক্রোবিয়াল সলিউশন দিয়ে ডিপ স্যানিটাইজেশন।",
    price: "৳১,৮০০ - ৳২,৪০০",
    slug: "anti-bacterial-ac-cleaning",
    images: ["https://i.ytimg.com/vi/93VgzICjvVU/maxresdefault.jpg"],
    process: [
      "প্রি-ওয়াশ",
      "অ্যান্টি-ব্যাক সলিউশন",
      "রিন্স",
      "ডিওডরাইজ",
      "টেস্ট",
    ],
  },
  {
    id: "perf-check",
    categoryId: "cleaning-maintenance",
    title: "এসি পারফরম্যান্স চেক",
    summary: "কুলিং আউটপুট, প্রেসার ও এনার্জি ড্র স্ন্যাপশট রিপোর্ট।",
    price: "৳৭০০ - ৳১,০০০",
    slug: "ac-performance-check",
    images: [
      "https://cdn-ileifhf.nitrocdn.com/MVPPGHIsSpZGbxQrdFBTeqEqVpcuPLJo/assets/images/optimized/rev-1627df1/www.evergreenaircon.co.uk/wp-content/uploads/2020/08/TCBEHVDBs7wz0NJVqovM_Services-or-Commercial-1024x683.jpg",
    ],
    process: ["তাপমাত্রা রিড", "প্রেসার রিড", "বিদ্যুৎ ড্র", "রিপোর্ট"],
  },

  // 2. Installation & Re-Installation
  {
    id: "split-install",
    categoryId: "installation",
    title: "স্প্লিট এসি ইনস্টলেশন",
    summary:
      "মাউন্টিং, ভ্যাকুয়াম, সঠিক কপার লাইন লেআউট ও কেব্‌ল ম্যানেজমেন্ট।",
    price: "৳৩,৫০০ - ৳৪,৫০০",
    slug: "split-ac-installation",
    images: [
      "https://i.ytimg.com/vi/AQ4EYHNCDzg/maxresdefault.jpg",
    ],
    process: [
      "সাইট চেক",
      "মাউন্টিং",
      "ভ্যাকুয়াম ও লিক টেস্ট",
      "পাওয়ার কানেকশন",
      "কুলিং টিউন",
    ],
  },
  {
    id: "window-install",
    categoryId: "installation",
    title: "উইন্ডো এসি ইনস্টলেশন",
    summary: "রিবার সাপোর্ট, সিলিং, ড্রেন সেটআপ ও কম্পন কন্ট্রোল।",
    price: "৳২,২০০ - ৳৩,২০০",
    slug: "window-ac-installation",
    images: [
      "https://images.unsplash.com/photo-1582719478248-54e9f2ab39f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1604328471151-dc9b1bda3caa?auto=format&fit=crop&w=1200&q=80",
    ],
    process: [
      "ওপেনিং প্রেপ",
      "মাউন্ট",
      "সিলিং",
      "ইলেকট্রিক সংযোগ",
      "টেস্ট রান",
    ],
  },
  {
    id: "cassette-install",
    categoryId: "installation",
    title: "ক্যাসেট এসি ইনস্টলেশন",
    summary: "গ্রিড/জিপসাম কাটআউট, সাসপেনশন, ড্রেন ও ভ্যাকুয়াম টেস্ট।",
    price: "৳৫,৫০০ - ৳৭,৫০০",
    slug: "cassette-ac-installation",
    images: [
      "https://images.unsplash.com/photo-1582719478248-54e9f2ab39f2?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["সাইট সার্ভে", "কাটআউট", "সাসপেনশন", "ভ্যাকুয়াম/টেস্ট", "ফিনিশ"],
  },
  {
    id: "floor-stand",
    categoryId: "installation",
    title: "ফ্লোর স্ট্যান্ডিং এসি ইনস্টলেশন",
    summary: "হেভি ইউনিট সিটিং, কপার/ড্রেন রাউটিং, টেস্ট রান।",
    price: "৳৪,৫০০ - ৳৬,৫০০",
    slug: "floor-standing-ac-installation",
    images: [
      "https://images.unsplash.com/photo-1582719478248-54e9f2ab39f2?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["প্লেসমেন্ট", "লাইন রাউট", "ভ্যাকুয়াম", "টেস্ট"],
  },
  {
    id: "commercial-install",
    categoryId: "installation",
    title: "কমার্শিয়াল এসি ইনস্টলেশন",
    summary: "কমার্শিয়াল/VRF সাইটে মাল্টি-ইউনিট সেটআপ ও ব্যালেন্সিং।",
    price: "৳৮,০০০ - ৳১২,০০০",
    slug: "commercial-ac-installation",
    images: [
      "https://images.unsplash.com/photo-1582719478250-0f06ff0c91e7?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["লোড প্ল্যান", "ইউনিট সেট", "ভ্যাকুয়াম", "ব্যালেন্স টেস্ট"],
  },
  {
    id: "re-install",
    categoryId: "installation",
    title: "এসি রি-ইনস্টলেশন",
    summary: "পুরনো ইউনিট নতুন স্থানে খুলে নিয়ে পুনরায় ইনস্টল।",
    price: "৳৩,০০০ - ৳৪,০০০",
    slug: "ac-re-installation",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ডিমাউন্ট", "ট্রান্সপোর্ট", "মাউন্ট", "ভ্যাকুয়াম", "টেস্ট"],
  },

  // 3. Repair
  {
    id: "cooling-repair",
    categoryId: "repair",
    title: "এসি কুলিং সমস্যা ঠিক করা",
    summary: "কুলিং কম/বন্ধ—ডায়াগনস্টিক ও ফিক্স।",
    price: "৳১,২০০ - ৳২,২০০",
    slug: "ac-cooling-repair",
    images: [
      "https://images.unsplash.com/photo-1582719478100-76d1d5e8b6ef?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ডায়াগনস্টিক", "কয়েল/প্রেসার চেক", "ফিক্স", "টেস্ট"],
  },
  {
    id: "leak-repair",
    categoryId: "repair",
    title: "এসি থেকে পানি পড়া ঠিক করা",
    summary: "ড্রেন ব্লক/কনডেনসেট ইস্যু সমাধান।",
    price: "৳১,২০০ - ৳২,০০০",
    slug: "ac-water-leak-repair",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ড্রেন চেক", "ক্লগ রিমুভ", "লাইনার টেস্ট", "ফাইনাল টেস্ট"],
  },
  {
    id: "noise-repair",
    categoryId: "repair",
    title: "এসি থেকে শব্দ সমস্যা ঠিক করা",
    summary: "ফ্যান/কম্প্রেসর কম্পন ও শব্দ সমাধান।",
    price: "৳১,৩০০ - ৳২,২০০",
    slug: "ac-noise-problem-fix",
    images: [
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["শব্দ উৎস শনাক্ত", "ব্যালেন্স/টাইটেন", "টেস্ট"],
  },
  {
    id: "fan-motor",
    categoryId: "repair",
    title: "এসি ফ্যান মোটর রিপেয়ার",
    summary: "ইনডোর/আউটডোর ফ্যান মোটর রিপেয়ার/রিপ্লেস।",
    price: "৳২,০০০ - ৳৩,৫০০",
    slug: "ac-fan-motor-repair",
    images: [
      "https://images.unsplash.com/photo-1582719478100-76d1d5e8b6ef?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["মোটর টেস্ট", "রিপেয়ার/রিপ্লেস", "ব্যালেন্স", "টেস্ট"],
  },
  {
    id: "pcb-repair",
    categoryId: "repair",
    title: "এসি পিসিবি রিপেয়ার",
    summary: "PCB ত্রুটি নির্ণয়, কম্পোনেন্ট রিপেয়ার ও টেস্ট।",
    price: "৳১,২০০ - ৳৩,০০০",
    slug: "ac-pcb-repair",
    images: [
      "https://images.unsplash.com/photo-1582719478100-76d1d5e8b6ef?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ডায়াগনস্টিক", "কম্পোনেন্ট চেক", "রিপেয়ার", "টেস্ট"],
  },
  {
    id: "electrical-repair",
    categoryId: "repair",
    title: "এসি ইলেকট্রিক্যাল সমস্যা সমাধান",
    summary: "ওয়্যারিং, কন্টাক্টর, ক্যাপাসিটর ও পাওয়ার ইস্যু ফিক্স।",
    price: "৳১,০০০ - ৳২,২০০",
    slug: "ac-electrical-repair",
    images: [
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ইন্সপেকশন", "ফিক্স", "টেস্ট"],
  },
  {
    id: "sensor-repair",
    categoryId: "repair",
    title: "এসি সেন্সর সমস্যা ঠিক করা",
    summary: "টেম্প সেন্সর/থার্মিস্টর ট্রাবলশুট ও রিপ্লেস।",
    price: "৳৯০০ - ৳১,৬০০",
    slug: "ac-sensor-repair",
    images: [
      "https://images.unsplash.com/photo-1582719478250-0f06ff0c91e7?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ডায়াগনস্টিক", "রিপ্লেস", "টেস্ট"],
  },
  {
    id: "remote-repair",
    categoryId: "repair",
    title: "এসি রিমোট সমস্যা ঠিক করা",
    summary: "রিমোট পেয়ার/রিপেয়ার বা রিপ্লেস।",
    price: "৳৫০০ - ৳১,২০০",
    slug: "ac-remote-fix",
    images: [
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["চেক", "মেরামত/রিপ্লেস", "পেয়ার", "টেস্ট"],
  },

  // 4. Gas & Cooling System
  {
    id: "gas-topup",
    categoryId: "gas",
    title: "এসি গ্যাস টপ-আপ",
    summary: "কম মাত্রায় গ্যাস পূরণ ও প্রেসার ব্যালেন্স।",
    price: "৳১,২০০ - ৳১,৮০০",
    slug: "ac-gas-topup",
    images: [
      "https://images.unsplash.com/photo-1604328471355-0c5c30a6dabc?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["লিক চেক", "টপ-আপ", "প্রেসার ব্যালেন্স", "টেস্ট"],
  },
  {
    id: "gas-refill",
    categoryId: "gas",
    title: "এসি গ্যাস রিফিল",
    summary: "ভ্যাকুয়াম, সম্পূর্ণ চার্জ ও পারফরম্যান্স টেস্ট।",
    price: "৳২,০০০ - ৳৩,২০০",
    slug: "ac-gas-refill",
    images: [
      "https://images.unsplash.com/photo-1604328471355-0c5c30a6dabc?auto=format&fit=crop&w=1200&q=80",
    ],
    process: [
      "লিক সার্চ",
      "ভ্যাকুয়াম",
      "চার্জিং",
      "প্রেসার ব্যালেন্স",
      "পারফরম্যান্স টেস্ট",
    ],
  },
  {
    id: "gas-leak-detect",
    categoryId: "gas",
    title: "গ্যাস লিক ডিটেকশন",
    summary: "ডাই/ইলেকট্রনিক পদ্ধতিতে লিক শনাক্ত।",
    price: "৳১,০০০ - ৳১,৬০০",
    slug: "ac-gas-leak-detection",
    images: [
      "https://images.unsplash.com/photo-1597004897539-7553e237209d?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ভিজ্যুয়াল", "ডাই/ইলেকট্রনিক", "লোকেট", "রিপোর্ট"],
  },
  {
    id: "gas-leak-repair",
    categoryId: "gas",
    title: "গ্যাস লিক মেরামত",
    summary: "লিক পয়েন্ট রিপেয়ার, ভ্যাকুয়াম ও রি-চার্জ।",
    price: "৳২,২০০ - ৳৩,৮০০",
    slug: "ac-gas-leak-repair",
    images: [
      "https://images.unsplash.com/photo-1597004897539-7553e237209d?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["লিক ফিক্স", "ভ্যাকুয়াম", "চার্জ", "টেস্ট"],
  },
  {
    id: "pressure-check",
    categoryId: "gas",
    title: "রেফ্রিজারেন্ট প্রেসার চেক",
    summary: "প্রেসার রিড ও কুলিং পারফরম্যান্স স্ন্যাপশট।",
    price: "৳৭০০ - ৳১,২০০",
    slug: "refrigerant-pressure-check",
    images: [
      "https://images.unsplash.com/photo-1597004897539-7553e237209d?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["হাই/লো রিড", "ব্যালেন্স", "রিপোর্ট"],
  },

  // 5. Shifting & Removal
  {
    id: "uninstallation",
    categoryId: "shifting",
    title: "এসি আনইনস্টল",
    summary: "রেফ্রিজারেন্ট রিকভারি, কপার ও ক্যাবল সুরক্ষা সহ খুলে ফেলা।",
    price: "৳১,২০০ - ৳১,৮০০",
    slug: "ac-uninstallation",
    images: [
      "https://images.unsplash.com/photo-1582719478190-5f69c5a616b4?auto=format&fit=crop&w=1200&q=80",
    ],
    process: [
      "প্রি-চেক",
      "গ্যাস রিকভারি",
      "ইউনিট ডিসকানেক্ট",
      "প্যাকিং",
      "সাইট ক্লিনআপ",
    ],
  },
  {
    id: "dismantle",
    categoryId: "shifting",
    title: "এসি ডিসম্যান্টল",
    summary: "সেফটি গিয়ার সহ সম্পূর্ণ খুলে প্যাকিং করা।",
    price: "৳১,২০০ - ৳১,৬০০",
    slug: "ac-dismantle",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["গ্যাস রিকভারি", "ডিসকানেক্ট", "প্যাকিং", "হ্যান্ডওভার"],
  },
  {
    id: "shifting",
    categoryId: "shifting",
    title: "এসি শিফটিং সার্ভিস",
    summary: "এক স্থান থেকে অন্য স্থানে খুলে, বহন করে পুনরায় ফিট করা।",
    price: "৳৩,২০০ - ৳৪,৮০০",
    slug: "ac-shifting-service",
    images: [
      "https://images.unsplash.com/photo-1582719478250-0f06ff0c91e7?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ডিমাউন্ট", "ট্রান্সপোর্ট", "মাউন্ট", "ভ্যাকুয়াম", "টেস্ট"],
  },
  {
    id: "relocation",
    categoryId: "shifting",
    title: "এসি রিলোকেশন",
    summary: "সম্পূর্ণ রিলোকেশন প্যাকেজ—ডিমাউন্ট, পরিবহন ও রি-ইনস্টল।",
    price: "৳৪,৫০০ - ৳৬,৫০০",
    slug: "ac-relocation",
    images: [
      "https://images.unsplash.com/photo-1582719478190-5f69c5a616b4?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["সাইট সার্ভে", "ডিমাউন্ট", "শিপ", "রি-ইনস্টল", "টেস্ট"],
  },

  // 6. Compressor & Spares
  {
    id: "spares-compressor",
    categoryId: "spares",
    title: "এসি কম্প্রেসর রিপ্লেসমেন্ট",
    summary: "কম্প্রেসর খুলে নতুনটি ফিট, ভ্যাকুয়াম ও চার্জিংসহ।",
    price: "৳৮,৫০০ - ৳১৫,০০০",
    slug: "ac-compressor-replacement",
    images: [
      "https://images.unsplash.com/photo-1582719478100-76d1d5e8b6ef?auto=format&fit=crop&w=1200&q=80",
    ],
    process: [
      "পুরনো কম্প্রেসর খুলুন",
      "নতুন ফিট",
      "ভ্যাকুয়াম",
      "চার্জিং",
      "টেস্ট",
    ],
  },
  {
    id: "spares-replacement",
    categoryId: "spares",
    title: "এসি স্পেয়ার পার্টস রিপ্লেসমেন্ট",
    summary: "পিসিবি, ফ্যান, সেন্সর, রিমোটসহ প্রয়োজনীয় পার্টস রিপ্লেস।",
    price: "৳১,০০০ - ৳৪,৫০০",
    slug: "ac-spare-parts-replacement",
    images: [
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ডায়াগনস্টিক", "পার্ট সিলেক্ট", "ইনস্টল", "টেস্ট"],
  },
];

export const topLandingServices = [
  "deep-ac-cleaning",
  "basic-ac-cleaning",
  "split-ac-installation",
  "ac-gas-refill",
  "ac-water-leak-repair",
  "ac-shifting-service",
];
