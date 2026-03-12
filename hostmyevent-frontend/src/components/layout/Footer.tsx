export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand Col */}
                    <div className="md:col-span-1">
                        <span className="font-bold text-2xl tracking-tight text-white mb-4 block">
                            HostMy<span className="text-indigo-400">Event</span>
                        </span>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Making local event discovery and hosting simpler, greener, and more accessible for everyone.
                        </p>
                    </div>

                    {/* Links Col 1 */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Explore</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">All Events</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">Categories</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">Locations</a></li>
                        </ul>
                    </div>

                    {/* Links Col 2 */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Resources</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">Host an Event</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">Help Center</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Socials Col */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                                IG
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                                TW
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                                FB
                            </a>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        &copy; {currentYear} HostMyEvent. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-sm mt-4 md:mt-0 italic flex items-center gap-1">
                        Made with <span className="text-red-500">❤️</span> by Sanjay Sharma
                    </p>
                </div>
            </div>
        </footer>
    );
}
