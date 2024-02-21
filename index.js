function isTouchDevice() {
  return ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);
}

const remToPixels = (rem) => rem * 16;

/* cookie banner */
let cookieBanner = document.querySelector('.cookie-banner'), 
    cookieButton = document.querySelector('.cookie-banner__button');

document.addEventListener('DOMContentLoaded', function() {
	if(cookieBanner) {
    if (Cookies.get('cookieBannerDismissed')) {
      cookieBanner.parentNode.removeChild(cookieBanner);
    } else {
      cookieBanner.style.pointerEvents = 'all';
      cookieBanner.style.opacity = '1';
    }

    cookieButton.addEventListener('click', function() {
      cookieBanner.style.opacity = '0';

      setTimeout(() => {
        cookieBanner.parentNode.removeChild(cookieBanner);
        Cookies.set('cookieBannerDismissed', true);
      }, '300');
    });
  }
});


/* hide cursor when exiting the window */
$(window).on('mouseenter', function(){
  $('.cursor-wrapper').css('opacity', '1');
});

$(window).on('mouseout', function(){
  $('.cursor-wrapper').css('opacity', '0');
});


/* reload automatically, script that needs to be updated on resize */
let resizeTimeout;

function debounce(func, delay) {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(func, delay); 
} 
//the indiviual resize is being checked on afterEnter of each page, so i don't call the script in the wrong page

/* register the gsap plugins */
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(CustomEase);

CustomEase.create('asset-index', '0,0,0,1');
CustomEase.create('blinking-line', '.25, 0, .15, 1');
CustomEase.create('splitLines', '.4, 0, 0, 1');
  
const cleanGSAP = () => {
	ScrollTrigger.getAll().forEach(t => t.kill(false));
	ScrollTrigger.refresh();
};


/* barba configs */
barba.hooks.beforeEnter(function() { //only things that are common to all pages
  cleanGSAP()
  customCursors()
	currentYear()
})
   
barba.hooks.after(function(data) {
  resetWebflow(data);

  if (!isTouchDevice()) { 
    hoverTyping();
  }
});

let scrollY = 0; //set initial scroll position for page change

/* search animation related */
const searchLottie = document.getElementById('search-icon'),
  searchOpen = document.querySelector('.navbar__search'),
  searchClose = document.querySelector('.search-leave-animation');

if(searchLottie) {
  searchOpen.addEventListener('click', function(){
    searchLottie.setDirection(1);
    searchLottie.play();
  });
}
  
barba.init({
  prefetchIgnore: true,
  preventRunning: true,
  cacheIgnore: true,
  views: [{
    namespace: 'home',
    beforeEnter() {
      homepageHeroLines()
      homepageHeroDesktop()
      projectsIndex()
    }, 
    afterEnter() {
      //flag resize
      function homepageResize() {
        homepageHeroLines();
        homepageHeroDesktop();
        //homepageHeroMobile();
        projectsIndex();
      }
      window.addEventListener('resize', function () {
        debounce(homepageResize, 1000); // 1 second delay after resize
      });
    }
  }, {
    namespace: 'projects',
    beforeEnter() {
      iframePoster()
      stickyReturn()
      projectsSwiper()
      scrollDownAnimation()
      videoComponent()
    }, 
    afterEnter() {
      document.querySelector('.project-hero').style.opacity = '1';
      projectsNavigation()
      projectSrollAnimations()

      //flag resize
      function projectResize() {
        scrollDownAnimation();
        stickyReturn();
      }
      window.addEventListener('resize', function () {
        debounce(projectResize, 1000); // 1 second delay after resize
      });
    }
  }, {
    namespace: 'objects',
    beforeEnter() {
      iframePoster()
      objectsHeroDesktop()
      objectsHeroLines()
      objectsIndex()
      enquireHover()
      objectsEnquire()
    }, 
    afterEnter() {
      //flag resize
      function objectsResize() {
        objectsHeroLines();
        objectsHeroDesktop();
        objectsIndex();
        enquireHover();
        objectsEnquire()
      }
      window.addEventListener('resize', function () {
        debounce(objectsResize, 1000); // 1 second delay after resize
      });
    }
  },{
    namespace: 'objects-single',
    beforeEnter() {
      iframePoster()
      objectsDownload()
      carouselAnimation()
    }, 
    afterEnter() {
      objectsSwiper()

      //flag resize
      function objectSingleResize() {
        objectsSwiper();
      }
      window.addEventListener('resize', function () {
        debounce(objectSingleResize, 1000); // 1 second delay after resize
      });
    }
  }, {
    namespace: 'about',
    beforeEnter() {
      iframePoster()
      aboutIndexes()
      locationHover()
      aboutSectionsHover() //only for the 2 cols
    }, 
    afterEnter() {
      aboutVideo()

      //flag resize
      function aboutResize() {
        aboutIndexes();
      }
      window.addEventListener('resize', function () {
        debounce(aboutResize, 1000); // 1 second delay after resize
      });
    }
  }, {
    namespace: 'search',
    beforeEnter() {
      searchEnter()
      search()
    },
  }, {
    namespace: 'error',
    beforeEnter() {
      errorPage()
    }
  }],
  transitions: [
  {
    name: 'default-transition',
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0
      });
    },
    enter(data) {
      gsap.defaults({
        ease: 'power2.inOut',
        duration: 1,
      });
  
      data.next.container.classList.add('fixed');
      
	    showScrollbar(); //show scrollbar, hidden on objects carousel
      
      //reveal page 
      return gsap.fromTo(
        data.next.container,
        { opacity: 0 }, 
        {	
          opacity: 1, 
          onStart: () => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          },
          onComplete: () => {
            data.next.container.classList.remove('fixed');

            setTimeout(() => { //show hero on project singles
              if(document.querySelector('.project-hero')) {
                document.querySelector('.project-hero').style.opacity = '1';
              }
            }, 100);
          }
        }
      );
    }
  },
  {
    name: 'project-enter',
    from: { 
      namespace: ['home']
    },
    to: { 
      namespace: ['projects']
    },
    leave(data) {
      scrollY = barba.history.current.scroll.y;

      return gsap.to(data.current.container, {
        opacity: 0
      });
    },
    enter(data) {
      gsap.defaults({
        ease: 'power2.inOut',
        duration: 1,
      });
  
      data.next.container.classList.add('fixed');
      
      //reveal page 
      return gsap.fromTo(
        data.next.container,
        { opacity: 0 }, 
        {	
          opacity: 1, 
          onStart: () => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          },
          onComplete: () => {
            data.next.container.classList.remove('fixed');
          }
        }
      );
    }
  },
  {
    name: 'project-leave',
    from: { 
      namespace: ['projects']
    },
    to: { 
      namespace: ['home']
    },
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0,
        display: 'none' //so you can see the new container opacity changing without position fixed
      });
    },
    enter(data) {
      gsap.defaults({
        ease: 'power2.inOut',
        duration: 1,
      });

      //reveal page 
      return gsap.fromTo(
        data.next.container,
        { opacity: 0 }, 
        {	
          opacity: 1, 
          onStart: () => {
            window.scrollTo({
              top: scrollY,
              left: 0,
            });
          },
        }
      );
    }
  }, 
	{
    name: 'objects-enter',
    from: { 
      namespace: ['objects']
    },
    to: { 
      namespace: ['objects-single']
    },
    leave(data) {
      scrollY = barba.history.current.scroll.y;
    
      return gsap.to(data.current.container, {
        opacity: 0
      });
    },
    enter(data) {
      gsap.defaults({
        ease: 'power2.inOut',
        duration: 1,
      });  
  
      data.next.container.classList.add('fixed');
      
      hideScrollbar(); //hide scrollbar
      
      //reveal page 
      return gsap.fromTo(
        data.next.container,
        { opacity: 0 }, 
        {	
          opacity: 1, 
          onStart: () => {
            window.scrollTo({
              top: 0,
              left: 0,
            });
          },
          onComplete: () => {
            data.next.container.classList.remove('fixed');
          }
        }
      );
    }
    },
    {
      name: 'objects-leave',
      from: { 
        namespace: ['objects-single']
      },
      to: { 
        namespace: ['objects']
      },
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          display: 'none' //so you can see the new container opacity changing without position fixed
        });
      },
      enter(data) {
        gsap.defaults({
          ease: 'power2.inOut',
          duration: 1,
        });
  
        //reveal page 
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 }, 
          {	
            opacity: 1, 
            onStart: () => {
              window.scrollTo({
                top: scrollY,
                left: 0,
              });
            },
          }
        );
      }
    }, 
    {
      name: 'search-enter',
      to: { 
        namespace: ['search']
      },
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0
        });
      },
      enter(data) {  
        gsap.defaults({
          ease: 'power2.inOut',
          duration: 1,
        });
    
        data.next.container.classList.add('fixed'); 

        //reveal page 
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 }, 
          {	
            opacity: 1, 
            onStart: () => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
              });
            },
            onComplete: () => {
              data.next.container.classList.remove('fixed');
            }
          }
        );
      }
    },
    {
      name: 'search-leave',
      from: { 
        namespace: ['search']
      },
      leave(data) {    
        searchLottie.setDirection(-1);
        searchLottie.play();

        return gsap.to(data.current.container, {
          opacity: 0, 
          y: -50,
          onComplete: () => {
            document.querySelector('.search-input__wrapper').classList.remove('active');
            document.querySelector('.navbar__search').removeEventListener('click', searchIconHandler);
          }
        });
      },
      enter(data) {
        gsap.defaults({
          ease: 'power2.inOut',
          duration: 1
        });
    
        data.next.container.classList.add('fixed');
        
        //reveal page 
        return gsap.fromTo(
          data.next.container,
          { opacity: 0 }, 
          {	
            opacity: 1, 
            onStart: () => {
              window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
              });
            },
            onComplete: () => {
              data.next.container.classList.remove('fixed');
            }
          }
        );
      }
    }
  ]
});


/* Smooth scroll */
const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


/* For transitions */
function resetWebflow(data) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data.next.html, "text/html");
  const webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
  document.querySelector("html").setAttribute("data-wf-page", webflowPageId);
  if (window.Webflow) {
    window.Webflow.destroy();
    window.Webflow.ready();
    window.Webflow.require("ix2").init();
  }
}


/* Logo interaction */
if (!isTouchDevice()) {
  let text = new SplitText('.navbar__logo', { type: "chars" }),
    letters = text.chars;

  gsap.utils.toArray(letters).forEach(function(letter, index) {
    letter.addEventListener('mouseenter', () =>{
      gsap.to(letter, {
        y: -3,
        x: 2,
        duration: 0.2,
        onStart: function() {
          letter.classList.add('active');
        },
      })

      //animate the previous letter if it exists
      if (index > 0) {
        const prevLetter = letters[index - 1];

        gsap.to(prevLetter, {
          y: -2,
          x: 1,
          duration: 0.2,
          onStart: function() {
            prevLetter.classList.add('active');
          },
        });

        //animate the 2nd previous letter if it exists
        if (index > 1) {
          const prevLetter2 = letters[index - 2];
          gsap.to(prevLetter2, {
            y: -1,
            x: 0,
            duration: 0.2,
            onStart: function() {
              prevLetter2.classList.add('active');
            },
          });
        }
      }

      //animate the next letter if it exists
      if (index < letters.length - 1) {
        const nextLetter = letters[index + 1];
      
        gsap.to(nextLetter, {
          y: -2,
          x: 1,
          duration: 0.2,
          onStart: function() {
            nextLetter.classList.add('active');
          },
        });

        //animate the 2nd next letter if it exists
        if (index < letters.length - 2) {
          const nextLetter2 = letters[index + 2];
          gsap.to(nextLetter2, {
            y: -1,
            x: 0,
            duration: 0.2,
            onStart: function() {
              nextLetter2.classList.add('active');
            },
          });
        }
      }
    });

    letter.addEventListener('mouseleave',  () =>{
      //reset animation for the current letter
      gsap.to(letter, {
        y: 0,
        x: 0,
        duration: 0.2,
        onStart: function() {
          letter.classList.remove('active');
        },
      });

      //reset animation for the previous letter if it exists
      if (index > 0) {
        const prevLetter = letters[index - 1];
      
        gsap.to(prevLetter, {
          y: 0,
          x: 0,
          duration: 0.2,
          onStart: function() {
            prevLetter.classList.remove('active');
          },
        });

        //reset animation for the 2nd previous letter if it exists
        if (index > 1) {
          const prevLetter2 = letters[index - 2];
          gsap.to(prevLetter2, {
            y: 0,
            x: 0,
            duration: 0.2,
            onStart: function() {
              prevLetter2.classList.remove('active');
            },
          });
        }
      }

      //reset animation for the next letter if it exists
      if (index < letters.length - 1) {
        const nextLetter = letters[index + 1];
        
        gsap.to(nextLetter, {
          y: 0,
          x: 0,
          duration: 0.2,
          onStart: function() {
            nextLetter.classList.remove('active');
          },
        });

        //reset animation for the 2nd next letter if it exists
        if (index < letters.length - 2) {
          const nextLetter2 = letters[index + 2];
          gsap.to(nextLetter2, {
            y: 0,
            x: 0,
            duration: 0.2,
            onStart: function() {
              nextLetter2.classList.remove('active');
            },
          });
        }
      }
    });
  });
}

/* Remove blinking spans from touch devices */
if (isTouchDevice()) {
  let blinkingSpans = document.querySelectorAll('.blinking-span'),
    nestedBlinking = document.querySelectorAll('.nested-blinking-span');

  let allBlinks = [...blinkingSpans].concat([...nestedBlinking]);

  allBlinks.forEach(function(el) {
    el.remove();
  })
}

/* Typing hover interaction */ 
function hoverTyping() {
  const hoverEls = document.querySelectorAll('[data-hover="type"]');
        
  hoverEls.forEach((element) => {
    let splitText = new SplitText(element, { type: 'words,chars' });
    let chars = splitText.chars;

    let elementTimeline = gsap.timeline({ paused: true });
    elementTimeline.addLabel('start');

    element.addEventListener('mouseenter', () => {
      if (!elementTimeline.isActive()) {
        elementTimeline.clear().seek('start'); //so it always finishes

        elementTimeline.from(chars, {
          duration: 0.01,
          opacity: 0,
          ease: 'none',
          stagger: 0.05,
        });

        elementTimeline.play();
      }
    });
  });
}

if (!isTouchDevice()) { //so it works when there's no barba action too
  hoverTyping();
}


/** CURSOR */
function customCursors() {
  const cursors = document.querySelector('.cursor-wrapper');
  const customCursors = document.querySelectorAll('[data-cursor]');

  document.querySelectorAll('a, button, [data-cursor-hover="true"], .proj-16x9-video, .proj-1x1-video, .proj-4x5-video, .proj-9x16-video, .proj-wide-video,  [data-animation-type="spline"]').forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursors.style.opacity = '0';
    });
  
    element.addEventListener('mouseleave', () => {
      cursors.style.opacity = '1';
    });

    /* so elements inside don't trigger the cursor */
    element.querySelectorAll('*').forEach(descendant => {
      descendant.addEventListener('mouseenter', () => {
        cursors.style.opacity = '0';
      });
      descendant.addEventListener('mouseleave', () => {
        cursors.style.opacity = '1';
      });
    });
  });
  
  if (!isTouchDevice()) {
    // move the cursors with the mouse position
    document.addEventListener('pointermove', (e) => {
      cursors.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
    });
  
    // check if a custom cursor is needed
    customCursors.forEach(element => {
      element.addEventListener('mouseenter', () => {
        toggleCursorDefault();

        const cursorType = element.dataset.cursor;
        const cursor = document.querySelector('.cursor-' + cursorType);

        cursor.style.display = 'block';

        if(cursorType=='carousel') {
          let carousel =  element.querySelector('.swiper'),
            carouselName = carousel.dataset.carouselName,
            totalSlides = carousel.querySelectorAll('.swiper-slide').length,
            currentSlide = 1;
          
          function addZero(number, length) {
            return number.toString().padStart(length, '0');
          }

          carousel.querySelectorAll('.swiper-slide').forEach((slide, index) => {
            slide.addEventListener('mouseenter', () => {
              currentSlide = index + 1; 
              document.querySelector('.cursor-carousel .current-slide').innerHTML = addZero(currentSlide, 2) + '/';
            });
          });

          if(carouselName) { document.querySelector('.cursor-carousel .carousel-name').innerHTML = carouselName; }
          document.querySelector('.cursor-carousel .total-slides').innerHTML = addZero(totalSlides, 2);
          document.querySelector('.cursor-carousel .current-slide').innerHTML = currentSlide + '/';
        }
      });

      element.addEventListener('mouseleave', () => {
        const cursors = document.querySelectorAll('.cursor');

        cursors.forEach(element => {
          element.style.display = 'none';
        });

        toggleCursorDefault();
      });
    });

    // toggle default cursor visibility
    function toggleCursorDefault(){
      const cursor = document.querySelector('.cursor-default');

      if (cursor.style.display === 'none') {
        cursor.style.display = 'block';
      } else {
        cursor.style.display = 'none';
      }
    }
  } else {
    cursors.style.display = 'none'; //hide all cursors on mobile
  }
}

function iframePoster() {
	document.querySelectorAll("[data-vimeo-poster='true']").forEach(function(componentEl) {
    const iframeEl = componentEl.querySelector('iframe');
    let player = new Vimeo.Player(iframeEl);

    player.on('play', function() {
      iframeEl.style.opacity = 1;
    });
	})
}

function currentYear() {
  let copyrightYear = document.querySelectorAll('.copyright_year'),
    currentYear = new Date().getFullYear();

  copyrightYear.forEach((el) => { //because there will be more than 1 when transition barbajs, the after hook doesn't work for some reason
    el.textContent = currentYear;
  })
}

/* hide/show scrollbar, used for objects singles carousel */
function hideScrollbar() {
  document.body.classList.add('hide-scrollbar');
}
function showScrollbar() {
  document.body.classList.remove('hide-scrollbar');
}
  
/** HOMEPAGE */
function homepageHeroLines() {
  const homepageHeroText = document.querySelector('.hero__clients-collection');

  if (window.matchMedia('(min-width: 992px)').matches) {
    gsap.set(homepageHeroText, { opacity: 1} )

    const splitLines = new SplitText(homepageHeroText, {
      type: 'lines',
      linesClass: 'line line++'
    });

    gsap.from(splitLines.lines, {
      yPercent: 100,
      duration: 0.6,
      opacity: 0,
      stagger: 0.1,
      ease: 'splitLines',
      onComplete() {
        gsap.set(splitLines.lines, { clearProps: 'all' });
      }
    });
  } else {
    gsap.set(homepageHeroText, { opacity: 1} )

    const lines = homepageHeroText.querySelectorAll('.hero__client-wrapper');

    gsap.from(lines, {
      yPercent: 100,
      duration: 0.6,
      opacity: 0,
      stagger: 0.05,
      ease: 'splitLines',
    });
  }
}

function homepageHeroDesktop() { 
  if (window.matchMedia('(min-width: 992px)').matches) {
    //the hover effect to not trigger the "sensitive" area with css
    $('.hero__client-link').hover(function() {
      $('.hero__client-link').not(this).addClass('inactive');
    }, function() {
      $('.hero__client-link').removeClass('inactive');
    });

    const clients = document.querySelectorAll('.hero__client-wrapper'); //get all clients elements

    clients.forEach((el) => {
      let clientName = el.querySelector('.hero__client-text');

      let assetContainer = el.querySelector('.hero__client-background'), 
        video =  assetContainer.querySelector('video'),
        loader = el.querySelector('.hero__client-loader'),
        isVideoLoaded = false,
        isMouseOver = false; //so videos dont play right away when they're ready, only when hovered

      if(video) {
        if (video.readyState >= 2) { //the video was loaded already
          isVideoLoaded = true;
          checkMouseOver();
        } else {
          video.addEventListener('canplay', function() { //the video is loaded for the 1st time 
            isVideoLoaded = true;
            checkMouseOver();
          });
        }
      } else {
        isVideoLoaded = true
      }

      el.addEventListener('mouseover', () => {
        isMouseOver = true; 
        checkMouseOver();
      });
      
      el.addEventListener('mouseout', () => {
        isMouseOver = false;
        loader.style.opacity = 0;

        assetContainer.style.opacity = 0;
        clientName.style.color = '#070707';

        if(video) {
          video.pause();
        }
      });

      function checkMouseOver() {
        if (isMouseOver) {  
          if (!isVideoLoaded) { //if video is not loaded
            loader.style.opacity = 1;
          } else {
            loader.style.opacity = 0; //video loaded, hide loader

            if (clientName.getAttribute('data-hover') === 'light') {
              clientName.style.color = '#f8f8f8';
            }

            if(video) {
              video.play();
            }

            assetContainer.style.opacity = 1;
          }
        }
      }
    });
  }
}

// function homepageHeroMobile() {
//   if (window.matchMedia('(max-width: 991px)').matches) {
//     const clients = document.querySelectorAll('.hero__client-wrapper');

//     let tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: '.homepage__hero',
//         pin: true,
//         scrub: 2,
//         anticipatePin: 1,
//         //markers: true,
//       }
//     });

//     clients.forEach((client, i) => {
//       let image = client.querySelector('.hero__client-background');

//       tl.to(image, { duration: 2, opacity: 1 }) // Fade in
//         .to(image, { duration: 2, opacity: 0 }, "+=2") // Fade out
//         .to(image, { duration: 0.1, opacity: 0 }); // Ensure the last image is hidden
//    });
//   }
// }

function projectsIndex() {
  if (window.matchMedia('(min-width: 992px)').matches) {
    const projectsContainer = document.querySelector('[data-index="projects"]');
    const projects = document.querySelectorAll('.project-index__link'); //get all projects inside the list
    const assetContainer = document.querySelector('.project-index__asset-wrapper'); //get the wrapper for the asset
  
    //opacity animation for the asset container
    projectsContainer.addEventListener('mouseenter', () => {
      let firstMouseMove = true;

      projectsContainer.addEventListener('mousemove', function (e) { //no mousemove, mexe o asset container
        if (firstMouseMove) {
          assetContainer.style.top = '0';
          assetContainer.style.left = '0';
          firstMouseMove = false;
        }

        assetContainer.style.transform = `translate(${e.clientX + 20}px, ${e.clientY + 20}px)`;
      });

      gsap.to(assetContainer, {
        autoAlpha: 1,
        duration: 0.25,
        ease: 'blinking-line',
      });
    });

    projectsContainer.addEventListener('mouseleave', () => {
      gsap.to(assetContainer, {
        autoAlpha: 0,
        duration: 0.25,
        ease: 'blinking-line',
      });
    })

    //animation for each project line - asset change
    projects.forEach((el) => { //em cada item da lista 
      const assetWrapper = document.querySelector('.project-index__assets'); //vou buscar o container do asset
      let isVideoPlaying;
      let singleUrl = el.getAttribute('href');

      el.addEventListener('click', () => {
        barba.prefetch(singleUrl);
      });

      el.addEventListener('mouseenter', () => { //no mouseenter
        let projectImage = el.querySelector('input[name="project-image"]').value, //valor da imagem 
          projectVideo = el.querySelector('input[name="project-video"]').value; //valor do video id
        
        if(projectVideo) { //se existir vídeo
          let vimeoWrapper = document.createElement('div');
            vimeoWrapper.className = 'vimeo-wrapper';
            vimeoWrapper.style.background = 'url(' + projectImage + ') center/cover no-repeat';

          let iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.position = 'relative';
            iframe.src = 'https://player.vimeo.com/video/' + projectVideo + '?background=1&quality=720p&autoplay=1';
            iframe.allow = 'autoplay';
            iframe.setAttribute('webkitallowfullscreen', '');
            iframe.setAttribute('mozallowfullscreen', '');
            iframe.setAttribute('allowfullscreen', '');

          //create the element
          vimeoWrapper.appendChild(iframe);

          let projectAsset = document.createElement('div');
            projectAsset.className = 'project-index__asset';
            projectAsset.appendChild(vimeoWrapper);

          document.querySelector('.project-index__assets').appendChild(projectAsset); //create the element inside the container

          projectAsset.style.zIndex = 2;

          gsap.set(projectAsset, { autoAlpha: 1 }); 

          gsap.to(projectAsset, {
            scale: 1.05,  
            duration: 0.5,
            ease: 'asset-index',
          });
    
          let player = new Vimeo.Player(iframe);

          player.on('play', function() {
            vimeoWrapper.style.backgroundImage = 'none';
            iframe.style.opacity = 1;
            isVideoPlaying = true; 
          });

          player.play().catch(function (error) {
            console.error('Failed to play video:', error);
            isVideoPlaying = false; //set this to false if play failed
          });
        } else if(projectImage) { //se existir imagem 
          let img = document.createElement('img');
            img.src = projectImage;
            img.className = 'project-index__asset';

          document.querySelector('.project-index__assets').appendChild(img);

          img.style.zIndex = 2;

          gsap.set(img, { autoAlpha: 1 }); 

          gsap.to(img, {
            scale: 1.05,  
            duration: 0.5,
            ease: 'asset-index',
          });
        }
      });

      el.addEventListener('mouseleave', () => {
        let projectAsset = document.querySelector('.project-index__asset:first-of-type');
        
        if (projectAsset) {
          projectAsset.style.zIndex = 1;
        
          gsap.to(projectAsset, {
            autoAlpha: 0,
            scale: 1,
            duration: 0.5,
            ease: 'asset-index',
            onComplete: function() {
              //not working with the varibale
              document.querySelector('.project-index__asset:first-of-type').remove();
            },
          });

          if (isVideoPlaying) {
            isVideoPlaying = false;
          }
        }
      });
    });
  }
}


/** PROJECTS */
function scrollDownAnimation() {
  if (window.matchMedia('(min-width: 992px)').matches) {
    setTimeout(() => { //wait for barbajs transition
      let scrollEl = document.querySelector('.btn-project-scroll');

      scrollEl.addEventListener('mouseenter', function() { 
        gsap.to('.btn-project-scroll__word', {
          duration: 0.4,
          y: 10,
          ease: 'power1.inOut',
          stagger: 0.1,
        });
      });

      scrollEl.addEventListener('mouseleave', function() {
        gsap.to('.btn-project-scroll__word', {
          duration: 0.4,
          y: 0,
          ease: 'power1.inOut',
          stagger: 0.1,
        });
      });

      document.querySelector('.btn-project-scroll').addEventListener('click', function () {
        const scrollPin = document.querySelector('.scroll-to-placeholder');
        window.scrollTo({
          top: scrollPin.offsetTop - 110,
          behavior: 'smooth'
        });
      });
    }, 1000); 
  }
}
  
function projectsSwiper() {
  new Swiper('.proj-general-carousel__wrapper', {
    loop: true,
    slidesPerView: 1.1,
    spaceBetween: 10,
    height: 'auto',
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    }
  });

  new Swiper('.proj-16x9-carousel__wrapper', {
    loop: true,
    slidesPerView: 1.1,
    spaceBetween: 10,
    height: 'auto',
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 1,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    }
  });

  new Swiper('.proj-9x16-carousel3__wrapper', {
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 10,
    height: 'auto',
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 3,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    }
  });

  new Swiper('.proj-9x16-carousel2__wrapper', {
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 10,
    height: 'auto',
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    }
  });

  new Swiper('.proj-4x5-carousel2__wrapper', {
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 10,
    height: 'auto',
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    }
  });

  new Swiper('.proj-1x1-carousel__wrapper', {
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 10,
    height: 'auto',
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    }
  });

  new Swiper('.proj-similar__wrapper', {
    slidesPerView: 1.1,
    spaceBetween: 10,
    height: 'auto',
    breakpoints: {
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    },
    on: {
      click: function () {
        this.slideNext();
      },
    }
  });
}
    
function videoComponent() {
  document.querySelectorAll("[js-vimeo-element='component']").forEach(function(componentEl) {
    const iframeEl = componentEl.querySelector("iframe");
    const coverEl = componentEl.querySelector("[js-vimeo-element='cover']");
    const coverImage = componentEl.querySelector("[js-vimeo-element='media']");
    const timeline =  componentEl.querySelector(".proj-video-timeline");

    let player = new Vimeo.Player(iframeEl);

    player.on('play', function() {
      componentEl.classList.add('is-playing');
    });

    player.on('pause', function() {      
      componentEl.classList.remove('is-playing');
      coverEl.style.cssText = 'opacity: 1;';
    });

    coverEl.addEventListener('click', function() { // when clicking the cover 
      coverEl.style.cssText = 'opacity: 0;';
      coverImage.style.cssText = 'opacity: 0';

      if (componentEl.classList.contains('is-playing')) {
        player.pause();
      } else {
        player.play();
      }
    });

    // update timeline
    player.getDuration().then(function(duration) {
      setInterval(updateTimelineBar, 100, duration);
    });
    
    function updateTimelineBar(duration) {
      player.getCurrentTime().then(function(time) {
        var progress = (time / duration) * 100;
        timeline.style.width = progress + '%';
      })
    }
  });
}

function stickyReturn() { 
  if (window.matchMedia('(min-width: 768px)').matches) { //from tablet on
    setTimeout(() => { //wait for the barbajs finish the transition
      let heroButtons = document.querySelector('.project-hero__buttons'),
        backButton = heroButtons.querySelector('.project-hero__back');

      ScrollTrigger.create({
        trigger: heroButtons,
        start: 'top-=12.5rem top',
        end: ScrollTrigger.maxScroll(window),
        // markers: true,
        onEnter: () => backButton.classList.add('sticky'),
        onEnterBack: () => backButton.classList.add('sticky'),
        onLeave: () => backButton.classList.remove('sticky'),
        onLeaveBack: () => backButton.classList.remove('sticky')
      });
    }, 1000);
  }
}

function projectsNavigation() {
  const currentUrl = window.location.href;
  const currentSlug = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
 
  $('<div />').load('/', function(data) {
    let allProjects = $(data).find('.homepage__projects');
    let currentProject = allProjects.find('[href$="' + currentSlug + '"]').closest('.projects-index'),
      prevProject = allProjects.find('.projects-index').eq(currentProject.index() - 1),
      prevAssets = allProjects.find('.project-index__data').eq(currentProject.index() - 1),
      nextProject = allProjects.find('.projects-index').eq(currentProject.index() + 1),
      nextAssets = allProjects.find('.project-index__data').eq(currentProject.index() + 1);

    let prevTitle = prevProject.find('.project-info__title p:last-of-type').text(),
      prevYear = prevProject.find('.project-info__year').text(), 
      prevImage = prevAssets.find('input[name="project-image"]').val(),
      prevUrl = prevProject.find('.project-index__link').attr('href');

    let nextTitle = nextProject.find('.project-info__title p:last-of-type').text(),
      nextYear = nextProject.find('.project-info__year').text(), 
      nextImage = nextAssets.find('input[name="project-image"]').val(),
      nextUrl = nextProject.find('.project-index__link').attr('href');

    document.querySelector('.proj-others__wrapper[data-proj-others="prev"]').href = prevUrl;
    document.querySelector('.proj-others__image[data-proj-others="prev"]').src = prevImage;
    document.querySelector('.proj-others__name[data-proj-others="prev"]').innerHTML = prevTitle;
    document.querySelector('.proj-others__year[data-proj-others="prev"]').innerHTML = prevYear;

    document.querySelector('.proj-others__wrapper[data-proj-others="next"]').href = nextUrl;
    document.querySelector('.proj-others__image[data-proj-others="next"]').src = nextImage;
    document.querySelector('.proj-others__name[data-proj-others="next"]').innerHTML = nextTitle;
    document.querySelector('.proj-others__year[data-proj-others="next"]').innerHTML = nextYear;    
  });
}

function projectSrollAnimations() {
  setTimeout(() => {
    const sectionsLines = ['.proj-text-col6', '.proj-text-col8', '.proj-text-block'];

    const sections = [
      '.proj-text-intro',
      '.proj-text-caption',
      '.proj-credits',
      '.proj-credits-inline',
      '.proj-16x9-col6',
      '.proj-16x9-col10',
      '.proj-16x9-col12',
      '.proj-16x9-gallery2',
      '.proj-16x9-gallery3',
      '.proj-16x9-gallery4',
      '.proj-general-full',
      '.proj-general-carousel',
      '.proj-16x9-col10-carousel',
      '.proj-16x9-col12-carousel',
      '.proj-9x16-col4',
      '.proj-16x9-video',
      '.proj-9x16-col8-gallery2',
      '.proj-9x16-col10-gallery2',
      '.proj-9x16-gallery3',
      '.proj-9x16-gallery2',
      '.proj-9x16-carousel3',
      '.proj-9x16-carousel2',
      '.proj-9x16-video',
      '.proj-1x1-col3',
      '.proj-1x1-col4',
      '.proj-1x1-col6',
      '.proj-1x1-col10',
      '.proj-1x1-col12',
      '.proj-1x1-gallery2',
      '.proj-1x1-gallery4',
      '.proj-1x1-carousel',
      '.proj-1x1-video',
      '.proj-4x5-col4',
      '.proj-4x5-col6',
      '.proj-4x5-col12',
      '.proj-4x5-gallery',
      '.proj-4x5-carousel2',
      '.proj-4x5-video', 
      '.proj-video-loop',
      '.proj-wide-image', 
      '.proj-wide-video',
      '.proj-others'
    ];

    sections.forEach((classSelector) => {
      const elements = document.querySelectorAll(classSelector);

      elements.forEach((el) => {
        if( !el.classList.contains('animated') ) {
          gsap.fromTo(el,
            { y: 40, opacity: 0, },
            { 
              y: 0,
              duration: 0.8,
              opacity: 1,
              ease: 'power4',
              scrollTrigger: {
                trigger: el,
                start: 'top-=40 bottom-=100',
                end: 'bottom bottom',
              },
              onComplete:function() {
                el.classList.add('animated')
              },
            }
          );
        }
      });
    });

    sectionsLines.forEach((classSelector) => {
      const elements = document.querySelectorAll(classSelector);

      elements.forEach((el) => {
        const splitLines = new SplitText(el.querySelector('.proj-text__paragraph'), {
          type: 'lines',
          linesClass: 'line line++'
        });

        const blockLink = el.querySelector('.proj-text-block__link');

        const timeline = gsap.timeline({
    
          scrollTrigger: {
            trigger: el,
            start: 'top-=40 bottom-=200',
            end: 'bottom bottom',
          },
        });

        timeline.from(splitLines.lines, { // lines animation
          yPercent: 50,
          duration: 1,
          opacity: 0,
          stagger: 0.1,
          ease: 'power4',
        });

        if (blockLink) { // check if blockLink exists and add its animation to the timeline
          gsap.set(blockLink, { opacity: 0 });

          timeline.to(blockLink, {
            opacity: 0.5,
            duration: 0.6,
            ease: 'power4',
          });
        }
      });
    });
  }, 1000);
}


/** OBJECTS */
function objectsHeroLines() {
  if (window.matchMedia('(min-width: 992px)').matches) {
    document.fonts.ready.then(function () {
      let objectsHeroText = document.querySelector('.objects-hero__text');

      gsap.set(document.querySelector('.objects-hero'), { opacity: 1} )

      const splitLines = new SplitText(objectsHeroText, {
        type: 'lines',
        linesClass: 'line line++'
      });
    
      gsap.from(splitLines.lines, {
        yPercent: 60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'splitLines',
        onComplete() {
          const finsih = gsap.timeline();
      
          finsih.to(splitLines.lines, { clearProps: 'all' })
          .to(objectsHeroText.style, { color: '#dedede', mixBlendMode: 'difference' }, 0) // synchronize color and mixBlendMode
          .call(() => {
            document.querySelectorAll('.objects-index__text--areas').forEach(function(el) {
              el.classList.add('obj-areas-underline');
            });
          });
        }
      });
    });
  } else {
    document.fonts.ready.then(function () {
      let objectsHeroText = document.querySelector('.objects-hero__text');

      gsap.set(document.querySelector('.objects-hero'), { opacity: 1} )

      const splitLines = new SplitText(objectsHeroText, {
        type: 'lines',
        linesClass: 'line line++'
      });
    
      gsap.from(splitLines.lines, {
        yPercent: 60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'splitLines',
        onComplete() {
          const finsih = gsap.timeline();
          finsih.to(splitLines.lines, { clearProps: 'all' })
          gsap.to('.objects-hero__asset-mobile', { opacity: 1, duration: 0.4, ease: 'blinking-line' })
        }
      });
    });
  }
}

function objectsHeroDesktop() { 
  if (window.matchMedia('(min-width: 992px)').matches) {
    // when videos are ready, show the container
    document.querySelectorAll('.objects-hero__assets .vimeo-wrapper').forEach(function(componentEl) {
      const iframeEl = componentEl.querySelector('iframe');
      const wrapper = document.querySelector('.objects-hero__assets');
      let player = new Vimeo.Player(iframeEl);

      player.on('play', function() {
        iframeEl.style.opacity = 1;
        wrapper.style.opacity = 1;
      });
    });

    const heroWords = document.querySelectorAll('[data-obj-word]');
    const images = document.querySelectorAll('[data-obj-video]');
    let activeImage = images[0]; // select the activeImage = active asset, start with first one (its called image cause it wasnt suppose to have video initially)

    if (activeImage) {
      activeImage.classList.add('active'); //show current asset
    }

    // trigger the mousemove interaction for the active image
    if (activeImage) {
      document.addEventListener('mousemove', (e) => {
        let xPos = (e.clientX - activeImage.offsetLeft) * 0.1;
        let yPos = (e.clientY - activeImage.offsetTop) * 0.1;

        activeImage.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
      });
    }

    heroWords.forEach(function(word) {
      word.addEventListener('mouseenter', function() {
        let code = this.getAttribute('data-obj-word');
        let imageEl = document.querySelector('[data-obj-video="' + code + '"]'); 

        if (imageEl && imageEl !== activeImage) {
          activeImage.classList.remove('active'); //remove previous active img

          imageEl.classList.add('active');
          activeImage = imageEl;
        }
      });
    });
  }
}
 
function objectsIndex() {
  if (window.matchMedia('(min-width: 992px)').matches) {
    const objectsContainer = document.querySelector('[data-index="objects"]');
    const objects = document.querySelectorAll('.objects-index__link');
    const allAssets = document.querySelectorAll('.objects-index__assets'); //get all images/videos
    const assetContainer = document.querySelector('.objects-index__asset-wrapper'); //get the wrapper for the asset
    let isVideoPlaying = false;
    let currentAsset;

    // opacity animation for the asset container
    objectsContainer.addEventListener('mouseenter', () => {
      let firstMouseMove = true;

      objectsContainer.addEventListener('mousemove', function (e) { //no mousemove, mexe o asset container
        if (firstMouseMove) {
          assetContainer.style.top = '0';
          assetContainer.style.left = '0';
          firstMouseMove = false;
        }

        assetContainer.style.transform = `translate(${e.clientX + 20}px, ${e.clientY + 20}px)`;
      });

      gsap.to(assetContainer, {
        autoAlpha: 1,
        duration: 0.25,
        ease: 'blinking-line',
      });
    });

    objectsContainer.addEventListener('mouseleave', () => {
      gsap.to(assetContainer, {
        autoAlpha: 0,
        duration: 0.25,
        ease: 'blinking-line',
      });
    })

    objects.forEach((el, index) => { //em cada item da lista 
      let singleUrl = el.getAttribute('href');

      el.addEventListener('click', () => {
        barba.prefetch(singleUrl);
      });

      el.addEventListener('mouseenter', () => { //no mouseenter
        currentAsset = allAssets[index];
        
        let iframe = currentAsset.querySelector('iframe'),
          iframeBackground = currentAsset.querySelector('.vimeo-wrapper');

        if (currentAsset) { //se este elemento da lista tiver asset        
          currentAsset.style.zIndex = 1;

          gsap.set(currentAsset, { autoAlpha: 1 }); 

          gsap.to(currentAsset, {
            scale: 1.05,  
            duration: 0.5,
            ease: 'asset-index',
          });

          if (iframe && iframe.dataset.videoId) {
            iframe.src = iframe.dataset.src; 
    
            let player = new Vimeo.Player(iframe);
    
            player.on('play', function() {
              iframeBackground.style.backgroundImage = 'none';
              iframe.style.opacity = 1;
              isVideoPlaying = true; 
            });
    
            player.play().catch(function (error) {
              console.error('Failed to play video:', error);
              isVideoPlaying = false; //set this to false if play failed
            });
          }
        }
      });

      el.addEventListener('mouseleave', () => {
        let iframe = currentAsset.querySelector('iframe');

        currentAsset.style.zIndex = 0;

        gsap.to(currentAsset, {
          autoAlpha: 0,
          scale: 1,
          duration: 0.5,
          ease: 'asset-index',
        });

        if (iframe && iframe.dataset.videoId && isVideoPlaying) {
          let player = new Vimeo.Player(iframe);
          
          player.pause();
          isVideoPlaying = false;
        }
      });
    });
  };
}

function enquireHover() {
  if (window.matchMedia('(min-width: 768px)').matches) { 
    const hoverEls = document.querySelectorAll('[data-hover="enquire"]');
          
    hoverEls.forEach((element) => {
      let sibling = element.nextElementSibling,
        hasHover = false, 
        splitHover, hoverChars;

      if(sibling.classList.contains('enquire-button__hover') && sibling.textContent.trim().length > 0) {
        hasHover = true,
        splitHover = new SplitText(sibling, { type: 'words,chars' }),
        hoverChars = splitHover.chars;
      }

      let splitInitial = new SplitText(element, { type: 'words,chars' }),
        initialChars = splitInitial.chars;

      let elementTimeline = gsap.timeline({ paused: true });
      elementTimeline.addLabel('start');

      element.addEventListener('mouseenter', () => {
        if (!elementTimeline.isActive()) {
          elementTimeline.clear().seek('start'); //so it always finishes

          if(hasHover) {
            element.style.opacity = '0';
            sibling.style.opacity = '1';

            elementTimeline.from(hoverChars, {
              duration: 0.01,
              opacity: 0,
              ease: 'none',
              stagger: 0.05,
            });
          } else {
            elementTimeline.from(initialChars, {
              duration: 0.01,
              opacity: 0,
              ease: 'none',
              stagger: 0.05,
            });
          }
        
          elementTimeline.play();
        }
      });

      if(hasHover) {
        let leaveTimeline = gsap.timeline({ paused: true });
          leaveTimeline.addLabel('start');

        element.addEventListener('mouseleave', () => {
          if (!leaveTimeline.isActive()) {
            leaveTimeline.clear().seek('start'); //so it always finishes
    
            leaveTimeline.to(sibling, {
              duration: 0.25,
              opacity: 0
            }).to(element, {
              duration: 0.25,
              opacity: 1
            });
    
            leaveTimeline.play();
          }
        });
      }
    });
  }
}

let objetcsSlideshow; //so i can access it on the else, doesn't work inside the function objectsSwiper

function objectsSwiper() {
  if (window.matchMedia('(min-width: 768px)').matches) {
    //init swiper only from tablet on 
    objetcsSlideshow = new Swiper('.objects-carousel__wrapper', {
      slidesPerView: 'auto',
      spaceBetween: remToPixels(1.25),
      freeMode: true,
      mousewheel: {
        enabled: true,
        sensitivity: 4,
      },
      on: {
        init: function () {
          let slidesInView = [
            this.slides[0],
            this.slides[1],
            this.slides[2]
          ];

          gsap.to(slidesInView, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'blinking-line',
          });
        },
        slideChange: function () {
          let currentSlide = this.slides[this.activeIndex + 2];

          gsap.to(currentSlide, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'blinking-line',
          });
        },
      },
    });

  } else {
    if ( objetcsSlideshow !== undefined ) {
      objetcsSlideshow.destroy( true, true );
    }

    setTimeout(() => { //wait for barba transition
      let slides = document.querySelectorAll('.objects-carousel__slide');
      
      slides.forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          { 
            y: 0,
            duration: 0.8,
            opacity: 1,
            ease: 'power4',
            scrollTrigger: {
              trigger: el,
              start: 'top-=40 bottom-=100',
              end: 'bottom bottom',
            },
          }
        );
      }); 
    }, 1000); 
  }
};

function animateEnquire() {
  let enquireTl = gsap.timeline(),
    enquireLines = document.querySelectorAll('.enquire-info p'), 
    enquireClose = document.querySelector('.enquire-close');

  enquireTl.from(enquireLines, {
    duration: 0.4,
    display: 'none', 
    ease: 'none',
    stagger: 0.1, 
    delay: 0.3,
  }).fromTo(enquireClose, {
    duration: 0.4,
    y: 20,
    opacity: 0,
    ease: 'power1.inOut',
  }, {
    opacity: 1,
    y: 0,
  });
}
  
function objectsEnquire() {
  if (window.matchMedia('(min-width: 768px)').matches) {
    const enquireModel = document.querySelector('.objects-enquire');
    const emailToCopy = 'hello@yambo.me';

    gsap.set(document.querySelector('.enquire-close'), { opacity: 0, y: 5 });
    
    document.querySelectorAll('.enquire-button').forEach(function(button) {
      let availability = button.textContent;

      if(availability=='Enquire') {
        button.addEventListener('click', function() {
          enquireModel.classList.add('active');
          animateEnquire();
          navigator.clipboard.writeText(emailToCopy);
        });
      } else if(availability=='On loan') {
        //
      } else {
        button.style.pointerEvents = 'none';
      }
    });

    document.querySelector('.enquire-close').addEventListener('click', function() {
      enquireModel.classList.remove('active');
    });
  }
}

function objectsDownload() {
  let downloadButtons = document.querySelectorAll('.objects-single_download-btn');
  
  downloadButtons.forEach(function(el) {
    let currentUrl = el.getAttribute('href');
    
    if (currentUrl.includes('www.dropbox.com') && currentUrl.includes('dl=0')) {
      let modifiedUrl = currentUrl.replace('dl=0', 'dl=1');
      el.setAttribute('href', modifiedUrl);
    }
  });
}

/** ABOUT */
function aboutVideo() {
  setTimeout(() => { //wait for the barbajs finish the transition, otherwise the containers would be on top of each other and the start/end point would be calculated wrong
    let videoWrapper = document.querySelector('#aboutVideo'),
      aboutIframe = videoWrapper.querySelector('iframe'),
      aboutVideo = new Vimeo.Player(aboutIframe);
    
    aboutVideo.pause();

    ScrollTrigger.matchMedia({	
      '(min-width: 992px)': function() {
        ScrollTrigger.create({
          trigger: videoWrapper,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => aboutVideo.play(),
          onEnterBack: () => aboutVideo.play(),
          onLeave: () => aboutVideo.pause(),
          onLeaveBack: () => aboutVideo.pause(),
        });
      },
      '(max-width: 991px)': function() {
        ScrollTrigger.create({
          trigger: videoWrapper,
          start: 'top bottom-=10%',
          end: 'bottom top+=10%',
          onEnter: () => aboutVideo.play(),
          onEnterBack: () => aboutVideo.play(),
          onLeave: () => aboutVideo.pause(),
          onLeaveBack: () => aboutVideo.pause(),
        });
      }
    });

    aboutVideo.on('play', function() {
      aboutIframe.style.opacity = 1; //for the poster, not using iframeVideo function because it would create another player
    });
  }, 1000);
}

function aboutIndexes() {
  if (window.matchMedia('(min-width: 992px)').matches) {
    const aboutIndexesSections = document.querySelectorAll('.about-three-col'); // Replace with the class that identifies your sections

    aboutIndexesSections.forEach(section => {
      let indexCode = section.querySelector('[data-index]').getAttribute('data-index');
      let sectionContainer = document.querySelector(`[data-index=${CSS.escape(indexCode)}]`);

      const indexes = section.querySelectorAll('.about-three-col__link');
      const allAssets = section.querySelectorAll('.about-three-col__assets'); //get all images/videos
      const assetContainer = section.querySelector('.about-three-col__asset-wrapper'); //get the wrapper for the asset
      let isVideoPlaying = false;
      let currentAsset;

      //opacity animation for the asset container
      sectionContainer.addEventListener('mouseenter', () => {
        let firstMouseMove = true;

        sectionContainer.addEventListener('mousemove', function (e) { //no mousemove, mexe o asset container
          if (firstMouseMove) {
            assetContainer.style.top = '0';
            assetContainer.style.left = '0';
            firstMouseMove = false;
          }

          assetContainer.style.transform = `translate(${e.clientX + 20}px, ${e.clientY + 20}px)`;
        });

        gsap.to(assetContainer, {
          autoAlpha: 1,
          duration: 0.25,
          ease: 'blinking-line',
        });
      });

      sectionContainer.addEventListener('mouseleave', () => {
        gsap.to(assetContainer, {
          autoAlpha: 0,
          duration: 0.25,
          ease: 'blinking-line',
        });
      })

      //animation for each project line 
      indexes.forEach((el, index) => { //em cada item da lista 
        el.addEventListener('mouseenter', () => { //no mouseenter
          currentAsset = allAssets[index];

          let iframe = currentAsset.querySelector('iframe'),
            iframeBackground = currentAsset.querySelector('.vimeo-wrapper');

          if (currentAsset) { //se este elemento da lista tiver asset
            currentAsset.style.zIndex = 1;

            gsap.set(currentAsset, { autoAlpha: 1 }); 

            gsap.to(currentAsset, {
              scale: 1.05,  
              duration: 0.5,
              ease: 'asset-index',
            });

            if (iframe && iframe.dataset.videoId) {
              iframe.src = iframe.dataset.src; 
      
              let player = new Vimeo.Player(iframe);
      
              player.on('play', function() {
                iframeBackground.style.backgroundImage = 'none';
                iframe.style.opacity = 1;
                isVideoPlaying = true; 
              });
      
              player.play().catch(function (error) {
                console.error('Failed to play video:', error);
                isVideoPlaying = false; //set this to false if play failed
              });
            }
          }
        });

        el.addEventListener('mouseleave', () => {
          let iframe = currentAsset.querySelector('iframe');

          currentAsset.style.zIndex = 0;
        
          gsap.to(currentAsset, {
            autoAlpha: 0,
            scale: 1,
            duration: 0.5,
            ease: 'asset-index',
          });

          if (iframe && iframe.dataset.videoId && isVideoPlaying) {
            let player = new Vimeo.Player(iframe);
            
            player.pause();
            isVideoPlaying = false;
          }
        });
      });
    })
  };
}

function locationHover() {
  if (!isTouchDevice()) {
    let hoverTrigger = document.querySelector('.about-location-hover');
    let hoverImage = document.querySelector('.about-location-image');
    
    let isActive = false;

    hoverTrigger.addEventListener('mouseover', () => {
      hoverImage.style.opacity = 1;
      isActive = true;

      document.addEventListener('mousemove', onMouseMove);
    });

    hoverTrigger.addEventListener('mouseout', () => {
      hoverImage.style.opacity = 0;
      isActive = false;

      document.removeEventListener('mousemove', onMouseMove);
    });

    function onMouseMove(e) {
      if (isActive) {
        let xPos = (e.clientX - hoverImage.offsetLeft) * 0.1;
        let yPos = (e.clientY - hoverImage.offsetTop) * 0.1;

        hoverImage.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
      }
    }
  }
}

function aboutSectionsHover() { //only for the 2 cols
  let sections = document.querySelectorAll('.about-two-col');

  sections.forEach(function(el) {
    el.addEventListener('mouseover', () => {
      el.classList.add('active')
    });

    el.addEventListener('mouseleave', () => {
      el.classList.remove('active')
    });
  })
}

/** SEARCH */
function searchIconHandler(event) {
  let resetButton = document.querySelector('.search-reset');

  event.preventDefault();
  resetButton.click();
}

function searchEnter() { //so the transition animation works on refresh too
  setTimeout(function() {
    document.querySelector('.search-input__wrapper').classList.add('active');  

    setTimeout(function() {
      document.getElementById('search').focus();
    }, 600);
    
    /* change behavior of search icon*/
    document.querySelector('.navbar__search').addEventListener('click', searchIconHandler);
  }, 800);
}

function search() { 
  // prevent form submit
  $('#search-form').submit(function() {
    return false;
  });

  let projectResults = document.querySelector('[data-search="projects"]'), //wrapper para onde vão os match de projectos
    objectsResults = document.querySelector('[data-search="objects"]'), //wrapper para onde vão os match de objetos
    searchInput = document.getElementById('search'); //o input

  gsap.set('.search-empty', { autoAlpha: 0 } ); // oculta a linha de 0 results
  gsap.set(projectResults, { display: 'none', autoAlpha: 0 }); //oculta o wrapper dos projetos
  gsap.set(objectsResults, { display: 'none', autoAlpha: 0 }); //oculta o wrapper dos objects
  gsap.set('.search-result-col', { display: 'none', autoAlpha: 0 }); 

  // attach event listeners for input changes
  let typingTimeout;

  searchInput.addEventListener('keydown', function() { //faz trigger do search no keydown após 1seg 
    clearTimeout(typingTimeout); //clear existing timeout

    typingTimeout = setTimeout(function() {
      searchItems();
    }, 1000); 
  });

  function searchItems() { //função para o search em si
    document.querySelector('.search').classList.add('searched'); 
    gsap.to('.search-empty', { autoAlpha: 0, duration: 0.3 }); //de cada vez que faço search quero ocultar o empty state
    
    let searchTerm = searchInput.value.toLowerCase(); //vai buscar o valor que o user escreveu no input e coloca em minúsculas

    if (searchTerm === "") { //se o input tiver vazio é pq é para fazer um reset
      resetSearch(); 
      return;
    } 

    let filterItems = document.querySelectorAll('.search-result-col'); 
    let matchedTimeline = gsap.timeline({ paused: true });

    filterItems.forEach(function(item) {
      let project = item.getAttribute('data-search-name').toLowerCase(); //nome do projeto 
      let client = item.getAttribute('data-search-client'); //nome do cliente
    
      if (searchTerm !== '') { //existe algo no input? ... 
        client = client ? client.toLowerCase() : ''; //check if client exists and, if so, convert it to lowercase for comparison
    
        if (client.includes(searchTerm) || project.includes(searchTerm)) { //o search term faz parte de um cliente ou nome de projeto? 
          gsap.set(item, { display: 'block' });

          matchedTimeline.to(item, {
            autoAlpha: 1,
            duration: 0.2,
          });

          item.setAttribute('data-visibility', 'visible');
        } else {
          if (item.getAttribute('data-visibility') == 'visible') { //se o item já tiver visibilidade e não corresponder, oculta 
            gsap.set(item, { display: 'none' }); 
            gsap.to(item, { autoAlpha: 0, duration: 0.3 }); 
            item.setAttribute('data-visibility', 'hide');
          }
        }
      } 
    });
  
    // check if there are results 
    let searched = document.querySelector('.search').classList.contains('searched'), 
      projectsCount = projectResults.querySelectorAll('.search-result-col[data-visibility="visible"]').length, //quantos projetos fizeram match?
      objectsCount = objectsResults.querySelectorAll('.search-result-col[data-visibility="visible"]').length, //quantos objects fizeram match?
      projectsText = projectResults.querySelector('.search-results__count'),
      objectsText = objectsResults.querySelector('.search-results__count');
    
    if(searched && projectsCount>0) { //se tiver searched e existirem projetos com match
      gsap.set(projectResults, { display: 'block'} )
      gsap.to(projectResults, { autoAlpha: 1 , duration: 0.3 }) //isto é a seção wrapper de todos os projectos
      projectResults.setAttribute('data-visibility', 'visible');

      matchedTimeline.play();

      if (projectsCount==1) {
        projectsText.innerHTML = '1 result'
      } else {
        projectsText.innerHTML = projectsCount + ' results'
      }
    }

    if(searched && objectsCount>0) { //se tiver searched e existirem objects com match
      gsap.set(objectsResults, { display: 'block'} )
      gsap.to(objectsResults, { autoAlpha: 1 , duration: 0.3 }) //isto é a seção wrapper de todos os objects
      objectsResults.setAttribute('data-visibility', 'visible');

      matchedTimeline.play();

      if (objectsCount==1) {
        objectsText.innerHTML = '1 result'
      } else {
        objectsText.innerHTML = objectsCount + ' results'
      }
    }

    if ( searched && projectsCount>0 && objectsCount == 0) { //se estiver searched e só projetos fizerem match
      gsap.set(objectsResults, { display: 'none'} )
      gsap.to(objectsResults, { autoAlpha: 0 , duration: 0.3 })
      objectsResults.setAttribute('data-visibility', 'hide');

      matchedTimeline.play();
    }

    if ( searched && objectsCount>0 && projectsCount == 0) { //se estiver searched e só objects fizerem match
      gsap.set(projectResults, { display: 'none'} )
      gsap.to(projectResults, { autoAlpha: 0 , duration: 0.3 })
      projectResults.setAttribute('data-visibility', 'hide');

      matchedTimeline.play();
    }

    if(searched && projectsCount==0 && objectsCount==0) { //se estiver search e nada fizer match
      gsap.to(projectResults, { autoAlpha: 0 , duration: 0.3,
        onComplete: function() { 
          gsap.set(projectResults, { display: 'none' }); 
          objectsResults.setAttribute('data-visibility', 'hide');
        }
      });

      gsap.to(objectsResults, { autoAlpha: 0 , duration: 0.3,
        onComplete: function() { 
          gsap.set(objectsResults, { display: 'none' }); 
          objectsResults.setAttribute('data-visibility', 'hide');
        }
      });

      animateEmpty()
    }
  }

  // reset button 
  document.querySelector('.search-reset').addEventListener('click', function() {
    resetSearch();
    window.history.back();
  }); 

  // empty animation 
  function animateEmpty() {
    gsap.to('.search-empty', { autoAlpha: 1 });
    
    let emptyTl = gsap.timeline(),
      emptyResults = new SplitText('.search-empty__results', { type: 'words,chars' }),
      emptyText = new SplitText('.search-empty__span', { type: 'words' }),
      chars = emptyResults.chars, 
      words = emptyText.words;

    emptyTl.from(chars, {
      duration: 0.2,
      opacity: 0,
      ease: 'none',
      stagger: 0.1,
    }).from(words, {
      duration: 0.8,
      x: 40,
      opacity: 0,
      ease: Power2.easeOut,
      stagger: 0.1,
    });
  }

  // reset search
  function resetSearch() {
    document.querySelector('.search-input').value = ''; //clear input
    document.querySelector('.search').classList.remove('searched'); 
    gsap.to('.search-empty', { autoAlpha: 0, duration: 0.2 }); 

    let activeElements = document.querySelectorAll('.search-result-col[data-visibility="visible"]');

    activeElements.forEach(el => {
      gsap.to(el, { autoAlpha: 0 , duration: 0.3,
        onComplete: function() { 
          gsap.set(el, { display: 'none' }); 
          el.setAttribute('data-visibility', 'hide');
        }
      });
    });

    gsap.to(projectResults, { autoAlpha: 0 , duration: 0.3,
      onComplete: function() { 
        gsap.set(projectResults, { display: 'none' }); 
        objectsResults.setAttribute('data-visibility', 'hide');
      }
    });

    gsap.to(objectsResults, { autoAlpha: 0 , duration: 0.3,
      onComplete: function() { 
        gsap.set(objectsResults, { display: 'none' }); 
        objectsResults.setAttribute('data-visibility', 'hide');
      }
    });
  }
}

/* ERROR */
function errorPage() {
  let currentYear = new Date().getFullYear();

  let errorDate = document.querySelector('.error-date'),
    errorYear = document.querySelector('.error-year'),
    errorSlug = document.querySelector('.error-slug');

  let todaysDate = new Date()
  errorDate.textContent = todaysDate.toISOString().split('T')[0];

  errorYear.textContent = currentYear;
  errorSlug.textContent = window.location.href;

  let errorTl = gsap.timeline(),
    errorLines = document.querySelectorAll('.error-info [data-animation=stagger]');

  gsap.set('.error-info', { opacity: 1} );

  errorTl.from(errorLines, {
    duration: 0.4,
    display: 'none', 
    ease: 'none',
    stagger: 0.1,
    onComplete: function() {
      if (window.matchMedia('(min-width: 992px)').matches) {
  		  document.querySelector('.error-form_input input').focus();
      }
    },
  });
}