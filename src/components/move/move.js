export const Move = function({
    el,
    mode="silent"
}){
    if(!el){
        throw new Error("Move初始化需要el")
    }
    var self = this
    this.el = el
    this.mode = mode
    
    if(mode == "silent"){
        this.move = new Silent(self.el)
    }
    if(mode == "dynamic"){
        this.move = new Dynamic(self.el)
    }

    this.to = this.move.to
    this.x = this.move.x
    this.y = this.move.y
}



function init(el){
    this.el =el
    this.curX = this.el.offsetLeft ? this.el.style.left +"px" : "0px"
    this.curY =  this.el.offsetTop ? this.el.style.top +"px" : "0px"
}


function to(x,y,callback){
     // todo:更严谨应该使用正则
     x =  (typeof x === "string" ) ? x : this.curX
     y = (typeof y === "string") ? y : this.curY
     if(this.curX === x && this.curY === y ) return
     this.el.trigger("move",{el:this.el})
     if(typeof callback === "function") callback()
     this.curX = x
     this.curY = y
}

var Silent = function(el){
    var self = this
    init.call(self,el)
    this.el.classList.remove("transition")
}

Silent.prototype.to = function(x,y){
   var self = this
   
    to.call(this,x,y,function(){
        self.el.style.left = x
        self.el.style.top = y
        self.el.trigger("moved",{el:this.el})
    })
}

Silent.prototype.x= function(x){
    this.to(x)
}

Silent.prototype.y = function(y){
    this.to(null,y)
}


var Dynamic = function(el){
    var self = this
    init.call(self,el)
    this.el.classList.add("transition")
    this.el.style.left = this.curX
    this.el.style.top = this.curY
}

Dynamic.prototype.to = function(x,y){
    var self = this
    var transitionendHandle = function(){
        self.el.trigger("moved",{el:self.el})
    }
    to.call(this,x,y,function(){
        self.el.removeEventListener("transitionend",transitionendHandle)
        self.el.addEventListener("transitionend",transitionendHandle ,{once:true})
        self.el.style.left = x 
        self.el.style.top = y
        self.curX = x
        self.curY = y
    })
}

Dynamic.prototype.x = function(x){
    this.to(x)
}

Dynamic.prototype.y = function(y){
    this.to(null,y)
}