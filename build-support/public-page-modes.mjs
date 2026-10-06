import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import project from '../appointment-settings/project.json' with {type:'json'};
import publicAssets from '../appointment-settings/public-assets.json' with {type:'json'};
import catalogue from '../src/data/consultationCatalogue.json' with {type:'json'};
import {generateModes} from '../appointment-system/tools/build/page-modes.mjs';
import {writeSurfaceManifest} from '../appointment-system/tools/build/surfaces.mjs';
const dist=resolve(import.meta.dirname,'../dist'),shell=readFileSync(resolve(dist,'index.html'),'utf8');
const pages={
 '/':['AstroAdvice by Kundan Singh','Explore astrology guidance and personal consultations with Kundan Singh.'],
 '/about':['About Kundan Singh','Meet Kundan Singh and explore his approach to astrology guidance.'],
 '/services':['Consultations','Explore the astrology services offered by AstroAdvice by Kundan Singh.'],
 '/contact':['Contact the practice','Send a question to AstroAdvice by Kundan Singh or ask for help with an existing booking.'],
 '/testimonials':['Testimonials','Read the experiences shared with AstroAdvice by Kundan Singh.'],
 '/booking':['Book a consultation','Choose a consultation and an available appointment time.'],
 '/privacy-policy':['Privacy policy','How AstroAdvice handles enquiry and booking information.'],
 '/terms-and-conditions':['Terms and conditions','Terms for AstroAdvice services and support.'],
 '/refund-policy':['Refund policy','Rules for cancellation, rescheduling and refunds for existing consultations.'],
 ...Object.fromEntries(catalogue.map(s=>['/services/'+s.id,[s.title,'Explore '+s.title+' guidance with AstroAdvice by Kundan Singh.']]))};
const bookingPaths=['/booking','/booking/receipt','/booking/access','/booking-help'];
const manifest=writeSurfaceManifest({dist,publicDirectory:resolve(import.meta.dirname,'../public'),project,
 publicPaths:Object.keys(pages).filter(path=>!bookingPaths.includes(path)),bookingPaths,
 backendPaths:['/studio','/studio/calendar','/enquiries-studio'],publicAssets});
generateModes({dist,shell,pages,project,manifest,brand:project.label,offDescriptions:{
 '/contact':'Send a question to AstroAdvice by Kundan Singh or contact the practice for help.',
 '/privacy-policy':'How AstroAdvice handles enquiry information and existing consultation records.'}});
console.log('Generated deterministic public display modes; no protected configuration read.');
