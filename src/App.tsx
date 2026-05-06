import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useContentStore } from '@/store/contentStore';

// Public Layout
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';

// Public Sections
import { HeroSection } from '@/sections/HeroSection';
import { ProblemCarousel } from '@/sections/ProblemCarousel';
import { AboutSection } from '@/sections/AboutSection';
import { WhyOrganiseSection } from '@/sections/WhyOrganiseSection';
import { WhyChooseSection } from '@/sections/WhyChooseSection';
import { LifeFlowSection } from '@/sections/LifeFlowSection';
import { VideoSection } from '@/sections/VideoSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { PricingSection } from '@/sections/PricingSection';
import { TestimonialSection } from '@/sections/TestimonialSection';
import { ReviewsSection } from '@/sections/ReviewsSection';
import { GallerySection } from '@/sections/GallerySection';
import { ContactSection } from '@/sections/ContactSection';
import { CertificationsSection } from '@/sections/CertificationsSection';
import { GoogleReviewsSection } from '@/sections/GoogleReviewsSection';

// New Features
import { BookingPage } from '@/sections/BookingPage';
import { QuizPage } from '@/sections/QuizPage';
import { ProductStore } from '@/sections/ProductStore';

// Admin
import {
  AdminLogin, Dashboard, ContentEditor, BookingManager,
  ServiceManager, TestimonialManager, ContactSubmissions,
  GalleryManager, QuizBuilder, SettingsManager
} from '@/admin';

function PublicLayout() {
  const { fetchContent } = useContentStore();

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ProblemCarousel />
        <AboutSection />
        <WhyOrganiseSection />
        <WhyChooseSection />
        <LifeFlowSection />
        <VideoSection />
        <ServicesSection />
        <PricingSection />
        <GoogleReviewsSection />
        <TestimonialSection />
        <ReviewsSection />
        <GallerySection />
        <ContactSection />
        <CertificationsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />} />
      <Route path="/booking" element={<><Header /><BookingPage /><Footer /></>} />
      <Route path="/quiz/:slug" element={<><Header /><QuizPage /><Footer /></>} />
      <Route path="/store" element={<><Header /><ProductStore /><Footer /></>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/content" element={<AdminRoute><ContentEditor /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><BookingManager /></AdminRoute>} />
      <Route path="/admin/services" element={<AdminRoute><ServiceManager /></AdminRoute>} />
      <Route path="/admin/testimonials" element={<AdminRoute><TestimonialManager /></AdminRoute>} />
      <Route path="/admin/contacts" element={<AdminRoute><ContactSubmissions /></AdminRoute>} />
      <Route path="/admin/gallery" element={<AdminRoute><GalleryManager /></AdminRoute>} />
      <Route path="/admin/quiz" element={<AdminRoute><QuizBuilder /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><SettingsManager /></AdminRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
