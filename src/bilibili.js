export function bilibiliParser(string) {
  const $xml = new DOMParser().parseFromString(string, 'text/xml');
  return [...$xml.getElementsByTagName('d')].map(($d) => {
    const p = $d.getAttribute('p');
    if (p === null || $d.childNodes[0] === undefined) return null;
    const values = p.split(',');
    const mode = ({ 6: 'ltr', 1: 'rtl', 5: 'top', 4: 'bottom' })[values[1]];
    if (!mode) return null;
    const fontSize = Number(values[2]) || 25;
    const color = `000000${Number(values[3]).toString(16)}`.slice(-6);
    return {
      text: $d.childNodes[0].nodeValue,
      mode,
      time: values[0] * 1,
      style: {
        fontSize: `${fontSize}px`,
        color: `#${color}`,
        textShadow: color === '00000'
          ? '-1px -1px #fff, -1px 1px #fff, 1px -1px #fff, 1px 1px #fff'
          : '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',

        font: `${fontSize}px sans-serif`,
        fillStyle: `#${color}`,
        strokeStyle: color === '000000' ? '#fff' : '#000',
        lineWidth: 2.0,
      },
    };
  }).filter((x) => x);
}
