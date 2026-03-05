import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import AppLayout from "../../components/AppLayout";

export default function AboutUs() {
  return (
    <AppLayout>
    <Navbar />
    <div className="bg-background text-text">

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            About Our Logistics Company
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600">
            We simplify global logistics with reliable, fast and scalable
            transportation solutions tailored for modern businesses.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to transform logistics operations into seamless,
              tech-driven systems that empower businesses to scale efficiently.
              From warehousing to doorstep delivery, we focus on innovation,
              reliability and customer satisfaction.
            </p>
          </div>

          <div className="bg-accent rounded-2xl p-10 shadow-md">
            <h3 className="text-2xl font-semibold mb-4">
              Why Choose Us?
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li>✔ Fast & Reliable Delivery</li>
              <li>✔ Real-Time Tracking</li>
              <li>✔ Secure Warehousing</li>
              <li>✔ 24/7 Customer Support</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-6 grid sm:grid-cols-3 gap-10 text-center">
          
          <div>
            <h3 className="text-4xl font-bold text-primary">12+</h3>
            <p className="mt-2 text-gray-600">Years of Experience</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-primary">50K+</h3>
            <p className="mt-2 text-gray-600">Deliveries Completed</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-primary">99%</h3>
            <p className="mt-2 text-gray-600">Customer Satisfaction</p>
          </div>

        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">
            Meet Our Leadership
          </h2>

          <div className="grid sm:grid-cols-3 gap-10">
            {[1,2,3].map((member) => (
              <div key={member} className="bg-background p-6 rounded-xl shadow-md">
                <div className="h-32 w-32 mx-auto rounded-full bg-secondary mb-6" />
                <h4 className="text-lg font-semibold">Team Member</h4>
                <p className="text-gray-600 text-sm">Operations Head</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-accent text-center">
        <h2 className="text-3xl font-semibold">
          Ready to streamline your logistics?
        </h2>
        <p className="mt-4">
          Partner with us and experience seamless supply chain management.
        </p>
        <button className="mt-8 bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
          Contact Us
        </button>
      </section>

    </div>
    <Footer />
    </AppLayout>
  );
}