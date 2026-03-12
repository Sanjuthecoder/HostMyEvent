import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, MapPin, Calendar as CalendarIcon, Clock, Users, DollarSign, Image as ImageIcon, ArrowRight, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../lib/api';

export default function HostEvent() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Media State
    const [mediaFiles, setMediaFiles] = useState<{ url: string, type: 'image' | 'video', file: File }[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        venueName: '',
        address: '',
        locationCity: '',
        ticketType: 'FREE',
        ticketPrice: '',
        maxAttendees: '',
        organizerEmail: user?.email || '',
        organizerPhone: ''
    });

    const categories = [
        "Cricket", "Football", "Volleyball", "Handball", "Badminton", "Kabaddi", "Wrestling",
        "Cycle Racing", "Marathon", "Study Group", "Tech Meetup", "Music Concert", "Workshop"
    ];

    // Auth Guard
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=host');
        }
    }, [isAuthenticated, navigate]);

    // Keep organizerEmail in sync with the logged-in user's email
    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({ ...prev, organizerEmail: user.email }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const newMedia = filesArray.map(file => ({
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
                file
            }));
            setMediaFiles(prev => [...prev, ...newMedia]);
        }
    };

    const removeMedia = (index: number) => {
        setMediaFiles(prev => {
            const newMedia = [...prev];
            URL.revokeObjectURL(newMedia[index].url);
            newMedia.splice(index, 1);
            return newMedia;
        });
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!emailRegex.test(formData.organizerEmail)) {
            setSubmitError("Please enter a valid organizer email address.");
            return false;
        }
        if (formData.organizerPhone && !phoneRegex.test(formData.organizerPhone)) {
            setSubmitError("Please enter a valid 10-digit mobile number for the organizer.");
            return false;
        }
        if (!formData.title || !formData.category || !formData.date || !formData.startTime) {
            setSubmitError("Please fill in all required fields.");
            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!formData.title || !formData.category || !formData.description) {
                setSubmitError("Please fill in all required fields in step 1.");
                return;
            }
        }
        if (currentStep === 2) {
            if (!formData.date || !formData.startTime || !formData.venueName || !formData.locationCity) {
                setSubmitError("Please fill in all required fields in step 2.");
                return;
            }
        }
        setSubmitError('');
        setCurrentStep((prev) => Math.min(prev + 1, 3));
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep !== 3) {
            nextStep();
            return;
        }

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Build FormData for multipart/form-data submission (files + fields together)
            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('venueName', formData.venueName);
            data.append('address', formData.address);
            data.append('locationCity', formData.locationCity || formData.venueName);
            data.append('ticketType', formData.ticketType);
            data.append('organizerEmail', formData.organizerEmail);
            data.append('organizerPhone', formData.organizerPhone);

            // Combine date + time into ISO 8601 format expected by Spring's @DateTimeFormat
            const startDateTime = `${formData.date}T${formData.startTime || '00:00'}:00`;
            data.append('startDate', startDateTime);
            if (formData.endTime) {
                const endDateTime = `${formData.date}T${formData.endTime}:00`;
                data.append('endDate', endDateTime);
            }
            if (formData.ticketType === 'PAID' && formData.ticketPrice) {
                data.append('price', formData.ticketPrice);
            }
            if (formData.maxAttendees) {
                data.append('capacity', formData.maxAttendees);
            }

            // Append media files
            mediaFiles.forEach(({ file }) => {
                data.append('mediaFiles', file);
            });

            await api.post('/api/events/host', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setSubmitSuccess(true);
            setTimeout(() => navigate('/explore'), 2000);
        } catch (err: any) {
            const msg = err.response?.data || 'Failed to publish event. Please try again.';
            setSubmitError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) return null;

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Event Published!</h2>
                    <p className="text-gray-500 mt-2">Redirecting to events page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Progress Indicator */}
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <Target className="w-8 h-8 text-indigo-600" /> Host a New Event
                    </h1>
                    <p className="mt-2 text-gray-600">Fill in the details below to publish your event to the community.</p>

                    {/* Progress Bar */}
                    <div className="mt-8 flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all duration-300"
                            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                        ></div>

                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 font-bold border-2 transition-colors ${step <= currentStep
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                    : 'bg-white border-gray-300 text-gray-400'
                                    }`}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm font-medium text-gray-500 px-2">
                        <span>Basic Info</span>
                        <span>Date & Location</span>
                        <span>Tickets & Contact</span>
                    </div>
                </div>

                {/* Error Banner */}
                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-sm text-red-700">
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>{submitError}</span>
                    </div>
                )}

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8">

                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">1. Basics</h2>

                                <div>
                                    <label htmlFor="title" className="block text-sm font-bold text-gray-700">Event Title <span className="text-red-500">*</span></label>
                                    <input type="text" id="title" name="title" required value={formData.title} onChange={handleChange} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors" placeholder="e.g., Annual City Marathon 2026" />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-bold text-gray-700">Category <span className="text-red-500">*</span></label>
                                    <select id="category" name="category" required value={formData.category} onChange={handleChange} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors">
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-bold text-gray-700">Description <span className="text-red-500">*</span></label>
                                    <textarea id="description" name="description" rows={5} required value={formData.description} onChange={handleChange} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors resize-none" placeholder="Provide detail about what attendees can expect..." />
                                    <p className="mt-2 text-sm text-gray-500">A clear, engaging description helps attract more attendees.</p>
                                </div>

                                {/* Image/Video Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Event Media (Images & Videos)</label>

                                    {mediaFiles.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                            {mediaFiles.map((media, idx) => (
                                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group bg-gray-100">
                                                    {media.type === 'video' ? (
                                                        <video src={media.url} className="w-full h-full object-cover" controls={false} />
                                                    ) : (
                                                        <img src={media.url} alt="preview" className="w-full h-full object-cover" />
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedia(idx)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group block">
                                        <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                        <span className="mt-2 block text-sm font-medium text-gray-900 group-hover:text-indigo-600">Click to upload images or videos</span>
                                        <span className="mt-1 block text-xs text-gray-500">JPG, PNG, MP4 up to 50MB</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Date & Location */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">2. Date & Location</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-bold text-gray-700">Event Date <span className="text-red-500">*</span></label>
                                        <div className="mt-2 relative">
                                            <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input type="date" id="date" name="date" required value={formData.date} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="startTime" className="block text-sm font-bold text-gray-700">Start Time <span className="text-red-500">*</span></label>
                                        <div className="mt-2 relative">
                                            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input type="time" id="startTime" name="startTime" required value={formData.startTime} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="endTime" className="block text-sm font-bold text-gray-700">End Time</label>
                                        <div className="mt-2 relative">
                                            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <label htmlFor="venueName" className="block text-sm font-bold text-gray-700">Venue Name <span className="text-red-500">*</span></label>
                                    <div className="mt-2 relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input type="text" id="venueName" name="venueName" required value={formData.venueName} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white" placeholder="e.g. Central Park, Main Ground" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="locationCity" className="block text-sm font-bold text-gray-700">City <span className="text-red-500">*</span></label>
                                    <input type="text" id="locationCity" name="locationCity" required value={formData.locationCity} onChange={handleChange} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white" placeholder="e.g. Mumbai, Delhi, Bengaluru" />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-bold text-gray-700">Full Address</label>
                                    <textarea id="address" name="address" rows={2} value={formData.address} onChange={handleChange} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white resize-none" placeholder="123 Main St, City, State ZIP" />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Ticketing & Privacy */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">3. Ticketing & Registration</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Event Registration Type</label>
                                        <div className="flex gap-4">
                                            <label className={`flex-1 flex items-center justify-center py-3 border-2 rounded-xl cursor-pointer transition-colors ${formData.ticketType === 'FREE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-300'}`}>
                                                <input type="radio" name="ticketType" value="FREE" checked={formData.ticketType === 'FREE'} onChange={handleChange} className="sr-only" />
                                                <span className="font-semibold">Free Event</span>
                                            </label>
                                            <label className={`flex-1 flex items-center justify-center py-3 border-2 rounded-xl cursor-pointer transition-colors ${formData.ticketType === 'PAID' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-300'}`}>
                                                <input type="radio" name="ticketType" value="PAID" checked={formData.ticketType === 'PAID'} onChange={handleChange} className="sr-only" />
                                                <span className="font-semibold">Paid Ticket</span>
                                            </label>
                                        </div>
                                    </div>

                                    {formData.ticketType === 'PAID' && (
                                        <div className="animate-fade-in-up">
                                            <label htmlFor="ticketPrice" className="block text-sm font-bold text-gray-700">Ticket Price</label>
                                            <div className="mt-2 relative">
                                                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <input type="number" id="ticketPrice" name="ticketPrice" required={formData.ticketType === 'PAID'} value={formData.ticketPrice} onChange={handleChange} min="1" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white" placeholder="0.00" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="maxAttendees" className="block text-sm font-bold text-gray-700">Maximum Capacity (Optional)</label>
                                    <div className="mt-2 relative">
                                        <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input type="number" id="maxAttendees" name="maxAttendees" value={formData.maxAttendees} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white" placeholder="Leave empty for unlimited" />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 mt-8 pt-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Organizer Contact Info</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="organizerEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                                            <input type="email" id="organizerEmail" name="organizerEmail" required value={formData.organizerEmail} onChange={handleChange} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50" />
                                        </div>
                                        <div>
                                            <label htmlFor="organizerPhone" className="block text-sm font-medium text-gray-700">Contact Phone (Optional)</label>
                                            <input type="tel" id="organizerPhone" name="organizerPhone" value={formData.organizerPhone} onChange={handleChange} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50" placeholder="+91..." />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                            {currentStep > 1 ? (
                                <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                    Back
                                </button>
                            ) : (
                                <div /> // Spacer
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
                            >
                                {isSubmitting ? 'Publishing...' : currentStep === 3 ? (
                                    <>
                                        <ShieldCheck className="mr-2 h-5 w-5" /> Publish Event
                                    </>
                                ) : (
                                    <>
                                        Next Step <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
