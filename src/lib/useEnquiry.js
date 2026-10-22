import * as React from 'react';
import {createEnquiryBrowser,createUseEnquiry} from '../../appointment-system/browser/enquiry/index.mjs';
import profile from '../../appointment-settings/enquiry-browser.json';
const initial=Object.freeze({receipt:null,busy:false,error:'',started:false,blocked:false,retry:null,waiting:0,resendWait:0,expired:false});
export const useEnquiry=createUseEnquiry(React,createEnquiryBrowser(profile),{serverSnapshot:()=>initial});
