// lib/db-helpers.ts
export function parseAmenities(amenitiesString: string): string[] {
  try {
    if (!amenitiesString) return [];
    const parsed = JSON.parse(amenitiesString);
    
    // Validar que sea un array de strings
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
      return parsed;
    }
    
    console.warn('Invalid amenities format:', amenitiesString);
    return [];
  } catch (error) {
    console.error('Error parsing amenities:', error);
    return [];
  }
}

export function stringifyAmenities(amenitiesArray: string[]): string {
  if (!Array.isArray(amenitiesArray)) {
    return JSON.stringify([]);
  }
  return JSON.stringify(amenitiesArray.filter(amenity => typeof amenity === 'string'));
}