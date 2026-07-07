import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var AOS: any;
declare var Typed: any;
declare var PureCounter: any;
declare var Waypoint: any;
declare var GLightbox: any;
declare var Isotope: any;
declare var imagesLoaded: any;
declare var Swiper: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  isDarkMode = false;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isDarkMode = localStorage.getItem('theme') === 'dark';
      this.updateTheme();
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
      this.updateTheme();
    }
  }

  updateTheme() {
    if (typeof document !== 'undefined') {
      if (this.isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  ngAfterViewInit() {
    // 1. Init AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }

    // 2. Init Typed.js for Typewriter Effect
    if (typeof Typed !== 'undefined') {
      const selectTyped = document.querySelector('.typed');
      if (selectTyped) {
        let typed_strings = selectTyped.getAttribute('data-typed-items');
        if (typed_strings) {
          const strings = typed_strings.split(',');
          new Typed('.typed', {
            strings: strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000
          });
        }
      }
    }

    // 3. Init PureCounter
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }

    // 4. Init Waypoints / Skills Animation Progress Bars
    if (typeof Waypoint !== 'undefined') {
      let skillsAnimation = document.querySelectorAll('.skills-animation');
      skillsAnimation.forEach((item: any) => {
        new Waypoint({
          element: item,
          offset: '80%',
          handler: function(direction: any) {
            let progress = item.querySelectorAll('.progress .progress-bar');
            progress.forEach((el: any) => {
              el.style.width = el.getAttribute('aria-valuenow') + '%';
            });
          }
        });
      });
    }

    // 5. Init GLightbox
    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox'
      });
    }

    // 6. Init Isotope Layout & Filters
    if (typeof Isotope !== 'undefined' && typeof imagesLoaded !== 'undefined') {
      document.querySelectorAll('.isotope-layout').forEach((isotopeItem: any) => {
        let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
        let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
        let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

        let initIsotope: any;
        const container = isotopeItem.querySelector('.isotope-container');
        if (container) {
          imagesLoaded(container, () => {
            initIsotope = new Isotope(container, {
              itemSelector: '.isotope-item',
              layoutMode: layout,
              filter: filter,
              sortBy: sort
            });
          });
        }

        isotopeItem.querySelectorAll('.isotope-filters li').forEach((filters: any) => {
          filters.addEventListener('click', function(this: any) {
            const activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active');
            if (activeFilter) {
              activeFilter.classList.remove('filter-active');
            }
            this.classList.add('filter-active');
            if (initIsotope) {
              initIsotope.arrange({
                filter: this.getAttribute('data-filter')
              });
            }
            if (typeof AOS !== 'undefined') {
              AOS.init();
            }
          }, false);
        });
      });
    }

    // 7. Init Swiper Slider
    if (typeof Swiper !== 'undefined') {
      document.querySelectorAll(".init-swiper").forEach((swiperElement: any) => {
        const swiperConfig = swiperElement.querySelector(".swiper-config");
        if (swiperConfig) {
          let config = JSON.parse(swiperConfig.innerHTML.trim());
          new Swiper(swiperElement, config);
        }
      });
    }

    // 8. Mobile navigation toggle listener
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', () => {
        document.querySelector('body')?.classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
      });
    }

    // 9. Hide mobile nav on clicking same-page/hash links
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          document.querySelector('body')?.classList.remove('mobile-nav-active');
          if (mobileNavToggleBtn) {
            mobileNavToggleBtn.classList.add('bi-list');
            mobileNavToggleBtn.classList.remove('bi-x');
          }
        }
      });
    });

    // 10. Navmenu Scrollspy
    let navmenulinks = document.querySelectorAll('.navmenu a');
    const navmenuScrollspy = () => {
      navmenulinks.forEach((navmenulink: any) => {
        if (!navmenulink.hash) return;
        let section = document.querySelector(navmenulink.hash);
        if (!section) return;
        let position = window.scrollY + 200;
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
          navmenulink.classList.add('active');
        } else {
          navmenulink.classList.remove('active');
        }
      });
    };
    window.addEventListener('scroll', navmenuScrollspy);
    navmenuScrollspy();

  }
}
