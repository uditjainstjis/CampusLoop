import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Make sure to register the plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Initialize scroll trigger animations for the whole page
export const initScrollTrigger = () => {
  // Only run on client side
  if (typeof window === 'undefined') return;

  // Animate elements when they come into view
  gsap.utils.toArray('.animate-on-scroll').forEach((element) => {
    gsap.fromTo(
      element,
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: element,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Parallax effect for background elements
  gsap.utils.toArray('.parallax-bg').forEach((element) => {
    gsap.to(element, {
      y: () => element.getAttribute('data-speed') * (ScrollTrigger.maxScroll(window) - ScrollTrigger.scrollTop()),
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  });

  // Stagger animation for lists or grids
  gsap.utils.toArray('.stagger-group').forEach((group) => {
    const items = group.querySelectorAll('.stagger-item');
    
    gsap.fromTo(
      items,
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
          trigger: group,
          start: 'top bottom-=150',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
};

// Text reveal animation
export const animateTextReveal = (selector) => {
  const splitLines = (elem) => {
    const text = elem.innerHTML;
    let output = '';
    
    text.split('<br>').forEach((line) => {
      output += `<span class="line"><div class="line-inner">${line}</div></span>`;
    });
    
    elem.innerHTML = output;
  };
  
  document.querySelectorAll(selector).forEach((element) => {
    splitLines(element);
    
    const lines = element.querySelectorAll('.line-inner');
    
    gsap.fromTo(
      lines,
      {
        y: '100%'
      },
      {
        y: '0%',
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
};

// Card stagger animation
export const animateCards = (cardsSelector, containerSelector) => {
  const cards = document.querySelectorAll(cardsSelector);
  
  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 40
    },
    {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerSelector,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      }
    }
  );
};
