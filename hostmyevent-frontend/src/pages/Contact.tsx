import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Get in touch</h1>
                    <p className="text-lg text-gray-600">
                        Have a question about hosting an event? Need help with tickets? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">Email Support</h3>
                                <p className="text-gray-500 text-sm mb-3">Our team typically replies within 2 hours.</p>
                                <a href="mailto:support@hostmyevent.com" className="font-medium text-indigo-600 hover:text-indigo-800">
                                    support@hostmyevent.com
                                </a>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">Phone Number</h3>
                                <p className="text-gray-500 text-sm mb-3">Available Mon-Fri, 9am to 6pm EST.</p>
                                <a href="tel:+18001234567" className="font-medium text-indigo-600 hover:text-indigo-800">
                                    +1 (800) 123-4567
                                </a>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">Headquarters</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    123 Organizer Way<br />
                                    Suite 400<br />
                                    San Francisco, CA 94105
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">

                            {isSuccess ? (
                                <div className="text-center py-16 animate-fade-in">
                                    <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                        <Send className="w-10 h-10 ml-2" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Thanks for reaching out. A member of our support team will get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-8 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                            <input type="text" id="firstName" required className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                            <input type="text" id="lastName" required className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input type="email" id="email" required className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="you@example.com" />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                        <select id="subject" className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                                            <option>General Inquiry</option>
                                            <option>Help with Hosting an Event</option>
                                            <option>Ticketing Support</option>
                                            <option>Partnerships</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                        <textarea id="message" rows={5} required className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none" placeholder="How can we help you?"></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
