import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                    <div>
                        <h4 className="mb-4 text-lg font-semibold">AmCoder</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Empowering India's engineering talent through accessible, world-class coding education.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/problems" className="text-gray-400 hover:text-white">Problems</Link></li>
                            <li><Link to="/community" className="text-gray-400 hover:text-white">Community</Link></li>
                            <li><Link to="/plans" className="text-gray-400 hover:text-white">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-semibold">Mission 2047</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="#" className="text-gray-400 hover:text-white">About Us</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">Our Vision</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-semibold">Community</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/feedback" className="text-gray-400 hover:text-white">Feedback</Link></li>
                            <li><a className="text-gray-400 hover:text-white">Discord</a></li>
                            <li><a className="text-gray-400 hover:text-white">Twitter</a></li>
                            <li><a className="text-gray-400 hover:text-white">LinkedIn</a></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                    © 2024 AmCoder. Built with 🧡🤍💚 for India's future engineers.
                </div>

            </div>
        </footer>
    );
}
