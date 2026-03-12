import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Filter, ChevronDown, Loader2, CalendarOff } from 'lucide-react';
import api from '../lib/api';

interface EventMedia {
    id: number;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
}

interface Event {
    id: number;
    title: string;
    category: string;
    startDate: string;
    locationCity: string;
    venueName: string;
    ticketType: string;
    price: number;
    status: string;
    media: EventMedia[];
}

export default function Events() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [activeCategory, setActiveCategory] = useState('All');
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');


    // Fetch events from backend on mount
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            setFetchError('');
            try {
                const response = await api.get('/api/events/public/all');
                setEvents(response.data);
            } catch (err) {
                setFetchError('Could not load events. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Client-side filtering on the fetched data
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.locationCity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venueName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' ||
            event.category.toLowerCase().includes(activeCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery) {
            setSearchParams({ search: searchQuery });
        } else {
            setSearchParams({});
        }
    };

    const getEventImage = (event: Event) => {
        const imageMedia = event.media?.find(m => m.mediaType === 'IMAGE');
        return imageMedia?.mediaUrl || null;
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return {
            month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
            day: d.getDate().toString(),
        };
    };

    const formatPrice = (event: Event) => {
        if (event.ticketType === 'FREE' || event.price === 0) return 'Free';
        return `₹${event.price.toFixed(0)}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">

            {/* Header & Search */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Explore Events</h1>

                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-4xl">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, organizer, or location..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="relative md:w-48">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Location"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

                {/* Sidebar Filters */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            <Filter className="w-4 h-4" /> Filters
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Category</h3>
                        <div className="space-y-2">
                            {['All', 'Cricket', 'Football', 'Marathon', 'Tech Meetup', 'Music Concert', 'Workshop'].map(category => (
                                <label key={category} className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={activeCategory === category}
                                        onChange={() => setActiveCategory(category)}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <span className={`ml-3 text-sm transition-colors ${activeCategory === category ? 'font-medium text-indigo-600' : 'text-gray-600 group-hover:text-gray-900'}`}>{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Price</h3>
                        <div className="space-y-2">
                            {['Any price', 'Free', 'Paid'].map(price => (
                                <label key={price} className="flex items-center cursor-pointer group">
                                    <input type="radio" name="price" className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" />
                                    <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">{price}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            {isLoading ? 'Loading events...' : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} found`}
                        </h2>
                        <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                            Sort by: Latest <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                            <p className="text-gray-500">Loading events...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!isLoading && fetchError && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                            <p className="text-red-600 font-medium">{fetchError}</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !fetchError && filteredEvents.length === 0 && (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                            <CalendarOff className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">No events found</h3>
                            <p className="text-gray-500 mt-1">
                                {events.length === 0
                                    ? 'No events have been created yet. Be the first to host one!'
                                    : 'Try adjusting your search query or filters.'}
                            </p>
                            {events.length > 0 && (
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                    className="mt-4 text-indigo-600 font-medium hover:text-indigo-800"
                                >
                                    Clear all filters
                                </button>
                            )}
                            {events.length === 0 && (
                                <Link to="/host" className="mt-4 inline-block text-indigo-600 font-medium hover:text-indigo-800">
                                    Host an Event →
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Events Grid */}
                    {!isLoading && !fetchError && filteredEvents.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => {
                                const img = getEventImage(event);
                                const { month, day } = formatDate(event.startDate);
                                return (
                                    <Link to={`/events/${event.id}`} key={event.id} className="block cursor-pointer">
                                        <div className="bg-white rounded-2xl flex flex-col h-full overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                                                {img ? (
                                                    <img
                                                        src={img}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Calendar className="h-16 w-16 text-indigo-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md shadow-sm">
                                                    <p className="text-xs font-bold text-indigo-600 mb-0 leading-none">{month}</p>
                                                    <p className="text-xl font-bold text-gray-900 leading-none mt-1">{day}</p>
                                                </div>
                                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md">
                                                    <p className="text-xs font-medium text-white tracking-wide">{event.category}</p>
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight flex-1">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center text-sm text-gray-500 mb-4 mt-auto">
                                                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                                    <span className="truncate">{event.venueName}{event.locationCity ? `, ${event.locationCity}` : ''}</span>
                                                </div>
                                                <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                                                    <span className="font-semibold text-gray-900">{formatPrice(event)}</span>
                                                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full transition-colors relative z-10 pointer-events-none">
                                                        Get Tickets
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
