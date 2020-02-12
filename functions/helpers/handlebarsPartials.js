const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

Handlebars.registerPartial('header', fs.readFileSync(path.join(__dirname, '../views/partials/header.hbs'), 'utf8'));
Handlebars.registerPartial('headerBook', fs.readFileSync(path.join(__dirname, '../views/partials/header_book.hbs'), 'utf8'));
Handlebars.registerPartial('headerGame', fs.readFileSync(path.join(__dirname, '../views/partials/header_game.hbs'), 'utf8'));
Handlebars.registerPartial('headerPrintable', fs.readFileSync(path.join(__dirname, '../views/partials/header_printable.hbs'), 'utf8'));
Handlebars.registerPartial('headerNav', fs.readFileSync(path.join(__dirname, '../views/partials/header_nav.hbs'), 'utf8'));

Handlebars.registerPartial('footer', fs.readFileSync(path.join(__dirname, '../views/partials/footer.hbs'), 'utf8'));
Handlebars.registerPartial('footerBook', fs.readFileSync(path.join(__dirname, '../views/partials/footer_book.hbs'), 'utf8'));
Handlebars.registerPartial('footerGame', fs.readFileSync(path.join(__dirname, '../views/partials/footer_game.hbs'), 'utf8'));
Handlebars.registerPartial('footerPrintable', fs.readFileSync(path.join(__dirname, '../views/partials/footer_printable.hbs'), 'utf8'));
Handlebars.registerPartial('footerNav', fs.readFileSync(path.join(__dirname, '../views/partials/footer_nav.hbs'), 'utf8'));

Handlebars.registerPartial('navSimple', fs.readFileSync(path.join(__dirname, '../views/partials/nav_simple.hbs'), 'utf8'));

Handlebars.registerPartial('fullPagePleaseRotate', fs.readFileSync(path.join(__dirname, '../views/partials/full_page_please_rotate.hbs'), 'utf8'));
Handlebars.registerPartial('fullPageNav', fs.readFileSync(path.join(__dirname, '../views/partials/full_page_nav.hbs'), 'utf8'));

Handlebars.registerPartial('gtmBody', fs.readFileSync(path.join(__dirname, '../views/partials/gtm_body.hbs'), 'utf8'));
Handlebars.registerPartial('gtmHead', fs.readFileSync(path.join(__dirname, '../views/partials/gtm_head.hbs'), 'utf8'));
