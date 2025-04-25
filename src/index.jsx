import App from './app.jsx'
import React from './react'
import {allEffects} from './react'

import './globle.css'
let app = <App></App>

document.querySelector('#root').appendChild(app.render())
allEffects.map((item)=>item())
