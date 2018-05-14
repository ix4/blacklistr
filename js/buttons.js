/* globals L */
/* globals leafletImage */
/* globals toggleSide */

window.Buttons = {
  ScreenshotButton: L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd(map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.style.cursor = 'pointer';
      container.style.backgroundColor = 'white';
      container.innerHTML = '<img alt="take a screenshot" src="images/camera.svg"></img>';
      container.style.height = '24px';
      container.onclick = () => {
        container.style.backgroundColor = '#ffa726';
        leafletImage(map, (err, canvas) => {
          const a = document.createElement('a');
          a.href = canvas.toDataURL();
          a.download = 'blacklistr-screenshot.png';
          document.getElementById('images').innerHTML = '';
          document.getElementById('images').appendChild(a);
          a.click();
          container.style.backgroundColor = 'white';
        });
      };
      return container;
    }
  }),
  ResetButton: L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd(map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.style.cursor = 'pointer';
      container.style.backgroundColor = 'white';
      container.innerHTML = '<img alt="reload map" src="images/autorenew.svg"></img>';
      container.style.height = '24px';
      container.onclick = () => {
        map.setView([30, 0], 2);
      };
      return container;
    }
  }),
  HideButton: L.Control.extend({
    options: {
      position: 'topright'
    },
    onAdd(map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.style.cursor = 'pointer';
      container.style.backgroundColor = 'white';
      container.innerHTML = '<img alt="hide editor" src="images/keyboard-close.svg"></img>';
      container.style.height = '24px';
      container.onclick = () => {
        toggleSide();
        map._onResize();
      };
      return container;
    }
  })
};
