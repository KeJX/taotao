export const Tab = function({
    el,
    event="mouseenter",
    activeIndex = 0,
    interval = 0,
    delay=0,
    loadingOption={
        isLoading:false,
        loadingURL:""
    }
}){
    if(!el){
        throw new Error("Tab初始化需要")
    }
    var self = this
    this.el = el
    this.event = event
    this.interval = interval
    this.delay = delay
    this.loadingOption = loadingOption
    this.activeClass = "kjx-tab-item-active"
    this.items = el.querySelectorAll(".kjx-tab-item")
    this.panels = el.querySelectorAll(".kjx-tab-panel")

    this.panelsShowHide = []
    this.panels.forEach(item => {
        self.panelsShowHide.push(new ShowHide({
            el:item,
            mode:"silent",
            isInitHide:true
        }))
    });
    
    this.itemNum = this.items.length
    this.curIndex = activeIndex


    this._init()
}
import "./tab.scss"
import {ShowHide} from "../showHide/showHide"
Tab.prototype._init = function(){
    var self = this 
    // init show
    this.items.forEach(item=>{
        item.classList.remove(self.activeClass)
    })

    
   
// set lazyload
    if(this.loadingOption.isLoading){
        self._loadingImg()
    }
    this.el.trigger("kjx-tab-show",{
        showIndex:self.curIndex,
        showPanel:self.panels[self.curIndex]
    })
    this.items[this.curIndex].classList.add(this.activeClass)
    this.panelsShowHide[this.curIndex].show()
    
     // trigger event
     this.panels.forEach(item=>{
        item.on("show",function(e){
        var curPanel = this
        self.el.trigger("kjx-tab-show" ,{showIndex:Array.prototype.indexOf.call(self.panels,curPanel),showPanel:curPanel})
    })
    })
    
    // bind event
    this.event = this.event === "click" ? "click" : "mouseover"
  var timer = null
    this.el.on(this.event,function(e){
        if(e.target.classList.contains("kjx-tab-item")){
            if(self.delay){
                clearTimeout(timer)
                timer = setTimeout(function(){
                    self.toggle(Array.prototype.indexOf.call(self.items,e.target))
                },self.delay)
            }else{
                self.toggle(Array.prototype.indexOf.call(self.items,e.target))
            }
        }
    })

    // auto
    if(this.interval > 0 && !isNaN(Number(this.interval))){
        self.auto()
        this.el.Hover(function(){
            self.pause()
        },function(){
            self.auto()
        })
    }


    
}



Tab.prototype.toggle= function(index){
    if(this.curIndex === index) return 

    this.panelsShowHide[this.curIndex].hide()
    this.panelsShowHide[index].show()

    this.items[this.curIndex].classList.remove(this.activeClass)
    this.items[index].classList.add(this.activeClass)
    this.curIndex = index
}
Tab.prototype._getCorrectIndex= function(index){
   if(isNaN(Number(index))) return 0
   if(index<0) return this.itemNum-1
   if(index >= this.itemNum) return 0
   return index
}

// 自动切换
Tab.prototype.auto = function(){
    var self = this 
    this.intervalId = setInterval(function(){
        self.toggle(self._getCorrectIndex(self.curIndex+1))
    },self.interval)
}

Tab.prototype.pause = function(){
    clearInterval(this.intervalId)
}


// 设置 按需加载 
Tab.prototype._loadingImg = function () {
    var self = this
    // 初始化loading img
    var items = {},
        loadedItemNum = 0,
        totalItemNum = self.items.length,
        loadItem,
        loadingImg = new Image()

        
    loadingImg.src = self.loadingOption.loadingURL
    self.imgs = self.el.querySelectorAll(".kjx-tab-panel-img")
    loadingImg.onload = function () {
        self.imgs.forEach((item) => {
            item.setAttribute("src", loadingImg.src)
        })
    }
    self.el.on("kjx-tab-show", loadItem = function (e) {
        if (items[e.detail.showIndex] !== "loaded") {
            var item = self.panels[e.detail.showIndex],
                imgDoms = item.querySelectorAll(".kjx-tab-panel-img")
            imgDoms.forEach((item) => {
                var img = new Image()
                img.src = item.dataset.loadingImg
                img.onload = function () {
                    setTimeout(() => {
                        item.setAttribute("src", img.src)
                    }, 1000);
                }
                
            })
            items[e.detail.showIndex] = "loaded"
           loadedItemNum++
           if (loadedItemNum == totalItemNum) {
               self.el.removeEventListener("kjx-tab-show", loadItem)
           }
        }
    })
}