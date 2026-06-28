/*
==========================================
RIMBERIO PREMIUM NAVBAR
Version: 1.0
Status: FINAL
Completed: June 2026

⚠️ Do not modify design unless required.
==========================================
*/



import { ShoppingBag } from "lucide-react";
import { BRAND_NAME, NAV_LINKS } from "@/constants";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const { cartCount, openDrawer } = useCart();

    return (
        <header className="sticky top-5 z-[1200] flex justify-center px-5">

            <div
                className="
                w-[96%]
                max-w-[1760px]
                h-[82px]
                px-12
                flex
                items-center
                justify-between
                rounded-full
                bg-white/90
                backdrop-blur-[20px]
                border
                border-black/[0.03]
                shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                overflow-visible
                transition-all
                duration-500
                hover:shadow-[0_16px_60px_rgba(0,0,0,0.08)]
            "
            >

                {/* LEFT */}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                    }}
                   className="
                   group-hover:w-20
                    flex
                    flex-col
                    justify-center
                    items-start
                    h-full
                    pl-8
                    shrink-0
                    select-none
                    leading-none
                    transition-transform
                    duration-300
                    hover:scale-[1.015]
                "
                >

                    {/* Brand */}

                    <span
                        className="
                            text-[42px]
                            max-lg:text-[46px]
                            max-md:text-[38px]
                            tracking-[6px]
                            max-md:tracking-[5px]
                            text-ink-900
                            font-medium
                            leading-none
                        "
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                        }}
                    >
                        {BRAND_NAME}
                    </span>

                    {/* Subtitle */}

                    <span
                        className="
                            mt-[-7px]
                            ml-6
                            text-[20px]
                            max-md:text-[18px]
                            text-ink-500
                        "
                        style={{
                            fontFamily: "'Allura', cursive",
                        }}
                    >
                        curated living
                    </span>

                    {/* Gold Line */}
                    <span
                        className="
                        mt-1
                        ml-6
                        h-[2px]
                        w-8
                        rounded-full
                        bg-[#C6A15B]
                        transition-all
                        duration-500
                        group-hover:w-12
                    "
                    />

                </a>

                {/* CENTER NAVIGATION */}

               <nav
                className="
                flex
                flex-1
                justify-center
                items-center
                px-20
            "
        >

                    <div className="mx-auto flex items-center gap-28
                        max-xl:gap-20
                        max-lg:gap-14
                        max-md:hidden">

                        {NAV_LINKS.map((link) => (

                            <a
                                key={link.href}
                                href={link.href}
                                className="
                    relative
                    uppercase
                    text-[14px]
                    max-lg:text-[13px]
                    font-medium
                    tracking-[5px]
                    max-lg:tracking-[3px]
                    text-ink-700
                    font-mono

                    transition-all
                    duration-400
                    ease-out

                    hover:text-ink-900
                    hover:tracking-[6px]

                    after:absolute
                    after:left-1/2
                    after:-bottom-2
                    after:h-[1px]
                    after:w-0
                    after:bg-black
                    after:-translate-x-1/2
                    after:transition-all
                    after:duration-300

                    hover:after:w-full
                "
                            >

                                {link.label}

                            </a>

                        ))}

                    </div>

                </nav>

                {/* Cart */}

                <button
                    onClick={openDrawer}
                    aria-label="Open shopping bag"
                    className="
                        relative
                        flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        rounded-full
                        transition-all
                        duration-300
                        hover:bg-black/5
                        hover:shadow-md
                        hover:-translate-y-[1px]
                        hover:scale-105
                        
                    "
                >
                    <ShoppingBag
                        size={22}
                        strokeWidth={1.5}
                    />

                    {cartCount > 0 && (

                        <span
                            className="
                                absolute
                                -top-1
                                -right-1
                                w-5
                                h-5
                                rounded-full
                                bg-ink-900
                                text-white
                                text-[10px]
                                flex
                                items-center
                                justify-center
                                font-medium
                            "
                        >
                            {cartCount}
                        </span>

                    )}

                </button>

            </div>

        </header>
    );
}