import { Navbar } from '../../components/Navbar'
import AppLayout from "../../components/AppLayout";
import { Footer } from '../../components/Footer'
import { Feature } from './Feature'

import { MainHeroSection } from './MainHeroSection'

export default function HomePage() {
    return (
        <>
            <title>Logistics Application V1</title>
            <Navbar />
            <AppLayout>
                <div className="min-h-screen w-full bg-white relative">
                    {/* Bottom Fade Grid Background */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `
                                            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                                            linear-gradient(to bottom, #e2e8f0 1px, transparent 2px)
                                        `,
                            backgroundSize: "20px 30px",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 60% 60% at 50% 100%, #000 60%, transparent 100%)",
                            maskImage:
                                "radial-gradient(ellipse 60% 60% at 50% 100%, #000 60%, transparent 100%)",
                        }}
                    />
                    {/* Your Content/Components */}
                    <MainHeroSection />
                </div>
                <div className="min-h-screen w-full bg-white relative">
                    {/* Top Fade Grid Background */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
                            backgroundSize: "20px 30px",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 60% 60% at 50% 0%, #000 60%, transparent 100%)",
                            maskImage:
                                "radial-gradient(ellipse 60% 60% at 50% 0%, #000 60%, transparent 100%)",
                        }}
                    />
                    {/* Your Content/Components */}
                    <Feature className="z-50" />
                </div>
                <Footer />
            </AppLayout>
        </>
    )
}