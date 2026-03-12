import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, CalendarDays, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 relative">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-indigo-600 p-2 rounded-xl group-hover:bg-indigo-700 transition-colors">
                                <CalendarDays className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-gray-900">
                                HostMy<span className="text-indigo-600">Event</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation OR Search Bar inline */}
                    <div className="hidden md:flex flex-1 items-center justify-end">

                        {isSearchOpen ? (
                            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl mx-8 flex items-center relative animate-fade-in-down">
                                <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search events, organizers, or locations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 rounded-full border border-indigo-100 bg-indigo-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="absolute right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </form>
                        ) : (
                            <div className="flex items-center space-x-8 animate-fade-in">
                                <div className="flex space-x-6">
                                    <Link to="/events" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Events</Link>
                                    <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</Link>
                                    <Link to="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Contact Us</Link>
                                </div>

                                {/* Search Icon */}
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {/* Auth / Profile Buttons */}
                        <div className="flex items-center space-x-4 pl-4 ml-6 border-l border-gray-200">
                            {isAuthenticated && user ? (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
                                            {getInitials(user.name)}
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                                            <div className="px-5 py-4 border-b border-gray-50">
                                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    to="/host"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                >
                                                    <CalendarDays className="h-4 w-4" />
                                                    Host an Event
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-600 hover:text-indigo-900 font-medium transition-colors whitespace-nowrap">
                                        Login / Sign Up
                                    </Link>
                                    <Link
                                        to="/host"
                                        className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                                    >
                                        Host an Event
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button & search icon */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-500 hover:text-gray-900 focus:outline-none p-2 rounded-md transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Input (Visible when toggled on mobile) */}
                {isSearchOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </form>
                    </div>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">Events</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">About</Link>
                        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">Contact Us</Link>

                        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3 px-3">
                            {isAuthenticated && user ? (
                                <>
                                    <div className="flex items-center gap-4 px-3 py-4 bg-indigo-50 rounded-2xl mb-2">
                                        <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                                            {getInitials(user.name)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link to="/host" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                                        Host an Event
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-center px-4 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                        Login / Sign Up
                                    </Link>
                                    <Link to="/host" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                                        Host an Event
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
