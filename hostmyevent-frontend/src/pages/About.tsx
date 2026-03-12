import { Link } from 'react-router-dom';
import { Target, Leaf, Users, ArrowRight } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-white pt-20">

            {/* Hero Section */}
            <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-50 to-transparent"></div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Connecting Communities Through Events
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        HostMyEvent was built to eliminate the chaos of paper tracking and modernize how local events are organized, managed, and remembered.
                    </p>
                </div>
            </section>

            {/* Mission Grid */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-12">

                    <div className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className="mx-auto w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform shadow-sm">
                            <Leaf className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Friendly</h3>
                        <p className="text-gray-600">
                            We replace physical tickets and paper-heavy processes with a streamlined digital registration system to save trees and reduce waste.
                        </p>
                    </div>

                    <div className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform shadow-sm">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
                        <p className="text-gray-600">
                            Designed specifically for local neighborhoods, schools, and organizations to easily connect real people with real experiences.
                        </p>
                    </div>

                    <div className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className="mx-auto w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform shadow-sm">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Data Driven</h3>
                        <p className="text-gray-600">
                            Organizers get historical references and attendee analytics, saving all event details securely for future planning and reference.
                        </p>
                    </div>

                </div>
            </section>

            {/* CTA Layer */}
            <section className="bg-indigo-600 text-white py-20 px-4 sm:px-6 lg:px-8 text-center mt-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to bring people together?</h2>
                    <p className="text-indigo-100 text-lg mb-10max-w-2xl mx-auto">
                        Join thousands of organizers who rely on HostMyEvent. Creating your first event takes less than 5 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/host" className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-full text-indigo-600 bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto shadow-xl">
                            Host an Event Now
                        </Link>
                        <Link to="/contact" className="inline-flex justify-center items-center px-8 py-3.5 border border-indigo-400 text-base font-semibold rounded-full text-white hover:bg-indigo-700 transition-colors w-full sm:w-auto">
                            Contact Sales <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
