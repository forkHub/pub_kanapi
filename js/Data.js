"use strict";
var ha;
(function (ha) {
    var sl;
    (function (sl) {
        class Data {
            HAL_PROFILE = '#hal_profile';
            HAL_DEPAN = '#hal_depan';
            HAL_LOGIN = '#hal_login';
            _iframe = '';
            _url = '';
            _anggotaAktifId = '';
            _halDepanDilihat = false;
            _halTerakhir;
            _halRedirect;
            _halTarget;
            _loginTerakhir = 0;
            get loginTerakhir() {
                return this._loginTerakhir;
            }
            set loginTerakhir(value) {
                this._loginTerakhir = value;
            }
            get halTarget() {
                return this._halTarget;
            }
            set halTarget(value) {
                this._halTarget = value;
            }
            get halRedirect() {
                return this._halRedirect;
            }
            set halRedirect(value) {
                this._halRedirect = value;
            }
            reg(setter, getter) {
                ha.comp.bind.reg(setter, getter);
            }
            update() {
                ha.comp.bind.update();
            }
            get iframe() {
                return this._iframe;
            }
            set iframe(value) {
                this._iframe = value;
                this.update();
            }
            get anggotaAktifId() {
                return this._anggotaAktifId;
            }
            set anggotaAktifId(value) {
                this._anggotaAktifId = value;
                this.update();
            }
            get url() {
                return this._url;
            }
            set url(value) {
                this._url = value;
                this.update();
            }
            get halDepanDilihat() {
                return this._halDepanDilihat;
            }
            set halDepanDilihat(value) {
                this._halDepanDilihat = value;
                this.update();
            }
            get halTerakhir() {
                return this._halTerakhir;
            }
            set halTerakhir(value) {
                this._halTerakhir = value;
            }
        }
        sl.Data = Data;
    })(sl = ha.sl || (ha.sl = {}));
})(ha || (ha = {}));
