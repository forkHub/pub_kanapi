"use strict";
var ha;
(function (ha) {
    var comp;
    (function (comp) {
        class Bind {
            bindList = [];
            reg(setter, getter) {
                let bindObj = {
                    data: '',
                    setter: setter,
                    getter: getter
                };
                this.bindList.push(bindObj);
                let data = bindObj.getter();
                bindObj.data = data;
            }
            update() {
                // console.log('update');
                this.bindList.forEach((item) => {
                    let data = item.getter();
                    if (item.data != data) {
                        // console.debug('update ');
                        item.setter();
                        item.data = data;
                    }
                    else {
                        // console.debug('data tidak terupdate');
                        //debug
                    }
                });
            }
        }
        comp.bind = new Bind();
    })(comp = ha.comp || (ha.comp = {}));
})(ha || (ha = {}));
