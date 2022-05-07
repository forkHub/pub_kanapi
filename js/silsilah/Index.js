"use strict";
var ha;
(function (ha) {
    var sl;
    (function (sl) {
        class Depan {
            constructor() {
            }
            async init() {
                let id = ha.comp.Util.getQueryId();
                if (id) {
                    await this.loadRenderAnggota(id);
                }
                else {
                    await this.loadRenderAnggota(sl.config.defaultId);
                }
            }
            async loadRenderAnggota(id) {
                let data = {
                    id: id
                };
                let url = ha.sl.config.nodeServer + ha.sl.RouterAPI2Kons.api_anggota_lihat;
                try {
                    let xml = await ha.comp.Util.Ajax('post', url, JSON.stringify(data));
                    if (200 == xml.status) {
                        console.log("sukses");
                        let angg = (JSON.parse(xml.responseText));
                        let cont = document.body.querySelector('div.silsilah-cont');
                        cont.innerHTML = '';
                        this.renderAnggota(angg, cont, -1, true);
                    }
                    else if (401 == xml.status) {
                        console.log('belum login');
                        window.top.location.href = sl.config.server + '/login.html';
                    }
                    else {
                        console.warn('error', xml.statusText);
                        ha.comp.dialog.tampil('Ada kesalahan di server!');
                    }
                }
                catch (e) {
                    ha.comp.Util.error(e);
                }
            }
            async loadAnak(anggota) {
                let anak = await ha.sl.anggotaDao.bacaAnak(anggota);
                anak.forEach((item) => {
                    item.populated = false;
                });
                anggota.anak = anak || [];
            }
            async loadPasangan(view) {
                if (view.anggota.rel_id) {
                    console.debug('load pasangan');
                    let pas = (await ha.sl.anggotaDao.bacaPasangan(view.anggota))[0];
                    if (pas) {
                        // console.debug('pasangan loaded');
                        view.anggota.pasangan_id = pas.id;
                        view.anggota.pas = pas;
                    }
                    else {
                        console.debug('pasangan tidak ketemu');
                    }
                }
                else {
                    console.debug('pasangan relasi tidak ada');
                }
            }
            async populateAnggota(view) {
                if (!view.anggota.populated) {
                    console.debug('anggota belum di populate');
                    view.anggota.populated = true;
                    await this.loadPasangan(view);
                    await this.loadAnak(view.anggota);
                }
                else {
                    console.log('anggota sudah diload');
                }
            }
            renderAnggota(anggota, cont, indek, loadOtomatis) {
                let view = new AnggotaView();
                view.anggota = anggota;
                view.nama.innerHTML = anggota.nama;
                view.profileUtama.setAttribute('id', anggota.id + '');
                this.renderImage(view, anggota.foto);
                view.attach(cont);
                this.renderHubung(indek, view.hubungCont);
                view.profileUtama.onclick = (e) => {
                    this.profileUtamaKlik(e);
                };
                view.profilePasangan.onclick = (e) => {
                    this.profilePasanganKlik(e);
                };
                view.utama.onclick = (evt) => {
                    evt.stopPropagation();
                    this.anggotaKlik(view);
                };
                if (loadOtomatis) {
                    this.anggotaKlik(view);
                }
            }
            renderImage(view, fotoUrl) {
                view.img.onerror = () => {
                    console.log("image on error:");
                    console.log(view.img.src);
                    view.foto.style.backgroundImage = 'url(' + sl.config.nodeServer + '/gbr/thumb.png' + ')';
                    console.log(view.foto.style.backgroundImage);
                };
                view.img.onload = () => {
                    console.log('img on load');
                    view.foto.style.backgroundImage = 'url(' + view.img.src + ')';
                };
                view.img.src = fotoUrl ? fotoUrl : sl.config.nodeServer + '/gbr/thumb.png';
                view.foto.style.backgroundRepeat = 'no-repeat';
                view.foto.style.backgroundSize = 'cover';
            }
            renderHubung(idx, cont) {
                // console.log('render hubung, idx ' + hubung);
                let view = new Hubung();
                view.kanan.classList.remove('border-kanan', 'border-kiri', 'border-atas', 'border-bawah');
                view.kiri.classList.remove('border-kanan', 'border-kiri', 'border-atas', 'border-bawah');
                if (idx == -1) {
                }
                else if (idx == 0) {
                    view.kanan.classList.add('border-kiri');
                    view.kiri.classList.add('border-kanan');
                }
                else if (idx == 1) {
                    view.kiri.classList.add('border-kanan');
                    view.kanan.classList.add('border-atas');
                    view.kanan.classList.add('border-kiri');
                }
                else if (idx == 2) {
                    view.kiri.classList.add('border-kanan');
                    view.kiri.classList.add('border-atas');
                    view.kanan.classList.add('border-atas');
                    view.kanan.classList.add('border-kiri');
                }
                else if (idx == 3) {
                    view.kiri.classList.add('border-atas');
                    view.kiri.classList.add('border-kanan');
                    view.kanan.classList.add('border-kiri');
                }
                view.attach(cont);
            }
            renderPasangan(view) {
                if (view.anggota.pas) {
                    console.debug('render pasangan');
                    view.namaPasangan.innerHTML = view.anggota.pas.nama;
                    view.pasangan.classList.toggle('display-none');
                    console.debug('pasangan loaded');
                    view.imgPasangan.onload = () => {
                        view.fotoPasangan.style.backgroundImage = 'url(' + view.imgPasangan.src + ')';
                    };
                    view.imgPasangan.onerror = () => {
                        view.fotoPasangan.style.backgroundImage = 'url(' + sl.config.nodeServer + '/gbr/thumb.png' + ')';
                    };
                    view.imgPasangan.src = view.anggota.pas.foto ? view.anggota.pas.foto : (sl.config.nodeServer + '/gbr/thumb.png');
                    view.profilePasangan.setAttribute('id', view.anggota.pas.id + '');
                    view.fotoPasangan.style.backgroundRepeat = 'no-repeat';
                    view.fotoPasangan.style.backgroundSize = 'cover';
                }
                if (view.pasangan.classList.contains('display-none')) {
                    view.pasangan.classList.remove('disp-table-cell');
                    view.utama.classList.remove('text-align-right');
                    view.utama.classList.add('text-align-center');
                }
                else {
                    view.pasangan.classList.add('disp-table-cell');
                    view.utama.classList.remove('text-align-center');
                    view.utama.classList.add('text-align-right');
                }
            }
            renderAnak(view) {
                console.log('render anak');
                view.bawah.innerHTML = '';
                for (let i = 0; i < view.anggota.anak.length; i++) {
                    let anak = view.anggota.anak[i];
                    let hubung = 0;
                    if (i == 0) {
                        hubung = 1;
                    }
                    else if (i == view.anggota.anak.length - 1) {
                        hubung = 3;
                    }
                    else {
                        hubung = 2;
                    }
                    if (view.anggota.anak.length == 1) {
                        hubung = 0;
                    }
                    this.renderAnggota(anak, view.bawah, hubung, false);
                }
            }
            async anggotaKlik(view) {
                console.group('anggota klik');
                console.log(view.anggota);
                await this.populateAnggota(view);
                this.renderPasangan(view);
                this.renderAnak(view);
                //toggle view bawah
                view.bawah.classList.toggle('display-none');
                view.bawah.classList.toggle('display-table');
                console.groupEnd();
            }
            async profileUtamaKlik(e) {
                e.stopPropagation();
                e.preventDefault();
                console.debug('utama on click');
                console.debug('id : ' + e.currentTarget.getAttribute('id'));
                let id = e.currentTarget.getAttribute('id');
                window.top.location.href = (sl.config.server + "/profile.html?id=" + id);
            }
            async profilePasanganKlik(e) {
                e.stopPropagation();
                e.preventDefault();
                console.debug('pasangan on click');
                console.debug('id : ' + e.currentTarget.getAttribute('id'));
                let id = e.currentTarget.getAttribute('id');
                window.top.location.href = (sl.config.server + "/profile.html?id=" + id);
            }
        }
        sl.Depan = Depan;
        class AnggotaView extends ha.comp.BaseComponent {
            _anggota;
            get anggota() {
                return this._anggota;
            }
            set anggota(value) {
                this._anggota = value;
            }
            constructor() {
                super();
                this._elHtml = document.body.querySelector('template').content.querySelector('div.cont').cloneNode(true);
            }
            get profileUtama() {
                return this.getEl('div.atas div.utama button.profile');
            }
            get profilePasangan() {
                return this.getEl('div.atas div.pasangan button.profile');
            }
            get bawah() {
                return this.getEl('div.bawah');
            }
            get nama() {
                return this.getEl('div.utama div.nama');
            }
            get img() {
                return this.getEl('div.utama img.foto');
            }
            get foto() {
                return this.getEl('div.utama div.foto');
            }
            get fotoPasangan() {
                return this.getEl('div.pasangan div.foto');
            }
            get utama() {
                return this.getEl('div.utama');
            }
            get pasangan() {
                return this.getEl('div.pasangan');
            }
            get imgPasangan() {
                return this.getEl('div.pasangan img.foto');
            }
            get namaPasangan() {
                return this.getEl('div.pasangan div.nama');
            }
            get hubungCont() {
                return this.getEl('div.hubung-cont');
            }
        }
        class Hubung extends ha.comp.BaseComponent {
            constructor() {
                super();
                this._template = `
				<div class='hubung'>
					<div class='kiri'></div>
					<div class='kanan'></div>
				</div>
			`;
                this.build();
            }
            get hubungDiv() {
                return this.getEl('div.hubung');
            }
            get kanan() {
                return this.getEl('div.hubung div.kanan');
            }
            get kiri() {
                return this.getEl('div.hubung div.kiri');
            }
        }
    })(sl = ha.sl || (ha.sl = {}));
})(ha || (ha = {}));
window.onload = () => {
    var app = new ha.sl.Depan();
    app.init();
    window.document.body.onclick = () => {
        console.log('window on click');
    };
};
