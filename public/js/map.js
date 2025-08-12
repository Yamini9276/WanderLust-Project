mapboxgl.accessToken = maptoken ;
const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 12 // starting zoom
});


map.addControl(new mapboxgl.FullscreenControl());

const marker2 = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup()
      .setHTML(`
        <div style="
          background:white;
          padding:8px;
          border-radius:6px;
          font-size:14px;
          color:#212529;
          font-weight:bold;
          box-shadow:0 4px 10px rgba(0,0,0,0.3);
        ">
          Exact location provided only after booking
        </div>
      `)
  )
  .addTo(map);


    