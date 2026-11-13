import {useCallback,useEffect,useState} from 'react';import {listOrders,listTechs} from './api';
export default function useOrders(){
 const [orders,setOrders]=useState([]),[techs,setTechs]=useState([]),[err,setErr]=useState(null);
 const refresh=useCallback(async()=>{
  try{const [o,t]=await Promise.all([listOrders(),listTechs()]);setOrders(o);setTechs(t);setErr(null)}
  catch(e){setErr(e.message)}},[]);
 useEffect(()=>{refresh()},[refresh]);
 return {orders,techs,refresh,err}}