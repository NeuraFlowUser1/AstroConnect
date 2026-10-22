/** Build-only renderer. Public components are eagerly imported, with no provider/customer reads. */
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import PublicApp from './PublicApp.jsx';
import {BookingStateProvider} from './lib/BookingProduct.jsx';
import {createStateController,publicDisplaySnapshot} from '../appointment-system/browser/product-state.mjs';
export function renderPublicPage(path,mode){
 const snapshot=publicDisplaySnapshot(mode==='on');
 const controller=createStateController({serverSnapshot:()=>snapshot,fetcher:()=>{throw Error('Public rendering must not fetch.');}});
 const tree=createElement(BookingStateProvider,{controller},createElement(MemoryRouter,{initialEntries:[path]},createElement(PublicApp)));
 const body=renderToString(tree,{identifierPrefix:'astroadvice-'});
 if(body.includes('Loading the page…')||body.includes('BAILOUT_TO_CLIENT_SIDE_RENDERING'))throw Error('Unresolved public page at '+path);
 return body;
}
