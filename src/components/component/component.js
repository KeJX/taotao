Element.prototype.trigger = function (eventName,data) {
    var event = new CustomEvent(eventName, { detail: data });
    // 派发事件
    this.dispatchEvent(event)
}


export const Component  = {
    name:"kjx-component"
}