try {
  const priceText = document.querySelector('#tdo_8')!;

  const link = document.createElement('a');
  link.textContent = 'View brokalys price history for this building';
  link.setAttribute('class', 'ads_opt_link_map');
  link.setAttribute('href', '#');

  link.onclick = (event: Event) => {
    event.preventDefault();

    const button = document.querySelector('#view-brokalys-price-history')!;

    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  };

  priceText.closest('div')!.appendChild(link);
} catch (e) {}

export {};
