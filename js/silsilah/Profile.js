"use strict";
var ha;
(function (ha) {
    var sl;
    (function (sl) {
        class Data {
            _nama;
            get nama() {
                return this._nama;
            }
            set nama(value) {
                this._nama = value;
                ha.comp.bind.update();
            }
            _namaLengkap;
            get namaLengkap() {
                return this._namaLengkap;
            }
            set namaLengkap(value) {
                this._namaLengkap = value;
                ha.comp.bind.update();
            }
            _jkl;
            get jkl() {
                return this._jkl;
            }
            set jkl(value) {
                this._jkl = value;
                ha.comp.bind.update();
            }
            _alamat;
            get alamat() {
                return this._alamat;
            }
            set alamat(value) {
                this._alamat = value;
                ha.comp.bind.update();
            }
            _tglLahir;
            get tglLahir() {
                return this._tglLahir;
            }
            set tglLahir(value) {
                this._tglLahir = value;
                ha.comp.bind.update();
            }
            _tglMeninggal;
            get tglMeninggal() {
                return this._tglMeninggal;
            }
            set tglMeninggal(value) {
                this._tglMeninggal = value;
                ha.comp.bind.update();
            }
            _fb;
            get fb() {
                return this._fb;
            }
            set fb(value) {
                this._fb = value;
                ha.comp.bind.update();
            }
            _wa;
            get wa() {
                return this._wa;
            }
            set wa(value) {
                this._wa = value;
                ha.comp.bind.update();
            }
            _instagram;
            get instagram() {
                return this._instagram;
            }
            set instagram(value) {
                this._instagram = value;
                ha.comp.bind.update();
            }
            _pasanganState;
            get pasanganState() {
                return this._pasanganState;
            }
            set pasanganState(value) {
                this._pasanganState = value;
                ha.comp.bind.update();
            }
            _tautanState;
            get tautanState() {
                return this._tautanState;
            }
            set tautanState(value) {
                this._tautanState = value;
                ha.comp.bind.update();
            }
            _anakState;
            get anakState() {
                return this._anakState;
            }
            set anakState(value) {
                this._anakState = value;
                ha.comp.bind.update();
            }
            _kerabatState;
            get kerabatState() {
                return this._kerabatState;
            }
            set kerabatState(value) {
                this._kerabatState = value;
                ha.comp.bind.update();
            }
        }
        class Profile {
            data = new Data();
            async init() {
                this.scanBind();
                let id = this.getId();
                this.loadProfile(id);
            }
            getId() {
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
            halProfile(id) {
                return `${sl.config.server}/profile.html?id=${id}`;
            }
            scanBind() {
                // console.group('scan api:');
                document.body.querySelectorAll('[data-bind]').forEach((item) => {
                    let attr = item.getAttribute('data-bind');
                    // console.log(attr);
                    ha.comp.bind.reg(() => {
                        let data = this.data;
                        item.innerHTML = data[attr];
                        // console.log('update ' + attr);
                    }, () => {
                        let data = this.data;
                        return data[attr];
                    });
                });
                console.groupEnd();
            }
            async loadProfile(id) {
                let data = {
                    id: id
                };
                console.log('load profile');
                console.log(data);
                let url = ha.sl.config.nodeServer + ha.sl.RouterAPI2Kons.api_profile_lihat;
                let xml = await ha.comp.Util.Ajax('post', url, JSON.stringify(data));
                if (200 == xml.status) {
                    let angg = (JSON.parse(xml.responseText));
                    this.data.alamat = angg.alamat;
                    this.data.nama = angg.nama;
                    this.data.namaLengkap = angg.nama_lengkap;
                    this.data.fb = angg.fb;
                    this.data.instagram = angg.instagram;
                    this.data.jkl = angg.jkl;
                    this.data.tglLahir = this.dateTimeStamp(angg.tgl_lahir);
                    this.data.tglMeninggal = this.dateTimeStamp(angg.tgl_meninggal);
                    this.data.wa = angg.wa;
                    ha.comp.Util.getElByNama('pasangan-cont', document.body).innerHTML = this.renderPasangan(angg);
                    ha.comp.Util.getElByNama('anak-cont', document.body).innerHTML = this.renderDaftarAnak(angg.anak);
                    ha.comp.Util.getElByNama('kerabat-cont', document.body).innerHTML = this.renderKerabat(angg);
                    ha.comp.Util.getElByNama('tautan-cont', document.body).innerHTML = this.renderTautan(angg);
                }
                else if (401 == xml.status) {
                    console.log('belum login');
                }
                else {
                    console.warn('error', xml.statusText);
                    ha.comp.dialog.tampil('Ada kesalahan di server!');
                }
            }
            renderPasangan(anggota) {
                if (anggota.pas) {
                    return `
				<a class="pasangan" href="${this.halProfile(anggota.pas.id + '')}"> ${anggota.pas.nama} </a>`;
                }
                else {
                    return `<p class="text-muted font-size-sm">tidak ada data</p>`;
                }
            }
            tglLebihBesar(tgl1, tgl2) {
                let tgl1a = new Date(tgl1);
                let tgl2a = new Date(tgl2);
                if (tgl1a > tgl2a)
                    return true;
                return false;
            }
            renderLek(anggota) {
                let hasil = '';
                let dhe = '';
                anggota.lek.forEach((item) => {
                    if (item.jkl == 'l') {
                        if (this.tglLebihBesar(anggota.tgl_lahir, item.tgl_lahir)) {
                            dhe = 'pakdhe';
                        }
                        else {
                            dhe = 'paklek';
                        }
                        hasil += this.renderkerabat2([item], dhe);
                    }
                    else {
                        if (this.tglLebihBesar(anggota.tgl_lahir, item.tgl_lahir)) {
                            dhe = 'budhe';
                        }
                        else {
                            dhe = 'bulek';
                        }
                        hasil += this.renderkerabat2([item], dhe);
                    }
                });
                return hasil;
            }
            renderKerabat(anggota) {
                let hasil = '';
                hasil += this.renderkerabat2(anggota.mbah, 'mbah');
                hasil += this.renderkerabat2(anggota.ortu, 'orang tua');
                hasil += this.renderLek(anggota);
                hasil += this.renderkerabat2(anggota.saudara, 'saudara');
                hasil += this.renderkerabat2(anggota.sepupu, 'sepupu');
                hasil += this.renderkerabat2(anggota.ponakan, 'ponakan');
                hasil += this.renderkerabat2(anggota.cucu, 'cucu');
                return hasil;
            }
            //render daftar kerabat detail
            renderkerabat2(daftar, label) {
                let hasil = '';
                daftar.forEach((anggota) => {
                    let el = `
				<div class='margin-bottom-8' id=${anggota.id}>
					<a class="" href="${this.halProfile(anggota.id + '')}">${anggota.nama_lengkap} (${label})</a>
				</div>`;
                    hasil += el;
                });
                return hasil;
            }
            renderDaftarAnak(anggotaAr) {
                let hasil = ``;
                if (anggotaAr.length == 0) {
                    return `<p class="text-muted font-size-sm">tidak ada data</p>`;
                }
                anggotaAr.forEach((anggota) => {
                    let el = `
				<div class='margin-bottom-8' id=${anggota.id}>
					<a class="" href="${this.halProfile(anggota.id + '')}">${anggota.nama_lengkap}</a>
				</div>`;
                    hasil += el;
                });
                return hasil;
            }
            renderTautan(anggota) {
                return `<a href="${sl.config.server}?id=${anggota.id}" ">tautan silsilah</a>`;
            }
            dateTimeStamp(t) {
                console.log('date time stamp, input: ' + t);
                if (!t)
                    return '---';
                if ('' == t)
                    return '---';
                t = t + '';
                let date = new Date(t);
                if (!date)
                    return '---';
                if ('Invalid Date' == (date + ''))
                    return '---';
                let dateStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                console.log('date time stamp, hasil: ' + dateStr);
                return dateStr;
            }
        }
        sl.Profile = Profile;
    })(sl = ha.sl || (ha.sl = {}));
})(ha || (ha = {}));
var profile;
window.onload = () => {
    profile = new ha.sl.Profile();
    profile.init();
};
