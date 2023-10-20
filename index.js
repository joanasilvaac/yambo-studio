/* Smooth scroll */
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf);


// /* Page interactions */
// gsap.registerPlugin(ScrollTrigger);
// gsap.registerPlugin(SplitText);

// lenis.on('scroll', ScrollTrigger.update);

// const revealClients = gsap.utils.toArray('.hero__clients-collection');

// revealClients.forEach((target) => {
//   const splitLines = new SplitText(target, {
//     type: 'lines',
//     linesClass: 'line line++'
//   });

//   gsap.from(splitLines.lines, {
//     yPercent: 100,
//     opacity: 0,
//     duration: 1,
//     stagger: 0.15,
//     ease: 'power4',
//   });
// });

// const revealOpacity = document.querySelectorAll("[data-reveal='opacity']")

// revealOpacity.forEach((el) => {
//   console.log(el)
//   gsap.from(el, {
//     opacity: 0,
//     duration: 0.8,
//     ease: 'power4',
//     scrollTrigger: {
//       trigger: el,
//       start: 'top bottom-=150',
//       end: 'bottom bottom',
//       //markers: true
//     }
//   });
// });

/* logo interaction */
gsap.registerPlugin(SplitText);

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
	if(document.querySelector('.loading')) {
    const loadingInfo = document.querySelector('.loading-info'),
      loadingText = document.querySelector('.loading-text'),
      splitText = new SplitText(loadingText, { type: 'words,chars' }),
      loadingPercentage = document.querySelector('.loading-percentage'), 
      loadingBackground = document.querySelector('.loading-background');

    let chars = splitText.chars, 
      loadingTimeline = gsap.timeline();

    gsap.set(loadingInfo, { opacity: 1} );

    loadingTimeline.to(loadingBackground, {
      y: 0,
      duration: 0.6, 
      ease: Power1.easeOut 
    }).from(chars, {
      duration: 0.03,
      opacity: 0,
      stagger: 0.05
    }).fromTo(loadingPercentage,   
      {  opacity: 0  }, 
      { 
        opacity: 1,
        duration: 0.2
      }
    ).fromTo(loadingPercentage,
      {   
        textContent: '0%',
      },
      {
        textContent: '100%',
        duration: 5,
        ease: 'none',
        onUpdate: () => {
          currentPercentage = Math.round(gsap.getProperty(loadingPercentage, 'textContent'));
          loadingPercentage.textContent = currentPercentage + '%';
        }
      }
    ).to(loadingInfo, {
      opacity: 0, 
      duration: 1,
      delay: 0.6, 
      ease: Power2.easeOut,
    }).to(loadingBackground, {
      yPercent: -100, 
      duration: 0.6, 
      ease: Power1.easeOut 
    }).to('.loading', {
      display: 'none'
    });
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

  document.querySelectorAll('a, button').forEach(element => {
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
      componentEl.querySelector('.vimeo-wrapper').style.backgroundImage = 'none';
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
  
/** HOMEPAGE */
function homepageHeroDesktop() { 
  if (window.matchMedia('(min-width: 992px)').matches) {
    //add hover state to clients hero
    const clients = document.querySelectorAll('.hero__client-wrapper');
    
    clients.forEach((el) => {
      let clientName = el.querySelector('.hero__client-text[data-hover]');

      if (clientName.getAttribute('data-hover') == 'Light') {
        clientName.classList.add('hover-text-light');
      } 

      let assetContainer = el.querySelector('.hero__client-background'), 
        //iframe = assetContainer.querySelector('iframe'),
        video =  assetContainer.querySelector('video'),
        isVideoPlaying = false;

      el.addEventListener('mouseover', () => {
        //assetContainer.querySelector('.vimeo-wrapper').style.backgroundImage = 'none';
        assetContainer.style.opacity = 1;
        video.style.opacity = 1;

        video.play();
        isVideoPlaying = true; 
  
        // if (iframe && iframe.dataset.videoId) {
        //   iframe.src = iframe.dataset.src; 
  
        //   let player = new Vimeo.Player(iframe);
  
        //   player.on('play', function() {
        //     assetContainer.querySelector('.vimeo-wrapper').style.backgroundImage = 'none';
        //     iframe.style.opacity = 1;
        //     isVideoPlaying = true; 
        //   });
  
        //   player.play();
        // }
      });

      el.addEventListener('mouseout', () => {
        assetContainer.style.opacity = 0;

        video.pause();
        isVideoPlaying = false;
  
        // if (iframe && iframe.dataset.videoId && isVideoPlaying) {
        //   let player = new Vimeo.Player(iframe);
        //   player.pause();
        //   isVideoPlaying = false;
        // }
      });
    });
  }
}

function homepageHeroMobile() {
  if (window.matchMedia('(max-width: 991px)').matches) {
    gsap.registerPlugin(ScrollTrigger);

    const clients = document.querySelectorAll('.hero__client-wrapper');

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.homepage__hero',
        pin: true,
        scrub: 2,
        anticipatePin: 1,
        //markers: true,
      }
    });

    clients.forEach((client, i) => {
      let image = client.querySelector('.hero__client-background');

      tl.to(image, { duration: 2, opacity: 1 }) // Fade in
        .to(image, { duration: 2, opacity: 0 }, "+=2") // Fade out
        .to(image, { duration: 0.1, opacity: 0 }); // Ensure the last image is hidden
   });
  }
}

function projectsIndex() {
  const projects = document.querySelectorAll('.project-index__link'); //get all projects inside the list
  const allAssets = document.querySelectorAll('.project-index__assets'); //get all images/videos
  const assetContainer = document.querySelector('.project-index__asset-wrapper'); //get the wrapper for the asset
  let isVideoPlaying = false;
  let currentAsset;

  projects.forEach((el, index) => { //em cada item da lista 
    el.addEventListener('mousemove', function (e) { //no mousemove, mexe o asset container
      assetContainer.style.transform = `translate(${e.clientX + 20}px, ${e.clientY + 20}px)`;
    });

    el.addEventListener('mouseover', () => { //no mouseenter
      currentAsset = allAssets[index];
      let iframe = currentAsset.querySelector('iframe'),
        iframeBackground = currentAsset.querySelector('.vimeo-wrapper');

      if (currentAsset) { //se este elemento da lista tiver asset
        assetContainer.style.opacity = 1;
        
        currentAsset.style.zIndex = 1;

        gsap.set(currentAsset, { autoAlpha: 1 }); 

        gsap.to(currentAsset, {
          duration: 0.2,
          scale: 1.05,  
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

    el.addEventListener('mouseout', () => {
      let iframe = currentAsset.querySelector('iframe');

      currentAsset.style.zIndex = 0;
      gsap.to(currentAsset, { autoAlpha: 0, scale: 1, duration: 0.4 });

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
      gsap.registerPlugin(ScrollTrigger);

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
 
/** OBJECTS */
function objectsHeroDesktop() { 
  if (window.matchMedia('(min-width: 992px)').matches) {
    const heroWords = document.querySelectorAll('[data-obj-word]');
    const images = document.querySelectorAll('[data-obj-image]');
    let activeImage = images[0]; // select the activeImage, start with first one

    if (activeImage) {
      activeImage.classList.add('active');
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
      gsap.registerPlugin(ScrollTrigger);

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
  const objects = document.querySelectorAll('.objects-index__link');
  const allAssets = document.querySelectorAll('.objects-index__assets'); //get all images/videos
  const assetContainer = document.querySelector('.objects-index__asset-wrapper'); //get the wrapper for the asset
  let isVideoPlaying = false;
  let currentAsset;

  objects.forEach((el, index) => { //em cada item da lista 
    el.addEventListener('mousemove', function (e) { //no mousemove, mexe o asset container
      assetContainer.style.transform = `translate(${e.clientX + 20}px, ${e.clientY + 20}px)`;
    });

    el.addEventListener('mouseover', () => { //no mouseenter
      currentAsset = allAssets[index];
  
      let iframe = currentAsset.querySelector('iframe'),
        iframeBackground = currentAsset.querySelector('.vimeo-wrapper');

      if (currentAsset) { //se este elemento da lista tiver asset
        assetContainer.style.opacity = 1;
        
        currentAsset.style.zIndex = 1;

        gsap.set(currentAsset, { autoAlpha: 1 }); 

        gsap.to(currentAsset, {
          duration: 0.2,
          scale: 1.05,  
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

    el.addEventListener('mouseout', () => {
      let iframe = currentAsset.querySelector('iframe');

      currentAsset.style.zIndex = 0;
      gsap.to(currentAsset, { autoAlpha: 0, scale: 1, duration: 0.4 });

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
    // else if a small viewport and single column layout needed
    } else if ( breakpoint.matches === false ) {
      // fire small viewport version of swiper
      return enableSwiper();
    }
  };
  
  const enableSwiper = function() {
    objectsSwiper = new Swiper('.objects-carousel__wrapper', {
      slidesPerView: 'auto',
      freeMode: true,
      spaceBetween: 24, 
      mousewheel: true,
    });
  };

  // keep an eye on viewport size changes
  breakpoint.addListener(breakpointChecker);

  // kickstart
  breakpointChecker();
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
    gsap.registerPlugin(ScrollTrigger);
    
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
  const index = document.querySelectorAll('.about-three-col__index');

  index.forEach(el => {
    let asset = el.querySelector('.about-three-col__asset-wrapper'),
      iframe = asset.querySelector('iframe');

    el.addEventListener('mouseenter', () => {
      asset.style.opacity = 1;

      el.addEventListener('mousemove', function(e) {
        let mouseX = e.pageX - el.offsetLeft;
        let containerWidth = el.offsetWidth;
        let imageWidth = asset.offsetWidth;
        let maxOffset = Math.min((containerWidth - imageWidth) / 2, 200);
        let offsetX = ((mouseX - containerWidth / 2) / containerWidth) * maxOffset;

        asset.style.transform = 'translateX(' + offsetX + 'px)';
      });

      if (iframe) {
        let player = new Vimeo.Player(iframe);
		    player.play();
      }
    });

    el.addEventListener('mouseout', () => {
      asset.style.opacity = 0;

      if (iframe) {
        let player = new Vimeo.Player(iframe);
		    player.pause();
      }
    });
  });
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
  gsap.registerPlugin(SplitText);

  // prevent form submit
  $('#search-form').submit(function() {
    return false;
  });

  let projectResults = document.querySelector('[data-search="projects"]'), 
    objectsResults = document.querySelector('[data-search="objects"]'),
    searchInput = document.getElementById('search');

  gsap.set('.search-empty', { autoAlpha: 0 } ); // hide empty state default
  gsap.set('.search [data-animation="stagger"]', { opacity: 0, y: 10 });
  gsap.set('.search-result-col', { display: 'none', autoAlpha: 0 });
  gsap.set(projectResults, { display: 'none', autoAlpha: 0 });
  gsap.set(objectsResults, { display: 'none', autoAlpha: 0 });

  // attach event listeners for input changes
  let typingTimeout;

  searchInput.addEventListener('keydown', function() {
    clearTimeout(typingTimeout);  // clear any existing timeout

    typingTimeout = setTimeout(function() {
      searchItems();
    }, 1000); // wait 1sec for user stops typing
  });

  function searchItems() {
    document.querySelector('.search').classList.add('searched');
    gsap.to('.search-empty', { autoAlpha: 0, duration: 0.2 }); // hide empty state when typing again 
    
    let searchTerm = searchInput.value.toLowerCase(); 

    if (searchTerm === "") { // if there's nothing on the input 
      resetSearch(); 
      return;
    } 

    let filterItems = document.querySelectorAll('.search-result-col');

    filterItems.forEach(function(item) {
      let project = item.getAttribute('data-search-name').toLowerCase();
      let client = item.getAttribute('data-search-client'); 
    
      if (searchTerm !== '') { // if there's something in the input
        client = client ? client.toLowerCase() : ''; // check if client exists and, if so, convert it to lowercase for comparison
    
        if (client.includes(searchTerm) || project.includes(searchTerm)) {
          gsap.set(item, { display: 'block' }); 
          gsap.to(item, { autoAlpha: 1, duration: 0.3 }); 
          item.setAttribute('data-visibility', 'visible');
        } else {
          if (item.getAttribute('data-visibility') == 'visible') {
            gsap.set(item, { display: 'none' }); 
            gsap.to(item, { autoAlpha: 0, duration: 0.3 }); 
            item.setAttribute('data-visibility', 'hide');
          }
        }
      } 
    });
  
    // check if there are results 
    let searched = document.querySelector('.search').classList.contains('searched'),
      projectsCount = projectResults.querySelectorAll('.search-result-col[data-visibility="visible"]').length,
      objcetsCount = objectsResults.querySelectorAll('.search-result-col[data-visibility="visible"]').length,
      projectsText = projectResults.querySelector('.search-results__count'),
      objectsText = objectsResults.querySelector('.search-results__count');
    
    if(searched && projectsCount>0) {
      gsap.set(projectResults, { display: 'block'} )
      gsap.to(projectResults, { autoAlpha: 1 , duration: 0.3 })
      projectResults.setAttribute('data-visibility', 'visible');

      if (projectsCount==1) {
        projectsText.innerHTML = '1 result'
      } else {
        projectsText.innerHTML = projectsCount + ' results'
      }
    }

    if(searched && objcetsCount>0) {
      gsap.set(objectsResults, { display: 'block'} )
      gsap.to(objectsResults, { autoAlpha: 1 , duration: 0.3 })
      objectsResults.setAttribute('data-visibility', 'visible');

      if (objcetsCount==1) {
        objectsText.innerHTML = '1 result'
      } else {
        objectsText.innerHTML = objcetsCount + ' results'
      }
    }

    if ( searched && objcetsCount>0 && projectsCount == 0) { 
      gsap.set(projectResults, { display: 'none'} )
      gsap.to(projectResults, { autoAlpha: 0 , duration: 0.3 })
      projectResults.setAttribute('data-visibility', 'hide');
    }

    if ( searched && projectsCount>0 && objcetsCount == 0) {
      gsap.set(objectsResults, { display: 'none'} )
      gsap.to(objectsResults, { autoAlpha: 0 , duration: 0.3 })
      objectsResults.setAttribute('data-visibility', 'hide');
    }
  
    if(searched && projectsCount==0 && objcetsCount==0) {
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

    if ( 
      projectResults.dataset.visibility == 'visible' || 
      objectsResults.dataset.visibility == 'visible'||
      (projectResults.dataset.visibility == 'visible' && objectsResults.dataset.visibility == 'visible')
    ) {
      animateResults();
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
    gsap.to('.search [data-animation="stagger"]', { opacity: 0, y: 10 });

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

  function animateResults() {
    let resultsTl = gsap.timeline(),
      resultsElements = document.querySelectorAll('[data-animation="stagger"]');

      resultsTl.to(resultsElements, {
        duration: 0.2,
        y: 0,
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
      })
  }
}

function searchUpdateIframe() {
	let searchAssets = document.querySelectorAll('.search-result__asset');

	searchAssets.forEach(function (el) {
    let iframe = el.querySelector('iframe');

    if(iframe.dataset.videoId) {
      iframe.src = iframe.dataset.src; 

      let player = new Vimeo.Player(iframe);

      player.on('play', function() {
        el.querySelector('.vimeo-wrapper').style.backgroundImage = 'none';
        iframe.style.opacity = 1;
      });

      player.play();
    }
  });
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