"use strict";
class Silsilah {
    // readonly data: ha.sl.Data = new ha.sl.Data();
    init() {
        // window.onhashchange = () => {
        // 	console.log('has change');
        // 	this.data.url = window.location.href;
        // }
        // if (window.location.href.indexOf("#") > -1) {
        // 	window.location.href = ha.sl.config.server;
        // }
        // else {
        // 	this.gantiHal(this.data.HAL_DEPAN);
        // }
        // this.data.reg(() => {
        // 	// this.gantiHal(api.data.halTarget);
        // }, () => {
        // 	// return api.data.halTarget;
        // })
    }
    gantiHal(url) {
        console.log('ganti hal, url: ' + url);
        console.log('url aktif' + window.top.location.href);
        window.top.location.href = ha.sl.config.server + "/" + url;
        let iframe = this.getHal(url);
        if (iframe.src == "") {
            iframe.onload = () => {
                this.setApi(iframe).then(() => {
                    console.log('api set');
                    // console.log()
                }).catch((e) => {
                    console.warn(e);
                });
            };
            iframe.src = iframe.getAttribute('data-src') + "?r=" + Math.floor(Math.random() * 1000);
        }
    }
    async setApi(iframe) {
        for (let i = 0; i < 3; i++) {
            try {
                iframe.contentWindow.api = this;
                break;
            }
            catch (e) {
                console.warn(e);
                ha.comp.Util.delay(1000);
            }
        }
    }
    getHal(url) {
        return ha.comp.Util.getEl(url);
    }
    get halProfile() {
        return ha.comp.Util.getEl(this.data.HAL_PROFILE);
    }
    get halDepan() {
        return ha.comp.Util.getEl(this.data.HAL_DEPAN);
    }
}
let silsilah = new Silsilah();
silsilah.init();
window.api = silsilah;
console.log('silsilah init');
