(function () {
    const lat = 10.4836451;
    const lng = -66.9074052;
    const mapa = L.map('mapa').setView([lat, lng], 13);
    let marker;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marker = new L.marker([lat, lng], { draggable: true, autoPan: true }).addTo(mapa)

    marker.on('moveend', function (e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))
    })

})()