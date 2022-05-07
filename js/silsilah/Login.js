"use strict";
var ha;
(function (ha) {
    var sl;
    (function (sl) {
        class Login {
            constructor() {
                console.log('login constructor');
                this.form.onsubmit = () => {
                    try {
                        console.log('login');
                        let dataObj = {
                            user_name: this.userName.value,
                            password: this.passWord.value
                        };
                        let data = JSON.stringify(dataObj);
                        ha.comp.Util.Ajax('post', sl.config.nodeServer + sl.RouterKOns.gp_auth_login, data)
                            .then((x) => {
                            if (401 == x.status) {
                                ha.comp.dialog.tampil('Username / password salah');
                            }
                            else if (200 == x.status) {
                                window.top.location.href = sl.config.server + '/index.html';
                                // var app: ha.sl.Depan = new ha.sl.Depan();
                                // app.init();
                            }
                            else {
                                throw Error(x.responseText);
                            }
                        })
                            .catch((e) => {
                            ha.comp.Util.error(e);
                        });
                    }
                    catch (e) {
                        ha.comp.Util.error(e);
                    }
                    return false;
                };
            }
            init() {
                console.log('login init');
            }
            get form() {
                return document.forms[0];
            }
            get userName() {
                return ha.comp.Util.getEl("form #user_name");
            }
            get passWord() {
                return ha.comp.Util.getEl("form #password");
            }
        }
        sl.login = new Login();
    })(sl = ha.sl || (ha.sl = {}));
})(ha || (ha = {}));
// var api: Silsilah;
window.onload = () => {
    console.log('hal login on load');
    ha.sl.login.init();
};
