/* Client-side page navigation also works when index.html is opened as a local file. */
const pageCopy={
ru:{navSessions:'ФОТОСЕССИИ',packagesHero:'Пакеты услуг',sessionsTitle:'Портреты для семейного архива, бизнеса и соцсетей',sessionsSubtitle:"Стоимость индивидуальной часовой съёмки",sessionsPrice:"4 000",session1:"Помогу с идеей, её воплощением и позированием",session2:"В среднем 15–40 фотографий с ретушью за час",session3:"Персональная ссылка на фотографии в облаке",session4:"Отдельная папка с фотографиями для соцсетей",session5:"Готовность — до 10 рабочих дней",sessionsLong:"Съёмку дольше двух часов обсудим отдельно."},
es:{navSessions:'SESIONES',packagesHero:'Paquetes de boda',sessionsTitle:'Retratos para la familia, los negocios y las redes sociales',sessionsSubtitle:"Precio de una sesión individual de una hora",sessionsPrice:"4,000",session1:"Te ayudo con la idea, a darle forma y a posar",session2:"Entre 15 y 40 fotos retocadas por hora, en promedio",session3:"Enlace personal a tus fotografías en la nube",session4:"Carpeta aparte con fotos listas para redes sociales",session5:"Entrega en un máximo de 10 días hábiles",sessionsLong:"Si necesitas más de dos horas, lo platicamos."},
en:{navSessions:'PHOTO SESSIONS',packagesHero:'Wedding packages',sessionsTitle:'Portraits for family, business and social media',sessionsSubtitle:"One-hour individual session",sessionsPrice:"4,000",session1:"Help developing your idea and guidance with posing",session2:"An average of 15–40 retouched photos per hour",session3:"A personal link to your photos in the cloud",session4:"A separate folder of images sized for social media",session5:"Delivery within 10 business days",sessionsLong:"For sessions longer than two hours, get in touch to discuss the details."},
pt:{navSessions:'SESSÕES',packagesHero:'Pacotes de casamento',sessionsTitle:'Retratos para a família, negócios e redes sociais',sessionsSubtitle:"Valor de uma sessão individual de uma hora",sessionsPrice:"4.000",session1:"Ajuda com a ideia, sua realização e as poses",session2:"Em média, 15–40 fotos retocadas por hora",session3:"Link pessoal para as suas fotos na nuvem",session4:"Pasta separada com fotos para redes sociais",session5:"Entrega em até 10 dias úteis",sessionsLong:"Para sessões com mais de duas horas, conversaremos sobre os detalhes."}
};
pageCopy.zh=window.CHINESE_CONTENT.pageCopy;
if(window.SITE_CONTENT?.pageCopy){for(const code of ['es','en','ru','pt'])Object.assign(pageCopy[code],window.SITE_CONTENT.pageCopy[code]||{})}
const coverSelectors={home:'#hero>img',about:'#about>img',packages:'#service-cover>img',package1:'.package[data-package="1"] .package-photo',package2:'.package[data-package="2"] .package-photo',package3:'.package[data-package="3"] .package-photo',package4:'.package[data-package="4"] .package-photo'};for(const [name,selector] of Object.entries(coverSelectors)){const image=document.querySelector(selector),src=window.SITE_CONTENT?.covers?.[name];if(image&&src&&src!==image.getAttribute('src')){image.removeAttribute('srcset');image.src=src}}
const siteNav=document.querySelector('.reference-header .nav');
new ResizeObserver(([entry]) => {
  const height = entry.target.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--site-header-height', height + 'px');
}).observe(siteNav.closest('header'));
const homeLink=siteNav.querySelector('[data-nav="home"]');const packagesLink=siteNav.querySelector('[data-i="navServices"]');const reviewsLink=siteNav.querySelector('[data-i="navReviews"]');const sessionsLink=siteNav.querySelector('[data-copy="navSessions"]');
homeLink.href='#/';packagesLink.href='#/services';reviewsLink.href='#/reviews';
const menuSettings=window.SITE_CONTENT?.menu||{};const customPages=window.SITE_CONTENT?.customPages||[];const menuNodes={home:homeLink,services:packagesLink,sessions:sessionsLink,stories:document.querySelector('.menu-holder'),reviews:reviewsLink};
const sectionsByPage={home:['hero','about','home-contact'],services:['service-cover','wedding-packages'],sessions:['sessions','home-contact','session-grid'],reviews:['reviews']};
for(const page of customPages){const link=document.createElement('a');link.href='#/page/'+page.id;link.dataset.customPage=page.id;menuNodes['custom:'+page.id]=link;const section=document.createElement('section');section.className='custom-page';section.id='custom-'+page.id;const heading=document.createElement('h1');heading.dataset.customTitle=page.id;section.append(heading);page.blocks.forEach((block,i)=>{if(block.type==='text'){const p=document.createElement('p');p.dataset.customText=page.id+':'+i;section.append(p)}else if(block.type==='image'){const image=document.createElement('img');image.src=block.src;image.alt='';image.loading='lazy';section.append(image)}});document.querySelector('main').append(section);sectionsByPage['page/'+page.id]=[section.id]}
for(const [key,node] of Object.entries(menuNodes)){if(menuSettings[key]===false)node.classList.add('route-hidden')}const navOrder=window.SITE_CONTENT?.menuOrder||Object.keys(menuNodes);for(const key of navOrder){if(menuNodes[key])siteNav.append(menuNodes[key])}siteNav.append(document.querySelector('#language'));
let pageBeforeStory='home';let currentPage='home';const showStory=show;const originalClose=closeAlbum;
function sessionImagePath(photo) {
  return 'photos/sessions/' + photo[0] + '.webp';
}
function sessionPhotoLabel(photo) {
  return photo[{ru:1, es:2, en:3, zh:4}[lang]] || photo[3];
}
function renderSessionGrid() {
  const grid = document.getElementById('session-grid');
  const mosaic = grid.querySelector('.session-gallery-mosaic');
  const rows = grid.querySelector('.session-photo-rows');
  if (!rows.childElementCount) {
    sessionPhotos.forEach((photo, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.sessionIndex = index;
      const area = sessionMosaicAreas[index];
      if (area) {
        const [left, top, width, height] = area.map(value => value + '%');
        Object.assign(button.style, {left, top, width, height});
        mosaic.append(button);
      } else {
        const image = document.createElement('img');
        image.src = sessionImagePath(photo);
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        [image.width, image.height] = photo.slice(5);
        button.append(image);
        button.style.setProperty('--photo-ratio', image.width / image.height);
        rows.append(button);
      }
      button.onclick = () => {
        viewerReturnFocus = button;
        viewerSession = true;
        showViewerPhoto(index);
        viewer.hidden = false;
        viewer.querySelector('.viewer-close').focus();
      };
    });
  }
  grid.querySelectorAll('[data-session-index]').forEach(button => {
    button.setAttribute('aria-label', sessionPhotoLabel(sessionPhotos[button.dataset.sessionIndex]));
  });
}
function localizePages(){if(currentPage==='sessions')renderSessionGrid();const data=pageCopy[lang];document.querySelectorAll('[data-copy]').forEach(x=>x.textContent=data[x.dataset.copy]);for(const key of ['home','series','photographer','about','name']){const node=document.querySelector('[data-nav="'+key+'"]');if(node&&data[key])node.textContent=data[key]}for(const page of customPages){const name=page.title[lang]||page.title.ru||'';const heading=document.querySelector('[data-custom-title="'+page.id+'"]');const link=menuNodes['custom:'+page.id];if(heading)heading.textContent=name;if(link)link.textContent=name;page.blocks.forEach((block,i)=>{if(block.type==='text'){const node=document.querySelector('[data-custom-text="'+page.id+':'+i+'"]');if(node)node.textContent=block.text[lang]||block.text.ru||''}})}try{localStorage.setItem('site-language',lang)}catch{}}
function setVisibleSections(page){const ids=['hero','about','home-contact','stories','service-cover','wedding-packages','sessions','session-grid','reviews','extras','contact',...customPages.map(p=>'custom-'+p.id)];for(const id of ids){const node=document.getElementById(id);node?.classList.toggle('route-hidden',!sectionsByPage[page].includes(id))}}
function drawPage(){if(!viewer.hidden)closeViewer();let path=location.hash.slice(1)||'/';let story=path.match(/^\/story\/([a-z0-9-]+)$/);if(story){setVisibleSections(currentPage);const index=/^\d+$/.test(story[1])?Number(story[1]):portfolio.findIndex(album=>album.id===story[1]);if(index>=0&&index<portfolio.length){if(!document.querySelector('#overlay').classList.contains('open')||lastAlbumIndex!==index)showStory(index);return}location.hash='#/';return}
 if(document.querySelector('#overlay').classList.contains('open'))originalClose();
 const route=path.split('?')[0];const custom=route.match(/^\/page\/(page-[a-z0-9-]+)$/);const page=custom&&sectionsByPage['page/'+custom[1]]?'page/'+custom[1]:route==='/services'?'services':route==='/sessions'?'sessions':route==='/reviews'?'reviews':'home';currentPage=page;
 setVisibleSections(page);
 if(page==='sessions') renderSessionGrid();
 for(const [key,link] of Object.entries(menuNodes)){if(key===page||key==='custom:'+page.replace(/^page\//,''))link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')}
 document.querySelector('.series-menu').hidden=true;document.querySelector('#seriesToggle').setAttribute('aria-expanded','false');window.scrollTo(0,0)
}
show=function(index){pageBeforeStory=currentPage;location.hash='#/story/'+(portfolio[index].id||index)};document.querySelector('#close').onclick=()=>{originalClose();location.hash=pageBeforeStory==='home'?'#/':'#/'+pageBeforeStory};
window.addEventListener('hashchange',drawPage);document.querySelector('#language').addEventListener('change',()=>{localizePages();if(document.querySelector('#overlay').classList.contains('open'))showStory(lastAlbumIndex)});
try{let saved=localStorage.getItem('site-language');if(['es','en','zh','ru'].includes(saved)){document.querySelector('#language').value=saved;document.querySelector('#language').dispatchEvent(new Event('change'))}}catch{}
localizePages();drawPage();

for(const selector of ['.cover-title a[href="#about"]','.service-cover a[href="#wedding-packages"]']){const link=document.querySelector(selector);link?.addEventListener('click',event=>{event.preventDefault();document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth'})})}
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.querySelector('#overlay').classList.contains('open')&&document.querySelector('.photo-viewer').hidden){event.stopImmediatePropagation();originalClose();location.hash=pageBeforeStory==='home'?'#/':'#/'+pageBeforeStory}},true);
function updateHeaderTheme(){const header=document.querySelector('.reference-header');const overlay=document.querySelector('#overlay');let coverVisible=false;if(overlay.classList.contains('open')){const cover=overlay.querySelector('.story-cover');coverVisible=!cover.hidden&&cover.getBoundingClientRect().bottom>header.getBoundingClientRect().height}else{for(const id of ['hero','service-cover']){const cover=document.getElementById(id);if(cover&&!cover.classList.contains('route-hidden')&&cover.getBoundingClientRect().bottom>header.getBoundingClientRect().height){coverVisible=true;break}}}header.classList.toggle('on-cover',coverVisible)}
window.addEventListener('scroll',updateHeaderTheme,{passive:true});window.addEventListener('hashchange',()=>requestAnimationFrame(updateHeaderTheme));document.querySelector('#overlay').addEventListener('scroll',updateHeaderTheme,{passive:true});updateHeaderTheme();
