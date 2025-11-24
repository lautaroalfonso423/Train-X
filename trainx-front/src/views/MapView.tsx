'use client';

import React from "react";
import Link from "next/link";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkedAlt } from "react-icons/fa";

const MapView: React.FC = () => {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mapa */}
        <div className="w-full h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
          <Map
            initialViewState={{
              longitude: -60.5761448,
              latitude: -33.9038557,
              zoom: 14,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={mapboxToken}
            // className="rounded-2xl"
          >
            <Marker longitude={-60.5761448} latitude={-33.9038557} color="orange"/>
          </Map>
        </div>

        {/* Información */}
        <div className="flex flex-col justify-start items-center">
          <div className="w-full bg-[var(--card)] p-6 rounded-2xl border border-[var(--muted-foreground)] shadow-lg space-y-4">
            <div className="flex items-center gap-4">
              <FaMapMarkedAlt size={40} color="orange"/>
              <div>
                <p className="text-xl font-semibold">Dirección</p>
                <span className="text-[var(--muted-foreground)] font-light">Intendente Biscayart Sur 452</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaMapMarkedAlt size={40} color="orange"/>
              <div>
                <p className="text-xl font-semibold">Teléfono</p>
                <span className="text-[var(--muted-foreground)] font-light">+1 234 567 890</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaMapMarkedAlt size={40} color="orange"/>
              <div className="space-y-1">
                <p className="text-xl font-semibold">Horarios</p>
                <span className="text-[var(--muted-foreground)] font-light">Lun - Vie: 6:00 AM - 10:00 PM</span>
                <span className="text-[var(--muted-foreground)] font-light">Sáb - Dom: 8:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>

          <Link 
            href="https://www.google.com/maps/dir//Club+N%C3%A1utico+Pergamino,+Int.+Biscayart+sur+452,+B2700+Pergamino,+Provincia+de+Buenos+Aires/@-33.9038557,-60.5761448,176m/data=!3m1!1e3!4m17!1m7!3m6!1s0x95b9b5fdb5968f3b:0x6a50115ae9c8ec5a!2sClub+N%C3%A1utico+Pergamino!8m2!3d-33.9039177!4d-60.5760481!16s%2Fg%2F11sq54yg_4!4m8!1m0!1m5!1m1!1s0x95b9b5fdb5968f3b:0x6a50115ae9c8ec5a!2m2!1d-60.576032!2d-33.9038816!3e1?entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D"
            className="bg-[var(--primary)]/70 hover:bg-[var(--primary)] hover:shadow-xl hover:shadow-[var(--primary)] py-3 px-12 rounded-2xl mt-6 text-center"
          >
            <span className="text-xl font-bold text-black">Cómo llegar</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MapView;