import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ArrowRight, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    media: EventMedia[];
}

export default function Home() {
    const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await api.get('/api/events/public/all');
                // Show up to 6 most recent events on home page
                setTrendingEvents(response.data.slice(0, 6));
            } catch {
                // Silently fail — home page just won't show events section
            } finally {
                setIsLoadingEvents(false);
            }
        };
        fetchTrending();
    }, []);

    const getEventImage = (event: Event) => {
        return event.media?.find(m => m.mediaType === 'IMAGE')?.mediaUrl || null;
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
        <div className="min-h-screen bg-gray-50 flex flex-col pt-20">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-50 blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-50 blur-3xl opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
                                <Star className="w-4 h-4 fill-current" />
                                <span>The new standard for local events</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                                Discover & Host <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                                    Unforgettable Events
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Ditch the paper tickets. HostMyEvent makes it effortless to find local happenings, manage attendees virtually, and save memories for the future.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/events" className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all duration-200 w-full sm:w-auto">
                                    Explore Events
                                </Link>
                                <Link to="/host" className="inline-flex justify-center items-center px-8 py-3.5 border-2 border-gray-200 text-base font-semibold rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 w-full sm:w-auto">
                                    Host an Event
                                </Link>
                            </div>

                            {/* Stats/Social Proof */}
                            <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">5k+</div>
                                    <div className="text-sm text-gray-500">Active Events</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">12k+</div>
                                    <div className="text-sm text-gray-500">Organizers</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">1M+</div>
                                    <div className="text-sm text-gray-500">Tickets Sold</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Interactive Image/Graphic */}
                        <div className="relative hidden lg:block">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100 group">
                                <img
                                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="People enjoying an event"
                                    className="w-full object-cover h-[600px] group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>

                                {/* Floating Card UI overlay */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-lg transform -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <h3 className="font-bold text-gray-900">Tech Conference 2026</h3>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4" /> San Francisco, CA
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Global Search/Filter Bar */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 relative z-20 -mt-10 w-full">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-3 flex flex-col md:flex-row items-center gap-3 border border-gray-100">

                    <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100 w-full">
                        <Search className="w-5 h-5 text-gray-400 mr-3 hidden sm:block" />
                        <input
                            type="text"
                            placeholder="What kind of event?"
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 p-0"
                        />
                    </div>

                    <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100 w-full">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 hidden sm:block" />
                        <input
                            type="text"
                            placeholder="Location (e.g. Mumbai)"
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 p-0"
                        />
                    </div>

                    <div className="flex-1 flex items-center px-4 py-2 w-full">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3 hidden sm:block" />
                        <input
                            type="text"
                            placeholder="Any date"
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 p-0"
                        />
                    </div>

                    <Link to="/events" className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 md:px-8 md:py-4 rounded-xl font-semibold transition-colors shadow-md shadow-indigo-200 w-full md:w-auto text-center">
                        Search
                    </Link>
                </div>
            </section>

            {/* Trending Events Section — Real data from DB */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Trending Events</h2>
                        <p className="text-gray-500 mt-2">Discover what's happening around you.</p>
                    </div>
                    <Link to="/events" className="hidden sm:flex items-center text-indigo-600 font-medium hover:text-indigo-700">
                        View all <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                {/* Loading State */}
                {isLoadingEvents && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoadingEvents && trendingEvents.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No events yet</h3>
                        <p className="text-gray-400 mt-1 mb-6">Be the first to host an event in your community!</p>
                        <Link to="/host" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors">
                            Host an Event
                        </Link>
                    </div>
                )}

                {/* Events Grid — Real events from DB */}
                {!isLoadingEvents && trendingEvents.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trendingEvents.map((event) => {
                            const img = getEventImage(event);
                            const { month, day } = formatDate(event.startDate);
                            return (
                                <Link to={`/events/${event.id}`} key={event.id} className="block cursor-pointer">
                                    <div className="bg-white rounded-2xl h-full flex flex-col overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                                            {img ? (
                                                <img
                                                    src={img}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Calendar className="h-14 w-14 text-indigo-300" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md shadow-sm">
                                                <p className="text-xs font-bold text-indigo-600 mb-0 leading-none">{month}</p>
                                                <p className="text-xl font-bold text-gray-900 leading-none mt-1">{day}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{event.title}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mb-4 mt-auto">
                                                <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                                <span className="truncate">{event.venueName}{event.locationCity ? `, ${event.locationCity}` : ''}</span>
                                            </div>
                                            <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                                                <span className="font-semibold text-gray-900">{formatPrice(event)}</span>
                                                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full transition-colors pointer-events-none relative z-10">
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                <div className="mt-12 text-center sm:hidden">
                    <Link to="/events" className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 w-full">
                        View all events
                    </Link>
                </div>
            </section>

        </div>
    );
}
