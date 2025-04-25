import React from '../react'
import {useState,useEffect} from '../react'
export default function Test() {
  const [data,setData] = useState('a')
  const [num,setNum] = useState(0)
  return (
    <div>
      <div onclick={()=>setNum(Math.random())}>this is {num}</div>
      <div onclick={()=>setData(data=='a'?'b':'a')}>this is {data}</div>
    </div>
  )
}
