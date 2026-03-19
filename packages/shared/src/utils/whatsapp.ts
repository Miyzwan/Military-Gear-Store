/**
 * Build a WhatsApp deep-link URL for the "Beli Sekarang" purchase flow.
 *
 * @param phoneNumber - WhatsApp number in international format (e.g. "6281234567890")
 * @param productName - The product name to include in the pre-filled message
 * @param price       - The product price (as a number)
 * @returns A wa.me deep link ready for use in an <a href> or window.open
 */
export function buildWhatsAppUrl(
  phoneNumber: string,
  productName: string,
  price: number
): string {
  const priceFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

  const message = [
    `Halo, saya ingin memesan produk berikut:`,
    ``,
    `Produk : ${productName}`,
    `Harga  : ${priceFormatted}`,
    ``,
    `Mohon info ketersediaan dan cara pembayarannya. Terima kasih!`,
  ].join("\n");

  const phone = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
