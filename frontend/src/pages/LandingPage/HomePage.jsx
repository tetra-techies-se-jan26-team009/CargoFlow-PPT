import { Navbar } from '../../components/Navbar'
import AppLayout from "../../components/AppLayout";
import { Footer } from '../../components/Footer'
import { Feature } from './Feature'
// import { Logo } from './Logo'
import { Statistic } from './Statistic'
import { MainHeroSection } from './MainHeroSection'
// import { PricingSection } from './PricingSection';
import { TestimonialSection } from './TestimonialSection';



export default function HomePage() {
    return (
        <>
            <title>Logistics Application V1</title>
            <Navbar />
            <MainHeroSection />
            <div className="min-h-screen w-full relative">
                {/* Dark White Dotted Grid Background */}
                <div
                    className="absolute inset-0 -z-10"
                    style={{
                        background: "#ffffff",
                        backgroundImage: `
                             radial-gradient(circle, rgb(128, 128, 128, 0.3) 1.5px, transparent 1.5px)
                                        `,
                        backgroundSize: "30px 30px",
                        backgroundPosition: "0 0",
                    }}
                />
                {/* Full Page Background Image */}

                {/* Your Content/Components */}

                    <Statistic />
                    <Feature />
                    <TestimonialSection />
            </div >
                <Footer />
        </>
    )
}