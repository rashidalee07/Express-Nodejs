/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicmFzaGlkYWxlZTA3IiwiYSI6ImNsa2M1MGYyZTAzbjIzZXBtOHd5MHAxMDgifQ.XB8c0l6pT7iBK9Disq8GzA';
  var map = new mapboxgl.Map({
    container: 'map',
    style:
      'mapbox://styles/rashidalee07/clkc5jmh5000701pa7rqs5g4l',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 10,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker

    const el = document.createElement('div');
    el.className = 'marker';

    // Add the marker

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
