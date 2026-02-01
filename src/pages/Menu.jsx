import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import dataSources from '../config/dataSources';
import menuFallback from '../data/menuFallback.json';

const emptyState = {
  column1: new Map(),
  column2: new Map(),
};

function normalizeMenuRows(rows) {
  return rows.filter((row) =>
    Object.values(row || {}).some((value) => String(value || '').trim() !== '')
  );
}

function groupMenu(rows) {
  const grouped = {
    column1: new Map(),
    column2: new Map(),
  };

  rows.forEach((row) => {
    const column = row.column?.trim() === '2' ? 'column2' : 'column1';
    const category = (row.category || 'Other').trim() || 'Other';
    if (!grouped[column].has(category)) {
      grouped[column].set(category, []);
    }
    grouped[column].get(category).push(row);
  });

  return grouped;
}

function mergeColumns(grouped) {
  const merged = new Map();
  ['column1', 'column2'].forEach((columnKey) => {
    grouped[columnKey].forEach((items, category) => {
      if (!merged.has(category)) {
        merged.set(category, []);
      }
      merged.get(category).push(...items);
    });
  });
  return merged;
}

function Menu() {
  const fallbackRows = Array.isArray(menuFallback?.rows) ? menuFallback.rows : [];
  const fallbackDate = menuFallback?.generatedAt || '';
  const fallbackDateLabel = fallbackDate
    ? new Date(fallbackDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const isPrerender =
    typeof window !== 'undefined' && window.__PRERENDER__ && window.__PRERENDER__.active;
  const [menuRows, setMenuRows] = useState(() => fallbackRows);
  const [loading, setLoading] = useState(fallbackRows.length === 0);
  const [error, setError] = useState('');
  const [isFallback, setIsFallback] = useState(fallbackRows.length > 0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 960;
  });

  useEffect(() => {
    setMenuRows(fallbackRows);
  }, [fallbackRows]);

  useEffect(() => {
    let active = true;
    if (isPrerender) {
      setLoading(false);
      return () => {
        active = false;
      };
    }
    if (fallbackRows.length === 0) {
      setLoading(true);
    }

    Papa.parse(dataSources.menuCsvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!active) return;
        const rows = normalizeMenuRows(results.data || []);
        setMenuRows(rows);
        setError('');
        setIsFallback(false);
        setLoading(false);
      },
      error: (err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load the menu right now.');
        setIsFallback(fallbackRows.length > 0);
        setLoading(false);
      },
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const groupedMenu = useMemo(() => {
    if (!menuRows.length) return emptyState;
    return groupMenu(menuRows);
  }, [menuRows]);

  const mergedMenu = useMemo(() => {
    if (!menuRows.length) return new Map();
    return mergeColumns(groupedMenu);
  }, [groupedMenu, menuRows.length]);

  const renderColumn = (columnKey) => {
    const column = groupedMenu[columnKey];
    return Array.from(column.entries()).map(([category, items]) => (
      <div key={category} className="menu-category">
        <h3>{category}</h3>
        {items.map((item, idx) => {
          const name = item.item_name?.trim();
          const price = item.price?.trim();
          const description = item.description?.trim();
          const note = item.special_notes?.trim();
          const numericPrice = price
            ? Number(String(price).replace(/\$/g, '').trim())
            : null;

          if (!name && note) {
            return (
              <p key={`${category}-note-${idx}`} className="menu-note">
                {note}
              </p>
            );
          }

          if (!name) return null;

          return (
            <div key={`${category}-${name}-${idx}`} className="menu-item">
              <div>
                <p className="menu-item-name">{name}</p>
                {description && <p className="menu-item-desc">{description}</p>}
              </div>
              {price && Number.isFinite(numericPrice) && (
                <span className="menu-item-price">${numericPrice.toFixed(2)}</span>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  const renderMerged = () =>
    Array.from(mergedMenu.entries()).map(([category, items]) => (
      <div key={category} className="menu-category">
        <h3>{category}</h3>
        {items.map((item, idx) => {
          const name = item.item_name?.trim();
          const price = item.price?.trim();
          const description = item.description?.trim();
          const note = item.special_notes?.trim();
          const numericPrice = price
            ? Number(String(price).replace(/\$/g, '').trim())
            : null;

          if (!name && note) {
            return (
              <p key={`${category}-note-${idx}`} className="menu-note">
                {note}
              </p>
            );
          }

          if (!name) return null;

          return (
            <div key={`${category}-${name}-${idx}`} className="menu-item">
              <div>
                <p className="menu-item-name">{name}</p>
                {description && <p className="menu-item-desc">{description}</p>}
              </div>
              {price && Number.isFinite(numericPrice) && (
                <span className="menu-item-price">${numericPrice.toFixed(2)}</span>
              )}
            </div>
          );
        })}
      </div>
    ));

  const showLoading = loading && menuRows.length === 0;
  const showFallbackMessage = Boolean(error && isFallback);
  const fallbackMessage = fallbackDateLabel
    ? `We couldn't load the live menu. Showing the menu as of ${fallbackDateLabel}.`
    : "We couldn't load the live menu.";

  return (
    <main>
      <section className="page-hero page-hero-wide">
        <div className="container">
          <h1>Menu</h1>
          <p>
            Crafted with love, topped with flavor, and made to order. Prices and
            availability may vary by stop.
          </p>
        </div>
      </section>

      <section className="menu-section">
        <div className="container">
          {showLoading && <p className="status">Loading menu...</p>}
          {showFallbackMessage && <p className="status">{fallbackMessage}</p>}
          {error && !isFallback && <p className="status error">{error}</p>}
          {menuRows.length > 0 && (
            <>
              {isMobile ? (
                <div className="menu-grid single">
                  <div className="menu-column">{renderMerged()}</div>
                </div>
              ) : (
                <div className="menu-grid">
                  <div className="menu-column">{renderColumn('column1')}</div>
                  <div className="menu-column">{renderColumn('column2')}</div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Menu;
