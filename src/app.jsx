import React from './react'
import {useState,useEffect,memo} from './react'
import Test from './pages/test'
export default function App({children}) {
  const [num,setNum] = useState(0)
  const [a,seta] = useState(0)
  const [b,setb] = useState(0)
  const [c,setc] = useState(0)

  return (
    <div id='app' >
      <div onclick={()=>setNum(Math.random())}>click</div>
      <Test />
    </div>
  )
}
