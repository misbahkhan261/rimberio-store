import { CartProvider } from '@/context/CartContext';
import TickerStrip from '@/components/TickerStrip';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import EditorialStrip from '@/components/EditorialStrip';
import FaqSection from '@/components/FaqSection';
import SupportSection from '@/components/SupportSection';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';

export default function App() {
    return (
        /* - CartProvider poori application ko state aur cart management provide karta hai */
        <CartProvider>
            <>
                {/* - Top announcement ticker strip */}
                <TickerStrip />

                {/* - Sticky Navigation Bar */}
                <Navbar />

                {/* - Main website content sections */}
                <main>
                    <Hero />
                    <Catalog />
                    <EditorialStrip />
                    <FaqSection />
                    <SupportSection />
                </main>

                {/* - Bottom Footer */}
                <Footer />

                {/* - Global Modals and Drawers */}
                <ProductModal />
                <CartDrawer />
            </>
        </CartProvider>
    );
}