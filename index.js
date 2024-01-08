const remToPixels = (rem) => rem * 16;

/* Smooth scroll */
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

lenis.on('scroll', ScrollTrigger.update);

requestAnimationFrame(raf);


/* logo interaction */
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

/** LOADING */
function loading() {
  if (document.querySelector('.loading') && !Cookies.get('loading')) {
    const loadingInfo = document.querySelector('.loading-info'),
      loadingText = document.querySelector('.loading-text'),
      splitText = new SplitText(loadingText, { type: 'words,chars' }),
      loadingPercentage = document.querySelector('.loading-percentage'),
      loadingBackground = document.querySelector('.loading-background');

    let chars = splitText.chars,
      loadingTimeline = gsap.timeline(),
      initialPercentage = 0,
      loadFlag;

    gsap.set(loadingInfo, { opacity: 1 });

    loadingTimeline.to(loadingBackground, {
      y: 0,
      duration: 0.6,
      ease: Power1.easeOut,
    }).from(chars, {
      duration: 0.03,
      opacity: 0,
      stagger: 0.05,
    }).fromTo(loadingPercentage,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.2,
      }
    );

    function updatePercentage() {
      if (initialPercentage < 100) {
        initialPercentage += 1;
        loadingPercentage.textContent = Math.floor(initialPercentage) + '%'; // Use Math.floor to round down to the nearest integer
      }
    }

    const percentageInterval = setInterval(updatePercentage, 100);

    // speed up the percentage animation when the 'load' event occurs
    function finishLoadingAnimation() { 
      const fastAnimationTimeline = gsap.timeline();
      fastAnimationTimeline.to(loadingPercentage, {
        textContent: '100%',
        duration: 0.5, // will take 0.5s to finish the animation
        ease: 'none',
        onUpdate: () => {
          currentPercentage = Math.round(gsap.getProperty(loadingPercentage, 'textContent'));
          loadingPercentage.textContent = currentPercentage + '%';
        },
      }).to(loadingInfo, {
        opacity: 0,
        duration: 0.6,
        ease: Power2.easeOut,
      }).to(loadingBackground, {
        yPercent: -100,
        duration: 0.6,
        ease: Power1.easeOut,
      }).to('.loading', {
        opacity: '0',
        duration: 0.3,
      }).to('.loading', {
        display: 'none',
      });
    }

    // set a timer to wait for 3 seconds, even if the 'load' event occurs earlier
    setTimeout(() => {
      if (loadFlag) {
        clearInterval(percentageInterval);
        finishLoadingAnimation();
        Cookies.set('loading', true);
      }
    }, 5000);

    window.addEventListener('load', () => {
      loadFlag = true; // set the flag to true when 'load' event occurs
    });
  } else if (document.querySelector('.loading') && Cookies.get('loading')) {
    document.querySelector('.loading').style.display = 'none'; 
  }
}

/** FOR TRANSITIONS */
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

function isTouchDevice() {
  return ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);
}


/** CURSOR */
function customCursors() {
  const cursors = document.querySelector('.cursor-wrapper');
  const customCursors = document.querySelectorAll('[data-cursor]');

  document.querySelectorAll('a, button, [data-cursor-hover="true"], .proj-16x9-video, .proj-1x1-video').forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursors.style.opacity = '0';
    });
  
    element.addEventListener('mouseleave', () => {
      cursors.style.opacity = '1';
    });
  });
  
  if (!isTouchDevice()) {
    // Move the cursors with the mouse position
    document.addEventListener('pointermove', (e) => {
      cursors.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
    });
  
    // Check if a custom cursor is needed
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

    // Toggle default cursor visibility
    function toggleCursorDefault(){
      const cursor = document.querySelector('.cursor-default');

      if (cursor.style.display === 'none') {
        cursor.style.display = 'block';
      } else {
        cursor.style.display = 'none';
      }
    }
  } else {
    cursors.style.display = 'none';
  }
}


function iframePoster() {
	document.querySelectorAll("[data-vimeo-poster='true']").forEach(function(componentEl) {
    const iframeEl = componentEl.querySelector("iframe");
    let player = new Vimeo.Player(iframeEl);

    player.on("play", function() {
      iframeEl.style.opacity = 1;
      //componentEl.querySelector('.vimeo-wrapper').style.background = 'transparent';
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

/* Hide/Show scrollbar */
function hideScrollbar() {
  document.body.classList.add('hide-scrollbar');
}
function showScrollbar() {
  document.body.classList.remove('hide-scrollbar');
}
  
/** HOMEPAGE */
function homepageHeroLines() {
  if (window.matchMedia('(min-width: 992px)').matches) {
    const homepageHeroText = gsap.utils.toArray('.hero__clients-collection');

    homepageHeroText.forEach((el) => {
      // const background = el.querySelector('.hero__client-background');
      // gsap.set(background, { visibility: 'hidden' });

      const splitLines = new SplitText(el, {
        type: 'lines',
        linesClass: 'line line++'
      });

      gsap.from(splitLines.lines, {
        yPercent: 100,
        duration: 0.6,
        opacity: 0,
        stagger: 0.1,
        ease: 'power4',
        onComplete() {
          gsap.set(splitLines.lines, { clearProps: 'all' });
          //gsap.set(background, { visibility: 'visible' });
        }
      });
    });
  }
}

function homepageHeroDesktop() { //add hover state to clients hero
  if (window.matchMedia('(min-width: 992px)').matches) {
    //the hover effect to not trigger the "sensitive" area with css
    $('.hero__client-link').hover(function() {
      $('.hero__client-link').not(this).addClass('inactive');
    }, function() {
      $('.hero__client-link').removeClass('inactive');
    });

    const clients = document.querySelectorAll('.hero__client-wrapper');
  
    clients.forEach((el) => {
      let clientName = el.querySelector('.hero__client-text');

      let assetContainer = el.querySelector('.hero__client-background'), 
        video =  assetContainer.querySelector('video'),
        loader = el.querySelector('.hero__client-loader'),
        isVideoLoaded = false,
        isMouseOver = false; //so videos dont play right away when they're ready, only when hovered

      video.addEventListener('loadedmetadata', function() {
        isVideoLoaded = true;
        checkMouseOver(); //so video plays if the user is already hovering it
      });

      el.addEventListener('mouseover', () => {
        isMouseOver = true; 
        checkMouseOver();
      });

      el.addEventListener('mouseout', () => {
        isMouseOver = false;
        loader.style.opacity = 0;

        assetContainer.style.opacity = 0;
        clientName.style.color = '#070707';

        video.pause();
      });

      function checkMouseOver() {
        if (isMouseOver) {  
          if (!isVideoLoaded) { //if video is not loaded
            loader.style.opacity = 1;
          } else {
            loader.style.opacity = 0; //video loaded, hide loader
    
            if (clientName.getAttribute('data-hover') === 'Light') {
              clientName.style.color = '#f8f8f8';
            }
            
            video.play();
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
  const projectsContainer = document.querySelector('[data-index="projects"]');
  const projects = document.querySelectorAll('.project-index__link'); //get all projects inside the list
  const allAssets = document.querySelectorAll('.project-index__assets'); //get all images/videos
  const assetContainer = document.querySelector('.project-index__asset-wrapper'); //get the wrapper for the asset
  let isVideoPlaying = false;
  let currentAsset;
  
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
      ease: 'cubic-bezier(.25, 0, .15, 1)',
    });
  });

  projectsContainer.addEventListener('mouseleave', () => {
    gsap.to(assetContainer, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'cubic-bezier(.25, 0, .15, 1)',
    });
  })

  //animation for each project line 
  projects.forEach((el, index) => { //em cada item da lista 
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
          ease: 'cubic-bezier(0,0,0,1)',
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
        ease: 'cubic-bezier(0,0,0,1)',
      });

      if (iframe && iframe.dataset.videoId && isVideoPlaying) {
        let player = new Vimeo.Player(iframe);
        
        player.pause();
        isVideoPlaying = false;
      }
    });
  });
}


/** PROJECTS */
function scrollDownAnimation() {
  let scrollEl = document.querySelector('.btn-project-scroll');

  scrollEl.addEventListener('mouseenter', function() { 
    gsap.to('.btn-project-scroll__word', {
      duration: 0.5,
      y: 10,
      ease: 'power1.inOut',
      stagger: 0.2,
    });
  });

  scrollEl.addEventListener('mouseleave', function() {
    gsap.to('.btn-project-scroll__word', {
      duration: 0.5,
      y: 0,
      ease: 'power1.inOut',
      stagger: 0.2,
    });
  });

  document.querySelector('.btn-project-scroll').addEventListener('click', function () {
    const scrollPin = document.querySelector('.scroll-to-placeholder');
    window.scrollTo({
    top: scrollPin.offsetTop,
    behavior: "smooth"
    });
  });
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
  
    player.on("play", function() {
      coverEl.style.cssText = "opacity: 0;";
      coverImage.style.cssText = "opacity: 0";
      componentEl.classList.add("is-playing");
    });

    player.on("pause", function() {
      coverEl.style.cssText = "opacity: 1;";
      componentEl.classList.remove("is-playing");
    });

    coverEl.addEventListener("click", function() { // when clicking the cover 
      if (componentEl.classList.contains("is-playing")) {
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
  if (window.matchMedia('(min-width: 767px)').matches) { //tablet on only
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
      prevAssets = allProjects.find('.project-index__assets').eq(currentProject.index() - 1),
      nextProject = allProjects.find('.projects-index').eq(currentProject.index() + 1),
      nextAssets = allProjects.find('.project-index__assets').eq(currentProject.index() + 1);

    let prevTitle = prevProject.find('.project-info__title p:last-of-type').text(),
      prevYear = prevProject.find('.project-info__year').text(), 
      prevImage = prevAssets.find('img').attr('src'),
      prevUrl = prevProject.find('.project-index__link').attr('href');

    let nextTitle = nextProject.find('.project-info__title p:last-of-type').text(),
      nextYear = nextProject.find('.project-info__year').text(), 
      nextImage = nextAssets.find('img').attr('src'),
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
                start: 'top-=40 bottom-=200',
                end: 'bottom bottom',
                //markers: true,
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
          type: "lines",
          linesClass: "line line++"
        });

        const blockLink = el.querySelector('.proj-text-block__link');

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top center+=200",
            end: "bottom bottom",
            //markers: true,
          },
        });

        timeline.from(splitLines.lines, { // lines animation
          yPercent: 50,
          duration: 1,
          opacity: 0,
          stagger: 0.1,
          ease: "power4",
        });

        if (blockLink) { // check if blockLink exists and add its animation to the timeline
          gsap.set(blockLink, { opacity: 0 });

          timeline.to(blockLink, {
            opacity: 0.5,
            duration: 0.6,
            ease: "power4",
          });
        }
      });
    });
  }, 1000);
}


/** OBJECTS */
function objectsHeroLines() {
  if (window.matchMedia('(min-width: 992px)').matches) {
    let objectsHeroText = document.querySelector('.objects-hero__text');

    const splitLines = new SplitText(objectsHeroText, {
      type: 'lines',
      linesClass: 'line line++'
    });
  
    gsap.from(splitLines.lines, {
      yPercent: 100,
      duration: 0.6,
      opacity: 0,
      stagger: 0.1,
      ease: 'power4',
      onComplete() {
        gsap.set(splitLines.lines, { clearProps: 'all' });
        objectsHeroText.style.color = '#dedede';
        objectsHeroText.style.mixBlendMode = 'difference';
      }
    });
  }
}

function objectsHeroDesktop() { 
  document.querySelectorAll("[data-vimeo-poster='true']").forEach(function(componentEl) {
    const iframeEl = componentEl.querySelector("iframe");
    let player = new Vimeo.Player(iframeEl);

    player.on("play", function() {
      iframeEl.style.opacity = 1;
      componentEl.querySelector('.vimeo-wrapper').style.background = 'transparent';
    });
	}) 
  
  if (window.matchMedia('(min-width: 992px)').matches) {
    const heroWords = document.querySelectorAll('[data-obj-word]');
    const images = document.querySelectorAll('[data-obj-image]');
    let activeImage = images[1]; // select the activeImage = active asset, start with first one (its called image cause it wasnt suppose to have video initially)

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
        let imageEl = document.querySelector('[data-obj-image="' + code + '"]'); 

        if (imageEl && imageEl !== activeImage) {
          activeImage.classList.remove('active'); //remove previous active img

          imageEl.classList.add('active');
          activeImage = imageEl;
        }
      });
    });
  }
}
  
function objectsHeroMobile() {
  if (window.matchMedia('(max-width: 991px)').matches) {
    setTimeout(() => { 
      const words = document.querySelectorAll('[data-obj-word]');

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.objects-hero',
          pin: true,
          scrub: true,
          anticipatePin: 1,
        }
      });

      words.forEach((word, i) => {
        let code = word.getAttribute('data-obj-word'),
          image = document.querySelector('[data-obj-image="' + code + '"]');

        tl.to(word, { duration: 1, opacity: 1 })
          .to(image, { duration: 2, opacity: 1, scale: 1.02, x: gsap.utils.random(-5, 5), y: gsap.utils.random(-10, 10), ease: 'power2.inOut' }, "-=1") 
          .to(image, { duration: 2, opacity: 0 }, "+=2")
          .to(word, { duration: 1, opacity: 0.1 }, "-=1") 
          .to(image, { duration: 0.1, scale: 1, x: 0, y: 0, ease: 'power2.inOut' }, "+=4");
        });
    }, 1000);
  }
}

function objectsIndex() {
  const objectsContainer = document.querySelector('[data-index="objects"]');
  const objects = document.querySelectorAll('.objects-index__link');
  const allAssets = document.querySelectorAll('.objects-index__assets'); //get all images/videos
  const assetContainer = document.querySelector('.objects-index__asset-wrapper'); //get the wrapper for the asset
  let isVideoPlaying = false;
  let currentAsset;

  //opacity animation for the asset container
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
      ease: 'cubic-bezier(.25, 0, .15, 1)',
    });
  });

  objectsContainer.addEventListener('mouseleave', () => {
    gsap.to(assetContainer, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'cubic-bezier(.25, 0, .15, 1)',
    });
  })

  objects.forEach((el, index) => { //em cada item da lista 
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
          ease: 'cubic-bezier(0,0,0,1)',
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
        ease: 'cubic-bezier(0,0,0,1)',
      });

      if (iframe && iframe.dataset.videoId && isVideoPlaying) {
        let player = new Vimeo.Player(iframe);
        
        player.pause();
        isVideoPlaying = false;
      }
    });
  });
}

function objectsSwiper() {
  const breakpoint = window.matchMedia( '(max-width:767px)' );

  let objectsSwiper; 

  const breakpointChecker = function() {
    if ( breakpoint.matches === true ) {
	    if ( objectsSwiper !== undefined ) objectsSwiper.destroy( true, true );
	    return;
    } else if ( breakpoint.matches === false ) { // else if a small viewport and single column layout needed
      const functionsToExecute = [enableSwiper, horizontalScroll];

      functionsToExecute.forEach((func) => {
        if (typeof func === 'function') {
          func(); // Call the function
        }
      });
    }
  };

  const enableSwiper = function() {
    objectsSwiper = new Swiper('.objects-carousel__wrapper', {
      direction: 'horizontal',
      slidesPerView: 'auto',
      freeMode: true,
      spaceBetween: remToPixels(1.25), 
      mousewheel: true,
    });
  };

  // keep an eye on viewport size changes
  breakpoint.addListener(breakpointChecker);

  // kickstart
  breakpointChecker();

  //enable horizontal scroll with lenis
  function horizontalScroll() {
    let sectionPin = document.querySelector('.objects-carousel__wrapper');

    let containerAnimation = gsap.to(sectionPin, {
      scrollTrigger: {
        trigger: '.main-wrapper[data-barba-namespace="objects-single"]',
        start: 'top top',
        end: () => "+=" + sectionPin.offsetWidth,
        pin: true,
        scrub: true,
      },
      ease: 'none'
    });
  }
}

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
  const enquireModel = document.querySelector('.objects-enquire');
  const emailToCopy = 'hello@yambo.me';

  gsap.set(document.querySelector('.enquire-close'), { opacity: 0, y: 5 });
  
  document.querySelectorAll('.objects-index__link-wrapper').forEach(function(link) {
    link.addEventListener('mouseover', () => {
      link.querySelector('.enquire-button').style.opacity = '1';
      link.querySelector('.objects-index__link').style.opacity = '1';
    });
    
    link.addEventListener('mouseout', () => {
      link.querySelector('.enquire-button').style.opacity = '0.5';
      link.querySelector('.objects-index__link').style.opacity = '0.5';
    });
  });

  document.querySelectorAll('.enquire-button').forEach(function(button) {
    if(button.textContent!='--') {
      button.addEventListener('click', function() {
        enquireModel.classList.add('active');
        animateEnquire();
        navigator.clipboard.writeText(emailToCopy);
      });
    }
  });

  document.querySelector('.enquire-close').addEventListener('click', function() {
    enquireModel.classList.remove('active');
  });
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

    ScrollTrigger.create({
      trigger: videoWrapper,
      start: 'top center',
      end: 'bottom center',
      //markers: true,
      onEnter: () => aboutVideo.play(),
      onEnterBack: () => aboutVideo.play(),
      onLeave: () => aboutVideo.pause(),
      onLeaveBack: () => aboutVideo.pause(),
    });

    aboutVideo.on('play', function() {
      aboutIframe.style.opacity = 1; //for the poster, not using iframeVideo function because it would create another player
    });
  }, 1000);
}

function aboutIndexes() {
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
        ease: 'cubic-bezier(.25, 0, .15, 1)',
      });
    });

    sectionContainer.addEventListener('mouseleave', () => {
      gsap.to(assetContainer, {
        autoAlpha: 0,
        duration: 0.25,
        ease: 'cubic-bezier(.25, 0, .15, 1)',
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
            ease: 'cubic-bezier(0,0,0,1)',
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
          ease: 'cubic-bezier(0,0,0,1)',
        });

        if (iframe && iframe.dataset.videoId && isVideoPlaying) {
          let player = new Vimeo.Player(iframe);
          
          player.pause();
          isVideoPlaying = false;
        }
      });
    });
  })
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
         //hoverImage.style.transform = `translate3d(${e.clientX+20}px, ${e.clientY+20}px, 0)`;

        let xPos = (e.clientX - hoverImage.offsetLeft) * 0.1;
        let yPos = (e.clientY - hoverImage.offsetTop) * 0.1;

        hoverImage.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
      }
    }
  }
}

function firstSeactionActive() {
  document.addEventListener('DOMContentLoaded', function() {
    let firstSection = document.querySelector('[data-trigger="hover"]');

    if (firstSection) {
      let event = new Event('mouseover');
      firstSection.dispatchEvent(event);
    }
  })
}

/** SEARCH */
function searchEnter() { //so it works on refresh
  setTimeout(function() {
    document.querySelector('.search-input__wrapper').classList.add('active');  

    setTimeout(function() {
      document.getElementById('search').focus();
    }, 600);
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
      objcetsCount = objectsResults.querySelectorAll('.search-result-col[data-visibility="visible"]').length, //quantos objects fizeram match?
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

    if(searched && objcetsCount>0) { //se tiver searched e existirem objects com match
      gsap.set(objectsResults, { display: 'block'} )
      gsap.to(objectsResults, { autoAlpha: 1 , duration: 0.3 }) //isto é a seção wrapper de todos os objects
      objectsResults.setAttribute('data-visibility', 'visible');

      matchedTimeline.play();

      if (objcetsCount==1) {
        objectsText.innerHTML = '1 result'
      } else {
        objectsText.innerHTML = objcetsCount + ' results'
      }
    }

    if ( searched && projectsCount>0 && objcetsCount == 0) { //se estiver searched e só projetos fizerem match
      gsap.set(objectsResults, { display: 'none'} )
      gsap.to(objectsResults, { autoAlpha: 0 , duration: 0.3 })
      objectsResults.setAttribute('data-visibility', 'hide');

      matchedTimeline.play();
    }

    if ( searched && objcetsCount>0 && projectsCount == 0) { //se estiver searched e só objects fizerem match
      gsap.set(projectResults, { display: 'none'} )
      gsap.to(projectResults, { autoAlpha: 0 , duration: 0.3 })
      projectResults.setAttribute('data-visibility', 'hide');

      matchedTimeline.play();
    }

    if(searched && projectsCount==0 && objcetsCount==0) { //se estiver search e nada fizer match
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
  		document.querySelector('.error-form_input input').focus();
    },
  });
}