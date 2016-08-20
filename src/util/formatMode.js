export default function(mode) {
  if (!/^(ltr|top|bottom)$/i.test(mode)) {
    return 'rtl';
  }
  return mode.toLowerCase();
}
