import React from 'react';

// Common CSS class style helper is defined in index.css:
// @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
// We use inline animation to make it fully self-contained.
const pulseStyle = {
  animation: 'pulse 1.5s infinite ease-in-out',
  background: 'var(--bg-tertiary, #f3f4f6)',
  borderRadius: '4px'
};

export const ProductCardSkeleton = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div 
        className="product-card-list skeleton-card" 
        style={{ 
          cursor: 'default',
          border: '1px solid var(--border-light)',
          background: 'var(--bg-primary)',
          width: '100%',
        }}
      >
        {/* List View Image */}
        <div className="pcl-image">
          <div style={{ ...pulseStyle, width: '100%', height: '100%', borderRadius: 0 }} />
        </div>

        {/* List View Body */}
        <div className="pcl-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ ...pulseStyle, width: '70px', height: '12px' }} />
          <div style={{ ...pulseStyle, width: '75%', height: '18px', marginTop: '4px' }} />
          <div style={{ ...pulseStyle, width: '90%', height: '12px', marginTop: '4px' }} />
          
          <div className="pc-craftsman" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ ...pulseStyle, width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ ...pulseStyle, width: '90px', height: '10px' }} />
          </div>
        </div>

        {/* List View Actions */}
        <div className="pcl-actions" style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
          <div style={{ ...pulseStyle, width: '50px', height: '12px' }} />
          <div style={{ ...pulseStyle, width: '90px', height: '16px', marginTop: '2px' }} />
          <div style={{ ...pulseStyle, width: '100px', height: '32px', borderRadius: '8px', marginTop: '8px' }} />
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className="product-card skeleton-card" 
      style={{ 
        cursor: 'default',
        height: '100%',
        border: '1px solid var(--border-light)',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Grid View Image */}
      <div className="pc-image-wrap">
        <div style={{ ...pulseStyle, width: '100%', height: '100%', borderRadius: 0 }} />
      </div>

      {/* Grid View Body */}
      <div className="pc-body" style={{ gap: '10px' }}>
        <div className="pc-craftsman">
          <div style={{ ...pulseStyle, width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <div style={{ ...pulseStyle, width: '60%', height: '10px' }} />
            <div style={{ ...pulseStyle, width: '40%', height: '8px' }} />
          </div>
        </div>

        <div style={{ ...pulseStyle, width: '90%', height: '14px', marginTop: '4px' }} />
        <div style={{ ...pulseStyle, width: '70%', height: '14px' }} />
        
        <div style={{ ...pulseStyle, width: '60px', height: '10px', marginTop: '2px' }} />
        
        <div className="pc-footer" style={{ marginTop: 'auto', paddingTop: '6px' }}>
          <div className="pc-price-block">
            <div style={{ ...pulseStyle, width: '75px', height: '16px' }} />
          </div>
          <div style={{ ...pulseStyle, width: '36px', height: '36px', borderRadius: '8px' }} />
        </div>
      </div>
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

export const ProductDetailSkeleton = () => (
  <div className="container" style={{ paddingTop: "32px", paddingBottom: "64px" }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "28px" }}>
      {/* Left Block - Image & Thumbnails */}
      <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ ...pulseStyle, width: "100%", aspectRatio: "1/1", borderRadius: "16px" }} />
        <div style={{ display: "flex", gap: "12px" }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ ...pulseStyle, flex: 1, aspectRatio: "1/1", borderRadius: "8px" }} />
          ))}
        </div>
      </div>
      
      {/* Right Block - Product Details */}
      <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ ...pulseStyle, width: "140px", height: "24px", borderRadius: "6px" }} />
        <div style={{ ...pulseStyle, width: "90%", height: "36px", borderRadius: "8px" }} />
        <div style={{ ...pulseStyle, width: "60%", height: "30px", borderRadius: "8px" }} />
        <div style={{ ...pulseStyle, width: "160px", height: "20px" }} />
        
        <div style={{ ...pulseStyle, width: "150px", height: "40px", borderRadius: "8px", marginTop: "10px" }} />
        
        <div style={{ width: "100%", height: "1px", background: "var(--border-light)", margin: "10px 0" }} />
        
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ ...pulseStyle, width: "100%", height: "14px" }} />
          <div style={{ ...pulseStyle, width: "95%", height: "14px" }} />
          <div style={{ ...pulseStyle, width: "80%", height: "14px" }} />
        </div>
        
        <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
          <div style={{ ...pulseStyle, flex: 1, height: "48px", borderRadius: "12px" }} />
          <div style={{ ...pulseStyle, flex: 1, height: "48px", borderRadius: "12px" }} />
        </div>
      </div>
    </div>
  </div>
);
