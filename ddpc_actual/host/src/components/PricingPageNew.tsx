import React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from 'shared_ui/button';

const PricingPageNew = () => {
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    padding: '3rem 1rem 2rem'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const cardBaseStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '1rem',
    border: '1px solid',
    padding: '2rem',
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    minHeight: '500px'
  };

  const freeCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  };

  const builderCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)',
    borderColor: '#fb923c',
    boxShadow: '0 20px 40px rgba(251,146,60,0.3)',
    transform: 'scale(1.05)'
  };

  const proCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    backgroundColor: '#1e293b',
    borderColor: '#475569',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    color: '#ffffff'
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ea580c',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    boxShadow: '0 4px 12px rgba(234,88,12,0.4)',
    zIndex: 10
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: 'auto'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 3rem)', 
          fontWeight: 'bold', 
          color: '#ffffff', 
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          Find the Plan That's Right for You
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#cbd5e1', 
          lineHeight: '1.6'
        }}>
          Start for free, then upgrade as you grow.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={gridStyle}>
        {/* Driver Card */}
        <div style={freeCardStyle}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Driver</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Free Tier</p>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1e293b' }}>$0</span>
              <span style={{ color: '#64748b', fontSize: '1rem', marginLeft: '0.5rem' }}>/ Free</span>
            </div>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flexGrow: 1 }}>
            {[
              '2 garage slots and basic maintenance records',
              '50 receipts per month with standard categorization', 
              'Community access and basic sharing features',
              'Strategic limitations to encourage upgrades without frustrating users',
              'You could log maintenance on the same two vehicles forever and never pay a cent'
            ].map((feature, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Check style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6', marginTop: '0.125rem', flexShrink: 0 }} />
                <span style={{ color: '#475569', fontSize: '0.875rem' }}>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button style={{ ...buttonStyle, backgroundColor: '#3b82f6', color: '#ffffff' }}
                  onClick={() => window.location.href = '/register'}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}>
            Get Started
          </button>
        </div>

        {/* Builder Card */}
        <div style={builderCardStyle}>
          <div style={badgeStyle}>
            <Star style={{ width: '1rem', height: '1rem', fill: 'currentColor' }} />
            Most Popular
          </div>
          
          <div style={{ marginBottom: '1.5rem', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#9a3412', marginBottom: '0.5rem' }}>Builder</h3>
            <p style={{ color: '#ea580c', fontSize: '0.875rem' }}>Recommended</p>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#9a3412' }}>$12.99</span>
              <span style={{ color: '#ea580c', fontSize: '1rem', marginLeft: '0.5rem' }}>/month</span>
            </div>
            <p style={{ color: '#ea580c', fontSize: '0.875rem', marginTop: '0.25rem' }}>or $129.99/year</p>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flexGrow: 1 }}>
            {[
              'Unlimited garage slots and advanced maintenance tracking',
              'Mod build lists and wishlists with detailed project planning',
              'Enhanced sharing features and community integration', 
              '500 receipts monthly with 2GB photo storage',
              'Basic analytics and insights on spending patterns'
            ].map((feature, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Check style={{ width: '1.25rem', height: '1.25rem', color: '#ea580c', marginTop: '0.125rem', flexShrink: 0 }} />
                <span style={{ color: '#9a3412', fontSize: '0.875rem' }}>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button style={{ ...buttonStyle, backgroundColor: '#ea580c', color: '#ffffff', boxShadow: '0 4px 12px rgba(234,88,12,0.3)' }}
                  onClick={() => window.location.href = '/register'}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}>
            Start Your Build
          </button>
        </div>

        {/* Pro Card */}
        <div style={proCardStyle}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f1f5f9', marginBottom: '0.5rem' }}>Pro</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Premium</p>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff' }}>$24.99</span>
              <span style={{ color: '#94a3b8', fontSize: '1rem', marginLeft: '0.5rem' }}>/month</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>or $239.99/year</p>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flexGrow: 1 }}>
            {[
              'Everything in Builder plus advanced project management',
              'Comprehensive budget tracking with detailed cost analysis',
              'Mobile app access (launching Year 1)',
              'Unlimited receipts with 10GB photo storage', 
              'Advanced analytics dashboard and export capabilities',
              'Priority email support and API access'
            ].map((feature, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Check style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', marginTop: '0.125rem', flexShrink: 0 }} />
                <span style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button style={{ ...buttonStyle, backgroundColor: '#475569', color: '#ffffff', border: '1px solid #64748b' }}
                  onClick={() => window.location.href = '/register'}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#475569'}>
            Go Pro
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          All plans include our core features. Upgrade or downgrade at any time.
        </p>
      </div>
    </div>
  );
};

export default PricingPageNew;
