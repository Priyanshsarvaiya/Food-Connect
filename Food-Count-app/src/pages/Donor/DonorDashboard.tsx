import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Listing {
  id: number;
  title: string;
  organization: string;
  location: string;
  description: string;
  quantity: number;
  dietaryRestrictions: string;
  availabilityStatus: string;
  expirationDate: string;
  imageUrl: string[];
  userId: number;
  // Additional properties for UI display
  tags?: string[];
  status?: string;
  duration?: number;
  reservations?: number;
  image?: string;
}

const DonorDashboard = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load listings from API on component mount
  useEffect(() => {
    fetchListings();
  }, []);

  // In fetchListings function
  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/food-posts', {
        method: 'GET',
        credentials: 'include', // Critical: Include cookies for auth
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch listings`);
      }
      
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        // Transform API data to match component's expected format
        const formattedListings = result.data.map((listing: any) => {
          // Parse dietary restrictions into tags array
          const tags = listing.dietaryRestrictions 
            ? listing.dietaryRestrictions.split(',').map((tag: string) => tag.trim()) 
            : [];
          
          // Calculate duration in hours from expiration date
          const expirationDate = new Date(listing.expirationDate);
          const now = new Date();
          const durationHours = Math.max(0, Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60)));
          
          return {
            ...listing,
            tags,
            status: listing.availabilityStatus,
            duration: durationHours,
            reservations: 0, // Default if not provided by API
            image: listing.imageUrl && listing.imageUrl.length > 0 ? listing.imageUrl[0] : null
          };
        });
        
        setListings(formattedListings);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err instanceof Error ? err.message : 'Error fetching listings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // In handleDelete function
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/food-posts/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Include HTTP-only cookies for auth
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: Failed to delete listing`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Update UI by removing the deleted listing
        setListings(prevListings => prevListings.filter(listing => listing.id !== id));
      } else {
        throw new Error(result.message || 'Failed to delete listing');
      }
    } catch (err: any) {
      console.error('Error deleting listing:', err);
      setError(`Failed to delete listing: ${err.message}`);
    }
  };

  // Filter listings based on search query
  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const profile = JSON.parse(localStorage.getItem('foodConnectProfile') || '{}');

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with logo and user profile */}
      <header className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <svg className="h-7 w-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-9h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2z" />
                </svg>
                <span className="ml-2 text-lg font-semibold text-gray-900">FoodConnect</span>
              </Link>
              <div className="ml-10 relative">
                <input
                  type="text"
                  placeholder="Search your listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  1
                </span>
              </button>
              <div className="ml-4 flex items-center">
                <Link to="/donor/profile" className="flex items-center">
                {localStorage.getItem('profileImage') ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    src={localStorage.getItem('profileImage') || ''}
                    alt="Profile"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold border border-gray-200">
                    {profile?.name
                      ? `${profile.name.charAt(0)}${profile.name.slice(-1)}`
                      : 'U'}
                  </div>
                )}
                  {/* Get user profile from localStorage, fallback to generic name */}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {(() => {
                      const profile = localStorage.getItem('foodConnectProfile');
                      return profile ? JSON.parse(profile).name : 'City Bakery';
                    })()}
                  </span>
                  <svg className="ml-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header with title and "New Listing" button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <Link
              to="/donor/newlisting"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Listing
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-10 w-10 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-3 text-gray-500">Loading listings...</p>
            </div>
          ) : (
            /* Listings grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-lg overflow-hidden shadow">
                    <div className="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center justify-center">
                          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm mt-2">No image available</p>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{listing.title}</h2>
                          <p className="text-sm text-gray-600">{listing.organization}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {listing.status}
                        </span>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {listing.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Available for {listing.duration} hours
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {listing.quantity} Available
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {listing.tags && listing.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <Link
                          to={`/donor/editlisting/${listing.id}`}
                          className="text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 bg-white rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No listings yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new listing.</p>
                  <div className="mt-6">
                    <Link
                      to="/donor/newlisting"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      New Listing
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;