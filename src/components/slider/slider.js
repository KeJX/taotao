export const Slider = function ({
    el,
    animateMode = "fade",
    activeIndex = 0,
    interval = 0,
    isIndicator = true,
    loadingOption = {
        loading: false,
        loadingURL: ""
    }
}) {
    var self = this
    this.el = el
    this.items = el.querySelectorAll(".kjx-slider-item")
    this.itemNum = this.items.length
    this.currentIndex = this._getCorrectIndex(activeIndex)
    this.animateMode = animateMode
    this.interval = interval
    this.loadingOption = loadingOption
    this.isIndicator = isIndicator
    if (isIndicator) {
        this.indicators = el.querySelectorAll(".kjx-slider-indicator")
    }
    this.control = {
        left: el.querySelector(".kjx-slider-control-left"),
        right: el.querySelector(".kjx-slider-control-right")
    }

    this.controlShowHide = {
        left: new ShowHide({
            el: self.control.left,
            mode: "fade",
            isInitHide: true
        }),
        right: new ShowHide({
            el: self.control.right,
            mode: "fade",
            isInitHide: true
        })
    }


    this._init()

}


import "./slider.scss"
import {
    Move
} from "../move/move"
import {
    ShowHide
} from "../showHide/showHide"
var indicatorActiveClass = "kjx-slider-indicator-active"
Slider.prototype._init = function () {
    var self = this
    // init show
    if (self.isIndicator) {
        self.indicators.forEach((item) => {
            item.classList.remove(indicatorActiveClass)
        })
        self._activeIndicator(self.currentIndex)

    }
    if (self.loadingOption.loading) {
        // 设置 loading 图片
        self._loadingImg()
    }
    self.el.trigger("kjx-slider-show", {
        showIndex: self.currentIndex,
        showItem: self.items[self.currentIndex]
    })
    // to
    if (self.animateMode == "slide") {
        self.el.classList.add("kjx-slider-slide")
        self.items[self.currentIndex].style.left = 0
        self.slideWidth = this.items[0].offsetWidth
        self.to = self._slide
        self.moves = []
        self.items.forEach((item) => {
            self.moves.push(new Move({
                el: item,
                mode: "dynamic"
            }))
        })
    } else {
        var itemsShowHide = []
        self.items.forEach(function (item) {
            itemsShowHide.push(new ShowHide({
                el: item,
                mode: "fade",
                isInitHide: true
            }))
        })
        self.itemsShowHide = itemsShowHide
        self.el.classList.add("kjx-slider-fade")
        self.itemsShowHide[self.currentIndex].show()
        self.to = self._fade
    }

    // bindEvent
    self.el.Hover(function () {
        self.controlShowHide.left.show()
        self.controlShowHide.right.show()
    }, function () {
        self.controlShowHide.left.hide()
        self.controlShowHide.right.hide()
    })


    self.el.addEventListener("click", function (e) {
        if (e.target === self.control.left) {
            self.to(self._getCorrectIndex(self.currentIndex - 1), 1)
        }
        if (e.target === self.control.right) {
            self.to((self._getCorrectIndex(self.currentIndex + 1)), -1)
        }
        if (e.target.classList.contains("kjx-slider-indicator")) {
            var index = self._getCorrectIndex(Array.prototype.indexOf.call(self.indicators, e.target))
            if (index === self.currentIndex) return
            self.to(index)
        }
    })

    // auto
    if (this.interval && !isNaN(Number(this.interval))) {
        self.auto()
        self.el.Hover(function () {
            self.pause()
        }, function () {
            self.auto()
        })
    }

    // send message
    this.items.forEach((item, i) => {
        item.on("show", function (e) {
            self.el.trigger("kjx-slider-" + e.type, {
                showIndex: i,
                showItem: item
            })
        })
        item.on("move moved", function (e) {
            if (e.type === "move") {
                if (i === self.currentIndex) {
                    self.el.trigger("kjx-slider-hide", {
                        showIndex: i,
                        showItem: item
                    })
                } else {
                    self.el.trigger("kjx-slider-show", {
                        showIndex: i,
                        showItem: item
                    })
                }
            } else {
                if (i === self.currentIndex) {
                    self.el.trigger("kjx-slider-shown", {
                        showIndex: i,
                        showItem: item
                    })
                } else {
                    self.el.trigger("kjx-slider-hidden", {
                        showIndex: i,
                        showItem: item
                    })
                }
            }
        })
    })


}


Slider.prototype._getCorrectIndex = function (index) {
    if (isNaN(Number(index))) return 0
    if (index < 0) return this.itemNum - 1
    if (index > this.itemNum - 1) return 0
    return index
}
Slider.prototype._fade = function (index) {
    this.itemsShowHide[this.currentIndex].hide()
    this.itemsShowHide[index].show()

    this._activeIndicator(index)

    this.currentIndex = index
}

Slider.prototype._slide = function (index, direction) {
    if (index === this.currentIndex) return
    // decide the direction for sliding
    if (!direction) {
        // click the indicators
        if (this.currentIndex < index) {
            direction = -1
        } else if (this.currentIndex > index) {
            direction = 1
        }
    }
    // set the origin pos for the slide
    this.items[index].classList.remove("transition")
    this.items[index].style.left = (-1 * direction * this.slideWidth) + "px"
    // current  slide  slides out , the new slide slides into
    setTimeout(() => {
        this.items[index].classList.add("transition")
        this.moves[this.currentIndex].x(direction * this.slideWidth + "px")
        this.moves[index].x("0px")
        this.currentIndex = index

    }, 20);


    this._activeIndicator(index)

}

// 自动切换
Slider.prototype.auto = function () {
    var self = this
    this.intervalId = setInterval(function () {
        self.to(self._getCorrectIndex(self.currentIndex + 1), -1)
    }, self.interval)
}

Slider.prototype.pause = function () {
    clearInterval(this.intervalId)
}

// 设置 按需加载 
Slider.prototype._loadingImg = function () {
    var self = this
    // 初始化loading img
    var items = {},
        loadedItemNum = 0,
        totalItemNum = self.items.length,
        loadItem,
        loadingImg = new Image()

    loadingImg.src = self.loadingOption.loadingURL
    self.imgs = self.el.querySelectorAll(".kjx-slider-img")
    loadingImg.onload = function () {
        self.imgs.forEach((item) => {
            item.setAttribute("src", loadingImg.src)
        })
    }
    self.el.on("kjx-slider-show", loadItem = function (e) {
        if (items[e.detail.showIndex] !== "loaded") {
            var item = self.items[e.detail.showIndex],
                imgDoms = item.querySelectorAll(".kjx-slider-img")
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
               self.el.removeEventListener("kjx-slider-show", loadItem)
           }
        }
    })
}
Slider.prototype._activeIndicator = function (index) {
    if (!this.isIndicator) return
    this.indicators[this.currentIndex].classList.remove(indicatorActiveClass)
    this.indicators[index].classList.add(indicatorActiveClass)
}