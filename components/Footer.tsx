import Link from 'next/link';
import { Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-stone-900 text-stone-200 border-t border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-3">BeforeYouSign</h3>
                        <p className="text-sm text-stone-400 leading-relaxed">
                            Institutional-grade contract analysis powered by AI. Identify material risks, decode complex provisions, and safeguard your commercial interests.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/analyze" className="text-sm text-stone-400 hover:text-white transition-colors">
                                    Analyze Contract
                                </Link>
                            </li>
                            <li>
                                <Link href="/templates" className="text-sm text-stone-400 hover:text-white transition-colors">
                                    Templates
                                </Link>
                            </li>
                            <li>
                                <Link href="/library" className="text-sm text-stone-400 hover:text-white transition-colors">
                                    Legal Library
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Developer Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Developer</h4>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-white">Srinivas Jangiti</p>
                            <a
                                href="tel:+918767505121"
                                className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors group"
                            >
                                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>+91 8767505121</span>
                            </a>
                            <a
                                href="mailto:srinivasajangiti@gmail.com"
                                className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors group"
                            >
                                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>srinivasajangiti@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-stone-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-stone-400">
                            © {currentYear} BeforeYouSign. All rights reserved.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-stone-400">
                            <span>Made with</span>
                            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                            <span>by Srinivas Jangiti</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
