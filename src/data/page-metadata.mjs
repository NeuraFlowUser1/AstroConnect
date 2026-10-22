/** Reviewed ordinary page identity. No query, receipt or customer values belong here. */
export const origin='https://astroadvicebykundansingh.com';
export const shareImage=origin+'/social/astroadvice-consultations.webp';
export const shareAlt='AstroAdvice by Kundan Singh — astrology consultations';
export const publicPages=Object.freeze({
  "/": {
    "title": "Astrology Consultations in New Delhi | AstroAdvice by Kundan Singh",
    "description": "Explore astrology, Numerology and Vastu consultations with Kundan Singh in New Delhi. Read about the services and contact the practice with your questions."
  },
  "/about": {
    "title": "About Kundan Singh | AstroAdvice",
    "description": "Read about Kundan Singh's astrology studies, experience and approach to consultations, and find the service that fits your question."
  },
  "/services": {
    "title": "Astrology Services | AstroAdvice by Kundan Singh",
    "description": "Compare Vedic Astrology, Numerology, Vastu, Laal Kitaab, Prashna Kundali and name-change consultations with Kundan Singh."
  },
  "/services/vedic-astrology": {
    "title": "Vedic Astrology Consultation | AstroAdvice",
    "description": "Read about a Vedic Astrology consultation with Kundan Singh, the questions you can bring and the information requested when arranging a consultation."
  },
  "/services/numerology": {
    "title": "Numerology Consultation | AstroAdvice",
    "description": "Read about Numerology consultations with Kundan Singh and how names and dates are discussed. Contact the practice if you need help choosing a service."
  },
  "/services/vastu": {
    "title": "Vastu Consultation | AstroAdvice",
    "description": "Read about discussing your home or workplace with Kundan Singh through a Vastu consultation, including the information to prepare."
  },
  "/services/laal-kitaab": {
    "title": "Laal Kitaab Consultation | AstroAdvice",
    "description": "Learn what a Laal Kitaab consultation with Kundan Singh covers and how to bring your questions to the discussion."
  },
  "/services/prashna-kundali": {
    "title": "Prashna Kundali Consultation | AstroAdvice",
    "description": "Read about bringing a specific question to a Prashna Kundali consultation with Kundan Singh and how question-based booking works."
  },
  "/services/name-change": {
    "title": "Name Change Consultation | AstroAdvice",
    "description": "Read about a name-change consultation with Kundan Singh and discuss your questions about names and Numerology with the practice."
  },
  "/testimonials": {
    "title": "Client Experiences | AstroAdvice by Kundan Singh",
    "description": "Read the experiences shared on the AstroAdvice website about consultations with Kundan Singh."
  },
  "/contact": {
    "title": "Contact AstroAdvice | Kundan Singh, New Delhi",
    "description": "Find AstroAdvice's contact details and send the practice a question about consultations or an existing appointment."
  },
  "/privacy-policy": {
    "title": "Privacy Policy | AstroAdvice by Kundan Singh",
    "description": "Read how AstroAdvice handles enquiry and appointment information, including contact details and practice records."
  },
  "/terms-and-conditions": {
    "title": "Terms & Conditions | AstroAdvice by Kundan Singh",
    "description": "Read the terms for AstroAdvice consultations, booking and support, and contact the practice if you have a question."
  },
  "/refund-policy": {
    "title": "Refund Policy | AstroAdvice by Kundan Singh",
    "description": "Read AstroAdvice's information about appointment changes, cancellations and refund review. Contact the practice for help with an existing booking."
  }
});
export const utilityPages=Object.freeze({
 '/booking':{title:'Book a Consultation | AstroAdvice by Kundan Singh',description:'Choose a consultation and an available appointment time.'},
 '/booking/receipt':{title:'View My Booking | AstroAdvice by Kundan Singh',description:'View your saved appointment details.'},
 '/booking/access':{title:'Find My Booking | AstroAdvice by Kundan Singh',description:'Find an existing appointment using its saved details.'},
 '/booking-help':{title:'Find My Booking | AstroAdvice by Kundan Singh',description:'Find an existing appointment using its saved details.'}
});
export const utilityPaths=Object.freeze(Object.keys(utilityPages));
export const escapeHtml=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export const safeJson=value=>JSON.stringify(value).replace(/[<>&\u2028\u2029]/g,c=>({ '<':'\\u003c','>':'\\u003e','&':'\\u0026','\u2028':'\\u2028','\u2029':'\\u2029'}[c]));
export function metadataFor(path){
 const page=publicPages[path];
 if(page)return {...page,path,canonical:origin+path,robots:'index, follow',referrer:'strict-origin-when-cross-origin',public:true};
 return {title:utilityPages[path]?.title||'Page Not Found | AstroAdvice by Kundan Singh',description:utilityPages[path]?.description||'Contact the practice if you need help with an appointment.',path,canonical:null,robots:'noindex, nofollow',referrer:'no-referrer',public:false};
}
export function structuredGraph(path){
 const page=publicPages[path];if(!page)return null;
 const business=origin+'/#practice',website=origin+'/#website',person=origin+'/#kundan-singh',url=origin+path;
 const graph=[{'@type':'ProfessionalService','@id':business,name:'AstroAdvice by Kundan Singh',url:origin+'/',image:shareImage,telephone:'+918527790801',email:'astroadvicebyks@gmail.com',address:{'@type':'PostalAddress',streetAddress:'B-23 Shantikunj, B-Block, Avenue-9, Church Road, Vasant Kunj',addressLocality:'New Delhi',postalCode:'110070',addressCountry:'IN'},openingHoursSpecification:[{ '@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],opens:'10:00',closes:'12:00'},{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],opens:'15:00',closes:'18:00'}]},
 {'@type':'Person','@id':person,name:'Kundan Singh',worksFor:{'@id':business}},
 {'@type':'WebSite','@id':website,url:origin+'/',name:'AstroAdvice by Kundan Singh',publisher:{'@id':business}},
 {'@type':'WebPage','@id':url+'#page',url,name:page.title,description:page.description,isPartOf:{'@id':website},about:{'@id':business},primaryImageOfPage:{'@type':'ImageObject',url:shareImage}}];
 if(path!=='/'){
  const crumbs=[{ '@type':'ListItem',position:1,name:'Home',item:origin+'/'}];
  if(path.startsWith('/services/'))crumbs.push({'@type':'ListItem',position:2,name:'Services',item:origin+'/services'});
  crumbs.push({'@type':'ListItem',position:crumbs.length+1,name:page.title.split(' | ')[0],item:url});
  graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumbs',itemListElement:crumbs});
  graph[3].breadcrumb={'@id':url+'#breadcrumbs'};
 }
 if(path.startsWith('/services/'))graph.push({'@type':'Service','@id':url+'#service',name:page.title.split(' | ')[0],description:page.description,provider:{'@id':business},url});
 return {'@context':'https://schema.org','@graph':graph};
}
export function metadataTags(path){
 const m=metadataFor(path),tags=[`<title>${escapeHtml(m.title)}</title>`,`<meta name="description" content="${escapeHtml(m.description)}">`,`<meta name="robots" content="${m.robots}">`,`<meta name="googlebot" content="${m.robots}">`,`<meta name="referrer" content="${m.referrer}">`];
 if(m.public){
  tags.push(`<link rel="canonical" href="${m.canonical}">`);
  for(const [key,value]of Object.entries({'og:title':m.title,'og:description':m.description,'og:url':m.canonical,'og:type':'website','og:image':shareImage,'og:image:alt':shareAlt}))tags.push(`<meta property="${key}" content="${escapeHtml(value)}">`);
  for(const [key,value]of Object.entries({'twitter:card':'summary_large_image','twitter:title':m.title,'twitter:description':m.description,'twitter:image':shareImage,'twitter:image:alt':shareAlt}))tags.push(`<meta name="${key}" content="${escapeHtml(value)}">`);
  tags.push(`<script type="application/ld+json" data-page-graph>${safeJson(structuredGraph(path))}</script>`);
 }
 return tags.join('\n');
}
export function writeMetadata(path,documentObject=document){
 const m=metadataFor(path);documentObject.title=m.title;
 documentObject.head.querySelectorAll('meta[name="description"],meta[name="robots"],meta[name="googlebot"],meta[name="referrer"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"],script[type="application/ld+json"]').forEach(n=>n.remove());
 const template=documentObject.createElement('template');template.innerHTML=metadataTags(path).replace(/<title>[\s\S]*?<\/title>/,'');documentObject.head.append(template.content);
}
