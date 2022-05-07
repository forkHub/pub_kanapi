"use strict";
var ha;
(function (ha) {
    var comp;
    (function (comp) {
        class Util {
            static sUserId = 'user_id';
            static sLevel = 'level';
            static sFilter = 'filter';
            static storageId = 'xyz.hagarden.tugas';
            static delay = async (m = 0) => {
                return new Promise((resolve, _reject) => {
                    setTimeout(() => {
                        resolve();
                    }, m);
                });
            };
            static getQueryId() {
                let id;
                //get id
                console.log('get Id:');
                console.log(window.top.location.search);
                let search = window.top.location.search.slice(1).split('&');
                console.log('search:');
                console.log(search);
                search.forEach((item) => {
                    let kv = item.split('=');
                    if ('id' == kv[0]) {
                        id = kv[1];
                    }
                });
                return id;
            }
            static getElByNama(nama, parent, err = true) {
                let el;
                if (!parent)
                    parent = document.body;
                el = parent.querySelectorAll(`[data-nama=${nama}]`);
                if (el && el.length == 1) {
                    return el[0];
                }
                else {
                    console.log(parent);
                    console.log(nama);
                    if (err) {
                        throw new Error('query not found ');
                    }
                    else {
                        return null;
                    }
                }
            }
            static getEl(query, parent = null, err = true) {
                let el;
                if (!parent)
                    parent = document.body;
                el = parent.querySelector(query);
                if (el) {
                    return el;
                }
                else {
                    console.log(parent);
                    console.log(query);
                    if (err) {
                        throw new Error('query not found ');
                    }
                    else {
                        return null;
                    }
                }
            }
            //default error
            static error(e) {
                console.error(e);
                if (!e.message) {
                    comp.dialog.tampil('ada kesalahan');
                }
                else {
                    comp.dialog.tampil(e.message);
                }
            }
            //shared
            static kirimWa(teks) {
                return "whatsapp://send?text=" + teks;
            }
            static getUrl(url, params) {
                let urlHasil = url;
                // console.group('get url');
                // console.log('url: ' + url);
                // console.log('params: ' + JSON.stringify(params));
                params.forEach((item) => {
                    // console.log('reg: ' + urlHasil.search(/\:[a-zA-Z_0-9]+/));
                    urlHasil = urlHasil.replace(/\:[a-zA-Z_0-9]+/, item + '');
                    // console.log('item: ' + item);
                    // console.log('url: ' + urlHasil);
                });
                // console.log('url hasil: ' + urlHasil);
                // console.groupEnd();
                return urlHasil;
            }
            static async AjaxLogin(type, urlServer, dataStr, loginUrl, pf = null) {
                let xml;
                xml = await this.Ajax(type, urlServer, dataStr, pf);
                if (401 == xml.status) {
                    window.top.location.href = loginUrl;
                    return null;
                }
                else {
                    return xml;
                }
            }
            static async Ajax2(type, url, dataStr, pf = null) {
                let x = await this.Ajax(type, url, dataStr, pf);
                if (x.status == 200 || x.status == 0) {
                    return x.responseText;
                }
                console.log('error status code: ' + x.status);
                throw Error(x.responseText);
            }
            static async Ajax3(type, url, dataStr, pf = null) {
                try {
                    return await this.Ajax(type, url, dataStr, pf);
                }
                catch (e) {
                    throw e;
                }
            }
            static Ajax(type, url, dataStr, pf = null) {
                return new Promise((resolve, reject) => {
                    try {
                        console.group('send data');
                        // console.log(dataStr);
                        console.log("type " + type);
                        console.log('url: ' + url);
                        comp.loading.attach(document.body);
                        let xhr = new XMLHttpRequest();
                        xhr.onload = () => {
                            comp.loading.detach();
                            resolve(xhr);
                        };
                        xhr.onerror = (e) => {
                            console.log('xhr error');
                            console.log(e);
                            comp.loading.detach();
                            reject(new Error(e.message));
                        };
                        xhr.onprogress = (p) => {
                            if (pf) {
                                pf(p);
                            }
                        };
                        xhr.open(type, url + "", true);
                        xhr.setRequestHeader('Content-type', 'application/json');
                        // xhr.setRequestHeader('from', window.sessionStorage.getItem(Util.sUserId));
                        // xhr.setRequestHeader('id', window.sessionStorage.getItem(Util.sUserId));
                        xhr.send(dataStr);
                        // console.log("type " + type);
                        // console.log("url " + url);
                        console.groupEnd();
                    }
                    catch (e) {
                        console.log('Util error');
                        console.log(e);
                        comp.loading.detach();
                        reject(new Error(e.message));
                    }
                });
            }
        }
        comp.Util = Util;
    })(comp = ha.comp || (ha.comp = {}));
})(ha || (ha = {}));
