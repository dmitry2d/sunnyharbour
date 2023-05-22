
const attractionsMapPoints = {
    path: 'img/attraction_icons/',
    size: [40,40],
    points: [

        [[44.6743, 37.7978],'heart.svg','text text'],
        [[44.6741, 37.7979],'heart.svg','text text'],
        [[44.6745, 37.7970],'logo_map.svg','text text', [140,140]],
    
    ]
}


const attractionsMapSettings = {
    center: [44.6745, 37.7970],
    containerId: 'attractions__map__container',
    scaleContainerSelector: '.attractions__map__zoom__scale__on',
    kilometerContainerSelector: '.attractions__map__kilometers__count',
    zoom: 18,
    minzoom: 15,
    maxzoom: 22,
    zoomstep: 1,
    map: null,
    kilometerMin: 0.5,
    kilometerMax: 20
}

const attractionsMap = async () => {
    ymaps.ready (() => {
        const map = new ymaps.Map (
            attractionsMapSettings.containerId,
            {
                center: attractionsMapSettings.center,
                zoom: attractionsMapSettings.zoom,
                controls: []
            },
            {
                minZoom: attractionsMapSettings.minzoom,
                maxZoom: attractionsMapSettings.maxzoom
            }
        );
        map.behaviors.disable('scrollZoom');
        attractionsMapSettings.map = map;
        
        attractionsMapOnZoom();
        map.events.add('boundschange', function (e) {
            var newZoom = e.get('newZoom'), oldZoom = e.get('oldZoom');
            if (newZoom != oldZoom) {
                attractionsMapSettings.zoom = newZoom;
                attractionsMapOnZoom();
            }
        });

        for (let point of attractionsMapPoints.points) {

            let placemark = new ymaps.Placemark(point[0], {
                hintContent: point[2],
                balloonContent: point[2]
            }, {
                iconLayout: 'default#image',
                iconImageHref: attractionsMapPoints.path + point[1],
                iconImageSize: point[3] || attractionsMapPoints.size,
                iconImageOffset: [-15, -15]
            })
            map.geoObjects.add(placemark)
        }


    });
}

try {
    attractionsMap ();
} catch (e) {
    console.log ('attraction_map.js:');
    console.log (e);
}
const attractionsMapOnZoom = function () {
    const coeff = (attractionsMapSettings.zoom - attractionsMapSettings.minzoom) / (attractionsMapSettings.maxzoom - attractionsMapSettings.minzoom);
    $(attractionsMapSettings.scaleContainerSelector).css({
        width: parseInt(coeff * 100) + '%'
    })
    const kilometers = (attractionsMapSettings.kilometerMax - attractionsMapSettings.kilometerMin) * (1 - coeff) || attractionsMapSettings.kilometerMin;
    $(attractionsMapSettings.kilometerContainerSelector).html(kilometers.toFixed(1) + ' Км');
}
const attractionsMapZoom = function (dir) {
    attractionsMapSettings.zoom += dir;
    attractionsMapSettings.zoom = Math.min(attractionsMapSettings.maxzoom, attractionsMapSettings.zoom);
    attractionsMapSettings.zoom = Math.max(attractionsMapSettings.minzoom, attractionsMapSettings.zoom);
    attractionsMapSettings.map.setZoom(attractionsMapSettings.zoom)
}

$(document).ready (() => {

    $('.attractions__map__zoom__out').on('click', () => {attractionsMapZoom(-1)});
    $('.attractions__map__zoom__in').on('click', () => {attractionsMapZoom(1)});

});