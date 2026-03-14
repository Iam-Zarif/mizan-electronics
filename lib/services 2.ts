export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
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

export const serviceCategories: ServiceCategory[] = [
  {
    id: "maintenance",
    name: "সার্ভিসিং ও ডিপ ক্লিন",
    description:
      "ইনডোর/আউটডোর জেট ওয়াশ, টিউন-আপ, ব্লোয়ার ক্লিন ও পারফরম্যান্স চেক।",
    image:
      "https://i0.wp.com/24sevendays.com/wp-content/uploads/2019/02/split-ac-jet-pump-service-by-experts.png?fit=600%2C800&ssl=1",
  },
  {
    id: "installation",
    name: "এসি ইনস্টলেশন ও আনইনস্টল",
    description: "নিরাপদ মাউন্টিং/ডিমাউন্ট, ভ্যাকুয়াম ও লিক টেস্টসহ পেশাদার সেটআপ।",
    image:
      "https://www.beachandsons.com/app/uploads/2022/12/71844429-ac-808x606-1.jpeg",
  },
  {
    id: "gas",
    name: "গ্যাস রিফিল ও কুলিং হেলথ",
    description: "রেফ্রিজারেন্ট চার্জ, প্রেসার ব্যালেন্স, লিক সার্চ ও কুলিং টিউন।",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2023/5/307730546/CY/MN/MJ/48593301/ac-gas-refilling-services.jpeg",
  },
  {
    id: "repair",
    name: "এসি রিপেয়ার",
    description: "কম্প্রেসর, মোটর, PCB ও বৈদ্যুতিক সমস্যা সমাধান।",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2021/8/XL/OQ/KR/35540727/inverter-ac-repairing-service.jpg",
  },
];

export const serviceItems: ServiceItem[] = [
  {
    id: "basic-servicing",
    categoryId: "maintenance",
    title: "বেসিক এসি সার্ভিস",
    summary: "ফিল্টার পরিষ্কার, কনডেনসার ব্রাশ, ড্রেন লাইন চেক ও পারফরম্যান্স টেস্ট।",
    price: "৳১,২০০ - ৳১,৮০০",
    slug: "basic-ac-service",
    images: [
      "https://images.unsplash.com/photo-1604328471151-dc9b1bda3caa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1597004897490-0e8c6d6f8c2c?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["পরিদর্শন", "ফিল্টার ক্লিনিং", "কনডেনসার ব্রাশ", "গ্যাস প্রেসার চেক", "ফাইনাল টেস্ট"],
  },
  {
    id: "deep-servicing",
    categoryId: "maintenance",
    title: "ডিপ এসি সার্ভিসিং",
    summary: "ইনডোর-আউটডোর জেট ওয়াশ, ব্লোয়ার ডিসঅ্যাসেম্বলি ও ড্রেন স্যানিটাইজ।",
    price: "৳১,৮০০ - ৳২,৮০০",
    slug: "deep-ac-servicing",
    images: [
      "https://images.unsplash.com/photo-1525684351541-6b769c2e2317?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-0f06ff0c91e7?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["পূর্ণ পরিদর্শন", "ব্লোয়ার খুলে ওয়াশ", "ইনডোর জেট ওয়াশ", "আউটডোর ডিপ ক্লিন", "গ্যাস প্রেসার ব্যালেন্স"],
  },
  {
    id: "jet-wash",
    categoryId: "maintenance",
    title: "জেট ওয়াশ সার্ভিস",
    summary: "হাই-প্রেশার জেট দিয়ে কুলিং কয়েল ও ফিন ক্লিনিং, ড্রেন লাইন ফ্লাশ।",
    price: "৳২,২০০ - ৳৩,২০০",
    slug: "jet-wash-ac-service",
    images: [
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["সেফটি কভার", "হাই প্রেশার জেট", "কয়েল ডিগ্রিজ", "ড্রেন ফ্লাশ", "ফাইনাল স্যানিটাইজ"]
  },
  {
    id: "split-install",
    categoryId: "installation",
    title: "স্প্লিট এসি ইনস্টলেশন",
    summary: "মাউন্টিং, ভ্যাকুয়াম, সঠিক কপার লাইন লেআউট ও কেব্‌ল ম্যানেজমেন্ট।",
    price: "৳৩,৫০০ - ৳৪,৫০০",
    slug: "split-ac-installation",
    images: [
      "https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["সাইট চেক", "মাউন্টিং", "ভ্যাকুয়াম ও লিক টেস্ট", "পাওয়ার কানেকশন", "কুলিং টিউন"],
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
    process: ["ওপেনিং প্রেপ", "মাউন্ট", "সিলিং", "ইলেকট্রিক সংযোগ", "টেস্ট রান"],
  },
  {
    id: "gas-refill",
    categoryId: "gas",
    title: "এসি গ্যাস রিফিল",
    summary: "সিস্টেম ভ্যাকুয়াম, প্রেসার চেক, লিক টেস্ট ও সঠিক রেফ্রিজারেন্ট চার্জ।",
    price: "৳২,০০০ - ৳৩,২০০",
    slug: "ac-gas-refill",
    images: [
      "https://images.unsplash.com/photo-1604328471355-0c5c30a6dabc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478248-54e9f2ab39f2?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["লিক সার্চ", "ভ্যাকুয়াম", "চার্জিং", "প্রেসার ব্যালেন্স", "পারফরম্যান্স টেস্ট"],
  },
  {
    id: "gas-health-check",
    categoryId: "gas",
    title: "কুলিং হেলথ চেক",
    summary: "প্রেসার ডায়াগনস্টিক, সাবকুলিং/সুপারহিট মাপ ও এনার্জি টিউনিং রিপোর্ট।",
    price: "৳১,২০০ - ৳১,৬০০",
    slug: "ac-cooling-health",
    images: [
      "https://images.unsplash.com/photo-1604328471355-0c5c30a6dabc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1597004897539-7553e237209d?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["প্রেসার রিডিং", "লিক কুইক-চেক", "ব্যালেন্সিং", "রিপোর্ট"],
  },
  {
    id: "uninstallation",
    categoryId: "installation",
    title: "এসি আনইনস্টল",
    summary: "রেফ্রিজারেন্ট রিকভারি, কপার ও ক্যাবল সুরক্ষা সহ খুলে ফেলা।",
    price: "৳১,২০০ - ৳১,৮০০",
    slug: "ac-uninstallation",
    images: [
      "https://images.unsplash.com/photo-1582719478190-5f69c5a616b4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["প্রি-চেক", "গ্যাস রিকভারি", "ইউনিট ডিসকানেক্ট", "প্যাকিং", "সাইট ক্লিনআপ"],
  },
  {
    id: "pcb-repair",
    categoryId: "repair",
    title: "PCB ও ইলেকট্রিকাল রিপেয়ার",
    summary: "PCB, কন্টাক্টর, ক্যাপাসিটর ও সেন্সর ট্রাবলশুট ও রিপেয়ার।",
    price: "৳১,২০০ - ৳৩,০০০",
    slug: "ac-pcb-repair",
    images: [
      "https://images.unsplash.com/photo-1582719478100-76d1d5e8b6ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80",
    ],
    process: ["ডায়াগনস্টিক", "কম্পোনেন্ট চেক", "রিপেয়ার/রিপ্লেস", "সোল্ডারিং", "টেস্ট রান"],
  },
];

export const testimonials = [
  {
    name: "রায়হান কবির",
    comment: "ডিপ সার্ভিসিং নেওয়ার পর কুলিং অনেক ভালো হয়েছে। টিম সময়মতো এসে পুরো ফ্লোর পরিষ্কার রেখেছে।",
    rating: 5,
    location: "ধানমন্ডি, ঢাকা",
  },
  {
    name: "মেহজাবিন সুলতানা",
    comment: "ইনস্টলেশন টিম খুব প্রফেশনাল। ভ্যাকুয়াম ও লিক টেস্ট করে দিয়েছে, বিল্ড কোয়ালিটি চমৎকার।",
    rating: 5,
    location: "বনানী, ঢাকা",
  },
  {
    name: "সাব্বির রহমান",
    comment: "গ্যাস রিফিলের পর বিদ্যুৎ খরচ কমেছে। রিপোর্ট ও ফটো শেয়ার করেছে—বিশ্বাসযোগ্য সার্ভিস।",
    rating: 4.8,
    location: "উত্তরা, ঢাকা",
  },
];
