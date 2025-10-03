export type LocaleText = { az: string; en: string };

export type Article = {
  id: string | number;
  title: LocaleText;
  date: string; // YYYY-MM-DD
  short_text: LocaleText;
  image: string;
  body: LocaleText;
};

export type PageItem = {
  id: string | number;
  title: LocaleText;
  short_text: LocaleText;
  image: string;
  body: LocaleText; // may contain HTML
};

export type MediaItem = {
  id: string | number;
  type: "photo" | "video";
  url: string;
  thumbnail?: string;
  caption?: LocaleText;
  date?: string;
};

export type Album = {
  id: string | number;
  title: LocaleText;
  description: LocaleText;
  thumbnail: string;
  date: string;
  media: MediaItem[];
};

export type GeneralInfo = {
  title: string;
  content: string;
  image: string;
};

export type Section = {
  id:
    | "ministry"
    | "news"
    | "energy-stats"
    | "renewables"
    | "efficiency"
    | "international"
    | "gallery"
    | "public-relations"
    | "contact";
  title_az: string;
  title_en: string;
  general_info: GeneralInfo;
  articles: Article[];
  pages?: PageItem[];
  albums?: Album[];
};

export type BoardData = {
  menu: Section[];
};

export const boardData: BoardData = {
  menu: [
    {
      id: "ministry",
      title_az: "Nazirlik",
      title_en: "Ministry",
      general_info: { title: "", content: "", image: "/placeholder.svg" },
      pages: [
        {
          id: "ministry",
          title: { az: "Nazirlik", en: "Ministry" },
          short_text: { az: "Nazirlik haqqında ümumi məlumat", en: "General information about the Ministry" },
          image: "/placeholder.svg",
          body: {
            az: "<p>Azərbaycan Respublikasının Energetika Nazirliyi ölkənin enerji sektorunun tənzimlənməsi və inkişafı sahəsində əsas dövlət orqanıdır. Nazirlik enerji təhlükəsizliyinin təmin edilməsi, enerji səmərəliliyinin artırılması, bərpa olunan enerji mənbələrinin inkişafı və beynəlxalq enerji əməkdaşlığı sahələrində fəaliyyət göstərir.</p>",
            en: "<p>The Ministry of Energy of the Republic of Azerbaijan is the main state body responsible for regulating and developing the country's energy sector. The Ministry operates in the areas of ensuring energy security, increasing energy efficiency, developing renewable energy sources and international energy cooperation.</p>",
          },
        },
        {
          id: "minister",
          title: { az: "Nazir", en: "Minister" },
          short_text: { az: "Nazir haqqında", en: "About the Minister" },
          image: "/placeholder.svg",
          body: {
            az: "<p>Energetika Naziri ölkənin enerji siyasətinin formalaşdırılması və həyata keçirilməsində əsas rolu oynayır. Nazir enerji t��hlükəsizliyinin təmin edilməsi, enerji infrastrukturunun modernləşdirilməsi və beynəlxalq enerji layihələrinin idarə edilməsi sahələrində məsuliyyət daşıyır.</p>",
            en: "<p>The Minister of Energy plays a key role in formulating and implementing the country's energy policy. The Minister is responsible for ensuring energy security, modernizing energy infrastructure and managing international energy projects.</p>",
          },
        },
        {
          id: "deputies",
          title: { az: "Nazir müavinləri", en: "Deputy Ministers" },
          short_text: { az: "Nazir müavinləri haqqında", en: "About deputy ministers" },
          image: "/placeholder.svg",
          body: {
            az: "<p>Nazir müavinləri nazirliyın müxtəlif istiqamətləri üzrə fəaliyyətini koordinasiya edirlər. Onlar bərpa olunan enerji, enerji səmərəliliyi, beynəlxalq əməkdaşlıq və digər sahələr üzrə ixtisaslaşırlar.</p>",
            en: "<p>Deputy Ministers coordinate the ministry's activities in various directions. They specialize in renewable energy, energy efficiency, international cooperation and other areas.</p>",
          },
        },
      ],
      articles: [
        {
          id: 101,
          title: {
            az: "Nazirliyin strukturu yeniləndi",
            en: "Ministry structure updated",
          },
          date: "2025-03-10",
          short_text: {
            az: "Yeni şöbələr təsdiq olundu.",
            en: "New departments approved.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Nazirliyin təşkilati strukturunda dəyişikliklər edildi.",
            en: "Changes were made to the organizational structure.",
          },
        },
        {
          id: 102,
          title: {
            az: "Vətəndaş qəbulu cədvəli",
            en: "Citizen reception schedule",
          },
          date: "2025-04-05",
          short_text: {
            az: "Qəbul günləri haqqında məlumat.",
            en: "Information about reception days.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Qəbul saatları və qeydiyyat qaydaları açıqlanıb.",
            en: "Reception hours and registration rules announced.",
          },
        },
      ],
    },
    {
      id: "news",
      title_az: "Xəbərlər və Elanlar",
      title_en: "News & Announcements",
      general_info: { title: "", content: "", image: "/placeholder.svg" },
      articles: [
        {
          id: 201,
          title: { az: "Enerji forumu keçirildi", en: "Energy forum held" },
          date: "2025-05-15",
          short_text: {
            az: "Enerji sektorunda yeniliklər müzakirə olundu.",
            en: "Latest developments in the energy sector were discussed.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Enerji forumunda bir sıra mövzular üzrə təqdimatlar edildi.",
            en: "At the energy forum, several topics were presented and discussed.",
          },
        },
        {
          id: 202,
          title: {
            az: "Yeni layihələr elan olundu",
            en: "New projects announced",
          },
          date: "2025-06-20",
          short_text: {
            az: "Regionlarda investisiya layihələri.",
            en: "Investment projects in regions.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Bir neçə istiqamət üzrə yeni layihələr təqdim edildi.",
            en: "Several new projects were introduced.",
          },
        },
      ],
    },
    {
      id: "energy-stats",
      title_az: "Enerji Statistikası",
      title_en: "Energy Statistics",
      general_info: { title: "", content: "", image: "/placeholder.svg" },
      articles: [
        {
          id: 301,
          title: {
            az: "Elektrik istehsalı artdı",
            en: "Electricity production increased",
          },
          date: "2025-02-01",
          short_text: {
            az: "İllik göstəricilər açıqlanıb.",
            en: "Annual indicators announced.",
          },
          image: "/placeholder.svg",
          body: {
            az: "İstehsalda artım qeydə alındı.",
            en: "Increase recorded in production.",
          },
        },
        {
          id: 302,
          title: { az: "İstehlak strukturu", en: "Consumption structure" },
          date: "2025-01-12",
          short_text: { az: "Sahələr üzrə pay.", en: "Share by sectors." },
          image: "/placeholder.svg",
          body: {
            az: "Müxtəlif sahələr üzrə istehlak payı təqdim edildi.",
            en: "Consumption share by sectors presented.",
          },
        },
      ],
    },
    {
      id: "renewables",
      title_az: "Bərpa Olunan Enerji",
      title_en: "Renewable Energy",
      general_info: { title: "", content: "", image: "/placeholder.svg" },
      articles: [
        {
          id: 401,
          title: {
            az: "Günəş stansiyası istifadəyə verildi",
            en: "Solar plant commissioned",
          },
          date: "2025-02-18",
          short_text: {
            az: "Yeni güc əlavə olundu.",
            en: "New capacity added.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Günəş enerjisi layihəsi tamamlandı.",
            en: "Solar energy project completed.",
          },
        },
        {
          id: 402,
          title: { az: "Külək parkında sınaqlar", en: "Wind farm tests" },
          date: "2025-03-03",
          short_text: {
            az: "Sınaqlar uğurla başa çatdı.",
            en: "Tests completed successfully.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Külək turbinlərində sınaqlar aparıldı.",
            en: "Tests were carried out on wind turbines.",
          },
        },
      ],
    },
    {
      id: "efficiency",
      title_az: "Enerji Səmərəliliyi",
      title_en: "Energy Efficiency",
      general_info: { title: "", content: "", image: "/placeholder.svg" },
      articles: [
        {
          id: 501,
          title: {
            az: "Binalarda səmərəlilik tədbirləri",
            en: "Efficiency in buildings",
          },
          date: "2025-04-02",
          short_text: {
            az: "Yeni standartlar qüvvədədir.",
            en: "New standards effective.",
          },
          image: "/placeholder.svg",
          body: {
            az: "İstilik izolyasiyası üzrə tövsiyələr.",
            en: "Thermal insulation recommendations.",
          },
        },
        {
          id: 502,
          title: { az: "Sənayedə qənaət", en: "Savings in industry" },
          date: "2025-04-20",
          short_text: { az: "Modernizasiya planı.", en: "Modernization plan." },
          image: "/placeholder.svg",
          body: {
            az: "Avadanlığın yenilənməsi ilə qənaət əldə olunur.",
            en: "Savings achieved by upgrading equipment.",
          },
        },
      ],
    },
    {
      id: "international",
      title_az: "Beynəlxalq Əməkdaşlıq",
      title_en: "International Cooperation",
      general_info: { title: "", content: "", image: "/placeholder.svg" },
      articles: [
        {
          id: 601,
          title: { az: "İkitərəfli görüş", en: "Bilateral meeting" },
          date: "2025-01-22",
          short_text: {
            az: "Enerji sahəsində əməkdaşlıq.",
            en: "Cooperation in energy.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Görüş zamanı müqavilələr müzakirə edildi.",
            en: "Agreements discussed during the meeting.",
          },
        },
        {
          id: 602,
          title: { az: "Regional konfrans", en: "Regional conference" },
          date: "2025-02-10",
          short_text: {
            az: "Forumda çıxışlar edildi.",
            en: "Presentations at the forum.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Bir sıra ölkəl��rin nümayəndələri iştirak etdi.",
            en: "Representatives of several countries attended.",
          },
        },
      ],
    },
    {
      id: "gallery",
      title_az: "Video və Foto Qalereya",
      title_en: "Video & Photo Gallery",
      general_info: { title: "", content: "", image: "/placeholder.svg" },
      articles: [],
      albums: [
        {
          id: 701,
          title: { az: "Enerji Forumu 2025", en: "Energy Forum 2025" },
          description: { az: "Beynəlxalq enerji forumundan foto və videolar", en: "Photos and videos from the international energy forum" },
          thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
          date: "2025-03-15",
          media: [
            {
              id: "p1",
              type: "photo",
              url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
              caption: { az: "Forum açılış mərasimi", en: "Forum opening ceremony" }
            },
            {
              id: "p2",
              type: "photo",
              url: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&h=600&fit=crop",
              caption: { az: "Panel diskussiyası", en: "Panel discussion" }
            },
            {
              id: "v1",
              type: "video",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
              caption: { az: "Forum icmal videosu", en: "Forum summary video" }
            },
            {
              id: "p3",
              type: "photo",
              url: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop",
              caption: { az: "Texnoloji sərgi", en: "Technology exhibition" }
            }
          ]
        },
        {
          id: 702,
          title: { az: "Bərpa Olunan Enerji Layihələri", en: "Renewable Energy Projects" },
          description: { az: "Günəş və külək elektrik stansiyalarından görüntülər", en: "Images from solar and wind power stations" },
          thumbnail: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
          date: "2025-02-20",
          media: [
            {
              id: "p4",
              type: "photo",
              url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
              caption: { az: "Günəş elektrik stansiyası", en: "Solar power station" }
            },
            {
              id: "p5",
              type: "photo",
              url: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&h=600&fit=crop",
              caption: { az: "Külək turbinləri", en: "Wind turbines" }
            },
            {
              id: "v2",
              type: "video",
              url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              thumbnail: "https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg",
              caption: { az: "Bərpa olunan enerji texnologiyaları", en: "Renewable energy technologies" }
            }
          ]
        },
        {
          id: 703,
          title: { az: "Nazirlik Fəaliyyəti", en: "Ministry Activities" },
          description: { az: "Nazirliyin günlük fəaliyyətindən kadrlar", en: "Scenes from the ministry's daily activities" },
          thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          date: "2025-01-10",
          media: [
            {
              id: "p6",
              type: "photo",
              url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
              caption: { az: "İş görüşü", en: "Business meeting" }
            },
            {
              id: "p7",
              type: "photo",
              url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
              caption: { az: "Komanda işi", en: "Teamwork" }
            },
            {
              id: "p8",
              type: "photo",
              url: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=600&fit=crop",
              caption: { az: "Prezentasiya", en: "Presentation" }
            }
          ]
        }
      ],
    },
    {
      id: "public-relations",
      title_az: "İctimaiyyətlə Əlaqələr",
      title_en: "Public Relations",
      general_info: { title: "", content: "", image: "/placeholder.svg" },
      articles: [
        {
          id: 801,
          title: { az: "Mətbuat açıqlaması", en: "Press release" },
          date: "2025-05-01",
          short_text: {
            az: "Yeni qaydalar elan edildi.",
            en: "New rules announced.",
          },
          image: "/placeholder.svg",
          body: {
            az: "İctimaiyyət üçün məlumatlandırma.",
            en: "Public information.",
          },
        },
        {
          id: 802,
          title: { az: "Sosial layihə", en: "Social project" },
          date: "2025-05-12",
          short_text: {
            az: "Maarifləndirmə kampaniyası.",
            en: "Awareness campaign.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Kampaniyanın məqsədləri açıqlanıb.",
            en: "Campaign objectives explained.",
          },
        },
      ],
    },
    {
      id: "contact",
      title_az: "Əlaqə Məlumatları",
      title_en: "Contact Information",
      general_info: { title: "", content: "", image: "/placeholder.svg" },
      articles: [
        {
          id: 901,
          title: { az: "Qaynar xətt", en: "Hotline" },
          date: "2025-01-05",
          short_text: {
            az: "Əlaqə nömrələri təqdim olunur.",
            en: "Contact numbers provided.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Qaynar xəttin iş saatları.",
            en: "Hotline working hours.",
          },
        },
        {
          id: 902,
          title: { az: "Müraciət forması", en: "Application form" },
          date: "2025-02-14",
          short_text: {
            az: "Onlayn müraciət imkanı.",
            en: "Online application available.",
          },
          image: "/placeholder.svg",
          body: {
            az: "Müraciət qaydaları barədə məlumat.",
            en: "Information on application rules.",
          },
        },
      ],
    },
  ],
};
