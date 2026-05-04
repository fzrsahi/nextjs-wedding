export type TGiftAccountCategory = "bank" | "ewallet";

export type TGiftAccount = {
  id: string;
  provider: string;
  accountHolder: string;
  accountNumber: string;
  category: TGiftAccountCategory;
};

export const GIFT_ACCOUNTS: TGiftAccount[] = [
  {
    id: "mandiri",
    provider: "Bank Mandiri",
    accountHolder: "Fauzan Kurnia",
    accountNumber: "1180010656105",
    category: "bank",
  },
  {
    id: "bca",
    provider: "BCA",
    accountHolder: "Fauzan Kurnia",
    accountNumber: "7976273221",
    category: "bank",
  },
  {
    id: "bri",
    provider: "BRI",
    accountHolder: "Syafa Tasya Nabila",
    accountNumber: "202301032310500",
    category: "bank",
  },
  {
    id: "gopay",
    provider: "GoPay",
    accountHolder: "Syafa",
    accountNumber: "085213189007",
    category: "ewallet",
  },
];

export const GIFT_DELIVERY_LABEL = "Send Gift";

export const GIFT_DELIVERY_ADDRESS =
  "Kemang Eminance, Jalan Kemang Eminance, Blok H1 No 33, KAB. BOGOR, KEMANG, JAWA BARAT, ID, 16310";
