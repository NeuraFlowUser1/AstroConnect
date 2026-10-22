import {createStateController,publicDisplaySnapshot} from '../../appointment-system/browser/product-state.mjs';
const declared=typeof document==='undefined'?false:document.querySelector('meta[name="booking-display-mode"]')?.content==='on';
const initial=publicDisplaySnapshot(declared);
export const productState=createStateController({serverSnapshot:()=>initial,initialDisplay:true});
