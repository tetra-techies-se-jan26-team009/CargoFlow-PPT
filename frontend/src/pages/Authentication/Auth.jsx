import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import AppLayout from "../../components/AppLayout";

export function Auth({ children }) {
  return (
    <AppLayout>
      <Navbar />

      <div className="px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="w-full max-w-6xl grid md:grid-cols-2 items-center gap-10">

          {/* Illustration */}
          <div className="hidden md:block">
            <img
              src="https://imgs.search.brave.com/haX76DiAa7Y9IWC04Tv84j8c_xtEfx411oVTPiy6KE0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/MDlmY2Y3OTJkOTVk/NTUzNWI1Y2YwYWQv/NjU1MzViYTZkNTg0/MmM5MmFmMTA5ODQ5/X1JlYWwlMjBUaW1l/JTIwVHJhY2tpbmcu/cG5n"
              alt="Auth Illustration"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Dynamic Form */}
          {children}

        </div>
      </div>

      <Footer />
    </AppLayout>
  );
}