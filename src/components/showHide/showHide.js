import "./showHide.scss"
import {
    Component
} from "../component/component.js"


const modeType = ["silent", "fade","slideUpDown","slideLeftRight"]

export const ShowHide = function ({
    el,
    mode = "silent",
    isInitHide = false
}) {
    if (!el) {
        throw new Error("ShowHide初始化需要el")
    }
    this.el = el
    this.mode = modeType.indexOf(mode) > -1 ? mode : "silent"
    this.isInitHide = isInitHide
    this.animator = new Animator(el, this.mode)
 
    this.animator.init()
    if (isInitHide) {
        el.classList.add("kjx-hide")
        el.dataset.showHide = "hidden"
    }
    if (this.mode != "silent") {
        el.classList.add('transition')
    }
    this.show = this.animator.show
    this.hide = this.animator.hide
}

ShowHide.prototype = Component


var animate = {
    silent: {
        init:function(el){

        },
        show: function (el) {
            show(el, function () {
                el.classList.remove('kjx-hide')
            })
        },
        hide: function (el) {
            hide(el, function () {
                el.classList.add('kjx-hide')
            })
        }
    },
    fade: {
        init:function(el){
            el.classList.add('kjx-fadeout')
        },
        show: function (el) {
            show(el, function () {
                // 异步 display:none是无法拥有动画的
                el.classList.remove('kjx-hide')
                el.removeEventListener("transitionend", fadeHideHandler)
                el.addEventListener("transitionend", fadeShowHandler, {
                    once: true
                })
                setTimeout(() => {
                    el.classList.remove('kjx-fadeout')
                });
            })
        },
        hide: function (el) {
            hide(el, function () {
                el.classList.add('kjx-fadeout')
                el.removeEventListener("transitionend", fadeShowHandler)
                el.addEventListener('transitionend', fadeHideHandler, {
                    once: true
                })
            })
        }
    },
    slideUpDown:{
        init:function(el){
            el.style.height = el.offsetHeight+"px";
            el.classList.add('kjx-slideUpDownCollapse')
        },
        show:function(el){
            show(el,function(){
                el.classList.remove('kjx-hide')
                el.removeEventListener("transitionend", slideUpDownHideHandler)
                el.addEventListener("transitionend", slideUpDownShowHandler, {
                    once: true
                })
                setTimeout(() => {
                    el.classList.remove('kjx-slideUpDownCollapse')
                },20);
            })
        },
        hide:function(el){
            hide(el,function(){
                el.classList.add('kjx-slideUpDownCollapse')
                el.removeEventListener("transitionend", slideUpDownShowHandler)
                el.addEventListener('transitionend', slideUpDownHideHandler, {
                    once: true
                })
            })
        }
    },
    slideLeftRight:{
        init:function(el){
            el.style.width = el.offsetWidth+"px";
            el.classList.add('kjx-slideLeftRight')
        },
        show:function(el){
            show(el,function(){
                el.classList.remove('kjx-hide')
                el.removeEventListener("transitionend", slideLeftRightHideHandler)
                el.addEventListener("transitionend", slideLeftRightShowHandler, {
                    once: true
                })
                setTimeout(() => {
                    el.classList.remove('kjx-slideLeftRight')
                },20);
            })
        },
        hide:function(el){
            hide(el,function(){
                el.classList.add('kjx-slideLeftRight')
                el.removeEventListener("transitionend", slideLeftRightShowHandler)
                el.addEventListener('transitionend', slideLeftRightHideHandler, {
                    once: true
                })
            })
        },
        
    }
}

function fadeShowHandler() {
    // 显示完全后要做的事情
}

function fadeHideHandler() {
    // 消失完全之后要做的事情
    this.classList.add('kjx-hide')
}

function slideUpDownShowHandler(){

}

function slideUpDownHideHandler() {
    // 消失完全之后要做的事情
    this.classList.add('kjx-hide')
}

function slideLeftRightShowHandler(){

}

function slideLeftRightHideHandler() {
    // 消失完全之后要做的事情
    this.classList.add('kjx-hide')
}


function Animator(el, mode) {
    this.init = function init(){
        animate[mode].init(el)
    }
    this.show = function show() {
        animate[mode].show(el)
    }
    this.hide = function show() {
        animate[mode].hide(el)
    }
}


function show(el, duringAnimateCallback) {
    if (el.dataset.showHide === "show" || el.dataset.showHide === "shown") return
    el.trigger("show")
    el.dataset.showHide = "show"
    duringAnimateCallback()
    setTimeout(() => {
        el.trigger("shown")
        el.dataset.showHide = "shown"
    });
}

function hide(el, duringAnimateCallback) {
    if (el.dataset.showHide === "hide" || el.dataset.showHide === "hidden") return
    el.trigger("hide")
    el.dataset.showHide = "hide"
    duringAnimateCallback()
    setTimeout(function () {
        el.trigger("hidden")
        el.dataset.showHide = "hidden"
    })
}