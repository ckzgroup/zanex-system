const DEFAULT_CURRENCY = "KES"; // Set your default currency here

export const formatMoney = (amount: number, locale: string = "en-US") => {
    const formattedAmount = new Intl.NumberFormat(locale, {
        style: "decimal",
        minimumFractionDigits: 2, // Ensures two decimal places
    }).format(amount);

    return `${DEFAULT_CURRENCY} ${formattedAmount}`;
};
