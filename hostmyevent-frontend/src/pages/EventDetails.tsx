import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Share2, Heart, User, ArrowLeft, ShieldCheck, Loader2, AlertCircle, Edit2, Save, X } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface EventMedia {
    id: number;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
}

interface EventData {
    id: number;
    title: string;
    description: string;
    category: string;
    startDate: string;
    endDate: string;
    venueName: string;
    locationCity: string;
    price: number;
    ticketType: string;
    status: string;
    media: EventMedia[];
    organizerEmail: string;
    organizerId: number;
    likesCount: number;
    sharesCount: number;
}

export default function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mainMedia, setMainMedia] = useState<EventMedia | null>(null);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editedEvent, setEditedEvent] = useState<EventData | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [enrollmentMsg, setEnrollmentMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const isOwnerOrAdmin = user && (user.role === 'ROLE_ADMIN' || user.id === event?.organizerId?.toString());

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/events/public/${id}`);
                const data = response.data;
                setEvent(data);
                setEditedEvent(data);

                // Prioritize video for main display
                if (data.media && data.media.length > 0) {
                    const firstVideo = data.media.find((m: EventMedia) => m.mediaType === 'VIDEO');
                    setMainMedia(firstVideo || data.media[0]);
                }
                setError(null);
            } catch (err: any) {
                console.error('Error fetching event details:', err);
                setError('Failed to load event details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEvent();
    }, [id]);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=event/${id}`);
            return;
        }

        setIsRegistering(true);
        setEnrollmentMsg(null);
        try {
            await api.post(`/api/events/${id}/enroll`);
            setEnrollmentMsg({ type: 'success', text: 'You have been successfully enrolled!' });
        } catch (err: any) {
            setEnrollmentMsg({ type: 'error', text: err.response?.data || 'Failed to enroll.' });
        } finally {
            setIsRegistering(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await api.post(`/api/events/${id}/like`);
            if (event) setEvent({ ...event, likesCount: response.data });
        } catch (err) {
            console.error('Error liking event:', err);
        }
    };

    const handleShare = async () => {
        try {
            const response = await api.post(`/api/events/${id}/share`);
            if (event) setEvent({ ...event, sharesCount: response.data });
            navigator.clipboard.writeText(window.location.href);
            alert("Event link copied to clipboard!");
        } catch (err) {
            console.error('Error sharing event:', err);
        }
    };

    const handleSaveEdit = async () => {
        if (!editedEvent) return;
        try {
            setLoading(true);
            const response = await api.put(`/api/events/${id}`, editedEvent);
            setEvent(response.data);
            setIsEditing(false);
        } catch (err: any) {
            alert(err.response?.data || "Failed to update event.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error || 'Event not found'}</p>
                    <Link to="/events" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back navigation */}
                <Link to="/events" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to all events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content (Left Column) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Header Info */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-semibold rounded-md text-sm">{event.category}</span>
                                    {isOwnerOrAdmin && (
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            {isEditing ? <><X className="w-4 h-4 mr-1" /> Cancel</> : <><Edit2 className="w-4 h-4 mr-1" /> Edit Event</>}
                                        </button>
                                    )}
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedEvent?.title}
                                        onChange={(e) => setEditedEvent(prev => prev ? { ...prev, title: e.target.value } : null)}
                                        className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight w-full bg-white border-b-2 border-indigo-600 focus:outline-none"
                                    />
                                ) : (
                                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                        {event.title}
                                    </h1>
                                )}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={handleSaveEdit}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                                >
                                    <Save className="w-5 h-5 mr-2" /> Save Changes
                                </button>
                            )}
                        </div>

                        {/* Interactive Media Gallery */}
                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                            {mainMedia && (
                                <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gray-900 shadow-inner group relative">
                                    {mainMedia.mediaType === 'VIDEO' ? (
                                        <video src={mainMedia.mediaUrl} controls className="w-full h-full object-contain" autoPlay muted loop />
                                    ) : (
                                        <img src={mainMedia.mediaUrl} alt="Event main feature" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    )}
                                </div>
                            )}

                            {/* Media Thumbnails */}
                            <div className="flex gap-3 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                                {event.media.map((media, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainMedia(media)}
                                        className={`relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${mainMedia?.mediaUrl === media.mediaUrl ? 'border-indigo-600 shadow-md ring-2 ring-indigo-200' : 'border-transparent hover:border-indigo-300 opacity-70 hover:opacity-100'}`}
                                    >
                                        {media.mediaType === 'VIDEO' ? (
                                            <>
                                                <video src={media.mediaUrl} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                                                </div>
                                            </>
                                        ) : (
                                            <img src={media.mediaUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
                            <div className="prose prose-indigo max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Sidebar (Right Column) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">

                            {/* Card: Details & Tickets */}
                            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Ticket Price</p>
                                        <p className="text-3xl font-extrabold text-gray-900">
                                            {event.price === 0 ? 'FREE' : `$${event.price.toFixed(2)}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleLike}
                                            className="p-2.5 bg-gray-50 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shadow-sm border border-gray-200 flex items-center gap-1.5"
                                        >
                                            <Heart className="w-5 h-5" />
                                            <span className="text-xs font-bold">{event.likesCount || 0}</span>
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="p-2.5 bg-gray-50 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shadow-sm border border-gray-200 flex items-center gap-1.5"
                                        >
                                            <Share2 className="w-5 h-5" />
                                            <span className="text-xs font-bold">{event.sharesCount || 0}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Calendar className="w-5 h-5" /></div>
                                        <div>
                                            {isEditing ? (
                                                <input
                                                    type="datetime-local"
                                                    value={editedEvent?.startDate.slice(0, 16)}
                                                    onChange={(e) => setEditedEvent(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                                                    className="font-bold text-gray-900 border-b border-indigo-200 w-full"
                                                />
                                            ) : (
                                                <>
                                                    <p className="font-bold text-gray-900">{formatDate(event.startDate)}</p>
                                                    <p className="text-sm text-gray-500 mt-0.5">{formatTime(event.startDate)} - {formatTime(event.endDate)}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MapPin className="w-5 h-5" /></div>
                                        <div>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedEvent?.venueName}
                                                    onChange={(e) => setEditedEvent(prev => prev ? { ...prev, venueName: e.target.value } : null)}
                                                    className="font-bold text-gray-900 border-b border-indigo-200 w-full"
                                                />
                                            ) : (
                                                <>
                                                    <p className="font-bold text-gray-900">{event.venueName}</p>
                                                    <p className="text-sm text-gray-500 mt-0.5">{event.locationCity}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {enrollmentMsg && (
                                    <div className={`mb-4 p-3 rounded-xl text-sm ${enrollmentMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        {enrollmentMsg.text}
                                    </div>
                                )}

                                <button
                                    onClick={handleEnroll}
                                    disabled={isRegistering}
                                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-200 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-70"
                                >
                                    {isRegistering ? <Loader2 className="w-6 h-6 animate-spin" /> : (event.ticketType === 'FREE' ? 'Register Now' : 'Get Tickets')}
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-4 h-4" /> Secure checkout via Stripe
                                </p>
                            </div>

                            {/* Card: Organizer Info */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Organized By</p>
                                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{event.organizerEmail.split('@')[0]}</p>
                                    </div>
                                </div>
                                <button className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                                    Contact
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
