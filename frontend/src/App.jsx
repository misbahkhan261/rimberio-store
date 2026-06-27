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
import CursorGlow from '@/components/CursorGlow';

export default function App() {
    return (
        <CartProvider>
            <TickerStrip />
            <Navbar />
            <main>
                <Hero />
                <Catalog />
                <EditorialStrip />
                <FaqSection />
                <SupportSection />
            </main>
            <Footer />
            <ProductModal />
            <CartDrawer />
            <CursorGlow />
        </CartProvider>
    );
}
