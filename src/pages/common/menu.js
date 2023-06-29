const menuObject = {
    burger: document.querySelector('.burger-menu'),
    menu: document.querySelector('.menu_box'),
    menuOverlay: document.querySelector('.menu_overlay'),
};

const scrollTo = (href) => href.indexOf('#') === 0 ? location.hash = href : location.href = href;

menuObject.menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault();

        handleCloseMenu();

        setTimeout(() => scrollTo(e.target.getAttribute('href')), 400);
    }
});

const handleMenu = (e) => {
    if (e.target.classList.contains('is-active')) {
        handleCloseMenu();

        return;
    }

    handleOpenMenu();
}

const handleCloseMenu = () => {
    Object.values(menuObject).map((item) => item.classList.remove('is-active'));

    document.body.classList.remove('is-fixed');
}

const handleOpenMenu = () => {
    Object.values(menuObject).map((item) => item.classList.add('is-active'));

    document.body.classList.add('is-fixed');
}

menuObject.menuOverlay.addEventListener('click', handleMenu);

menuObject.burger.addEventListener('click', (e) => {
    Object.values(menuObject).map((item) => item.classList.toggle('is-active'));

    document.body.classList.toggle('is-fixed');
});
