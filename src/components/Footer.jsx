function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>&copy; {year} Mad Hatter&apos;s Waffles</p>
      </div>
    </footer>
  );
}

export default Footer;
