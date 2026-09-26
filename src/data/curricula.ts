export interface EducationServer {
  id: string;
  name: string;
  location: string;
  flag: string;
  provider: string;
  pingMs: number;
  uptime: string;
  status: 'optimal' | 'active' | 'standby';
  description: string;
  specialization: string;
  isDefault?: boolean;
}

export const EDUCATION_SERVERS: EducationServer[] = [
  {
    id: 'alhikmah-cluster-southasia',
    name: 'Al-Hikmah Academic Primary Mesh (Karachi-Riyadh Node)',
    location: 'Karachi / Riyadh High-Speed TPU Hub',
    flag: '🇵🇰🇸🇦',
    provider: 'Al-Hikmah Sovereign Cloud & Neural TPU',
    pingMs: 14,
    uptime: '99.99%',
    status: 'optimal',
    description: 'Specialized for Urdu, Arabic, Quranic/Hadith research, and South Asian / Middle Eastern K-12 to University syllabi.',
    specialization: 'Urdu & Arabic RTL, Islamic Jurisprudence, PTB & FBISE Mathematics',
    isDefault: true,
  },
  {
    id: 'gemini-multimodal-cluster',
    name: 'Google Gemini Multi-Model Neural Cluster (v3.8 / 3.1-Lite)',
    location: 'Global Edge Cloud (Asia-Pacific / Europe / US)',
    flag: '🌐',
    provider: 'Google AI Studio & Vertex Infrastructure',
    pingMs: 22,
    uptime: '99.97%',
    status: 'active',
    description: 'High-throughput multimodal reasoning cluster capable of OCR, code debugging, and step-by-step mathematical proofs.',
    specialization: 'Photo OCR Vision, Algorithmic Code Execution, Advanced Physics & Calculus',
  },
  {
    id: 'cambridge-oxford-scholarly',
    name: 'Cambridge & Oxford Scholarly Engine (London Node)',
    location: 'London, United Kingdom',
    flag: '🇬🇧',
    provider: 'British Academic Grid & CAIE Pipeline',
    pingMs: 38,
    uptime: '99.98%',
    status: 'active',
    description: 'Optimized for Cambridge Assessment International (O/A-Levels, IGCSE), Edexcel, and IB Diploma rigor.',
    specialization: 'Pure Mathematics, Mechanics, English Literature, A-Level Sciences',
  },
  {
    id: 'alazhar-madinah-grid',
    name: 'Al-Azhar & Madinah Islamic Scholarly Node (Cairo-Madinah)',
    location: 'Cairo & Madinah Al-Munawwarah',
    flag: '🇪🇬🇸🇦',
    provider: 'Islamic Classical Research Grid',
    pingMs: 29,
    uptime: '100.0%',
    status: 'optimal',
    description: 'Dedicated classical Islamic sciences repository: Quranic exegesis (Tafsir), Sahih Hadith grading, Usul al-Fiqh, and Arabic Balagha.',
    specialization: 'Authentic Sahih Hadith, Seerah, Islamic Golden Age History, Classical Arabic',
  },
  {
    id: 'siliconvalley-cs-edge',
    name: 'MIT & Silicon Valley CS Edge Accelerator (California Node)',
    location: 'San Jose & Boston, USA',
    flag: '🇺🇸',
    provider: 'Open Computer Science Foundation',
    pingMs: 45,
    uptime: '99.95%',
    status: 'active',
    description: 'Specialized in Data Structures, Algorithms (CLRS), Software Engineering, and AI/Machine Learning pipelines.',
    specialization: 'Python, C++, Java, System Architecture, Time-Space Complexity',
  },
];

export interface CountryCurriculum {
  id: string;
  name: string;
  flag: string;
  boards: string[];
  defaultBoard: string;
  popularBooks: Array<{
    title: string;
    subject: string;
    gradeLevel: string;
    authorOrPublisher: string;
  }>;
}

export const COUNTRIES_AND_CURRICULA: CountryCurriculum[] = [
  {
    id: 'pakistan',
    name: 'Pakistan',
    flag: '🇵🇰',
    boards: [
      'Punjab Curriculum and Textbook Board (PTB)',
      'Federal Board of Intermediate & Secondary Education (FBISE)',
      'Sindh Textbook Board (STBB Jamshoro)',
      'KPK Textbook Board Peshawar',
      'Balochistan Textbook Board Quetta',
      'Aga Khan University Examination Board (AKU-EB)',
      'Cambridge International (O/A Levels in Pakistan)',
      'Higher Education Commission (HEC Pakistan University Syllabi)',
    ],
    defaultBoard: 'Punjab Curriculum and Textbook Board (PTB)',
    popularBooks: [
      { title: 'Mathematics Class 9 (Science Group)', subject: 'Mathematics', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'Punjab Textbook Board (PTB)' },
      { title: 'Mathematics Class 10 (Science Group)', subject: 'Mathematics', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'Punjab Textbook Board (PTB)' },
      { title: 'Physics Class 11 (FSc Pre-Engineering / ICS)', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'Punjab Textbook Board (PTB)' },
      { title: 'Physics Class 12 (Electromagnetism & Modern Physics)', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'PTB / Federal Board' },
      { title: 'Chemistry Class 9 & 10 (Matric)', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'PTB Lahore' },
      { title: 'Computer Science Class 9 & 10 (Python & Algorithms)', subject: 'Computer Science & Coding', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'National Book Foundation (Federal)' },
      { title: 'Islamic Studies / Islamiat Lazmi Class 9-10', subject: 'Islamic Studies & History', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'Punjab Curriculum Board' },
      { title: 'Urdu Lazmi (مرزا غالب، میر تقی میر، علامہ اقبال)', subject: 'Languages & Literature (English & Urdu)', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'Punjab Textbook Board' },
      { title: 'Calculus and Analytic Geometry (FSc Part 2 Math)', subject: 'Mathematics', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'Punjab Textbook Board' },
      { title: 'Seerat-un-Nabi (سیرت النبی ﷺ - شبلی نعمانی و سلیمان ندوی)', subject: 'Islamic Studies & History', gradeLevel: 'General Academics', authorOrPublisher: 'Darul Musannefeen' },
    ],
  },
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia (المملكة العربية السعودية)',
    flag: '🇸🇦',
    boards: [
      'Ministry of Education (وزارة التعليم - مناهج تطوير)',
      'Qiyas National Center for Assessment (قياس التحصيلي والقدرات)',
      'Islamic University of Madinah Curriculum',
      'Umm Al-Qura University (جامعة أم القرى)',
      'King Fahd University of Petroleum & Minerals (KFUPM)',
    ],
    defaultBoard: 'Ministry of Education (وزارة التعليم - مناهج تطوير)',
    popularBooks: [
      { title: 'الرياضيات - المرحلة الثانوية (مقررات مسار العلوم الطبيعية)', subject: 'Mathematics', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'وزارة التعليم السعودية' },
      { title: 'الفيزياء ۳ و ٤ (الفيزياء المتقدمة والكهرومغناطيسية)', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'وزارة التعليم السعودية' },
      { title: 'الحديث والثقافة الإسلامية (جامع السنن وشرح الأحاديث)', subject: 'Islamic Studies & History', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'وزارة التعليم السعودية' },
      { title: 'التوحيد والفقه وأصوله (المرحلة الثانوية)', subject: 'Islamic Studies & History', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'وزارة التعليم السعودية' },
      { title: 'الرحيق المختوم (بحث في السيرة النبوية - المباركفوري)', subject: 'Islamic Studies & History', gradeLevel: 'General Academics', authorOrPublisher: 'رابطة العالم الإسلامي' },
      { title: 'علم البيانات والذكاء الاصطناعي (المرحلة الثانوية مسار الحاسب)', subject: 'Computer Science & Coding', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'وزارة التعليم السعودية' },
    ],
  },
  {
    id: 'uk',
    name: 'United Kingdom (Cambridge & Edexcel)',
    flag: '🇬🇧',
    boards: [
      'Cambridge Assessment International Education (CAIE O-Level / IGCSE)',
      'Cambridge International A-Level (CAIE)',
      'Pearson Edexcel International GCSE & A-Level',
      'Oxford AQA International',
      'UK National Curriculum (Key Stages 3 & 4)',
    ],
    defaultBoard: 'Cambridge Assessment International Education (CAIE O-Level / IGCSE)',
    popularBooks: [
      { title: 'Cambridge IGCSE Mathematics: Core and Extended (Ric Pimentel)', subject: 'Mathematics', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'Hodder Education / Cambridge' },
      { title: 'Cambridge International AS & A Level Mathematics: Pure Mathematics 1 & 2', subject: 'Mathematics', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'Sophie Goldie / Cambridge' },
      { title: 'Cambridge International AS & A Level Physics (David Sang)', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'Cambridge University Press' },
      { title: 'Cambridge IGCSE Computer Science (David Watson & Helen Williams)', subject: 'Computer Science & Coding', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'Hodder Education' },
      { title: 'AQA GCSE Biology Student Book', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'Oxford University Press' },
    ],
  },
  {
    id: 'uae',
    name: 'United Arab Emirates (دولة الإمارات العربية المتحدة)',
    flag: '🇦🇪',
    boards: [
      'Ministry of Education UAE (وزارة التربية والتعليم)',
      'Abu Dhabi Department of Education and Knowledge (ADEK)',
      'Knowledge and Human Development Authority (KHDA Dubai)',
      'Emirates Standardized Test (EmSAT Achieve)',
    ],
    defaultBoard: 'Ministry of Education UAE (وزارة التربية والتعليم)',
    popularBooks: [
      { title: 'Advanced Math Track - Grade 12 (EmSAT Prep)', subject: 'Mathematics', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'UAE Ministry of Education' },
      { title: 'Islamic Education Grade 10 & 11 (التربية الإسلامية)', subject: 'Islamic Studies & History', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'UAE MoE' },
      { title: 'Physics Advanced Grade 11 & 12', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'McGraw-Hill / UAE MoE' },
      { title: 'Computer Science & AI Grade 11', subject: 'Computer Science & Coding', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'UAE MoE' },
    ],
  },
  {
    id: 'usa',
    name: 'United States of America',
    flag: '🇺🇸',
    boards: [
      'College Board Advanced Placement (AP Curriculum)',
      'Common Core State Standards (CCSS)',
      'International Baccalaureate (IB North America)',
      'SAT & ACT College Entrance Curriculum',
    ],
    defaultBoard: 'College Board Advanced Placement (AP Curriculum)',
    popularBooks: [
      { title: 'Calculus: Early Transcendentals (8th/9th Ed - James Stewart)', subject: 'Mathematics', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'Cengage Learning' },
      { title: 'Introduction to Algorithms (CLRS 4th Edition)', subject: 'Computer Science & Coding', gradeLevel: 'Undergraduate / College (BS CS / Math / Sciences)', authorOrPublisher: 'MIT Press (Cormen, Leiserson, Rivest, Stein)' },
      { title: 'University Physics with Modern Physics (Young & Freedman)', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Undergraduate / College (BS CS / Math / Sciences)', authorOrPublisher: 'Pearson' },
      { title: 'Campbell Biology (12th Edition)', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'Pearson' },
      { title: 'AP Computer Science A: Java Programming (Barron\'s / Princeton)', subject: 'Computer Science & Coding', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'College Board' },
    ],
  },
  {
    id: 'india',
    name: 'India',
    flag: '🇮🇳',
    boards: [
      'National Council of Educational Research and Training (NCERT)',
      'Central Board of Secondary Education (CBSE)',
      'Indian Certificate of Secondary Education (ICSE / ISC)',
      'JEE Main & Advanced / NEET National Prep',
    ],
    defaultBoard: 'Central Board of Secondary Education (CBSE)',
    popularBooks: [
      { title: 'NCERT Mathematics Class 10', subject: 'Mathematics', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'NCERT New Delhi' },
      { title: 'NCERT Mathematics Class 11 & 12 (Calculus & Vectors)', subject: 'Mathematics', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'NCERT New Delhi' },
      { title: 'Concepts of Physics (Part 1 & 2 - H.C. Verma)', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'Bharati Bhawan' },
      { title: 'Computer Science with Python Class 12 (Sumita Arora)', subject: 'Computer Science & Coding', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'Dhanpat Rai & Co.' },
    ],
  },
  {
    id: 'egypt',
    name: 'Egypt (جمهورية مصر العربية)',
    flag: '🇪🇬',
    boards: [
      'Al-Azhar Al-Sharif Secondary Curriculum (قطاع المعاهد الأزهرية)',
      'Ministry of Education Egypt (الثانوية العامة المصرية)',
      'Cairo University Faculty of Engineering & Sciences',
    ],
    defaultBoard: 'Al-Azhar Al-Sharif Secondary Curriculum (قطاع المعاهد الأزهرية)',
    popularBooks: [
      { title: 'تيسير التفسير وشرح آيات الأحكام (الأزهر الشريف)', subject: 'Islamic Studies & History', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'قطاع المعاهد الأزهرية' },
      { title: 'تيسير مصطلح الحديث (د. محمود الطحان)', subject: 'Islamic Studies & History', gradeLevel: 'Undergraduate / College (BS CS / Math / Sciences)', authorOrPublisher: 'دار الحديث القاهرة' },
      { title: 'الرياضيات البحتة والتطبيقية (الثانوية العامة المصرية)', subject: 'Mathematics', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'وزارة التربية والتعليم المصرية' },
      { title: 'البداية والنهاية (ابن كثير - تحقيق ودراسة تاريخية)', subject: 'Islamic Studies & History', gradeLevel: 'Postgraduate / Master\'s (MS / MPhil)', authorOrPublisher: 'دار ابن كثير' },
    ],
  },
  {
    id: 'turkey',
    name: 'Turkey (Türkiye)',
    flag: '🇹🇷',
    boards: [
      'Milli Eğitim Bakanlığı (MEB Anadolu ve Fen Lisesi)',
      'Diyanet İşleri Başkanlığı İlahiyat Müfredatı',
      'ÖSYM YKS (TYT / AYT Üniversite Sınavı)',
    ],
    defaultBoard: 'Milli Eğitim Bakanlığı (MEB Anadolu ve Fen Lisesi)',
    popularBooks: [
      { title: 'MEB 11. ve 12. Sınıf İleri Matematik (Türev ve İntegral)', subject: 'Mathematics', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'Milli Eğitim Bakanlığı' },
      { title: 'Fizik 11. Sınıf (Mekanik ve Elektromanyetizma)', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)', authorOrPublisher: 'MEB Devlet Kitapları' },
      { title: 'İslam Kültür ve Medeniyeti (İmam Hatip Liseleri)', subject: 'Islamic Studies & History', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'MEB Din Öğretimi' },
    ],
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    flag: '🇲🇾',
    boards: [
      'Kementerian Pendidikan Malaysia (SPM / STPM KSSM)',
      'Jabatan Kemajuan Islam Malaysia (JAKIM Pendidikan Islam)',
      'Majlis Peperiksaan Malaysia',
    ],
    defaultBoard: 'Kementerian Pendidikan Malaysia (SPM / STPM KSSM)',
    popularBooks: [
      { title: 'Matematik Tambahan Tingkatan 4 & 5 (Additional Mathematics KSSM)', subject: 'Mathematics', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'Kementerian Pendidikan Malaysia' },
      { title: 'Pendidikan Islam Tingkatan 4 & 5 (Akidah, Ibadah, Sirah)', subject: 'Islamic Studies & History', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'Dewan Bahasa dan Pustaka' },
      { title: 'Fizik Tingkatan 4 & 5 KSSM', subject: 'Natural Sciences (Physics/Chem/Bio)', gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)', authorOrPublisher: 'DBP Malaysia' },
    ],
  },
];
