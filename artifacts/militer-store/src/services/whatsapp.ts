/**
 * services/whatsapp.ts
 *
 * Builds WhatsApp purchase links for the "Beli Sekarang" flow.
 * Centralised here so the URL format is never duplicated across components.
 */

/**
 * Build a WhatsApp deep-link for a product purchase enquiry.
 *
 * @param phoneNumber - Store WhatsApp number in international format (e.g. "6281234567890")
 * @param productName - Product name shown in the pre-filled message
 * @param price       - Price in IDR (number)
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
