// Menu2 Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuSections = document.querySelectorAll('.menu-section');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filterValue = this.getAttribute('data-filter');

            // Show/hide sections based on filter
            menuSections.forEach(section => {
                if (filterValue === 'all' || section.getAttribute('data-category') === filterValue) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            // Smooth scroll to menu content
            document.querySelector('.menu-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Show all sections on page load
    menuSections.forEach(section => section.classList.add('active'));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});