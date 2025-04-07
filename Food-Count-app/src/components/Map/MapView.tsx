import { useState, useEffect, memo } from 'react';
import Map from 'react-map-gl';
import { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BASE_URL } from '../../config/api';

// Define the FoodListing interface
interface FoodListing {
  id: number;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Default center (Vancouver)
const defaultCenter = {
  latitude: 49.2827,
  longitude: -123.1207,
  zoom: 12
};

// Hardcoded listings data
const mockListings: FoodListing[] = [
  {
    id: 1,
    title: "Fresh Bread and Pastries",
    location: "123 Robson St, Vancouver, BC",
    description: "Freshly baked bread and pastries from local bakery. Includes baguettes, croissants, and artisan breads.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2827,
      lng: -123.1207
    }
  },
  {
    id: 2,
    title: "Organic Vegetables",
    location: "456 Granville St, Vancouver, BC",
    description: "Fresh organic vegetables from local farm. Seasonal produce including tomatoes, lettuce, and herbs.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2836,
      lng: -123.1156
    }
  },
  {
    id: 3,
    title: "Prepared Meals",
    location: "789 Davie St, Vancouver, BC",
    description: "Healthy prepared meals from local restaurant. Includes vegetarian and vegan options.",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2806,
      lng: -123.1306
    }
  },
  {
    id: 4,
    title: "Fresh Seafood",
    location: "321 Main St, Vancouver, BC",
    description: "Daily catch from local fishermen. Includes fresh fish, shellfish, and prepared seafood dishes.",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2812,
      lng: -123.0991
    }
  },
  {
    id: 5,
    title: "Artisan Cheese",
    location: "654 Commercial Dr, Vancouver, BC",
    description: "Selection of artisanal cheeses from local dairy farms. Includes aged cheddar, brie, and goat cheese.",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2771,
      lng: -123.0696
    }
  },
  {
    id: 6,
    title: "Fresh Fruits",
    location: "987 Cambie St, Vancouver, BC",
    description: "Seasonal fruits from local orchards. Includes apples, berries, and citrus fruits.",
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2634,
      lng: -123.1156
    }
  },
  {
    id: 7,
    title: "Bakery Delights",
    location: "147 West 4th Ave, Vancouver, BC",
    description: "Freshly baked goods including cakes, cookies, and specialty desserts.",
    imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2634,
      lng: -123.1156
    }
  },
  {
    id: 8,
    title: "Local Honey",
    location: "258 Broadway, Vancouver, BC",
    description: "Raw honey from local beekeepers. Includes different varieties and honey-based products.",
    imageUrl: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2634,
      lng: -123.1156
    }
  },
  {
    id: 9,
    title: "Organic Coffee",
    location: "369 Hastings St, Vancouver, BC",
    description: "Freshly roasted organic coffee beans and ground coffee from local roasters.",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2812,
      lng: -123.0991
    }
  },
  {
    id: 10,
    title: "Farm Fresh Eggs",
    location: "159 Pender St, Vancouver, BC",
    description: "Fresh eggs from free-range chickens at local farms. Available in various sizes.",
    imageUrl: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    coordinates: {
      lat: 49.2812,
      lng: -123.0991
    }
  }
];

const MapView: React.FC = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [viewport, setViewport] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setLocationError("Unable to retrieve your location");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);

  // Set mock data when component mounts
  useEffect(() => {
    const fetchFoodPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/food-posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include' // Important for cookies
        });
        if (!response.ok) throw new Error('Failed to fetch food posts');
        const responseData = await response.json();
        console.log("Raw API Response:", responseData);
        
        // Transform API data to match FoodListing interface
        const transformedListings = responseData.data.map((post: any) => {
          console.log("Processing post:", post);
          const transformed = {
            id: post.id,
            title: post.title,
            location: post.location,
            description: post.description,
            imageUrl: post.imageUrl?.[0] || '', // Use first image if available
            coordinates: {
              lat: parseFloat(post.latitude),
              lng: parseFloat(post.longitude)
            }
          };
          console.log("Transformed post:", transformed);
          return transformed;
        });
        
        console.log("All transformed listings:", transformedListings);
        setListings(transformedListings);

        // Update viewport to show all markers
        if (transformedListings.length > 0) {
          const bounds = transformedListings.reduce((bounds: mapboxgl.LngLatBounds, listing: FoodListing) => {
            bounds.extend([listing.coordinates.lng, listing.coordinates.lat]);
            return bounds;
          }, new mapboxgl.LngLatBounds());
          
          setViewport({
            ...viewport,
            ...bounds.toArray().flat(),
            zoom: 11
          });
        }
      } catch (error) {
        console.error('Error fetching food posts:', error);
        // Fallback to mock data if API call fails
        setListings(mockListings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodPosts();
   
    // Current mock data implementation
    // setListings(mockListings);
    // setIsLoading(false);
    
    // Fit bounds to show all markers
    const bounds = mockListings.reduce((bounds: mapboxgl.LngLatBounds, listing: FoodListing) => {
      bounds.extend([listing.coordinates.lng, listing.coordinates.lat]);
      return bounds;
    }, new mapboxgl.LngLatBounds());
    
    setViewport({
      ...viewport,
      ...bounds.toArray().flat(),
      zoom: 11
    });
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading map...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full relative text-black">
      {/* Map Container */}
      <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg">
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: '100%', height: '100%' }}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          onMove={(evt) => setViewport(evt.viewState)}
        >
          <NavigationControl 
            position="top-right"
            showCompass={true}
            showZoom={true}
            visualizePitch={true}
          />
          <FullscreenControl position="top-right" />

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Marker>
          )}

          {/* Render markers for each listing */}
          {listings.map(listing => (
            <Marker
              key={listing.id}
              longitude={listing.coordinates.lng}
              latitude={listing.coordinates.lat}
            >
              <div 
                className="w-10 h-10 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedListing(listing);
                }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Marker>
          ))}

          {/* Show Popup when a marker is clicked */}
          {selectedListing && (
            <Popup
              longitude={selectedListing.coordinates.lng}
              latitude={selectedListing.coordinates.lat}
              onClose={() => setSelectedListing(null)}
              closeButton={true}
              closeOnClick={false}
              anchor="bottom"
              offset={25}
              maxWidth="300px"
            >
              <div className="bg-white rounded-lg shadow-lg">
                {/* Image Section */}
                {selectedListing.imageUrl && (
                  <div className="w-full h-40 overflow-hidden rounded-t-lg">
                    <img 
                      src={selectedListing.imageUrl} 
                      alt={selectedListing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedListing.title}</h3>
                  
                  {/* Location with Icon */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{selectedListing.location}</span>
                  </div>

                  {/* Scrollable Description */}
                  <div className="max-h-32 overflow-y-auto mb-4 pr-2">
                    <p className="text-sm text-gray-600">{selectedListing.description}</p>
                  </div>

                  {/* Action Button */}
                  <button 
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={() => {
                      console.log('Reserve clicked for:', selectedListing.title);
                    }}
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-2">
        <div className="text-sm font-medium text-gray-700">
          Showing {listings.length} listings
        </div>
      </div>

      {/* Location Error Message */}
      {locationError && (
        <div className="absolute bottom-4 left-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md">
          {locationError}
        </div>
      )}
    </div>
  );
};

export default memo(MapView); 