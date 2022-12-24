import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import './Map.css'

const Map = props => {
  const mapRef = useRef();

  useEffect(() => { // useEffect is a React Hook
  
    const map = new window.google.maps.Map(mapRef.current, {
      center: props.center,
      zoom: props.zoom
    });

    new window.google.maps.Marker({ position: props.center, map: map });

  }, [props.center, props.zoom]);

  return (
    <div ref={mapRef} className={`map ${props.className}`} style={props.style}>Map</div>
  )
}

Map.propTypes = {}

export default Map