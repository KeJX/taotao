import "assets/scss/index.scss"



import {
  Msg
} from "./components/Toast/msg.js"


import {
  Dropdown
} from "./components/dropdown/dropdown"
import {
  Search
} from "./components/search/search"
import {
  Slider
} from "./components/slider/slider"
import {
  ShowHide
} from "./components/showHide/showHide.js"
import axios from "axios"

import {
  Tab
} from "./components/tab/tab"
window.onload = function () {
  // nav dropdown
  var navDropdownClassList = [".nav-right-my", ".nav-right-favorites", ".nav-right-service"]
  navDropdownClassList.forEach(function (item) {
    new Dropdown({
      el: document.querySelector(".kjx-dropdown.nav-right-item" + item)
    })
  })

  // nav dropdown 按需加载的那一个 
  var sellercenterDropdown = new Dropdown({
    el: document.querySelector(".kjx-dropdown.nav-right-item.nav-right-sellercenter"),
    loadingOptions: {
      isLoading: true,
      loadingPath: "static/header/data.json"
    },

  })

  sellercenterDropdown.el.addEventListener("kjx-dropdown-getData", function (e) {
    var self = sellercenterDropdown,
      html = ""
    e.detail.forEach(function (item) {
      html += `<li><a href="${item.href}" class="menu-item">${item.content}</a></li>`
    })
    setTimeout(() => {
      if (html) {
        self.layer.innerHTML = html
      }
      // 更新宽度  否则宽度有bug
      // todo:ShowHide模块可以新增方法update来调用
      self.layer.style = ""
      self.layer.style.width = self.layer.offsetWidth + "px"
    }, 500);
  })


  // header-search
  var headerSearch = document.querySelector('#header-search')
  var search = new Search({
    el: headerSearch,
    autocomplete: true,
    animateMode: "fade",
    url: 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1565451014718_4223&callback=jsonp4224&k=1&area=c2c&bucketid=8&q='
  })

  // 获取数据 事件
  search.el.addEventListener('kjx-search-getdata', function (e) {
    var html = createHeadSearchItems(e.detail)
    search.appendLayer(html)
    if (html) {
      search.showLayer()
    } else {
      search.hideLayer()
    }
  })
  // 未成功得到数据执行事件
  search.el.addEventListener('kjx-search-nodata', function (e) {
    search.appendLayer("")
  })

  search.layer.addEventListener('click', function (e) {
    if (e.target.classList.contains('kjx-search-layer-item')) {
      search.setInputVal(e.target.innerHTML)
      search.searchSubmit()
    }
  })

  function createHeadSearchItems(data, maxNum = 10) {
    var html = '',
      dataNum = data['result'].length
    if (dataNum === 0) {
      return ''
    } else {
      for (var i = 0; i < data['result'].length; i++) {
        if (i > maxNum) break
        html += `<li class="kjx-search-layer-item text-ellipsis">${data['result'][i][0]}</li>`
      }
      return html
    }
  }



  // cart dropdown
  var cartDropdown = new Dropdown({
    el: document.querySelector('.kjx-dropdown.cart-dropdown'),
    animateMode: "fade",
    loadingOptions: {
      isLoading: true,
      loadingPath: "static/cart/cart.json"
    }
  })
  cartDropdown.el.addEventListener('kjx-dropdown-getData', function (e) {
    var self = cartDropdown,
      html = "",
      itemContainerInnerHTML = "",
      data = e.detail,
      cartItemNumDom = cartDropdown.el.querySelector(".cart-num"),
      cartItemNum = 0
      
    if (data.length == 0) {
      // 显示购物车 空
      html+=`<div class="cart-empty">
        <i class="iconfont icon-gouwuchetianjia"></i>
        <div class="cart-empty-text">
          购物车里还没有商品</br>
          赶紧去选购吧!
        </div>
      </div>`
      
    } else {
      // 获取到数据后组成html
      html += `<div class="cart-layer-title">最近加入的商品</div>`
      data.forEach(function (item) {
        cartItemNum++
        // 添加购物车item
        itemContainerInnerHTML += `<li class="cart-item cf"><a href="${item.href}"  >
        <img class="cart-item-img fl" src="${item.imgURL}"></img>
        <div class="cart-item-detail fl">
          <div class="cart-item-detail-name">${item.name}</div>
          <div class="cart-item-detail-price">￥${item.price} x ${item.count}</div>
        </div>
      </a>
      <i class="iconfont fr icon-cuowu"></i>
      </li>`
      })

      itemContainerInnerHTML = `<ul class="cart-item-container">${itemContainerInnerHTML}</ul>`
      html += itemContainerInnerHTML
      html += `<div class="cart-result fc">
            <div class="cart-result-text">
              <span class="fl">共 <b>${0}</b> 件商品</span>
              <span class="fl">共计 <b>￥ ${"0.00"}</b></span>
            </div>
            <button class="cart-btn fr transition">去购物车</button>
          </div>`
    }


    if (html) {
      setTimeout(() => {
        cartItemNumDom.innerHTML = cartItemNum
        self.layer.innerHTML = html
      }, 1000);
    }
  })

// category dropdowns
  var categoryDropdownEls = document.querySelectorAll(".kjx-dropdown.focus-category-dropdown")
  var categoryDropdowns = []
  categoryDropdownEls.forEach((item,i) => {
    var tempDropdown = new Dropdown({
      el: item,
      animateMode: "fade",
      loadingOptions:{
        isLoading:true,
        loadingPath:"static/category/category-detail-"+(i+1)+".json"
        // "static/category/category-detail-"+(i+1)+".json"
      }
    })

    categoryDropdowns.push(tempDropdown)
  })
  categoryDropdowns.forEach(function(item){
    item.el.addEventListener("kjx-dropdown-getData",function(e){
      var data = e.detail,
          layer = item.layer

      setTimeout(() => {
        createCategoryDetails(layer,data)
      }, 500);
    })
  })
  
function createCategoryDetails(layerEl,data){
  var html=""
  for(var i =0;i<data.length;i++){
    html+=
    `<dl class="category-details cf">
      <dt class="category-details-title fl">
        <a href="###" class="category-details-title-link">${data[i].title}</a>
      </dt>
    <dd class="category-details-item fl">`
    for(var j =0;j<data[i].items.length;j++){
      html+=
      `<a href="###" class="link">${data[i].items[j]}</a>`
    }
    html+=
    `</dd></dl>`
  }
  layerEl.innerHTML = html
}
  

// focus -slider
var focusSliderEl = document.querySelector("#carousel-slider")

var focusSlider = new Slider({
  el:focusSliderEl,
  interval:3500,
  indicators:true,
  animateMode:"slide",
  activeIndex:0,
  loadingOption:{
    loading:true,
    loadingURL:"static/img/carousel/loading.gif"
  }
})

// todays-slider
var todaysSliderEl = document.querySelector("#todays-slider")

var todaysSlider = new Slider({
  el:todaysSliderEl,
  isIndicator:false,
  interval:0,
  animateMode:"fade",
  activeIndex:0,
  loadingOption:{
    loading:true,
    loadingURL:"static/img/today/loading.gif"
  }
})

// floor

var F1Tab = new Tab({
  el:document.querySelector("#floor-1F"),
  event:"mouseover",
  activeIndex:0,
  delay:500,
  loadingOption:{
    isLoading:true,
    loadingURL:"static/img/floor/loading.gif"
  }
})


}

