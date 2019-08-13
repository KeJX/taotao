export const Search = function({el,timeout=0,animateMode="fade",autocomplete=false,url}){
    var self = this
    // console.log(self);
    this.el = el
    this.box = el.querySelector('.kjx-search-inputbox')
    this.form = el.querySelector(".kjx-search-form")
    this.layer = el.querySelector('.kjx-search-layer')
    this.layerShowHide = new ShowHide({
        el:self.layer,
        mode:"fade",
        isInitHide:true
    })


    this.autocomplete = autocomplete
    this.url = url
    this.animateMode = animateMode
    this.timeout = timeout
    // 判断layer是否有装载
    this.loaded = false
    // 绑定提交事件
    this.el.addEventListener('click',function(e){
        
        if(e.target.classList.contains("kjx-search-btn"))
        {
          self.searchSubmit()
        }
    })

    // 自动完成
    if(this.autocomplete){
        this.autoComplete()
    }
}


import "./search.scss"
import jsonp from "jsonp"
import {ShowHide} from "../showHide/showHide"
var cache = {
    data:{},
    count:0,
    addData:function(key,data){
        if(!this.data[key]){
            this.data[key] = data 
            this.count ++
        }
    },
    readData:function(key){
        return this.data[key]
    },
    deleteDataByKey(key){
        delete this.data[key]
        this.count--
    },
    deleteDataByOrder(num){
        var count = 0
        for(var p in this.data){
            if(count>=num){
                break
            }
            count++
            this.deleteDataByKey(p)
        }
    }
}
Search.prototype.searchSubmit=function(){
    if(this.getInputVal()===""){
        return false
    }
    this.form.submit()
}
Search.prototype.getInputVal= function(){
    return this.box.value.trim()
}
Search.prototype.setInputVal = function(val){
    this.box.value =  removeHTMLTag(val)
    function removeHTMLTag(str){
        return str.replace(/<\s*\/?\s*[a-zA-z_]([^>]*?["][^"]*["])*[^>"]*>/g,'')
    }
}
Search.prototype.autoComplete = function(){
    var self= this
    var timer = null
    self.box.addEventListener('input',function(){
        if(self.getInputVal() == ""){
            self.hideLayer()
        }
        if(self.timeout){
            clearTimeout(timer)
        timer = setTimeout(function(){
            self.getData()
        },self.timeout)
        }
        else{
            self.getData()
        }
        })

    self.box.addEventListener('focus',function(){
        if(self.getInputVal()!='')
        self.showLayer()
    })
    this.box.addEventListener('click',function(e){
        // 阻止点击box会冒泡导致触发下面的点击事件
        e.stopPropagation()
    })
    document.addEventListener('click',function(){
        // 因为存在blur和 click的冲突
        self.hideLayer()
    })
}
Search.prototype.getData = function(){
    var self = this,
        boxValue = self.getInputVal(),
        url  = self.url+encodeURIComponent(boxValue)
    if(boxValue === "") return self.el.trigger('kjx-search-nodata')
    if(cache.readData(boxValue)) return self.el.trigger('kjx-search-getdata',cache.readData(boxValue))
    
    if(boxValue){
        self.layerShowHide.hide()
    }
    jsonp(url,null,(err,data)=>{
        if(err){
            self.el.trigger('kjx-search-nodata',data)
        }
        else{
            cache.addData(boxValue,data)
           self.el.trigger('kjx-search-getdata',data)
        }
    })
}

Search.prototype.showLayer = function(){
    if(!this.loaded) return 
    this.layerShowHide.show()
}

Search.prototype.hideLayer = function(){
    this.layerShowHide.hide()
}

Search.prototype.appendLayer = function(html){
    this.layer.innerHTML = html
    this.loaded = !!html
}
