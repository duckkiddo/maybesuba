"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ne"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.products": "Products",
    "nav.factories": "Factories",
    "nav.documents": "Documents",
    "nav.contact": "Contact",
    "nav.activities": "Activities",
    "nav.rice": "Rice Varieties",
    "nav.team": "Our Team",
    "nav.gallery": "Gallery",
    "nav.videos": "Videos",

    // Hero Section
    "hero.title": "Premium Quality",
    "hero.titleHighlight": "Agricultural Products",
    "hero.subtitle": "Providing the best quality rice and agricultural products across Nepal",
    "hero.exploreProducts": "Explore Products",
    "hero.getInTouch": "Get In Touch",

    // About
    "about.title": "About Us",
    "about.subtitle": "Learn more about our mission, vision, and goals as Nepal's leading agricultural company.",
    "about.mission": "Our Mission",
    "about.vision": "Our Vision",
    "about.goals": "Our Goals",
    "about.missionText":
      "To provide premium agricultural products while promoting sustainable farming practices that benefit both consumers and the environment, ensuring food security for future generations across Nepal.",
    "about.visionText":
      "To become the leading agricultural company in Nepal recognized globally for innovation, quality, and commitment to sustainable farming practices that nourish communities worldwide.",
    "about.goalsText":
      "To expand our reach across Nepal, enhance product quality, support local farmers, and contribute to food security nationwide while maintaining our commitment to sustainability.",

    // Products
    "products.title": "Our Products",
    "products.subtitle": "Discover our range of premium quality agricultural products.",
    "products.showAll": "Show All Products",
    "products.learnMore": "Learn More",
    "products.whatsapp": "WhatsApp",
    "products.contactSeller": "Contact Seller",
    "products.inStock": "In Stock",
    "products.outOfStock": "Out of Stock",
    "products.category": "Category",
    "products.price": "Price",
    "products.availability": "Availability",
    "products.keyFeatures": "Key Features",
    "products.premiumQuality": "Premium Quality",
    "products.freshNatural": "Fresh & Natural",
    "products.qualityAssured": "Quality Assured",
    "products.fastDelivery": "Fast Delivery",

    // Factories
    "factories.title": "Our Factories",
    "factories.subtitle": "Explore our state-of-the-art production facilities across Nepal.",
    "factories.locations": "Our Locations",
    "factories.exploreLocations": "Explore our factory locations and headquarters across Nepal",
    "factories.manufacturingUnits": "Manufacturing Units",
    "factories.totalEmployees": "Total Employees",
    "factories.districtsCovered": "Districts Covered",
    "factories.operations": "Operations",

    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "Get in touch with our team for inquiries, orders, or partnerships.",
    "contact.name": "Your Name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.subject": "Subject",
    "contact.message": "Your Message",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.success": "Message Sent Successfully!",
    "contact.successMessage": "Thank you for contacting us. We'll get back to you within 24 hours.",
    "contact.becomeDealer": "Become a Dealer/Partner",
    "contact.companyName": "Company/Business Name",
    "contact.contactPerson": "Contact Person",
    "contact.businessType": "Business Type",
    "contact.location": "Location/Area",
    "contact.additionalInfo": "Additional Information",
    "contact.submitApplication": "Submit Application",
    "contact.submitting": "Submitting...",
    "contact.applicationSubmitted": "Application Submitted!",
    "contact.applicationMessage":
      "Thank you for your interest in becoming our partner. Our team will review your application and contact you soon.",

    // Common
    "common.learnMore": "Learn More",
    "common.close": "Close",
    "common.details": "Details",
    "common.viewAll": "View All",
    "common.loading": "Loading...",
    "common.noResults": "No results found",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",

    // Stats
    "stats.yearsExperience": "Years Experience",
    "stats.happyCustomers": "Happy Customers",
    "stats.products": "Products",
    "stats.districtsServed": "Districts Served",

    // Footer
    "footer.description":
      "Vagro-Agro Industries (P).Ltd is Nepal's leading agricultural company providing premium quality rice and other agricultural products.",
    "footer.quickLinks": "Quick Links",
    "footer.products": "Products & Services",
    "footer.contactInfo": "Contact Info",
    "footer.rights": "All Rights Reserved",

    // Gallery & Videos
    "gallery.title": "Gallery",
    "gallery.subtitle": "Explore our agricultural activities and products through images",
    "gallery.viewAllImages": "View All Images",
    "videos.title": "Videos",
    "videos.subtitle": "Watch our agricultural processes and activities through videos",
    "videos.viewAllVideos": "View All Videos",
    "videos.relatedVideos": "Related Videos",
    "videos.uploadDate": "Upload Date:",
    "videos.video": "Video",
    "videos.noDescription": "No description available",

    // Activities
    "activities.title": "Nepal's Agricultural Activities",
    "activities.subtitle":
      "Comprehensive overview of Nepal's agricultural sector, statistics, and challenges. Agriculture forms the backbone of the country's economy and livelihood.",
    "activities.gdpContribution": "Agriculture's GDP Contribution",
    "activities.populationDependent": "Population Dependent on Agriculture",
    "activities.agriculturalHouseholds": "Total Agricultural Households",
    "activities.arableLand": "Hectares of Arable Land",
    "activities.totalArea": "Total Area (sq km)",
    "activities.highestPeak": "Highest Peak",
    "activities.regionalDistribution": "Regional Distribution",
    "activities.majorCrops": "Major Crops",
    "activities.agriculturalCalendar": "Agricultural Calendar",
    "activities.keyChallenges": "Key Challenges",
    "activities.economicImpact": "Economic Impact",

    // Agriculture Timeline
    "timeline.title": "Agriculture Production Process",
    "timeline.subtitle": "From seed to market - our premium agricultural production journey",
    "timeline.landPreparation": "Land Preparation",
    "timeline.planting": "Planting & Crop Care",
    "timeline.harvesting": "Harvesting",
    "timeline.processing": "Processing",
    "timeline.packaging": "Packaging",
    "timeline.transportation": "Transportation",
    "timeline.storage": "Storage",
    "timeline.distribution": "Distribution",

    // Capital Structure
    "capital.title": "Capital Structure",
    "capital.subtitle": "Financial position and capital structure details of our company",
    "capital.authorized": "Authorized Capital",
    "capital.issued": "Issued Capital",
    "capital.paidUp": "Paid-Up Capital",
    "capital.utilization": "Capital Utilization Rate",
    "capital.creditRating": "Credit Rating",
    "capital.established": "Established Year",

    // Welcome Section
    "welcome.title": "Welcome to Vagro-Agro Industries (P).Ltd",
    "welcome.description":
      "We are Nepal's leading agricultural company producing high-quality rice and other agricultural products. Our mission is to empower farmers and provide consumers with healthy and nutritious food.",

    // CEO Message
    "ceo.title": "Message from the Chairman",
    "ceo.message":
      "Our vision is to revolutionize Nepal's agricultural sector and improve the livelihood of farmers. We are committed to quality and innovation in everything we do.",
    "ceo.name": "Guru Prasad Neupane",
    "ceo.position": "Chairman",

    // MD Message
    "md.title": "Message from the Managing Director",
    "md.message": "We are committed to driving innovation in agriculture through technology and passion. Your support inspires us.",
    "md.name": "John Doe",
    "md.position": "Managing Director",

    // Documents
    "documents.title": "Official Documents",
    "documents.subtitle": "Access our company's official documents and certifications",
    "documents.searchFilter": "Search & Filter Documents",
    "documents.searchPlaceholder": "Search documents...",
    "documents.filterCategory": "Filter by category",
    "documents.filterYear": "Filter by year",
    "documents.allCategories": "All Categories",
    "documents.allYears": "All Years",
    "documents.showing": "Showing",
    "documents.of": "of",
    "documents.documentsText": "documents",
    "documents.download": "Download",
    "documents.preview": "Preview",
    "documents.share": "Share",
    "documents.noDocuments": "No documents found",
    "documents.adjustFilters": "Try adjusting your search terms or filters to find what you're looking for.",
    "documents.clearFilters": "Clear Filters",
    "documents.needAdditional": "Need Additional Documents?",
    "documents.requestMessage":
      "If you need any specific documents or certificates not listed above, please contact us and we'll be happy to provide them.",
    "documents.requestDocuments": "Request Documents",
    "documents.printPage": "Print Page",

    // Rice Page
    "rice.title": "Rice Varieties",
    "rice.subtitle": "Different rice varieties available in Nepal",
    "rice.qualityAssurance": "Quality Assurance",
    "rice.qualityMessage":
      "All our rice products go through strict quality control processes. We only bring the finest quality rice to the market.",
    "rice.natural": "Natural",
    "rice.noChemicals": "No chemicals",
    "rice.certified": "Certified",
    "rice.qualityCertified": "Quality certified",
    "rice.premium": "Premium",
    "rice.highQuality": "High quality",
    "rice.orderNow": "Order Now",

    // Team Page
    "team.title": "Our Team",
    "team.subtitle": "Meet the dedicated professionals behind our success",
    "team.leadership": "Leadership Team",
    "team.management": "Management Team",
    "team.technical": "Technical Team",

    // Admin
    "admin.login": "Admin Login",
    "admin.dashboard": "Admin Dashboard",
    "admin.products": "Products",
    "admin.documents": "Documents",
    "admin.notices": "Notices",
    "admin.factories": "Factories",
    "admin.media": "Media",
    "admin.mail": "Mail Submissions",
    "admin.carousel": "Carousel",
    "admin.settings": "Settings",
  },
  ne: {
    // Navigation
    "nav.home": "गृहपृष्ठ",
    "nav.about": "हाम्रो बारेमा",
    "nav.products": "उत्पादनहरू",
    "nav.factories": "कारखानाहरू",
    "nav.documents": "कागजातहरू",
    "nav.contact": "सम्पर्क",
    "nav.activities": "गतिविधिहरू",
    "nav.rice": "चामलका किसिमहरू",
    "nav.team": "हाम्रो टिम",
    "nav.gallery": "ग्यालेरी",
    "nav.videos": "भिडियोहरू",

    // Hero Section
    "hero.title": "उच्च गुणस्तरीय",
    "hero.titleHighlight": "कृषि उत्पादनहरू",
    "hero.subtitle": "नेपालभरि उत्कृष्ट गुणस्तरको चामल र कृषि उत्पादनहरू प्रदान गर्दै",
    "hero.exploreProducts": "उत्पादनहरू हेर्नुहोस्",
    "hero.getInTouch": "सम्पर्क गर्नुहोस्",

    // About
    "about.title": "हाम्रो बारेमा",
    "about.subtitle": "नेपालको अग्रणी कृषि कम्पनीको रूपमा हाम्रो मिशन, भिजन र लक्ष्यहरूको बारेमा थप जान्नुहोस्।",
    "about.mission": "हाम्रो मिशन",
    "about.vision": "हाम्रो भिजन",
    "about.goals": "हाम्रा लक्ष्यहरू",
    "about.missionText":
      "दिगो कृषि अभ्यासहरूलाई बढावा दिँदै उपभोक्ता र वातावरण दुवैलाई फाइदा पुर्‍याउने प्रिमियम कृषि उत्पादनहरू प्रदान गर्नु, नेपालभरि भावी पुस्ताहरूको लागि खाद्य सुरक्षा सुनिश्चित गर्नु।",
    "about.visionText":
      "नवाचार, गुणस्तर र दिगो कृषि अभ्यासहरूप्रति प्रतिबद्धताका लागि विश्वव्यापी रूपमा मान्यता प्राप्त नेपालको अग्रणी कृषि कम्पनी बन्नु जसले विश्वव्यापी समुदायहरूलाई पोषण प्रदान गर्छ।",
    "about.goalsText":
      "नेपालभरि हाम्रो पहुँच विस्तार गर्नु, उत्पादनको गुणस्तर बढाउनु, स्थानीय किसानहरूलाई सहयोग गर्नु, र दिगोताप्रति हाम्रो प्रतिबद्धता कायम राख्दै राष्ट्रिय खाद्य सुरक्षामा योगदान पुर्‍याउनु।",

    // Products
    "products.title": "हाम्रा उत्पादनहरू",
    "products.subtitle": "हाम्रो उच्च गुणस्तरको कृषि उत्पादनहरूको श्रृंखला पत्ता लगाउनुहोस्।",
    "products.showAll": "सबै उत्पादनहरू हेर्नुहोस्",
    "products.learnMore": "थप जान्नुहोस्",
    "products.whatsapp": "व्हाट्सएप",
    "products.contactSeller": "विक्रेतालाई सम्पर्क गर्नुहोस्",
    "products.inStock": "स्टकमा छ",
    "products.outOfStock": "स्टकमा छैन",
    "products.category": "श्रेणी",
    "products.price": "मूल्य",
    "products.availability": "उपलब्धता",
    "products.keyFeatures": "मुख्य विशेषताहरू",
    "products.premiumQuality": "प्रिमियम गुणस्तर",
    "products.freshNatural": "ताजा र प्राकृतिक",
    "products.qualityAssured": "गुणस्तर आश्वासन",
    "products.fastDelivery": "छिटो डेलिभरी",

    // Factories
    "factories.title": "हाम्रा कारखानाहरू",
    "factories.subtitle": "नेपालभरि हाम्रो अत्याधुनिक उत्पादन सुविधाहरू अन्वेषण गर्नुहोस्।",
    "factories.locations": "हाम्रा स्थानहरू",
    "factories.exploreLocations": "नेपाल भरि हाम्रा कारखाना स्थानहरू र मुख्यालय अन्वेषण गर्नुहोस्",
    "factories.manufacturingUnits": "उत्पादन इकाइहरू",
    "factories.totalEmployees": "कुल कर्मचारीहरू",
    "factories.districtsCovered": "सेवा पुर्‍याइएका जिल्लाहरू",
    "factories.operations": "संचालन",

    // Contact
    "contact.title": "हामीलाई सम्पर्क गर्नुहोस्",
    "contact.subtitle": "सोधपुछ, अर्डर वा साझेदारीको लागि हाम्रो टिमसँग सम्पर्क गर्नुहोस्।",
    "contact.name": "तपाईंको नाम",
    "contact.email": "इमेल ठेगाना",
    "contact.phone": "फोन नम्बर",
    "contact.subject": "विषय",
    "contact.message": "तपाईंको सन्देश",
    "contact.send": "सन्देश पठाउनुहोस्",
    "contact.sending": "पठाउँदै...",
    "contact.success": "सन्देश सफलतापूर्वक पठाइयो!",
    "contact.successMessage": "हामीलाई सम्पर्क गर्नुभएकोमा धन्यवाद। हामी २४ घण्टा भित्र तपाईंलाई सम्पर्क गर्नेछौं।",
    "contact.becomeDealer": "डिलर/पार्टनर बन्नुहोस्",
    "contact.companyName": "कम्पनी/व्यवसायको नाम",
    "contact.contactPerson": "सम्पर्क व्यक्ति",
    "contact.businessType": "व्यवसायको प्रकार",
    "contact.location": "स्थान/क्षेत्र",
    "contact.additionalInfo": "अतिरिक्त जानकारी",
    "contact.submitApplication": "आवेदन पेश गर्नुहोस्",
    "contact.submitting": "पेश गर्दै...",
    "contact.applicationSubmitted": "आवेदन पेश गरियो!",
    "contact.applicationMessage":
      "हाम्रो पार्टनर बन्न चाहनुभएकोमा धन्यवाद। हाम्रो टिमले तपाईंको आवेदन समीक्षा गरेर चाँडै सम्पर्क गर्नेछ।",

    // Common
    "common.learnMore": "थप जान्नुहोस्",
    "common.close": "बन्द गर्नुहोस्",
    "common.details": "विवरण",
    "common.viewAll": "सबै हेर्नुहोस्",
    "common.loading": "लोड हुँदै...",
    "common.noResults": "कुनै परिणाम फेला परेन",
    "common.search": "खोज्नुहोस्",
    "common.filter": "छान्नुहोस्",
    "common.all": "सबै",

    // Stats
    "stats.yearsExperience": "वर्षको अनुभव",
    "stats.happyCustomers": "सन्तुष्ट ग्राहकहरू",
    "stats.products": "उत्पादनहरू",
    "stats.districtsServed": "सेवा पुर्‍याइएका जिल्लाहरू",

    // Footer
    "footer.description":
      "वाग्रो-एग्रो इन्डस्ट्रिज (प्रा).लि. नेपालको अग्रणी कृषि कम्पनी हो जसले उच्च गुणस्तरको चामल र अन्य कृषि उत्पादनहरू प्रदान गर्दछ।",
    "footer.quickLinks": "द्रुत लिङ्कहरू",
    "footer.products": "उत्पादन र सेवाहरू",
    "footer.contactInfo": "सम्पर्क जानकारी",
    "footer.rights": "सर्वाधिकार सुरक्षित",

    // Gallery & Videos
    "gallery.title": "ग्यालेरी",
    "gallery.subtitle": "हाम्रो कृषि गतिविधिहरू र उत्पादनहरूका तस्बिरहरू हेर्नुहोस्",
    "gallery.viewAllImages": "सबै तस्बिरहरू हेर्नुहोस्",
    "videos.title": "भिडियोहरू",
    "videos.subtitle": "हाम्रो कृषि प्रक्रिया र गतिविधिहरूका भिडियोहरू हेर्नुहोस्",
    "videos.viewAllVideos": "सबै भिडियोहरू हेर्नुहोस्",
    "videos.relatedVideos": "अन्य भिडियोहरू",
    "videos.uploadDate": "अपलोड मिति:",
    "videos.video": "भिडियो",
    "videos.noDescription": "भिडियो विवरण उपलब्ध छैन",

    // Activities
    "activities.title": "नेपालको कृषि गतिविधिहरू",
    "activities.subtitle":
      "नेपालको कृषि क्षेत्रको विस्तृत विवरण, तथ्याङ्क र चुनौतिहरूको अवलोकन। यो देशको अर्थतन्त्र र जनजीवनको मुख्य आधार हो।",
    "activities.gdpContribution": "जीडीपीमा कृषिको योगदान",
    "activities.populationDependent": "कृषिमा निर्भर जनसंख्या",
    "activities.agriculturalHouseholds": "कुल कृषि घरपरिवार",
    "activities.arableLand": "हेक्टेयर कृषि योग्य भूमि",
    "activities.totalArea": "वर्ग किलोमिटर कुल क्षेत्रफल",
    "activities.highestPeak": "सर्वोच्च शिखर",
    "activities.regionalDistribution": "भौगोलिक वितरण",
    "activities.majorCrops": "मुख्य बालीहरू",
    "activities.agriculturalCalendar": "कृषि पंचाङ्ग",
    "activities.keyChallenges": "मुख्य चुनौतिहरू",
    "activities.economicImpact": "आर्थिक प्रभाव",

    // Agriculture Timeline
    "timeline.title": "कृषि उत्पादन प्रक्रिया",
    "timeline.subtitle": "बीउदेखि बजारसम्म - हाम्रो उत्कृष्ट कृषि उत्पादन प्रक्रिया",
    "timeline.landPreparation": "जमिन तयारी",
    "timeline.planting": "रोपाई र बाली हेरचाह",
    "timeline.harvesting": "बाली कटानी",
    "timeline.processing": "प्रशोधन",
    "timeline.packaging": "प्याकेजिङ",
    "timeline.transportation": "यातायात",
    "timeline.storage": "भण्डारण",
    "timeline.distribution": "वितरण",

    // Capital Structure
    "capital.title": "पूंजी संरचना",
    "capital.subtitle": "हाम्रो कम्पनीको वित्तीय स्थिति र पूंजी संरचनाको विवरण",
    "capital.authorized": "अधिकृत पूंजी",
    "capital.issued": "जारी पूंजी",
    "capital.paidUp": "चुक्ता पूंजी",
    "capital.utilization": "पूंजी उपयोग दर",
    "capital.creditRating": "क्रेडिट रेटिङ",
    "capital.established": "स्थापना वर्ष",

    // Welcome Section
    "welcome.title": "वाग्रो-एग्रो इन्डस्ट्रिज (प्रा).लि. मा स्वागत छ",
    "welcome.description":
      "हामी नेपालको अग्रणी कृषि कम्पनी हौं जसले उच्च गुणस्तरको चामल र अन्य कृषि उत्पादनहरू उत्पादन गर्छ। हाम्रो मिशन भनेको किसानहरूलाई सशक्त बनाउनु र उपभोक्ताहरूलाई स्वस्थ र पोषणयुक्त खाना प्रदान गर्नु हो।",

    // CEO Message
    "ceo.title": "प्रमुख कार्यकारी अधिकृतको सन्देश",
    "ceo.message":
      "हाम्रो दृष्टिकोण भनेको नेपालको कृषि क्षेत्रमा क्रान्ति ल्याउनु र किसानहरूको जीवनस्तर सुधार गर्नु हो। हामी गुणस्तर र नवाचारमा प्रतिबद्ध छौं।",
    "ceo.name": "राजेश कुमार शर्मा",
    "ceo.position": "प्रमुख कार्यकारी अधिकृत",

    // MD Message NEpali
    "md.title": "Message from the Managing Director",
    "md.message": "We are committed to driving innovation in agriculture through technology and passion. Your support inspires us.",
    "md.name": "John Doe",
    "md.position": "Managing Director",

    // Documents
    "documents.title": "आधिकारिक कागजातहरू",
    "documents.subtitle": "हाम्रो कम्पनीका आधिकारिक कागजात र प्रमाणपत्रहरू पहुँच ���र्नुहोस्",
    "documents.searchFilter": "कागजातहरू खोज्नुहोस् र छान्नुहोस्",
    "documents.searchPlaceholder": "कागजातहरू खोज्नुहोस्...",
    "documents.filterCategory": "श्रेणी अनुसार छान्नुहोस्",
    "documents.filterYear": "वर्ष अनुसार छान्नुहोस्",
    "documents.allCategories": "सबै श्रेणीहरू",
    "documents.allYears": "सबै वर्षहरू",
    "documents.showing": "देखाइँदै",
    "documents.of": "को",
    "documents.documentsText": "कागजातहरू",
    "documents.download": "डाउनलोड",
    "documents.preview": "पूर्वावलोकन",
    "documents.share": "साझा गर्नुहोस्",
    "documents.noDocuments": "कुनै कागजात फेला परेन",
    "documents.adjustFilters": "तपाईंले खोजिरहनुभएको कुरा फेला पार्न आफ्ना खोज शब्दहरू वा फिल्टरहरू समायोजन गर्ने प्रयास गर्नुहोस्।",
    "documents.clearFilters": "फिल्टरहरू खाली गर्नुहोस्",
    "documents.needAdditional": "थप कागजातहरू चाहिन्छ?",
    "documents.requestMessage":
      "यदि तपाईंलाई माथि सूचीबद्ध नभएका कुनै विशिष्ट कागजात वा प्रमाणपत्रहरू चाहिन्छ भने, कृपया हामीलाई सम्पर्क गर्नुहोस् र हामी तिनीहरू प्रदान गर्न खुसी हुनेछौं।",
    "documents.requestDocuments": "कागजातहरू अनुरोध गर्नुहोस्",
    "documents.printPage": "पृष्ठ प्रिन्ट गर्नुहोस्",

    // Rice Page
    "rice.title": "चामलका किसिमहरू",
    "rice.subtitle": "नेपालमा उपलब्ध विभिन्न चामलका किसिमहरू",
    "rice.qualityAssurance": "गुणस्तरको आश्वासन",
    "rice.qualityMessage":
      "हाम्रो सबै चामल उत्पादनहरू कडा गुणस्तर नियन्त्रण प्रक्रियाबाट गुज्रिन्छन्। हामी केवल उत्कृष्ट गुणस्तरको चामल मात्र बजारमा ल्याउँछौं।",
    "rice.natural": "प्राकृतिक",
    "rice.noChemicals": "कुनै रसायन छैन",
    "rice.certified": "प्रमाणित",
    "rice.qualityCertified": "गुणस्तर प्रमाणित",
    "rice.premium": "उत्कृष्ट",
    "rice.highQuality": "उच्च गुणस्तर",
    "rice.orderNow": "अर्डर गर्नुहोस्",

    // Team Page
    "team.title": "हाम्रो टिम",
    "team.subtitle": "हाम्रो सफलताको पछाडि समर्पित पेशेवरहरूलाई भेट्नुहोस्",
    "team.leadership": "नेतृत्व टिम",
    "team.management": "व्यवस्थापन टिम",
    "team.technical": "प्राविधिक टिम",

    // Admin
    "admin.login": "प्रशासक लगइन",
    "admin.dashboard": "प्रशासक ड्यासबोर्ड",
    "admin.products": "उत्पादनहरू",
    "admin.documents": "कागजातहरू",
    "admin.notices": "सूचनाहरू",
    "admin.factories": "कारखानाहरू",
    "admin.media": "मिडिया",
    "admin.mail": "मेल सबमिशनहरू",
    "admin.carousel": "क्यारोसेल",
    "admin.settings": "सेटिङहरू",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ne")) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("language", language)
      } catch (error) {
        console.warn("Could not save to localStorage:", error)
      }
    }
  }, [language, isClient])

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations.en]
    if (!translation) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translation
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
