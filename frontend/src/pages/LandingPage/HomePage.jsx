import { Navbar } from '../../components/Navbar'
import AppLayout from "../../components/AppLayout";
import { Footer } from '../../components/Footer'
import { Feature } from './Feature'
import { Banner } from './Banner'
import {Logo } from './Logo'
import { Statistic } from './Statistic'
import { MainHeroSection } from './MainHeroSection'

export default function HomePage() {
    return (
        <>
            <title>Logistics Application V1</title>

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
                {/* Your Content/Components */}
                <Banner />
                <Navbar />
                <AppLayout>
                    <MainHeroSection />
                    <Logo />
                </AppLayout>
                <AppLayout>
                    <Statistic className="" />
                    <Feature className="z-50" />
                </AppLayout>
            </div >

            <AppLayout>
                {/* <div className="min-h-screen w-full bg-[#f9fafb] relative"> */}
                    {/* Diagonal Fade Grid Background - Top Left */}
                    {/* <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
                            backgroundSize: "32px 32px",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 80% 80% at 0% 0%, #000 30%, transparent 50%)",
                            maskImage:
                                "radial-gradient(ellipse 80% 80% at 0% 0%, #000 30%, transparent 50%)",
                        }}
                    /> */}
                    {/* Your Content/Components */}
                    {/* <Feature className="z-50" /> */}
                {/* </div> */}
                <Footer />
            </AppLayout>
        </>
    )
}