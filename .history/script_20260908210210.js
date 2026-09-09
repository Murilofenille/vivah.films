// Substitua pelo número real com DDI e DDD, somente dígitos (ex.: 55 + DDD + número).
// Enquanto estiver vazio, o site apresenta o contato real do Instagram.
const WHATSAPP_NUMBER = '5514982074158';
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.header nav');
menuButton.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  document.querySelectorAll('.project').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    const video = card.querySelector('video');
    if (video) { if (card.hidden) video.pause(); else if (!matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {}); }
  });
}));
const projectDialog = document.querySelector('#project-dialog');
const contactDialog = document.querySelector('#contact-dialog');
function showDialog(dialog) { dialog.showModal(); document.body.classList.add('modal-open'); }
document.querySelectorAll('.project').forEach(card => card.addEventListener('click', () => {
  const media = document.querySelector('#project-media');
  media.replaceChildren();
  const element = document.createElement(card.dataset.video ? 'video' : 'img');
  if (card.dataset.video) {
    element.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
    element.controls = true; element.playsInline = true;
  } else { element.src = card.dataset.image; element.alt = card.querySelector('img').alt; }
  media.append(element);
  document.querySelector('#project-title').textContent = card.dataset.title;
  document.querySelector('#project-description').textContent = card.dataset.description;
  showDialog(projectDialog);
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    dialog.querySelectorAll('video').forEach(video => video.pause());
  });
});
document.querySelector('#project-contact').addEventListener('click', () => projectDialog.close());
document.querySelector('#contact-open').addEventListener('click', () => {
  if (/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá, VIVAH! Quero conversar sobre um projeto audiovisual.')}`, '_blank', 'noopener,noreferrer');
  } else showDialog(contactDialog);
});
document.querySelector('#year').textContent = new Date().getFullYear();
if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('video').forEach(video => { video.autoplay = false; video.pause(); });

// Conteúdo permanece visível sem JavaScript ou com movimento reduzido.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll('.intro > *, .section-heading, .project, .services-title, .service-list details, .about-art, .about-text, .contact > *');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('reveal-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealTargets.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${index % 2 * 70}ms`);
    element.classList.add('reveal-pending');
    element.addEventListener('animationend', () => element.classList.remove('reveal-visible'), { once: true });
    revealObserver.observe(element);
  });
  motionPreference.addEventListener('change', event => {
    if (!event.matches) return;
    revealObserver.disconnect();
    revealTargets.forEach(element => element.classList.remove('reveal-pending', 'reveal-visible'));
    document.querySelectorAll('video').forEach(video => video.pause());
  });
}
