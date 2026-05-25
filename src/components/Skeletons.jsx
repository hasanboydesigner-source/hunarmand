import React, { useState, useEffect } from 'react';
import ContentLoader from 'react-content-loader';

// Common CSS class style helper is defined in index.css:
// @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
// We use inline animation to make it fully self-contained.
const pulseStyle = {
  animation: 'pulse 1.5s infinite ease-in-out',
  background: 'var(--bg-tertiary, #f3f4f6)',
  borderRadius: '4px'
};

// Hook to track mobile view inside skeletons
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Run initially
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export const ProductCardSkeleton = ({ viewMode = 'grid' }) => {
  const isMobile = useMobile();

  if (viewMode === 'list') {
    if (isMobile) {
      // Mobile List view layout: vertical card card
      return (
        <div 
          className="product-card-list" 
          style={{ 
            padding: 12, 
            border: '1px solid var(--border-light)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 12, 
            cursor: 'default',
            background: 'var(--bg-primary)',
            width: '100%',
            alignItems: 'stretch'
          }}
        >
          <ContentLoader 
            speed={2}
            width="100%"
            height={360}
            viewBox="0 0 320 360"
            backgroundColor="var(--bg-tertiary, #f3f4f6)"
            foregroundColor="var(--bg-secondary, #e5e7eb)"
            style={{ width: "100%", height: "auto", display: "block", alignSelf: "stretch" }}
          >
            {/* Image at top */}
            <rect x="0" y="0" rx="8" ry="8" width="320" height="160" />
            
            {/* Category */}
            <rect x="0" y="180" rx="4" ry="4" width="70" height="12" />
            
            {/* Title */}
            <rect x="0" y="204" rx="6" ry="6" width="280" height="18" />
            <rect x="0" y="228" rx="6" ry="6" width="180" height="18" />
            
            {/* Description */}
            <rect x="0" y="256" rx="4" ry="4" width="320" height="10" />
            <rect x="0" y="272" rx="4" ry="4" width="240" height="10" />
            
            {/* Craftsman Info */}
            <circle cx="15" cy="305" r="12" />
            <rect x="35" y="300" rx="4" ry="4" width="120" height="10" />
            
            {/* Price & Buy Button */}
            <rect x="0" y="330" rx="4" ry="4" width="100" height="16" />
            <rect x="220" y="325" rx="8" ry="8" width="100" height="34" />
          </ContentLoader>
        </div>
      );
    }

    // Desktop List view layout: horizontal row.
    return (
      <div 
        className="product-card-list" 
        style={{ 
          padding: 16, 
          border: '1px solid var(--border-light)', 
          display: 'flex', 
          cursor: 'default',
          background: 'var(--bg-primary)',
          width: '100%',
          alignItems: 'stretch'
        }}
      >
        <ContentLoader 
          speed={2}
          width="100%"
          height={130}
          viewBox="0 0 800 130"
          backgroundColor="var(--bg-tertiary, #f3f4f6)"
          foregroundColor="var(--bg-secondary, #e5e7eb)"
          style={{ width: "100%", height: "auto", display: "block", alignSelf: "stretch" }}
        >
          {/* Image */}
          <rect x="0" y="0" rx="8" ry="8" width="130" height="130" />
          
          {/* Content */}
          <rect x="150" y="12" rx="4" ry="4" width="80" height="12" />
          <rect x="150" y="32" rx="6" ry="6" width="320" height="20" />
          <rect x="150" y="60" rx="4" ry="4" width="400" height="14" />
          
          {/* Craftsman Info */}
          <circle cx="164" cy="98" r="12" />
          <rect x="186" y="92" rx="4" ry="4" width="140" height="12" />

          {/* Right Side (Actions) */}
          <rect x="680" y="12" rx="4" ry="4" width="100" height="14" />
          <rect x="650" y="34" rx="4" ry="4" width="130" height="20" />
          
          {/* Buttons */}
          <rect x="650" y="86" rx="8" ry="8" width="130" height="36" />
        </ContentLoader>
      </div>
    );
  }

  // Grid view Mode (Desktop and Mobile are similar layout-wise)
  return (
    <div 
      className="product-card" 
      style={{ 
        padding: 0, 
        height: '100%', 
        border: '1px solid var(--border-light)', 
        cursor: 'default',
        background: 'var(--bg-primary)'
      }}
    >
      <ContentLoader 
        speed={2}
        width="100%"
        height="100%"
        viewBox="0 0 260 410"
        backgroundColor="var(--bg-tertiary, #f3f4f6)"
        foregroundColor="var(--bg-secondary, #e5e7eb)"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* Product Image */}
        <rect x="0" y="0" rx="0" ry="0" width="260" height="220" />
        
        {/* Craftsman Avatar & Details */}
        <circle cx="30" cy="250" r="16" /> 
        <rect x="56" y="238" rx="4" ry="4" width="120" height="10" />
        <rect x="56" y="254" rx="4" ry="4" width="80" height="10" />
        
        {/* Product Title */}
        <rect x="14" y="280" rx="6" ry="6" width="232" height="14" />
        <rect x="14" y="302" rx="6" ry="6" width="180" height="14" />
        
        {/* Rating */}
        <rect x="14" y="328" rx="4" ry="4" width="100" height="12" />
        
        {/* Price & Buy Button */}
        <rect x="14" y="370" rx="4" ry="4" width="110" height="20" />
        <rect x="210" y="360" rx="8" ry="8" width="36" height="36" />
      </ContentLoader>
    </div>
  );
};

export const HeroSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '0', width: '100%', maxWidth: '850px' }}>
    {/* Tag */}
    <div style={{ ...pulseStyle, width: '120px', height: '32px', borderRadius: '16px' }} />
    {/* Title */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ ...pulseStyle, width: '85%', height: '56px', borderRadius: '8px' }} />
      <div style={{ ...pulseStyle, width: '60%', height: '56px', borderRadius: '8px' }} />
    </div>
    {/* Subtitle */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
      <div style={{ ...pulseStyle, width: '75%', height: '16px' }} />
      <div style={{ ...pulseStyle, width: '50%', height: '16px' }} />
    </div>
    {/* Buttons */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
      <div style={{ ...pulseStyle, width: '180px', height: '56px', borderRadius: '999px' }} />
      <div style={{ ...pulseStyle, width: '160px', height: '56px', borderRadius: '999px' }} />
    </div>
  </div>
);

export const FeatureCardSkeleton = () => (
  <div 
    style={{ 
      background: 'var(--bg-primary)', 
      border: '1px solid var(--border-light)', 
      borderRadius: 'var(--radius-lg)', 
      padding: '24px', 
      display: 'flex', 
      alignItems: 'center',
      gap: '16px' 
    }}
  >
    <div style={{ ...pulseStyle, width: '44px', height: '44px', borderRadius: '8px', flexShrink: 0 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
      <div style={{ ...pulseStyle, width: '50%', height: '12px' }} />
      <div style={{ ...pulseStyle, width: '80%', height: '8px' }} />
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div 
    style={{ 
      background: 'var(--bg-primary)', 
      border: '1px solid var(--border-light)', 
      borderRadius: 'var(--radius-lg)', 
      padding: '18px', 
      display: 'flex', 
      alignItems: 'center',
      gap: '14px' 
    }}
  >
    <div style={{ ...pulseStyle, width: '48px', height: '48px', borderRadius: '8px', flexShrink: 0 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
      <div style={{ ...pulseStyle, width: '60%', height: '12px' }} />
      <div style={{ ...pulseStyle, width: '40%', height: '8px' }} />
    </div>
  </div>
);

export const ProductDetailSkeleton = () => {
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <div className="container" style={{ paddingTop: "20px", paddingBottom: "40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <ContentLoader 
            speed={2}
            width="100%"
            height={600}
            viewBox="0 0 320 600"
            backgroundColor="var(--bg-tertiary, #f3f4f6)"
            foregroundColor="var(--bg-secondary, #e5e7eb)"
            style={{ width: "100%", height: "auto" }}
          >
            {/* Image */}
            <rect x="0" y="0" rx="12" ry="12" width="320" height="260" />
            {/* Thumbs */}
            <rect x="0" y="272" rx="6" ry="6" width="60" height="50" />
            <rect x="70" y="272" rx="6" ry="6" width="60" height="50" />
            <rect x="140" y="272" rx="6" ry="6" width="60" height="50" />
            <rect x="210" y="272" rx="6" ry="6" width="60" height="50" />

            {/* Info */}
            <rect x="0" y="340" rx="6" ry="6" width="100" height="20" />
            <rect x="0" y="370" rx="8" ry="8" width="280" height="30" />
            <rect x="0" y="410" rx="6" ry="6" width="180" height="20" />
            <rect x="0" y="440" rx="4" ry="4" width="120" height="14" />

            {/* Price */}
            <rect x="0" y="470" rx="6" ry="6" width="120" height="32" />

            {/* Desc */}
            <rect x="0" y="520" rx="4" ry="4" width="320" height="8" />
            <rect x="0" y="534" rx="4" ry="4" width="280" height="8" />
            
            {/* Buttons */}
            <rect x="0" y="560" rx="10" ry="10" width="140" height="40" />
            <rect x="156" y="560" rx="10" ry="10" width="140" height="40" />
          </ContentLoader>
        </div>
      </div>
    );
  }

  // Desktop Detail Skeleton
  return (
    <div className="container" style={{ paddingTop: "32px", paddingBottom: "64px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "28px" }}>
        <div style={{ flex: "1 1 400px", minWidth: 0 }}>
          <ContentLoader 
            speed={2}
            width="100%"
            height={520}
            viewBox="0 0 500 520"
            backgroundColor="var(--bg-tertiary, #f3f4f6)"
            foregroundColor="var(--bg-secondary, #e5e7eb)"
            style={{ width: "100%", height: "auto", aspectRatio: "1/1.05", borderRadius: "16px" }}
          >
            <rect x="0" y="0" rx="16" ry="16" width="500" height="420" /> 
            <rect x="0" y="440" rx="8" ry="8" width="110" height="80" /> 
            <rect x="130" y="440" rx="8" ry="8" width="110" height="80" /> 
            <rect x="260" y="440" rx="8" ry="8" width="110" height="80" /> 
            <rect x="390" y="440" rx="8" ry="8" width="110" height="80" /> 
          </ContentLoader>
        </div>
        <div style={{ flex: "1 1 400px", minWidth: 0 }}>
          <ContentLoader 
            speed={2}
            width="100%"
            height={520}
            viewBox="0 0 500 520"
            backgroundColor="var(--bg-tertiary, #f3f4f6)"
            foregroundColor="var(--bg-secondary, #e5e7eb)"
            style={{ width: "100%", height: "auto" }}
          >
            <rect x="0" y="0" rx="12" ry="12" width="140" height="28" />
            <rect x="0" y="48" rx="8" ry="8" width="450" height="38" />
            <rect x="0" y="96" rx="8" ry="8" width="300" height="38" />
            <rect x="0" y="154" rx="4" ry="4" width="220" height="24" />
            
            <rect x="0" y="200" rx="8" ry="8" width="180" height="46" />
            
            <rect x="0" y="270" rx="4" ry="4" width="500" height="2" />
            <rect x="0" y="290" rx="8" ry="8" width="500" height="70" />
            
            <rect x="0" y="380" rx="8" ry="8" width="180" height="46" />
            <rect x="0" y="440" rx="12" ry="12" width="240" height="56" />
            <rect x="260" y="440" rx="12" ry="12" width="240" height="56" />
          </ContentLoader>
        </div>
      </div>
    </div>
  );
};
