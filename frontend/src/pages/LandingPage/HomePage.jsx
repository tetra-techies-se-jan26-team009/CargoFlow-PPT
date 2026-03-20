import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { Feature } from './Feature'
import { Statistic } from './Statistic'
import { MainHeroSection } from './MainHeroSection'
import { TestimonialSection } from './TestimonialSection';

export default function HomePage() {
    return (
        <>
            <title>CargoFlow</title>
            <Navbar />
            <MainHeroSection />
            <Statistic />
            <Feature />
            <TestimonialSection />
            <Footer />
        </>
    )
}