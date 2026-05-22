import React from 'react';

// Common CSS class style helper is defined in index.css:
// @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
// We can use inline animation to make it fully self-contained.
const pulseStyle = {
  animation: 'pulse 1.5s infinite ease-in-out',
  background: 'var(--bg-tertiary)',
  borderRadius: '4px'
};

export const ProductCardSkeleton = () => (
  <div 
    style={{ 
      background: 'var(--bg-primary)', 
      border: '1px solid var(--border-light)', 
      borderRadius: 'var(--radius-lg)', 
      padding: '16px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px' 
    }}
  >
    {/* Product Image */}
    <div style={{ ...pulseStyle, width: '100%', height: '200px', borderRadius: '12px' }} />
    
    {/* Craftsman Avatar & Details */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
      <div style={{ ...pulseStyle, width: '32px', height: '32px', borderRadius: '50%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <div style={{ ...pulseStyle, width: '60%', height: '8px' }} />
        <div style={{ ...pulseStyle, width: '40%', height: '6px' }} />
      </div>
    </div>
    
    {/* Product Title */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
      <div style={{ ...pulseStyle, width: '90%', height: '12px' }} />
      <div style={{ ...pulseStyle, width: '70%', height: '10px' }} />
    </div>
    
    {/* Rating */}
    <div style={{ ...pulseStyle, width: '80px', height: '8px', marginTop: '4px' }} />
    
    {/* Price & Buy Button */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
      <div style={{ ...pulseStyle, width: '110px', height: '18px' }} />
      <div style={{ ...pulseStyle, width: '36px', height: '32px', borderRadius: '8px' }} />
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBlock: '20px' }}>
    {/* Tag */}
    <div style={{ ...pulseStyle, width: '100px', height: '26px', borderRadius: '14px' }} />
    {/* Title */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ ...pulseStyle, width: '70%', height: '40px', borderRadius: '8px' }} />
      <div style={{ ...pulseStyle, width: '50%', height: '40px', borderRadius: '8px' }} />
    </div>
    {/* Subtitle */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
      <div style={{ ...pulseStyle, width: '60%', height: '12px' }} />
      <div style={{ ...pulseStyle, width: '45%', height: '12px' }} />
    </div>
    {/* Buttons */}
    <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
      <div style={{ ...pulseStyle, width: '160px', height: '48px', borderRadius: '8px' }} />
      <div style={{ ...pulseStyle, width: '160px', height: '48px', borderRadius: '8px' }} />
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
