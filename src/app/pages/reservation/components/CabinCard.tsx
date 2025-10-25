"use client";
import { useState } from 'react';
import { CabinCardProps } from '../../../types/reservation';

export default function CabinCard({ cabin, onSelect, isSelected }: CabinCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div 
      className={`cabin-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cabin-image">
        <div className="image-placeholder">
          {cabin.name}
        </div>
        <div className={`overlay ${isHovered ? 'visible' : ''}`}>
          <span>Ver disponibilidad</span>
        </div>
      </div>
      
      <div className="cabin-info">
        <h3>{cabin.name}</h3>
        <p>{cabin.description}</p>
        
        <div className="cabin-details">
          <div className="detail">
            <span className="icon">👥</span>
            <span>Máx. {cabin.capacity} personas</span>
          </div>
          <div className="detail">
            <span className="icon">💰</span>
            <span>${cabin.price}/noche</span>
          </div>
        </div>
        
        <div className="amenities">
          {cabin.amenities.map((amenity, index) => (
            <span key={index} className="amenity-tag">{amenity}</span>
          ))}
        </div>
      </div>
    </div>
  );
}