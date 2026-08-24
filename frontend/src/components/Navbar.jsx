import React, { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { BRAND_NAME, NAV_LINKS } from "@/constants";
import { useCart } from "@/context/CartContext";
import AdminModal from "./AdminModal";

export default function Navbar() {
    const { cartCount, openDrawer } = useCart();
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    // - Secret keyboard shortcut (Ctrl + Shift + A) se admin panel open karne ka logic
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.code === "KeyA") {
                e.preventDefault();
                setIsAdminOpen(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            {/* - Sticky header jo scroll karne par upar fix rehta hai */}
            <header className="sticky top-5 z-[1200] flex justify-center px-5">
                
                {/* - Navbar ka main container (Glassmorphism effect ke sath) */}
                <div className="w-[96%] max-w-[1760px] min-h-[86px] py-4 px-10 max-md:px-5 flex items-center justify-between rounded-full bg-white/90 backdrop-blur-[20px] border border-black/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_16px_60px_rgba(0,0,0,0.08)]">

                    {/* - LEFT SIDE: Brand Logo aur Subtitle */}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        }}
                        className="flex flex-col justify-center items-start shrink-0 select-none pl-2 transition-transform duration-300 hover:scale-[1.015]"
                    >
                        {/* - Brand Name */}
                        <span 
                            className="text-[32px] max-lg:text-[28px] max-md:text-[24px] tracking-[4px] max-md:tracking-[2px] text-ink-900 font-medium leading-[0.85]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            {BRAND_NAME}
                        </span>

                        {/* - Subtitle (curated living) */}
                        <span 
                            className="text-[17px] max-md:text-[14px] text-ink-500 leading-[0.9] mt-[3px] ml-[2px]"
                            style={{ fontFamily: "'Allura', cursive" }}
                        >
                            curated living
                        </span>

                        {/* - Chhoti si golden line jo hover par bari hoti hai */}
                        <span className="mt-[3px] ml-[2px] h-[1.5px] w-7 rounded-full bg-[#C6A15B] transition-all duration-500 hover:w-10" />
                    </a>

                    {/* - CENTER: Navigation Links (Mobile screens par hide ho jayenge) */}
                    <nav className="flex flex-1 justify-center items-center px-6">
                        <div className="mx-auto flex items-center gap-16 max-xl:gap-12 max-lg:gap-8 max-md:hidden">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="relative uppercase text-[13px] font-medium tracking-[4px] text-ink-700 font-mono transition-all duration-400 ease-out hover:text-ink-900 hover:tracking-[5px] after:absolute after:left-1/2 after:-bottom-2 after:h-[1px] after:w-0 after:bg-black after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </nav>

                    {/* - RIGHT SIDE: Cart Icon aur Item Badge */}
                    <div className="flex items-center">
                        <button
                            onClick={openDrawer}
                            aria-label="Open shopping bag"
                            className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-black/5 hover:shadow-md hover:-translate-y-[1px] hover:scale-105"
                        >
                            <ShoppingBag size={22} strokeWidth={1.5} />

                            {/* - Agar cart mein items hain toh yeh badge show hoga */}
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ink-900 text-white text-[10px] flex items-center justify-center font-medium">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                </div>
            </header>

            {/* - Admin Login & Product Adding Modal (Shortcut se khulta hai) */}
            <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        </>
    );
}