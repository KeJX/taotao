export const Slider = function ({
    el,
    animateMode = "fade",
    activeIndex = 0,
    interval = 0
}) {
    var self = this
    this.el = el
    this.currentIndex = this._getCorrectIndex(activeIndex)
    this.animateMode = animateMode
    this.interval = interval
    this.items = el.querySelectorAll(".kjx-slider-item")
    this.itemNum = this.items.length
    this.indicators = el.querySelectorAll(".kjx-slider-indicator")
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

    var itemsShowHide = []
    this.items.forEach(function (item) {
        itemsShowHide.push(new ShowHide({
            el: item,
            mode: "fade",
            isInitHide: true
        }))
    })
    this.itemsShowHide = itemsShowHide
    this._init()

}


import "./slider.scss"
import {
    ShowHide
} from "../showHide/showHide"
var indicatorActiveClass = "kjx-slider-indicator-active"
Slider.prototype._init = function () {
    var self = this
    // init show

    self.itemsShowHide[self.currentIndex].show()
    self.indicators.forEach((item) => {
        item.classList.remove(indicatorActiveClass)
    })
    self.indicators[self.currentIndex].classList.add(indicatorActiveClass)

    // to
    if (self.animateMode == "slide") {
        self.el.classList.add("kjx-slider-slide")
        self.to = self._slide
    } else {
        self.el.classList.add("kjx-slider-fade")
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
            // length-1 =3
            self.to(self._getCorrectIndex(self.currentIndex - 1))
        }
        if (e.target === self.control.right) {
            self.to((self._getCorrectIndex(self.currentIndex + 1)))
        }
        if (e.target.classList.contains("kjx-slider-indicator")) {
            console.log(e.target);
            var index = self._getCorrectIndex(Array.prototype.indexOf.call(self.indicators, e.target))
            console.log(index);
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
    this.items.forEach((item) => {
        item.on("show shown hide hidden", function (e) {
            self.el.trigger("kjx-slider-" + e.type, {
                showIndex: Array.prototype.indexOf.call(self.items, item),
                showItem: item
            })
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

    this.indicators[this.currentIndex].classList.remove(indicatorActiveClass)
    this.indicators[index].classList.add(indicatorActiveClass)

    this.currentIndex = index
}

Slider.prototype._slide = function () {

}

// 自动切换
Slider.prototype.auto = function () {
    var self = this
    this.intervalId = setInterval(function () {
        self.to(self._getCorrectIndex(self.currentIndex + 1))
    }, self.interval)
}

Slider.prototype.pause = function () {
    clearInterval(this.intervalId)
}