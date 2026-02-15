import AppLayout from "../../components/AppLayout";
import { Footer } from '../../components/Footer'
import { Navbar } from '../../components/Navbar'


export default function Login(){
    return (
        <AppLayout>
            <Navbar />
            <h1>This is Login Page</h1>
            <Footer />
        </AppLayout>
    )
}