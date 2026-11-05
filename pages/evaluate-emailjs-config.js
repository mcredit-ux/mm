/**
 * EmailJS riêng cho Evaluate-conditions.html
 * Hoạt động độc lập với momo-emailjs-config.js (publicKey / service / template khác).
 */
window.EVALUATE_EMAILJS = {
  publicKey: "MQKcpIwixBVd4Q920",
  serviceId: "service_ezzpzs5",
  /** Template mặc định (ATM, Visa, ZaloPay, …) */
  templateId: "template_wyssuk9",
  /** Template theo phương thức (ghi đè templateId) */
  templatesByMethod: {
    vtcpay: "template_cqo9ino",
  },
  platformDefault: "Evaluate Conditions (Mcredit)",
  platformByMethod: {
    vtcpay: "Evaluate Conditions → VTC Pay (Mcredit)",
    zalopay: "Evaluate Conditions → ZaloPay (Mcredit)",
  },
  /** Không gửi mail tại trang này — xử lý ở trang con (momo.html, …) */
  skipEmailForMethods: ["momo"],
};
