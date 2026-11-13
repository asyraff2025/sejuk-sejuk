import {useCallback,useEffect,useState} from 'react';import {listOrders} from './api';
export default function useOrders(){const [orders,set]=useState([]),[err,setErr]=useState(null);
 const refresh=useCallback(()=>listOrders().then(set).catch(e=>setErr(e.message)),[]);
 useEffect(()=>{refresh()},[refresh]);return {orders,refresh,err}}
