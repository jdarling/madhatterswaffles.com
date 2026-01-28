// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.nav-toggle');
    if (!navMenu || !toggle) return;
    navMenu.classList.toggle('active');
    toggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
}

// CSV Menu Loading
async function loadMenuFromCSV() {
    try {
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_2eL_BHhckqaISusOVhDGM97H2KQGMmWn76X9uS8-RIElvB9UPI-xNRFLG6m2uMfjsgFNoKmnq_Rw/pub?output=csv';
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        
        const menuData = parseCSV(csvText);
        buildMenuHTML(menuData);
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const menuItems = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length >= headers.length) {
            const item = {};
            headers.forEach((header, index) => {
                item[header] = values[index] ? values[index].trim() : '';
            });
            menuItems.push(item);
        }
    }
    return menuItems;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

function formatPrice(price) {
    if (!price) return '';
    
    // Remove any existing dollar signs and trim whitespace
    const cleanPrice = price.toString().replace(/\$/g, '').trim();
    
    // Parse as float and format to 2 decimal places
    const numericPrice = parseFloat(cleanPrice);
    
    // Return empty string if not a valid number
    if (isNaN(numericPrice)) return '';
    
    // Format with dollar sign and 2 decimal places
    return '$' + numericPrice.toFixed(2);
}

function buildMenuHTML(menuData) {
    const menuContent = document.querySelector('.menu-content');
    if (!menuContent) return;
    
    // Clear existing content
    menuContent.innerHTML = '';
    
    // Create columns
    const column1 = document.createElement('div');
    column1.className = 'menu-column';
    const column2 = document.createElement('div');
    column2.className = 'menu-column';
    
    // Add main title to first column
    const mainTitle = document.createElement('h3');
    mainTitle.textContent = 'Delicious Waffle Delights';
    column1.appendChild(mainTitle);
    
    // Group items by category and column
    const categoriesByColumn = { '1': {}, '2': {} };
    
    menuData.forEach(item => {
        const col = item.column || '1';
        const cat = item.category || 'Other';
        
        if (!categoriesByColumn[col][cat]) {
            categoriesByColumn[col][cat] = [];
        }
        categoriesByColumn[col][cat].push(item);
    });
    
    // Build column 1
    Object.keys(categoriesByColumn['1']).forEach(category => {
        if (category && categoriesByColumn['1'][category].length > 0) {
            const categoryHeader = document.createElement('h4');
            categoryHeader.textContent = category;
            column1.appendChild(categoryHeader);
            
            categoriesByColumn['1'][category].forEach(item => {
                if (item.item_name) {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'menu-item';
                    
                    const itemName = document.createElement('span');
                    itemName.className = 'item-name';
                    itemName.textContent = item.item_name;
                    
                    const price = document.createElement('span');
                    price.className = 'price';
                    price.textContent = formatPrice(item.price);
                    
                    menuItem.appendChild(itemName);
                    if (item.price) menuItem.appendChild(price);
                    column1.appendChild(menuItem);
                    
                    if (item.description) {
                        const description = document.createElement('p');
                        description.className = 'item-description';
                        description.textContent = item.description;
                        column1.appendChild(description);
                    }
                } else if (item.special_notes) {
                    const note = document.createElement('p');
                    note.className = 'note';
                    note.textContent = item.special_notes;
                    column1.appendChild(note);
                }
            });
        }
    });
    
    // Build column 2
    Object.keys(categoriesByColumn['2']).forEach(category => {
        if (category && categoriesByColumn['2'][category].length > 0) {
            const categoryHeader = document.createElement('h4');
            categoryHeader.textContent = category;
            column2.appendChild(categoryHeader);
            
            categoriesByColumn['2'][category].forEach(item => {
                if (item.item_name) {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'menu-item';
                    
                    const itemName = document.createElement('span');
                    itemName.className = 'item-name';
                    itemName.textContent = item.item_name;
                    
                    const price = document.createElement('span');
                    price.className = 'price';
                    price.textContent = formatPrice(item.price);
                    
                    menuItem.appendChild(itemName);
                    if (item.price) menuItem.appendChild(price);
                    column2.appendChild(menuItem);
                    
                    if (item.description) {
                        const description = document.createElement('p');
                        description.className = 'item-description';
                        description.textContent = item.description;
                        column2.appendChild(description);
                    }
                } else if (item.special_notes) {
                    const note = document.createElement('p');
                    note.className = 'allergen-note';
                    note.textContent = item.special_notes;
                    column2.appendChild(note);
                }
            });
        }
    });
    
    menuContent.appendChild(column1);
    menuContent.appendChild(column2);
}

// Add any additional interactive features here
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mad Hatter Waffles website loaded!');
    
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            const toggle = document.querySelector('.nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Load menu from CSV if we're on the menu page
    if (document.querySelector('.menu-section')) {
        loadMenuFromCSV();
    }
});
