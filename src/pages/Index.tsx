
import React from "react";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import HomeFooter from "@/components/home/HomeFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header/Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default Index;
