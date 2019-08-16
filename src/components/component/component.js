Element.prototype.trigger = function (eventName,data) {
    var event = new CustomEvent(eventName, { detail: data });
    // 派发事件
    this.dispatchEvent(event)
}
Element.prototype.Hover = function(inCallback,outCallback){
    this.addEventListener("mouseenter",inCallback)
    this.addEventListener("mouseleave",outCallback)
}

Element.prototype.on = function(eventStr,callback){
    var self = this
    var eventList = eventStr.trim().split(' ')
    eventList.forEach((item)=>{
        self.addEventListener(item,callback)
    })
}

export const Component  = {
    name:"kjx-component"
}
