import {useEffect,useState} from 'react';
export function usePublicBinding(){const [bound,setBound]=useState(false);useEffect(()=>{setBound(true);},[]);return bound;}
