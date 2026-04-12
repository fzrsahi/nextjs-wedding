/**
 * Placeholder rekening amplop digital — ganti dengan data asli sebelum produksi.
 */
export type TGiftBankAccount = {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
};

export const PLACEHOLDER_GIFT_ACCOUNTS: TGiftBankAccount[] = [
  {
    id: "bca",
    bankName: "BCA",
    accountHolder: "Nama Pemilik Rekening",
    accountNumber: "1234567890",
  },
  {
    id: "mandiri",
    bankName: "Bank Mandiri",
    accountHolder: "Nama Pemilik Rekening",
    accountNumber: "9876543210987",
  },
];
