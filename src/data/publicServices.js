import vedic from '../assets/images/Vedic Astrology.webp'
import numerology from '../assets/images/Numerology.webp'
import vastu from '../assets/images/Vastu Consultation.webp'
import lalKitab from '../assets/images/Laal Kitaab Remedies.webp'
import prashna from '../assets/images/Prashna Kundli.webp'
import nameChange from '../assets/images/Name-Change.png'
import catalogue from './consultationCatalogue.json'
import {money as formatFee} from '../../appointment-system/browser/display-formatting.mjs'

// Keep public artwork/copy separate; confirmed prices come from the catalogue
// shared with the booking server. Payment amounts are still calculated server-side.
export const publicServices = [
  {
    id: 'vedic-astrology',
    image: vedic, icon: 'chart', artScale: 1.16,
    description: 'Explore your birth chart to understand life patterns, planetary influences and the questions that matter to you.',
    focus: [{ icon: 'chart', text: 'Birth chart' }, { icon: 'orbit', text: 'Planetary influences' }],
  },
  {
    id: 'numerology',
    image: numerology, icon: 'numbers', artScale: 1.3,
    description: 'Discover how your date of birth and name are interpreted through numerology, with a closer look at your core numbers and life path.',
    focus: [{ icon: 'numbers', text: 'Core numbers' }, { icon: 'path', text: 'Life path' }],
  },
  {
    id: 'vastu',
    image: vastu, icon: 'home', artScale: 1.4,
    description: 'Look at your home or workplace through Vastu principles, with guidance on the layout, directions and use of your space.',
    focus: [{ icon: 'home', text: 'Home & workplace' }, { icon: 'compass', text: 'Space & direction' }],
  },
  {
    id: 'laal-kitaab',
    image: lalKitab, icon: 'book', artScale: 1.65,
    description: 'Understand the planetary influences in your chart and explore practical, personalised remedies from the Laal Kitaab tradition.',
    focus: [{ icon: 'book', text: 'Chart-based remedies' }, { icon: 'leaf', text: 'Everyday practice' }],
  },
  {
    id: 'prashna-kundali',
    image: prashna, icon: 'question', artScale: 1.4,
    description: 'Bring one specific question. Prashna Kundali considers the chart for the moment you ask, offering a focused reading of your concern.',
    focus: [{ icon: 'question', text: 'One clear question' }, { icon: 'compass', text: 'Focused guidance' }],
  },
  {
    id: 'name-change',
    image: nameChange, icon: 'name', artScale: 1,
    description: 'Considering a different name or spelling? Explore your options through name numerology, with your date of birth as a point of reference.',
    focus: [{ icon: 'name', text: 'Name & spelling' }, { icon: 'numbers', text: 'Name numerology' }],
  },
].map(service => {
  const pricing = catalogue.find(item => item.id === service.id)
  return { ...service, title: pricing.title, price: formatFee(pricing.amount_paise), priceUnit: pricing.per_question ? 'per question' : undefined }
})

export const publicServiceById = Object.fromEntries(publicServices.map(service => [service.id, service]))
