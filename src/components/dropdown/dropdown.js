export const Dropdown = function ({
    el,
    animateMode = "slideLeftRight",
    loadingOptions={
        isLoading : false,
        loadingPath : ""
    }
}) {
    if (!el) {
        throw new Error("dropdown选择元素未传入")
    }
    this.el = el
    this.toggle = el.querySelector(".kjx-dropdown-toggle")
    this.layer = el.querySelector(".kjx-dropdown-layer")

    this.animateMode = animateMode
    this.loadingOptions = loadingOptions

    var self = this
    // 和showhide的顺序不能乱    因为loading的时候改变了dom 的结构 ， showhide模块要根据dom结构来判断长宽
    if (loadingOptions.isLoading) {
        this._loading()
    }

    this.layerShowHide = new ShowHide({
        el: self.layer,
        mode: self.animateMode,
        isInitHide: true
    })
    this._beDropdown()
    
}

import "./dropdown.scss"
import {
    ShowHide
} from "../showHide/showHide.js"
import axios from "axios"
Dropdown.prototype._beDropdown = function () {
    var self = this,
        el = this.el
    var activeClass = el.dataset.dropdownType + "-active"

    //当前的dropdown对象
    el.addEventListener("mouseenter", function () {
        el.classList.add(activeClass)
        self.layerShowHide.show()
        el.trigger("kjx-dropdown-show")
    })
    el.addEventListener("mouseleave", function () {
        el.classList.remove(activeClass)
        self.layerShowHide.hide()
        el.trigger("kjx-dropdown-hide")
    })
}



Dropdown.prototype._loading = function () {
    var el = this.el,
        self = this,
        loadingUrl = this.loadingOptions.loadingPath,
        loadingDiv = "<div class='kjx-dropdown-loading'></div>"
        self.layer.innerHTML =loadingDiv
        self.layer.style = ""
        self.layer.style.width = self.layer.offsetWidth + "px"
         el.dataset.isloading = false
    

    el.addEventListener("kjx-dropdown-show", function () {
        var html = "";
        if (el.dataset.isloading == "false") {
            axios.get(loadingUrl).then(res => {
                el.trigger("kjx-dropdown-getData",res.data)
                self.el.dataset.isloading = true
            },rej=>{
                console.log(rej)
                el.trigger("kjx-dropdown-noData",rej)
            })
        }
    })
}

