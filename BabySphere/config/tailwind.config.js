module.exports = {
    theme: {
      extend: {
        animation: {
          'slide-down': 'slideDown 0.5s ease-out forwards',
        },
        keyframes: {
          slideDown: {
            '0%': { transform: 'translateY(-100%)' },
            '100%': { transform: 'translateY(0)' },
          },
        },
      },
    },
    // ... other configurations
  }
  
  