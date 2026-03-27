-- 013_seed_data.sql
-- Demo / development seed data for Alumni Connect
-- Password for ALL demo accounts: Demo1234!
-- Run with: supabase db reset

BEGIN;

-- ============================================================
-- 1. AUTH USERS (trigger will auto-create basic profile rows)
-- ============================================================

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_sso_user
) VALUES
  ('00000000-0000-0000-0000-000000000000',
   'a0000001-0000-0000-0000-000000000001',
   'authenticated', 'authenticated', 'alexandros@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Αλέξανδρος","last_name":"Παπαδόπουλος"}'::jsonb,
   now() - interval '6 years', now(), false),

  ('00000000-0000-0000-0000-000000000000',
   'a0000002-0000-0000-0000-000000000002',
   'authenticated', 'authenticated', 'sofia@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Σοφία","last_name":"Κωνσταντίνου"}'::jsonb,
   now() - interval '5 years', now(), false),

  ('00000000-0000-0000-0000-000000000000',
   'a0000003-0000-0000-0000-000000000003',
   'authenticated', 'authenticated', 'giorgis@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Γιώργης","last_name":"Αθανασίου"}'::jsonb,
   now() - interval '4 years', now(), false),

  ('00000000-0000-0000-0000-000000000000',
   'a0000004-0000-0000-0000-000000000004',
   'authenticated', 'authenticated', 'eleni@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Ελένη","last_name":"Νικολάου"}'::jsonb,
   now() - interval '3 years', now(), false),

  ('00000000-0000-0000-0000-000000000000',
   'a0000005-0000-0000-0000-000000000005',
   'authenticated', 'authenticated', 'kostas@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Κωνσταντίνος","last_name":"Δημητρίου"}'::jsonb,
   now() - interval '2 years', now(), false),

  ('00000000-0000-0000-0000-000000000000',
   'a0000006-0000-0000-0000-000000000006',
   'authenticated', 'authenticated', 'maria@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Μαρία","last_name":"Παπανικολάου"}'::jsonb,
   now() - interval '2 years', now(), false),

  ('00000000-0000-0000-0000-000000000000',
   'a0000007-0000-0000-0000-000000000007',
   'authenticated', 'authenticated', 'nikos@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Νίκος","last_name":"Γεωργίου"}'::jsonb,
   now() - interval '1 year', now(), false),

  ('00000000-0000-0000-0000-000000000000',
   'a0000008-0000-0000-0000-000000000008',
   'authenticated', 'authenticated', 'anna@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Άννα","last_name":"Σταματίου"}'::jsonb,
   now() - interval '6 months', now(), false),

  ('00000000-0000-0000-0000-000000000000',
   'a0000009-0000-0000-0000-000000000009',
   'authenticated', 'authenticated', 'stavros@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Σταύρος","last_name":"Μιχαηλίδης"}'::jsonb,
   now() - interval '3 years', now(), false),

  ('00000000-0000-0000-0000-000000000000',
   'a0000010-0000-0000-0000-000000000010',
   'authenticated', 'authenticated', 'theodora@demo.gr',
   crypt('Demo1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Θεοδώρα","last_name":"Βασιλείου"}'::jsonb,
   now() - interval '1 year', now(), false);

-- ============================================================
-- 2. PROFILES (UPDATE rows auto-created by trigger)
--    Setting membership_number explicitly prevents the
--    assign_membership_number trigger from overwriting it.
-- ============================================================

UPDATE profiles SET
  membership_number   = 'ALU-2020-00001',
  first_name          = 'Αλέξανδρος',
  last_name           = 'Παπαδόπουλος',
  first_name_en       = 'Alexandros',
  last_name_en        = 'Papadopoulos',
  graduation_year     = 1998,
  department          = 'Τμήμα Πληροφορικής & Τηλεπικοινωνιών',
  current_position    = 'CEO & Co-Founder',
  current_company     = 'TechVentures AE',
  industry            = 'Τεχνολογία',
  bio                 = 'Απόφοιτος του 1998, ίδρυσα την TechVentures το 2005. Πάθος για την καινοτομία και το entrepreneurship. Χαρούμενος να βοηθώ νέους αποφοίτους.',
  bio_en              = 'Class of 1998 graduate, founded TechVentures in 2005. Passionate about innovation and entrepreneurship. Happy to mentor recent graduates.',
  city                = 'Αθήνα',
  country             = 'Ελλάδα',
  linkedin_url        = 'https://linkedin.com/in/alexandros-demo',
  is_mentor           = false,
  membership_status   = 'active',
  role                = 'super_admin',
  language_pref       = 'el',
  onboarding_completed = true
WHERE id = 'a0000001-0000-0000-0000-000000000001';

UPDATE profiles SET
  membership_number   = 'ALU-2021-00001',
  first_name          = 'Σοφία',
  last_name           = 'Κωνσταντίνου',
  first_name_en       = 'Sofia',
  last_name_en        = 'Konstantinou',
  graduation_year     = 2003,
  department          = 'Τμήμα Διοίκησης Επιχειρήσεων',
  current_position    = 'Head of Operations',
  current_company     = 'Alumni Connect',
  industry            = 'Εκπαίδευση',
  bio                 = 'Υπεύθυνη Λειτουργίας του Alumni Connect. Αφοσιωμένη στη δημιουργία ισχυρής κοινότητας αποφοίτων.',
  bio_en              = 'Head of Operations at Alumni Connect. Dedicated to building a strong alumni community.',
  city                = 'Αθήνα',
  country             = 'Ελλάδα',
  linkedin_url        = 'https://linkedin.com/in/sofia-demo',
  is_mentor           = false,
  membership_status   = 'active',
  role                = 'admin',
  language_pref       = 'el',
  onboarding_completed = true
WHERE id = 'a0000002-0000-0000-0000-000000000002';

UPDATE profiles SET
  membership_number   = 'ALU-2018-00001',
  first_name          = 'Γιώργης',
  last_name           = 'Αθανασίου',
  first_name_en       = 'Giorgos',
  last_name_en        = 'Athanassiou',
  graduation_year     = 2008,
  department          = 'Τμήμα Μηχανολογίας',
  current_position    = 'Senior Software Engineer',
  current_company     = 'Google Hellas',
  industry            = 'Τεχνολογία',
  bio                 = 'Software Engineer με 15 χρόνια εμπειρία σε distributed systems. Mentor στο πρόγραμμα αποφοίτων από το 2019.',
  bio_en              = 'Software Engineer with 15 years in distributed systems. Mentoring alumni since 2019.',
  city                = 'Αθήνα',
  country             = 'Ελλάδα',
  linkedin_url        = 'https://linkedin.com/in/giorgis-demo',
  is_mentor           = true,
  membership_status   = 'active',
  role                = 'verified_member',
  language_pref       = 'el',
  onboarding_completed = true
WHERE id = 'a0000003-0000-0000-0000-000000000003';

UPDATE profiles SET
  membership_number   = 'ALU-2022-00001',
  first_name          = 'Ελένη',
  last_name           = 'Νικολάου',
  first_name_en       = 'Eleni',
  last_name_en        = 'Nikolaou',
  graduation_year     = 2015,
  department          = 'Τμήμα Μάρκετινγκ',
  current_position    = 'Marketing Manager',
  current_company     = 'OmegaBrands',
  industry            = 'Μάρκετινγκ & Επικοινωνία',
  bio                 = 'Ειδικός στο digital marketing και brand strategy. Αγαπώ να δικτυώνομαι και να ανταλλάσσω ιδέες με συναδέλφους αποφοίτους.',
  bio_en              = 'Digital marketing and brand strategy specialist. Love networking and exchanging ideas with fellow alumni.',
  city                = 'Θεσσαλονίκη',
  country             = 'Ελλάδα',
  linkedin_url        = 'https://linkedin.com/in/eleni-demo',
  is_mentor           = false,
  membership_status   = 'active',
  role                = 'verified_member',
  language_pref       = 'el',
  onboarding_completed = true
WHERE id = 'a0000004-0000-0000-0000-000000000004';

UPDATE profiles SET
  membership_number   = 'ALU-2023-00001',
  first_name          = 'Κωνσταντίνος',
  last_name           = 'Δημητρίου',
  first_name_en       = 'Konstantinos',
  last_name_en        = 'Dimitriou',
  graduation_year     = 2018,
  department          = 'Τμήμα Οικονομικών',
  current_position    = 'Financial Analyst',
  current_company     = 'Alpha Bank',
  industry            = 'Χρηματοοικονομικά',
  bio                 = 'Αναλυτής στην Alpha Bank. Ενδιαφέρομαι για fintech και επενδύσεις. Αναζητώ mentor στον χώρο.',
  bio_en              = 'Analyst at Alpha Bank. Interested in fintech and investments. Looking for a mentor.',
  city                = 'Αθήνα',
  country             = 'Ελλάδα',
  linkedin_url        = 'https://linkedin.com/in/kostas-demo',
  is_mentor           = false,
  membership_status   = 'active',
  role                = 'verified_member',
  language_pref       = 'en',
  onboarding_completed = true
WHERE id = 'a0000005-0000-0000-0000-000000000005';

UPDATE profiles SET
  membership_number   = 'ALU-2023-00002',
  first_name          = 'Μαρία',
  last_name           = 'Παπανικολάου',
  first_name_en       = 'Maria',
  last_name_en        = 'Papanikolaou',
  graduation_year     = 2017,
  department          = 'Τμήμα Νομικής',
  current_position    = 'Associate Lawyer',
  current_company     = 'Δικηγορική Εταιρεία Δημητρίου & Συνεργάτες',
  industry            = 'Νομικές Υπηρεσίες',
  bio                 = 'Δικηγόρος με εξειδίκευση στο εμπορικό δίκαιο. Βοηθώ startup founders να προστατέψουν τις επιχειρήσεις τους.',
  bio_en              = 'Lawyer specialising in commercial law. Helping startup founders protect their businesses.',
  city                = 'Αθήνα',
  country             = 'Ελλάδα',
  linkedin_url        = 'https://linkedin.com/in/maria-demo',
  is_mentor           = false,
  membership_status   = 'active',
  role                = 'verified_member',
  language_pref       = 'el',
  onboarding_completed = true
WHERE id = 'a0000006-0000-0000-0000-000000000006';

UPDATE profiles SET
  membership_number   = 'ALU-2025-00001',
  first_name          = 'Νίκος',
  last_name           = 'Γεωργίου',
  first_name_en       = 'Nikos',
  last_name_en        = 'Georgiou',
  graduation_year     = 2022,
  department          = 'Τμήμα Πληροφορικής & Τηλεπικοινωνιών',
  current_position    = 'Junior Developer',
  current_company     = 'StartupHub Athens',
  industry            = 'Τεχνολογία',
  bio                 = 'Νέος developer που αγαπά το open-source. Ψάχνω mentor για να κάνω το επόμενο βήμα στην καριέρα μου.',
  bio_en              = 'Junior developer passionate about open-source. Looking for a mentor to take the next career step.',
  city                = 'Αθήνα',
  country             = 'Ελλάδα',
  linkedin_url        = 'https://linkedin.com/in/nikos-demo',
  is_mentor           = false,
  membership_status   = 'active',
  role                = 'verified_member',
  language_pref       = 'el',
  onboarding_completed = true
WHERE id = 'a0000007-0000-0000-0000-000000000007';

UPDATE profiles SET
  membership_number   = 'ALU-2026-00001',
  first_name          = 'Άννα',
  last_name           = 'Σταματίου',
  first_name_en       = 'Anna',
  last_name_en        = 'Stamatiou',
  graduation_year     = 2024,
  department          = 'Τμήμα Διοίκησης Επιχειρήσεων',
  current_position    = 'Business Development Intern',
  current_company     = 'RetailGreece',
  industry            = 'Λιανεμπόριο',
  bio                 = 'Πρόσφατη απόφοιτος που αναζητά ευκαιρίες στο business development. Ενθουσιασμένη να είμαι μέλος της κοινότητας!',
  bio_en              = 'Recent graduate exploring business development opportunities. Excited to be part of the community!',
  city                = 'Πειραιάς',
  country             = 'Ελλάδα',
  is_mentor           = false,
  membership_status   = 'active',
  role                = 'basic_member',
  language_pref       = 'el',
  onboarding_completed = true
WHERE id = 'a0000008-0000-0000-0000-000000000008';

UPDATE profiles SET
  membership_number   = 'ALU-2019-00001',
  first_name          = 'Σταύρος',
  last_name           = 'Μιχαηλίδης',
  first_name_en       = 'Stavros',
  last_name_en        = 'Michailidis',
  graduation_year     = 2010,
  department          = 'Τμήμα Ψυχολογίας',
  current_position    = 'Executive Coach & Career Consultant',
  current_company     = 'MindGrowth Consulting',
  industry            = 'Συμβουλευτικές Υπηρεσίες',
  bio                 = 'Executive Coach με 12 χρόνια εμπειρία. Βοηθώ επαγγελματίες να ανακαλύψουν τις δυνατότητές τους. Mentor αποφοίτων από το 2015.',
  bio_en              = 'Executive Coach with 12 years of experience. Helping professionals unlock their potential. Mentoring alumni since 2015.',
  city                = 'Αθήνα',
  country             = 'Ελλάδα',
  linkedin_url        = 'https://linkedin.com/in/stavros-demo',
  website_url         = 'https://mindgrowth.gr',
  is_mentor           = true,
  membership_status   = 'active',
  role                = 'verified_member',
  language_pref       = 'el',
  onboarding_completed = true
WHERE id = 'a0000009-0000-0000-0000-000000000009';

UPDATE profiles SET
  membership_number   = 'ALU-2025-00002',
  first_name          = 'Θεοδώρα',
  last_name           = 'Βασιλείου',
  first_name_en       = 'Theodora',
  last_name_en        = 'Vassiliou',
  graduation_year     = 2021,
  department          = 'Τμήμα Αρχιτεκτονικής',
  current_position    = 'Architect',
  current_company     = 'Studio Forma',
  industry            = 'Αρχιτεκτονική & Σχεδιασμός',
  bio                 = 'Αρχιτέκτονας με πάθος για βιώσιμη αρχιτεκτονική και αστική ανάπτυξη. Μέλος αρκετών επαγγελματικών δικτύων.',
  bio_en              = 'Architect passionate about sustainable design and urban development. Active in several professional networks.',
  city                = 'Θεσσαλονίκη',
  country             = 'Ελλάδα',
  linkedin_url        = 'https://linkedin.com/in/theodora-demo',
  is_mentor           = false,
  membership_status   = 'active',
  role                = 'verified_member',
  language_pref       = 'el',
  onboarding_completed = true
WHERE id = 'a0000010-0000-0000-0000-000000000010';

-- ============================================================
-- 3. BUSINESSES (5 listings)
-- ============================================================

INSERT INTO businesses (
  id, owner_id, name, name_en, description, description_en,
  category, industry, website_url, email, city, country,
  is_verified, is_active
) VALUES
  ('b0000001-0000-0000-0000-000000000001',
   'a0000001-0000-0000-0000-000000000001',
   'TechVentures AE', 'TechVentures SA',
   'Εταιρεία ανάπτυξης λογισμικού και consulting. Ειδικευόμαστε σε cloud solutions και AI applications για τον ελληνικό αγορά.',
   'Software development and consulting company. We specialise in cloud solutions and AI applications for the Greek market.',
   'Τεχνολογία', 'Τεχνολογία',
   'https://techventures.gr', 'info@techventures.gr',
   'Αθήνα', 'Ελλάδα', true, true),

  ('b0000002-0000-0000-0000-000000000002',
   'a0000004-0000-0000-0000-000000000004',
   'OmegaBrands', 'OmegaBrands',
   'Πλήρης υπηρεσίες digital marketing: SEO, social media, content creation και brand strategy για μεσαίες και μεγάλες επιχειρήσεις.',
   'Full-service digital marketing agency: SEO, social media, content creation and brand strategy for medium and large businesses.',
   'Μάρκετινγκ', 'Μάρκετινγκ & Επικοινωνία',
   'https://omegabrands.gr', 'hello@omegabrands.gr',
   'Θεσσαλονίκη', 'Ελλάδα', true, true),

  ('b0000003-0000-0000-0000-000000000003',
   'a0000006-0000-0000-0000-000000000006',
   'Δικηγορική Εταιρεία Δημητρίου & Συνεργάτες',
   'Dimitriou & Associates Law Firm',
   'Εξειδικευμένη δικηγορική εταιρεία σε εμπορικό δίκαιο, εταιρικές συγχωνεύσεις, εργατικό δίκαιο και δίκαιο ακινήτων.',
   'Specialised law firm in commercial law, corporate mergers, labour law and real estate law.',
   'Νομικές Υπηρεσίες', 'Νομικές Υπηρεσίες',
   'https://dimitrioulaw.gr', 'contact@dimitrioulaw.gr',
   'Αθήνα', 'Ελλάδα', true, true),

  ('b0000004-0000-0000-0000-000000000004',
   'a0000009-0000-0000-0000-000000000009',
   'MindGrowth Consulting', 'MindGrowth Consulting',
   'Coaching και career consulting για executives και επαγγελματίες. Ατομικές συνεδρίες, team workshops και leadership programs.',
   'Coaching and career consulting for executives and professionals. Individual sessions, team workshops and leadership programs.',
   'Συμβουλευτικές Υπηρεσίες', 'Συμβουλευτικές Υπηρεσίες',
   'https://mindgrowth.gr', 'stavros@mindgrowth.gr',
   'Αθήνα', 'Ελλάδα', true, true),

  ('b0000005-0000-0000-0000-000000000005',
   'a0000010-0000-0000-0000-000000000010',
   'Studio Forma', 'Studio Forma',
   'Αρχιτεκτονικό γραφείο με εξειδίκευση σε βιώσιμη αρχιτεκτονική, ανακατασκευές και εσωτερική διακόσμηση.',
   'Architecture studio specialising in sustainable design, renovations and interior design.',
   'Αρχιτεκτονική', 'Αρχιτεκτονική & Σχεδιασμός',
   'https://studioforma.gr', 'info@studioforma.gr',
   'Θεσσαλονίκη', 'Ελλάδα', false, true);

-- ============================================================
-- 4. BENEFITS + REDEMPTIONS
-- ============================================================

INSERT INTO benefits (
  id, title, title_en, description, description_en,
  category, partner_name, discount_text, terms, terms_en,
  redemption_code, is_active, valid_until,
  requires_verified_member, created_by
) VALUES
  ('bf000001-0000-0000-0000-000000000001',
   '20% Έκπτωση στο Caffè Centrale',
   '20% Discount at Caffè Centrale',
   'Απολαύστε 20% έκπτωση σε όλα τα ροφήματα και γλυκά του Caffè Centrale, partner café της κοινότητάς μας.',
   'Enjoy 20% off all drinks and pastries at Caffè Centrale, our community partner café.',
   'food', 'Caffè Centrale', '20% off',
   'Ισχύει καθημερινά 08:00–21:00. Δεν συνδυάζεται με άλλες προσφορές.',
   'Valid daily 08:00–21:00. Cannot be combined with other offers.',
   'ALUMNI20', true, now() + interval '1 year',
   true, 'a0000001-0000-0000-0000-000000000001'),

  ('bf000002-0000-0000-0000-000000000002',
   'Δωρεάν μήνας Γυμναστήριο FitLife',
   'Free Month at FitLife Gym',
   'Αποκτήστε δωρεάν πρόσβαση για έναν ολόκληρο μήνα σε όλες τις εγκαταστάσεις του FitLife.',
   'Get one month of free access to all FitLife facilities and classes.',
   'service', 'FitLife Gym', '1 μήνας δωρεάν',
   'Ισχύει για νέα μέλη μόνο. Απαιτείται εγγραφή στο γυμναστήριο.',
   'Valid for new members only. Registration at the gym required.',
   NULL, true, now() + interval '6 months',
   true, 'a0000001-0000-0000-0000-000000000001'),

  ('bf000003-0000-0000-0000-000000000003',
   'Δωρεάν Νομική Συμβουλή (1 ώρα)',
   'Free Legal Consultation (1 hour)',
   'Μία ώρα δωρεάν νομικής συμβουλής από τη Δικηγορική Εταιρεία Δημητρίου & Συνεργάτες.',
   'One hour free legal consultation from Dimitriou & Associates Law Firm.',
   'service', 'Δικηγορική Εταιρεία Δημητρίου', '1 ώρα δωρεάν',
   'Κατόπιν ραντεβού. Εξαιρούνται υποθέσεις ποινικού δικαίου.',
   'By appointment only. Criminal law cases excluded.',
   'ALUMLEGAL24', true, now() + interval '8 months',
   true, 'a0000002-0000-0000-0000-000000000002'),

  ('bf000004-0000-0000-0000-000000000004',
   '3 μήνες LinkedIn Premium δωρεάν',
   '3 Months LinkedIn Premium Free',
   'Αποκτήστε 3 μήνες LinkedIn Premium Career μέσω του εταιρικού μας συνδρομητικού προγράμματος.',
   'Get 3 months of LinkedIn Premium Career through our corporate subscription programme.',
   'discount', 'LinkedIn', '3 μήνες δωρεάν',
   'Ισχύει για χρήστες που δεν έχουν ενεργή LinkedIn Premium συνδρομή.',
   'Valid for users without an active LinkedIn Premium subscription.',
   'ALUMLINKED3M', true, now() + interval '3 months',
   true, 'a0000002-0000-0000-0000-000000000002'),

  ('bf000005-0000-0000-0000-000000000005',
   '15% Έκπτωση σε Aegean Airlines',
   '15% Discount on Aegean Airlines',
   'Αποκλειστική έκπτωση 15% σε εισιτήρια Aegean Airlines για αποφοίτους της κοινότητάς μας.',
   'Exclusive 15% discount on Aegean Airlines tickets for our alumni community members.',
   'travel', 'Aegean Airlines', '15% off',
   'Ισχύει για πτήσεις εντός Ελλάδας. Δεν ισχύει για ήδη κρατημένα εισιτήρια.',
   'Valid for domestic flights within Greece. Not valid on already booked tickets.',
   'ALUMAEGEAN15', true, now() + interval '4 months',
   true, 'a0000001-0000-0000-0000-000000000001');

-- Redemptions (trigger increments benefit redemption_count)
INSERT INTO benefit_redemptions (benefit_id, user_id, verification_code) VALUES
  ('bf000001-0000-0000-0000-000000000001',
   'a0000004-0000-0000-0000-000000000004',
   'ELENI001'),
  ('bf000001-0000-0000-0000-000000000001',
   'a0000005-0000-0000-0000-000000000005',
   'KOSTA001'),
  ('bf000002-0000-0000-0000-000000000002',
   'a0000006-0000-0000-0000-000000000006',
   'MARIA001');

-- ============================================================
-- 5. EVENTS + RSVPs
-- ============================================================

INSERT INTO events (
  id, title, title_en, description, description_en,
  type, status, start_date, end_date,
  location, capacity, is_public, created_by
) VALUES
  ('e0000001-0000-0000-0000-000000000001',
   'Alumni Gala 2025 — Βραδιά Αποφοίτων',
   'Alumni Gala 2025 — Alumni Evening',
   'Η μεγάλη ετήσια βραδιά αποφοίτων! Dinner, networking, βραβεύσεις διακεκριμένων αποφοίτων και live μουσική.',
   'The grand annual alumni evening! Dinner, networking, distinguished alumni awards and live music.',
   'in_person', 'completed',
   now() - interval '3 months',
   now() - interval '3 months' + interval '5 hours',
   'Μέγαρο Μουσικής Αθηνών, Λεωφ. Βασιλίσσης Σοφίας',
   200, true, 'a0000001-0000-0000-0000-000000000001'),

  ('e0000002-0000-0000-0000-000000000002',
   'Tech Talk: AI & το Μέλλον της Εργασίας',
   'Tech Talk: AI & the Future of Work',
   'Τεχνική ομιλία από ειδικούς για τον αντίκτυπο της AI στην αγορά εργασίας και τις νέες δεξιότητες που απαιτούνται.',
   'Technical talk by experts on the impact of AI on the job market and the new skills required.',
   'hybrid', 'completed',
   now() - interval '6 weeks',
   now() - interval '6 weeks' + interval '3 hours',
   'Αίθουσα Α1, Κτίριο Διοίκησης',
   80, true, 'a0000003-0000-0000-0000-000000000003'),

  ('e0000003-0000-0000-0000-000000000003',
   'Networking Lunch — Αθήνα Κέντρο',
   'Networking Lunch — Athens Centre',
   'Ανεπίσημο lunch networking για αποφοίτους της Αθήνας. Ιδανικό για νέες συνδέσεις και ανταλλαγή ευκαιριών.',
   'Informal networking lunch for Athens-based alumni. Ideal for new connections and opportunity exchange.',
   'in_person', 'published',
   now() + interval '2 weeks',
   now() + interval '2 weeks' + interval '2 hours',
   'Couleur Locale, Μοναστηράκι',
   30, true, 'a0000002-0000-0000-0000-000000000002'),

  ('e0000004-0000-0000-0000-000000000004',
   'Career Fair Αποφοίτων 2026',
   'Alumni Career Fair 2026',
   'Ετήσια έκθεση καριέρας με συμμετοχή 20+ εταιρειών. Παρουσίαση θέσεων, on-the-spot συνεντεύξεις, CV workshops.',
   'Annual career fair with 20+ participating companies. Job presentations, on-the-spot interviews, CV workshops.',
   'in_person', 'published',
   now() + interval '6 weeks',
   now() + interval '6 weeks' + interval '8 hours',
   'Εκθεσιακό Κέντρο Αθηνών',
   500, true, 'a0000001-0000-0000-0000-000000000001'),

  ('e0000005-0000-0000-0000-000000000005',
   'Webinar: Ξεκινώντας τη Δική σου Επιχείρηση',
   'Webinar: Starting Your Own Business',
   'Online σεμινάριο για όσους σκέφτονται να ξεκινήσουν startup ή επιχείρηση. Tips, νομικά θέματα, funding options.',
   'Online seminar for those thinking of starting a startup or business. Tips, legal issues, funding options.',
   'virtual', 'published',
   now() + interval '10 days',
   now() + interval '10 days' + interval '2 hours',
   NULL, NULL, true, 'a0000001-0000-0000-0000-000000000001');

-- RSVPs (trigger auto-sets status based on capacity)
INSERT INTO event_rsvps (event_id, user_id) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000002'),
  ('e0000001-0000-0000-0000-000000000001', 'a0000003-0000-0000-0000-000000000003'),
  ('e0000001-0000-0000-0000-000000000001', 'a0000004-0000-0000-0000-000000000004'),
  ('e0000002-0000-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003'),
  ('e0000002-0000-0000-0000-000000000002', 'a0000005-0000-0000-0000-000000000005'),
  ('e0000003-0000-0000-0000-000000000003', 'a0000004-0000-0000-0000-000000000004'),
  ('e0000003-0000-0000-0000-000000000003', 'a0000007-0000-0000-0000-000000000007'),
  ('e0000004-0000-0000-0000-000000000004', 'a0000005-0000-0000-0000-000000000005'),
  ('e0000004-0000-0000-0000-000000000004', 'a0000008-0000-0000-0000-000000000008'),
  ('e0000005-0000-0000-0000-000000000005', 'a0000006-0000-0000-0000-000000000006'),
  ('e0000005-0000-0000-0000-000000000005', 'a0000007-0000-0000-0000-000000000007');

-- ============================================================
-- 6. GALLERY ALBUMS + PHOTOS
-- ============================================================

INSERT INTO gallery_albums (
  id, title, title_en, description, description_en,
  is_published, event_id, created_by
) VALUES
  ('a1000001-0000-0000-0000-000000000001',
   'Alumni Gala 2025',
   'Alumni Gala 2025',
   'Φωτογραφίες από την ετήσια βραδιά αποφοίτων 2025.',
   'Photos from the 2025 Annual Alumni Gala Evening.',
   true, 'e0000001-0000-0000-0000-000000000001',
   'a0000001-0000-0000-0000-000000000001'),

  ('a2000002-0000-0000-0000-000000000002',
   'Tech Talk: AI & Μέλλον της Εργασίας',
   'Tech Talk: AI & Future of Work',
   'Στιγμιότυπα από το Tech Talk για AI και το μέλλον της εργασίας.',
   'Snapshots from the Tech Talk on AI and the future of work.',
   true, 'e0000002-0000-0000-0000-000000000002',
   'a0000003-0000-0000-0000-000000000003');

-- Photos (trigger auto-increments album photo_count)
INSERT INTO gallery_photos (
  album_id, storage_path, url, caption, caption_en,
  width, height, is_approved, uploaded_by
) VALUES
  ('a1000001-0000-0000-0000-000000000001',
   'gallery/a1000001/photo-001.jpg',
   'https://picsum.photos/seed/gala1/1200/800',
   'Η είσοδος στο Μέγαρο Μουσικής',
   'Entrance to the concert hall',
   1200, 800, true, 'a0000001-0000-0000-0000-000000000001'),

  ('a1000001-0000-0000-0000-000000000001',
   'gallery/a1000001/photo-002.jpg',
   'https://picsum.photos/seed/gala2/1200/800',
   'Βράβευση διακεκριμένων αποφοίτων',
   'Distinguished alumni awards ceremony',
   1200, 800, true, 'a0000002-0000-0000-0000-000000000002'),

  ('a1000001-0000-0000-0000-000000000001',
   'gallery/a1000001/photo-003.jpg',
   'https://picsum.photos/seed/gala3/800/1200',
   'Networking μεταξύ αποφοίτων',
   'Networking among alumni',
   800, 1200, true, 'a0000002-0000-0000-0000-000000000002'),

  ('a1000001-0000-0000-0000-000000000001',
   'gallery/a1000001/photo-004.jpg',
   'https://picsum.photos/seed/gala4/1200/800',
   'Το dinner table των αποφοίτων 1998',
   'Dinner table for class of 1998',
   1200, 800, true, 'a0000001-0000-0000-0000-000000000001'),

  ('a1000001-0000-0000-0000-000000000001',
   'gallery/a1000001/photo-005.jpg',
   'https://picsum.photos/seed/gala5/1200/800',
   'Live μουσική βραδιά',
   'Live music evening',
   1200, 800, true, 'a0000003-0000-0000-0000-000000000003'),

  ('a1000001-0000-0000-0000-000000000001',
   'gallery/a1000001/photo-006.jpg',
   'https://picsum.photos/seed/gala6/1200/800',
   'Group photo — αποφοίτοι 2020–2025',
   'Group photo — class of 2020–2025',
   1200, 800, true, 'a0000002-0000-0000-0000-000000000002'),

  ('a2000002-0000-0000-0000-000000000002',
   'gallery/a2000002/photo-001.jpg',
   'https://picsum.photos/seed/tech1/1200/800',
   'Παρουσίαση για AI trends',
   'AI trends presentation',
   1200, 800, true, 'a0000003-0000-0000-0000-000000000003'),

  ('a2000002-0000-0000-0000-000000000002',
   'gallery/a2000002/photo-002.jpg',
   'https://picsum.photos/seed/tech2/1200/800',
   'Panel discussion με ειδικούς',
   'Panel discussion with experts',
   1200, 800, true, 'a0000003-0000-0000-0000-000000000003'),

  ('a2000002-0000-0000-0000-000000000002',
   'gallery/a2000002/photo-003.jpg',
   'https://picsum.photos/seed/tech3/1200/800',
   'Ερωτήσεις από το κοινό',
   'Q&A with the audience',
   1200, 800, true, 'a0000005-0000-0000-0000-000000000005'),

  ('a2000002-0000-0000-0000-000000000002',
   'gallery/a2000002/photo-004.jpg',
   'https://picsum.photos/seed/tech4/1200/800',
   'Networking coffee break',
   'Networking coffee break',
   1200, 800, true, 'a0000005-0000-0000-0000-000000000005');

-- ============================================================
-- 7. JOBS + SAVED JOBS
-- ============================================================

INSERT INTO jobs (
  id, posted_by, title, title_en, company,
  description, description_en, type, status,
  location, is_remote, salary_range, industry,
  apply_email, expires_at
) VALUES
  ('cb000001-0000-0000-0000-000000000001',
   'a0000001-0000-0000-0000-000000000001',
   'Full Stack Developer (React / Node.js)',
   'Full Stack Developer (React / Node.js)',
   'TechVentures AE',
   'Αναζητούμε έμπειρο Full Stack Developer για ανάπτυξη SaaS εφαρμογών. Τουλάχιστον 3 χρόνια εμπειρία με React και Node.js. Ευέλικτο ωράριο, remote-first κουλτούρα.',
   'We are looking for an experienced Full Stack Developer for SaaS application development. At least 3 years experience with React and Node.js. Flexible hours, remote-first culture.',
   'full_time', 'open',
   'Αθήνα', true, '2.500–3.500€ / μήνα', 'Τεχνολογία',
   'jobs@techventures.gr', now() + interval '2 months'),

  ('cb000002-0000-0000-0000-000000000002',
   'a0000004-0000-0000-0000-000000000004',
   'Social Media Manager',
   'Social Media Manager',
   'OmegaBrands',
   'Ψάχνουμε δημιουργικό Social Media Manager για διαχείριση accounts πελατών. Εμπειρία σε Instagram, TikTok, LinkedIn. Part-time, 20 ώρες/εβδομάδα.',
   'Looking for a creative Social Media Manager to manage client accounts. Experience with Instagram, TikTok, LinkedIn. Part-time, 20 hours/week.',
   'part_time', 'open',
   'Θεσσαλονίκη', true, '800–1.200€ / μήνα', 'Μάρκετινγκ & Επικοινωνία',
   'careers@omegabrands.gr', now() + interval '6 weeks'),

  ('cb000003-0000-0000-0000-000000000003',
   'a0000003-0000-0000-0000-000000000003',
   'DevOps Engineer',
   'DevOps Engineer',
   'Google Hellas',
   'Θέση DevOps Engineer στην ομάδα cloud infrastructure. Εμπειρία σε Kubernetes, Terraform, CI/CD pipelines. Εξαιρετικό πακέτο αποδοχών.',
   'DevOps Engineer position in the cloud infrastructure team. Experience with Kubernetes, Terraform, CI/CD pipelines. Excellent benefits package.',
   'full_time', 'open',
   'Αθήνα', false, '4.000–5.500€ / μήνα', 'Τεχνολογία',
   'careers.hellas@google.com', now() + interval '3 months'),

  ('cb000004-0000-0000-0000-000000000004',
   'a0000009-0000-0000-0000-000000000009',
   'Ασκούμενος/η — Business Development',
   'Intern — Business Development',
   'MindGrowth Consulting',
   'Ευκαιρία πρακτικής άσκησης για απόφοιτους που θέλουν να μάθουν business development στον χώρο του consulting. Ευέλικτο πρόγραμμα, mentoring από senior consultants.',
   'Internship opportunity for graduates wanting to learn business development in consulting. Flexible schedule, mentoring from senior consultants.',
   'internship', 'open',
   'Αθήνα', true, '500€ / μήνα', 'Συμβουλευτικές Υπηρεσίες',
   'intern@mindgrowth.gr', now() + interval '5 weeks'),

  ('cb000005-0000-0000-0000-000000000005',
   'a0000006-0000-0000-0000-000000000006',
   'Νομικός Σύμβουλος (Freelance)',
   'Legal Advisor (Freelance)',
   'Δικηγορική Εταιρεία Δημητρίου & Συνεργάτες',
   'Αναζητούμε freelance νομικό σύμβουλο για χειρισμό εμπορικών υποθέσεων. Επί τόπου παρουσία 2 ημέρες/εβδομάδα. Απαιτείται άδεια ασκήσεως επαγγέλματος.',
   'Looking for freelance legal advisor for handling commercial cases. On-site presence 2 days/week. Bar admission required.',
   'freelance', 'open',
   'Αθήνα', false, 'Κατόπιν συμφωνίας', 'Νομικές Υπηρεσίες',
   'hr@dimitrioulaw.gr', now() + interval '1 month');

-- Saved jobs
INSERT INTO saved_jobs (user_id, job_id) VALUES
  ('a0000007-0000-0000-0000-000000000007', 'cb000001-0000-0000-0000-000000000001'),
  ('a0000007-0000-0000-0000-000000000007', 'cb000003-0000-0000-0000-000000000003'),
  ('a0000008-0000-0000-0000-000000000008', 'cb000004-0000-0000-0000-000000000004');

-- ============================================================
-- 8. CONVERSATIONS + PARTICIPANTS + MESSAGES
-- ============================================================

INSERT INTO conversations (id, title) VALUES
  ('c0000001-0000-0000-0000-000000000001', NULL),
  ('c0000002-0000-0000-0000-000000000002', NULL),
  ('c0000003-0000-0000-0000-000000000003', 'Tech Alumni Group Chat');

INSERT INTO conversation_participants (conversation_id, user_id) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'a0000003-0000-0000-0000-000000000003'),
  ('c0000001-0000-0000-0000-000000000001', 'a0000007-0000-0000-0000-000000000007'),
  ('c0000002-0000-0000-0000-000000000002', 'a0000009-0000-0000-0000-000000000009'),
  ('c0000002-0000-0000-0000-000000000002', 'a0000005-0000-0000-0000-000000000005'),
  ('c0000003-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001'),
  ('c0000003-0000-0000-0000-000000000003', 'a0000003-0000-0000-0000-000000000003'),
  ('c0000003-0000-0000-0000-000000000003', 'a0000005-0000-0000-0000-000000000005'),
  ('c0000003-0000-0000-0000-000000000003', 'a0000007-0000-0000-0000-000000000007');

-- Messages (trigger updates conversation last_message_at + preview)
INSERT INTO messages (conversation_id, sender_id, content) VALUES
  ('c0000001-0000-0000-0000-000000000001',
   'a0000003-0000-0000-0000-000000000003',
   'Γεια σου Νίκο! Είδα το προφίλ σου και νομίζω ότι μπορώ να σε βοηθήσω με την καριέρα σου στο tech. Θα ήθελες να μιλήσουμε;'),

  ('c0000001-0000-0000-0000-000000000001',
   'a0000007-0000-0000-0000-000000000007',
   'Γειά σου Γιώργη! Σε ευχαριστώ πολύ, θα χαρώ πάρα πολύ! Πότε είσαι διαθέσιμος;'),

  ('c0000001-0000-0000-0000-000000000001',
   'a0000003-0000-0000-0000-000000000003',
   'Μπορούμε να κανονίσουμε ένα 30λεπτο call την Πέμπτη; Έχω ελεύθερο απόγευμα μετά τις 17:00.'),

  ('c0000001-0000-0000-0000-000000000001',
   'a0000007-0000-0000-0000-000000000007',
   'Τέλεια! Πέμπτη 18:00 είναι ιδανικό. Θα σου στείλω invite στο calendar.'),

  ('c0000002-0000-0000-0000-000000000002',
   'a0000009-0000-0000-0000-000000000009',
   'Χαίρε Κωνσταντίνε! Μόλις ξεκίνησε το mentorship μας. Θέλω πρώτα να μάθω περισσότερα για τους στόχους σου. Τι θέλεις να πετύχεις μέσα στους επόμενους 6 μήνες;'),

  ('c0000002-0000-0000-0000-000000000002',
   'a0000005-0000-0000-0000-000000000005',
   'Κύριε Σταύρο, σε ευχαριστώ! Θέλω κυρίως να αναπτύξω τις δεξιότητές μου στο financial modeling και να ετοιμαστώ για CFA Level 1. Έχω επίσης ενδιαφέρον για fintech startups.'),

  ('c0000002-0000-0000-0000-000000000002',
   'a0000009-0000-0000-0000-000000000009',
   'Εξαιρετικοί στόχοι! CFA είναι σπουδαία επένδυση στον εαυτό σου. Ας ξεκινήσουμε με ένα structured study plan. Στείλε μου το τρέχον CV σου να το δούμε μαζί.'),

  ('c0000003-0000-0000-0000-000000000003',
   'a0000001-0000-0000-0000-000000000001',
   'Καλώς ορίσατε στο Tech Alumni Group Chat! Εδώ μπορούμε να μοιραζόμαστε tech news, ευκαιρίες και να βοηθάμε ο ένας τον άλλο.'),

  ('c0000003-0000-0000-0000-000000000003',
   'a0000003-0000-0000-0000-000000000003',
   'Τέλεια ιδέα! Μόλις διάβασα για το νέο GPT-5 release. Τεράστιες αλλαγές έρχονται στον τομέα μας.'),

  ('c0000003-0000-0000-0000-000000000003',
   'a0000007-0000-0000-0000-000000000007',
   'Έχετε δει το νέο framework που βγήκε από την Vercel; Νομίζω ότι αξίζει να το εξετάσουμε για το επόμενο project.');

-- ============================================================
-- 9. MENTORSHIPS
-- ============================================================

INSERT INTO mentorships (
  mentor_id, mentee_id, status,
  goals, message, started_at, completed_at
) VALUES
  -- Active mentorship: Giorgis → Eleni
  ('a0000003-0000-0000-0000-000000000003',
   'a0000004-0000-0000-0000-000000000004',
   'active',
   'Βελτίωση δεξιοτήτων digital marketing, εκμάθηση analytics tools, κατανόηση tech product lifecycle.',
   'Γεια σου Γιώργη! Δουλεύω στο marketing αλλά θέλω να καταλάβω καλύτερα πώς λειτουργεί η τεχνολογία από πίσω. Νομίζω ότι η εμπειρία σου στο Google θα με βοηθήσει πολύ.',
   now() - interval '2 months', NULL),

  -- Active mentorship: Stavros → Kostas
  ('a0000009-0000-0000-0000-000000000009',
   'a0000005-0000-0000-0000-000000000005',
   'active',
   'Προετοιμασία για CFA Level 1, ανάπτυξη financial modeling skills, exploration fintech sector.',
   'Αγαπητέ Σταύρο, το coaching σου έχει φήμη στην κοινότητα. Θα ήθελα πολύ να με βοηθήσεις να αναπτύξω career plan για τα επόμενα 3 χρόνια στο χρηματοοικονομικό τομέα.',
   now() - interval '5 weeks', NULL),

  -- Pending mentorship: Giorgis → Nikos
  ('a0000003-0000-0000-0000-000000000003',
   'a0000007-0000-0000-0000-000000000007',
   'pending',
   'Junior → Mid-level transition, open-source contributions, system design skills.',
   'Γεια σου Γιώργη! Είμαι junior developer και θαυμάζω την πορεία σου. Θα ήθελα να με βοηθήσεις να κάνω το leap στο mid-level engineering. Έχω κάνει ήδη μερικά contributions σε OSS αλλά θέλω structured guidance.',
   NULL, NULL),

  -- Completed mentorship: Stavros → Maria
  ('a0000009-0000-0000-0000-000000000009',
   'a0000006-0000-0000-0000-000000000006',
   'completed',
   'Ανάπτυξη δικηγορικής πρακτικής, public speaking, networking strategy.',
   'Αγαπητέ Σταύρο, μόλις ξεκίνησα στη δικηγορία και θέλω να χτίσω σωστά τα θεμέλια. Πιστεύω ότι το coaching σου θα με βοηθήσει να αναπτύξω professional presence.',
   now() - interval '1 year', now() - interval '3 months');

-- ============================================================
-- 10. NEWS FEED: ANNOUNCEMENTS + SUCCESS STORIES + POLLS
-- ============================================================

INSERT INTO announcements (
  title, title_en, body, body_en, type,
  is_published, published_at, created_by
) VALUES
  ('Καλωσορίζουμε τους Νέους Αποφοίτους 2025!',
   'Welcome New 2025 Graduates!',
   'Η κοινότητα Alumni Connect καλωσορίζει όλους τους νέους αποφοίτους του 2025! Η πλατφόρμα είναι εδώ για να σας συνδέσει με συναδέλφους, mentors, και επαγγελματικές ευκαιρίες. Εξερευνήστε το directory, εγγραφείτε σε groups, και συμμετέχετε στα επόμενα events.',
   'The Alumni Connect community welcomes all new graduates of 2025! The platform is here to connect you with peers, mentors, and professional opportunities. Explore the directory, join groups, and participate in upcoming events.',
   'general', true, now() - interval '3 months',
   'a0000001-0000-0000-0000-000000000001'),

  ('Career Fair Αποφοίτων 2026 — Εγγραφές Ανοιχτές!',
   'Alumni Career Fair 2026 — Registrations Open!',
   'Χαρούμαστε να ανακοινώσουμε ότι η εγγραφή για το Career Fair Αποφοίτων 2026 είναι πλέον ανοιχτή! Φέτος συμμετέχουν 20+ εταιρείες από τεχνολογία, χρηματοοικονομικά, consulting και marketing. Εγγραφείτε τώρα μέσω της πλατφόρμας.',
   'We are pleased to announce that registration for the 2026 Alumni Career Fair is now open! This year 20+ companies from technology, finance, consulting and marketing are participating. Register now through the platform.',
   'event', true, now() - interval '2 weeks',
   'a0000002-0000-0000-0000-000000000002'),

  ('Νέα Σύμπραξη με Aegean Airlines — 15% Έκπτωση για Αποφοίτους',
   'New Partnership with Aegean Airlines — 15% Discount for Alumni',
   'Με χαρά ανακοινώνουμε τη νέα μας σύμπραξη με την Aegean Airlines! Όλα τα μέλη της κοινότητας απολαμβάνουν πλέον 15% έκπτωση στις πτήσεις εσωτερικού. Χρησιμοποιήστε τον κωδικό ALUMAEGEAN15 κατά την κράτησή σας.',
   'We are pleased to announce our new partnership with Aegean Airlines! All community members now enjoy a 15% discount on domestic flights. Use code ALUMAEGEAN15 when booking.',
   'opportunity', true, now() - interval '1 week',
   'a0000001-0000-0000-0000-000000000001');

INSERT INTO success_stories (
  user_id, title, title_en, content, content_en, is_approved
) VALUES
  ('a0000003-0000-0000-0000-000000000003',
   'Από Αποφοιτο σε Senior Engineer στη Google',
   'From Graduate to Senior Engineer at Google',
   'Αποφοίτησα το 2008 με τρόμο για το μέλλον. Η κοινότητα αποφοίτων μου έδωσε τις πρώτες επαγγελματικές συνδέσεις. Σήμερα, 15 χρόνια μετά, δουλεύω ως Senior Engineer στη Google Hellas και προσπαθώ να επιστρέψω αυτό που έλαβα γίνοντας mentor νέων αποφοίτων.',
   'I graduated in 2008 full of fear about the future. The alumni community gave me my first professional connections. Today, 15 years later, I work as a Senior Engineer at Google Hellas and try to give back by mentoring new graduates.',
   true),

  ('a0000009-0000-0000-0000-000000000009',
   'Πώς Άλλαξα Καριέρα στα 35 και Βρήκα την Αποστολή μου',
   'How I Changed Careers at 35 and Found My Calling',
   'Ήμουν manager σε εταιρεία κατασκευών όταν συνειδητοποίησα ότι δεν με εκπλήρωνε. Μέσα από το alumni network βρήκα έναν career coach που με βοήθησε να κάνω το μεγαλύτερο risk της ζωής μου. Σήμερα τρέχω το δικό μου coaching business και βοηθώ άλλους να κάνουν το ίδιο.',
   'I was a manager in a construction company when I realised it was not fulfilling me. Through the alumni network I found a career coach who helped me take the biggest risk of my life. Today I run my own coaching business and help others do the same.',
   true);

INSERT INTO polls (id, question, question_en, created_by, closes_at, is_active) VALUES
  ('da000001-0000-0000-0000-000000000001',
   'Ποιο θέμα θέλετε να καλυφθεί στο επόμενο Tech Talk;',
   'What topic would you like covered at the next Tech Talk?',
   'a0000001-0000-0000-0000-000000000001',
   now() + interval '3 weeks', true),

  ('da000002-0000-0000-0000-000000000002',
   'Ποια μορφή events προτιμάτε;',
   'What type of events do you prefer?',
   'a0000002-0000-0000-0000-000000000002',
   now() + interval '2 weeks', true);

INSERT INTO poll_options (id, poll_id, text, text_en, position) VALUES
  ('db000001-0000-0000-0000-000000000001',
   'da000001-0000-0000-0000-000000000001',
   'Generative AI & LLMs', 'Generative AI & LLMs', 1),
  ('db000001-0000-0000-0000-000000000002',
   'da000001-0000-0000-0000-000000000001',
   'Cybersecurity', 'Cybersecurity', 2),
  ('db000001-0000-0000-0000-000000000003',
   'da000001-0000-0000-0000-000000000001',
   'Cloud & DevOps', 'Cloud & DevOps', 3),

  ('db000002-0000-0000-0000-000000000001',
   'da000002-0000-0000-0000-000000000002',
   'In-person', 'In-person', 1),
  ('db000002-0000-0000-0000-000000000002',
   'da000002-0000-0000-0000-000000000002',
   'Virtual / Online', 'Virtual / Online', 2),
  ('db000002-0000-0000-0000-000000000003',
   'da000002-0000-0000-0000-000000000002',
   'Hybrid', 'Hybrid', 3);

-- Poll votes (trigger increments vote_count on options)
INSERT INTO poll_votes (poll_id, option_id, user_id) VALUES
  ('da000001-0000-0000-0000-000000000001',
   'db000001-0000-0000-0000-000000000001',
   'a0000003-0000-0000-0000-000000000003'),
  ('da000001-0000-0000-0000-000000000001',
   'db000001-0000-0000-0000-000000000001',
   'a0000007-0000-0000-0000-000000000007'),
  ('da000001-0000-0000-0000-000000000001',
   'db000001-0000-0000-0000-000000000002',
   'a0000005-0000-0000-0000-000000000005'),
  ('da000001-0000-0000-0000-000000000001',
   'db000001-0000-0000-0000-000000000003',
   'a0000004-0000-0000-0000-000000000004'),
  ('da000002-0000-0000-0000-000000000002',
   'db000002-0000-0000-0000-000000000001',
   'a0000004-0000-0000-0000-000000000004'),
  ('da000002-0000-0000-0000-000000000002',
   'db000002-0000-0000-0000-000000000003',
   'a0000003-0000-0000-0000-000000000003'),
  ('da000002-0000-0000-0000-000000000002',
   'db000002-0000-0000-0000-000000000003',
   'a0000006-0000-0000-0000-000000000006');

-- ============================================================
-- 11. GROUPS + MEMBERS + POSTS
-- ============================================================

INSERT INTO groups (id, name, name_en, description, description_en, is_private, created_by) VALUES
  ('cc000001-0000-0000-0000-000000000001',
   'Τεχνολογία & Innovation',
   'Technology & Innovation',
   'Για αποφοίτους που ασχολούνται με τεχνολογία, software, startups και καινοτομία. Μοιραζόμαστε νέα, ευκαιρίες και γνώση.',
   'For alumni working in technology, software, startups and innovation. We share news, opportunities and knowledge.',
   false, 'a0000003-0000-0000-0000-000000000003'),

  ('cc000002-0000-0000-0000-000000000002',
   'Alumni Αθήνας',
   'Athens Alumni',
   'Η ομάδα των αποφοίτων που βρίσκονται στην Αθήνα. Οργανώνουμε meetups, dinners και networking events στην πρωτεύουσα.',
   'The group for alumni based in Athens. We organise meetups, dinners and networking events in the capital.',
   false, 'a0000002-0000-0000-0000-000000000002'),

  ('cc000003-0000-0000-0000-000000000003',
   'Careers Network',
   'Careers Network',
   'Κλειστή ομάδα για ανταλλαγή job leads, CV reviews, interview prep και career advice. Για verified members.',
   'Private group for sharing job leads, CV reviews, interview prep and career advice. For verified members only.',
   true, 'a0000001-0000-0000-0000-000000000001');

-- Group members (trigger increments member_count)
INSERT INTO group_members (group_id, user_id, role) VALUES
  -- Tech group
  ('cc000001-0000-0000-0000-000000000001', 'a0000003-0000-0000-0000-000000000003', 'admin'),
  ('cc000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'member'),
  ('cc000001-0000-0000-0000-000000000001', 'a0000005-0000-0000-0000-000000000005', 'member'),
  ('cc000001-0000-0000-0000-000000000001', 'a0000007-0000-0000-0000-000000000007', 'member'),
  -- Athens group
  ('cc000002-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000002', 'admin'),
  ('cc000002-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'member'),
  ('cc000002-0000-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003', 'member'),
  ('cc000002-0000-0000-0000-000000000002', 'a0000006-0000-0000-0000-000000000006', 'member'),
  ('cc000002-0000-0000-0000-000000000002', 'a0000009-0000-0000-0000-000000000009', 'member'),
  -- Careers group
  ('cc000003-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', 'admin'),
  ('cc000003-0000-0000-0000-000000000003', 'a0000003-0000-0000-0000-000000000003', 'member'),
  ('cc000003-0000-0000-0000-000000000003', 'a0000004-0000-0000-0000-000000000004', 'member'),
  ('cc000003-0000-0000-0000-000000000003', 'a0000005-0000-0000-0000-000000000005', 'member'),
  ('cc000003-0000-0000-0000-000000000003', 'a0000006-0000-0000-0000-000000000006', 'member'),
  ('cc000003-0000-0000-0000-000000000003', 'a0000009-0000-0000-0000-000000000009', 'member');

INSERT INTO group_posts (group_id, user_id, content) VALUES
  ('cc000001-0000-0000-0000-000000000001',
   'a0000003-0000-0000-0000-000000000003',
   'Καλωσορίσατε στην ομάδα Τεχνολογία & Innovation! Ανυπομονώ να μοιραστούμε ιδέες και να βοηθήσουμε ο ένας τον άλλο. Ποιο είναι το tech topic που σας ενδιαφέρει περισσότερο τώρα;'),

  ('cc000001-0000-0000-0000-000000000001',
   'a0000007-0000-0000-0000-000000000007',
   'Μόλις τελείωσα ένα side project με Next.js 14 και Supabase. Εκπληκτικό stack! Αν κάποιος θέλει να το δει, μπορώ να κάνω μικρό demo call.'),

  ('cc000001-0000-0000-0000-000000000001',
   'a0000005-0000-0000-0000-000000000005',
   'Ενδιαφέρον post! Μήπως κάποιος έχει εμπειρία με Bloomberg API; Θέλω να φτιάξω ένα personal finance dashboard.'),

  ('cc000002-0000-0000-0000-000000000002',
   'a0000002-0000-0000-0000-000000000002',
   'Το επόμενο Athens Alumni Networking Lunch είναι στις ' || to_char(now() + interval '2 weeks', 'DD/MM/YYYY') || '! Θα είναι στο Couleur Locale, Μοναστηράκι, 13:00-15:00. Εγγραφείτε μέσω Events!'),

  ('cc000002-0000-0000-0000-000000000002',
   'a0000009-0000-0000-0000-000000000009',
   'Υπέροχη ιδέα! Η τοποθεσία είναι ιδανική. Θα φέρω μερικά brochures για το coaching program μου αν δεν πειράζει.'),

  ('cc000003-0000-0000-0000-000000000003',
   'a0000001-0000-0000-0000-000000000001',
   'Νέα θέση: TechVentures αναζητά Full Stack Developer. Πολύ καλό πακέτο, remote-friendly. Δείτε το Jobs section. Αν γνωρίζετε κάποιον κατάλληλο, μη διστάσετε να προτείνετε!'),

  ('cc000003-0000-0000-0000-000000000003',
   'a0000006-0000-0000-0000-000000000006',
   'Υπενθύμιση: Η δικηγορική μου εταιρεία ψάχνει freelance νομικό σύμβουλο. Εμπορικό δίκαιο, 2 ημέρες/εβδομάδα onsite. Ιδανικό για κάποιον που θέλει flexibility.');

-- ============================================================
-- 12. NOTIFICATIONS
-- ============================================================

INSERT INTO notifications (user_id, type, title, body, link, is_read) VALUES
  ('a0000007-0000-0000-0000-000000000007',
   'message',
   'Νέο μήνυμα από τον Γιώργη Αθανασίου',
   'Γεια σου Νίκο! Είδα το προφίλ σου και νομίζω ότι μπορώ να σε βοηθήσω...',
   '/dashboard/messages',
   false),

  ('a0000007-0000-0000-0000-000000000007',
   'mentorship',
   'Αίτημα mentorship σε αναμονή',
   'Το αίτημα mentorship με τον Γιώργη Αθανασίου εκκρεμεί έγκριση.',
   '/dashboard/mentorship/mentee',
   false),

  ('a0000005-0000-0000-0000-000000000005',
   'event_reminder',
   'Υπενθύμιση: Career Fair Αποφοίτων 2026',
   'Το Career Fair Αποφοίτων 2026 πλησιάζει! Έχετε RSVP. Δείτε τις εταιρείες που συμμετέχουν.',
   '/dashboard/events',
   false),

  ('a0000004-0000-0000-0000-000000000004',
   'benefit_expiry',
   'Το benefit "20% Έκπτωση Caffè Centrale" λήγει σύντομα',
   'Θυμηθείτε να χρησιμοποιήσετε την έκπτωσή σας πριν τη λήξη.',
   '/dashboard/benefits',
   true),

  ('a0000005-0000-0000-0000-000000000005',
   'message',
   'Νέο μήνυμα από τον Σταύρο Μιχαηλίδη',
   'Χαίρε Κωνσταντίνε! Μόλις ξεκίνησε το mentorship μας...',
   '/dashboard/messages',
   true),

  ('a0000003-0000-0000-0000-000000000003',
   'mentorship',
   'Νέο αίτημα mentorship από τον Νίκο Γεωργίου',
   'Ο Νίκος Γεωργίου σας στέλνει αίτημα mentorship. Δείτε τους στόχους του.',
   '/dashboard/mentorship/mentor',
   false),

  ('a0000008-0000-0000-0000-000000000008',
   'system',
   'Καλωσόρισες στο Alumni Connect!',
   'Το προφίλ σου είναι έτοιμο! Εξερεύνησε το directory, εγγράψου σε groups και βρες mentors.',
   '/dashboard',
   true),

  ('a0000006-0000-0000-0000-000000000006',
   'event_reminder',
   'Υπενθύμιση: Webinar "Ξεκινώντας τη Δική σου Επιχείρηση"',
   'Το webinar ξεκινά σε 10 ημέρες! Έχετε εγγραφεί. Θα σταλεί το link λίγο πριν.',
   '/dashboard/events',
   false),

  ('a0000001-0000-0000-0000-000000000001',
   'system',
   'Νέο μέλος: Άννα Σταματίου',
   'Η Άννα Σταματίου (αποφοιτος 2024) εγγράφηκε στην πλατφόρμα.',
   '/admin/users',
   true),

  ('a0000010-0000-0000-0000-000000000010',
   'system',
   'Προφίλ επαληθεύτηκε!',
   'Το προφίλ σου επαληθεύτηκε. Τώρα έχεις πλήρη πρόσβαση σε όλα τα features της πλατφόρμας.',
   '/dashboard/profile',
   false);

COMMIT;
