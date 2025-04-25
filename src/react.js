class Renderable {
  constructor() {

  }
}

class FFragment extends Renderable{
  constructor(tag,props,children) {
    super()
    this.children=tag({...props,children})
    this.render()
  }
  render(){
    let eles = this.children.map((item)=>{
      if (item instanceof Renderable) return item.render()
      return document.createTextNode(item)
    })
    return eles
  }
}


class Element extends Renderable{
  constructor(tag,props,children) {
    super()
    this.tag = tag
    this.props = props
    this.children = children
  }
  render(){
    let el = document.createElement(this.tag)
    Object.assign(el,this.props);
    this.children.map((item)=>{
      if (item instanceof Renderable) {
        let result = item.render()
        if (Array.isArray(result)) el.append(...result)
        else el.appendChild(result)
      }
      else el.appendChild(document.createTextNode(item))
    })
    return el;
  }
}

class Component extends Renderable{
  constructor(fn,props,children) {
    super()
    this.fn = function () {
      current = this;
      this.child = fn({...props,children})
    }
    this.props = props
    this.children = children

    this.states = []
    this.effects = []
    this.callback = []
    this.memo = []
    this.usememo = []
    this.usememo_index = 0
    this.memo_index = 0
    this.callback_index = 0
    this.effect_index = 0
    this.state_index = 0

    this.effect = function (com) {
      com.effects.map((item)=>{
        if (item.call==true) {
          let clearup = item.fn()
          item.clearup = clearup
          item.call = false
        }
        if (typeof item.clearup == 'function') item.clearup()
      })
    }

    this.fn()
  }
  render(){
    this.dom = (this.child instanceof Renderable)?this.child.render():document.createTextNode(item)
    return this.dom;
  }
  refresh(){
    current = this
    this.effect_index = 0
    this.state_index = 0
    this.callback_index = 0
    this.memo_index = 0
    this.usememo_index = 0

    let _dom = this.dom
    this.fn()
    this.effect(this)
    this.dom=this.render()
    _dom.parentNode.replaceChild(this.dom,_dom)
  }
}


function createElement(tag,props,...children) {
  if (tag == undefined) {
    console.log('--------',tag);
    // tag = Fragment
  }
  props=props==null?{}:props
  // if (tag == Fragment) {
    // return new FFragment(tag,props,children)
  // }
  if (typeof tag == 'string') return new Element(tag,props,children)
  return new Component(tag,props,children)
}


let allEffects = []
let current = null
//-----------------------------------------------------------------------

function arr_compare(arr1,arr2) {
  if (!Array.isArray(arr1)||!Array.isArray(arr2)||arr1.length!=arr2.length) return undefined;
  for (var i = 0; i < arr1.length; i++) {
    for (var n = 0; n < arr2.length; n++) {
      if (arr2[n]!=arr1[i]) return true;
    }
  }
  return false;
}


function obj_compare(props,com_props) {
  let props_arr = Object.keys(props)
  let com_props_arr = Object.keys(com_props)
  if (!props_arr||!com_props_arr)return null;

  for (var i = 0; i < props_arr.length; i++) {
    let position = com_props_arr.indexOf(props_arr[i])
    if (position>-1) {
      if (props[props_arr[i]]!=com_props[props_arr[i]]){
        if (!Array.isArray(props[props_arr[i]])&&!Array.isArray(com_props[props_arr[i]]))
        return false;
      }
    }
  }
  return true;
}

//-----------------------------------------------------------------------

function useCallback(fn,arr) {
  let index = current.callback_index++
  let effects = current.callback
  if (effects[index]==undefined) {
    current.callback[index] = {fn,arr,call:true,clearup:null}
    allEffects.push(fn)
    current.callback_index = 0
    return;
  }

  let [_fn,_arr] = current.callback[index]
  let result = arr_compare(arr,_arr)
  if (!result) {
    current.callback[index] = {fn,arr}
    return fn;
  }
  return _fn;
}


function useMemo(fn,arr) {
  let index = current.usememo_index++
  if (current.memos[index]==undefined) {
    current.memos[index] = arr
    return fn();
  }
  let result = arr_compare(arr,current.memos[index])
  if (arr.length==0) return;
  if (!result) {
    current.memos[index] = arr
    return fn();
  }
}


function memo(C) {
  let fn = (component)=>(props)=>{
    let index = component.__memo_index++
    if (!component.memo[index]) {
      let _dom = C()
      component.memo[index] = {props,dom:_dom}
      return _dom
    }

    if (!obj_compare(props,component.memo[index].props)) {
      let _dom = C()
      component.memo[index] = {props,dom:_dom}
      return _dom
    }

    return component.memo[index].dom
  }

  return fn(current);
}


function useState(init){
  let index = current.state_index++
  let states = current.states
  if (states[index]==undefined) states[index] = init
  let set = (_current)=> (new_state)=>{
    if ((Array.isArray(states[index])&&Array.isArray(new_state)&&arr_compare(states[index],new_state))||states[index]!=new_state) {
      _current.states[index] = new_state
      _current.state_index=0
      _current.refresh()
    }
  }
  return [states[index],set(current)];
}


function useEffect(fn,arr) {
  let index = current.effect_index++
  let effects = current.effects
  if (effects[index]==undefined) {
    current.effects[index] = {fn,arr,call:true,clearup:null}
    allEffects.push(fn)
    current.effect_index = 0
    return;
  }

  if (arr.length==0) return;
  let result = arr_compare(arr,effects[index].arr)
  if (result) {
    current.effects[index] = {fn,arr,call:true,clearup:null}
    current.effect_index = 0
    return;
  }

}


export default {createElement}
export {allEffects,useEffect,useState,memo}
