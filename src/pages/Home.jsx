import { useEffect, useMemo, useState } from 'react';
import homeImagesConfig from '../config/homeImages';

function getVisibleImages(images, startIndex, count) {
  if (images.length <= 3) {
    return images;
  }
  return Array.from({ length: count }, (_, offset) => {
    return images[(startIndex + offset) % images.length];
  });
}

function Home() {
  const images = homeImagesConfig.images || [];
  const rotationMs = homeImagesConfig.rotationMs || 6000;
  const basePath = homeImagesConfig.basePath || '/';
  const [startIndex, setStartIndex] = useState(0);
  const [prevStartIndex, setPrevStartIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window === 'undefined') return Math.min(3, images.length);
    return window.innerWidth < 768 ? 1 : Math.min(3, images.length);
  });
  const visibleImages = useMemo(
    () => getVisibleImages(images, startIndex, visibleCount),
    [images, startIndex, visibleCount]
  );
  const prevImages = useMemo(() => {
    if (prevStartIndex === null) return [];
    return getVisibleImages(images, prevStartIndex, visibleCount);
  }, [images, prevStartIndex, visibleCount]);

  useEffect(() => {
    const updateVisibleCount = () => {
      const count = window.innerWidth < 768 ? 1 : Math.min(3, images.length);
      setVisibleCount(count);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= visibleCount) return undefined;
    const intervalId = window.setInterval(() => {
      setPrevStartIndex(startIndex);
      setStartIndex((prev) => (prev + 1) % images.length);
    }, rotationMs);
    return () => window.clearInterval(intervalId);
  }, [images.length, rotationMs, startIndex, visibleCount]);

  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Kansas City&apos;s roaming waffle kitchen</p>
            <h1>Warm waffles, bold flavors, and a little bit of wonder.</h1>
            <p className="hero-lede">
              Mad Hatter&apos;s Waffles brings sweet and savory creations to the
              streets. Find us each week, or order ahead for pickup.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="#/menu">
                See the menu
              </a>
              <a className="btn outline" href="#/schedule">
                Find the truck
              </a>
            </div>
          </div>
          <div className="hero-card">
            <h2>Today&apos;s quick info</h2>
            <ul>
              <li>Plant-based and classic options</li>
              <li>Customizable add-ons</li>
              <li>Serving Kansas City &amp; nearby</li>
            </ul>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/waffle_header.avif" alt="Waffle breakfast spread" />
        </div>
      </section>

      <section className="mission">
        <div className="container mission-grid">
          <div>
            <h2>Our mission</h2>
            <p>
              We craft waffles that feel like a celebration. Every stop is a
              chance to share comfort, creativity, and a little magic with the
              community.
            </p>
          </div>
          <div className="mission-card">
            <h3>Order &amp; connect</h3>
            <p>
              Follow us for weekly stops, special events, and menu drops. Online
              ordering is available when the truck is open.
            </p>
            <div className="link-grid">
              <a href="https://cash.app/order/$madhatterswaffles" target="_blank" rel="noreferrer">
                Online ordering
              </a>
              <a href="https://www.doordash.com/store/mad-hatters-waffles-llc-kansas-city-36849887/82792354/" target="_blank" rel="noreferrer">
                DoorDash
              </a>
              <a href="https://www.instagram.com/madhatterswaffles/" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href="https://www.facebook.com/madhatterswaffles" target="_blank" rel="noreferrer">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery">
        <div className="container gallery-grid">
          {Array.from({ length: visibleCount }).map((_, slotIndex) => {
            const current = visibleImages[slotIndex];
            const previous = prevImages[slotIndex];
            return (
              <div className="gallery-slot" key={`slot-${slotIndex}`}>
                {previous && (
                  <img
                    className="gallery-image exit"
                    src={`${basePath}${previous.file}`}
                    alt={previous.alt}
                  />
                )}
                {current && (
                  <img
                    className="gallery-image enter"
                    src={`${basePath}${current.file}`}
                    alt={current.alt}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="contact">
        <div className="container contact-grid">
          <div>
            <h2>Contact</h2>
            <p>Email us for events, catering, or collaborations.</p>
          </div>
          <div className="contact-card">
            <p className="contact-label">Email</p>
            <a href="mailto:madhatterswaffles@gmail.com">madhatterswaffles@gmail.com</a>
            <p className="contact-label">Based in</p>
            <p>Kansas City, MO</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
