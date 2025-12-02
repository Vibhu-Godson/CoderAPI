import { useState } from 'react';
import { Mail, MessageCircle, Phone, MapPin, Send } from 'lucide-react';

export default function ContactUs() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        }, 3000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-gray-900 mb-4">Contact Us</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Have a question or need help? We're here to assist you. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-gray-900 mb-2">Message Sent!</h2>
                            <p className="text-gray-600">
                                Thank you for contacting us. We'll get back to you within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8">
                            <h2 className="text-gray-900 mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="What is this about?"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={6}
                                        placeholder="Your message..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-gray-900 mb-1">Email</h3>
                                <p className="text-gray-600">amcoder.in@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-gray-900 mb-1">Phone</h3>
                                <p className="text-gray-600">+91 7239010038</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 text-white rounded-lg p-6">
                        <MessageCircle className="w-12 h-12 mb-4" />
                        <h3 className="mb-2">Live Chat</h3>
                        <p className="text-blue-100 mb-4">
                            Get instant help from our support team
                        </p>
                        <button className="w-full py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50">
                            Start Chat
                        </button>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-gray-900 mb-4">Office Hours</h3>
                        <div className="space-y-2 text-gray-600">
                            <div className="flex justify-between">
                                <span>Monday - Friday</span>
                                <span>9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Saturday</span>
                                <span>10:00 AM - 4:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sunday</span>
                                <span>Closed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
