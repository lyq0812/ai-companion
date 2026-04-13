// 短信服务工具（示例，实际接入具体短信服务商）

const sendSMS = async (phone, code) => {
  // 这里接入实际的短信服务商，如阿里云短信、腾讯云短信等
  // 示例代码：
  /*
  const smsClient = new SMSClient({
    accessKeyId: process.env.SMS_ACCESS_KEY,
    secretAccessKey: process.env.SMS_SECRET_KEY
  });
  
  await smsClient.sendSMS({
    PhoneNumbers: phone,
    SignName: process.env.SMS_SIGN_NAME,
    TemplateCode: process.env.SMS_TEMPLATE_CODE,
    TemplateParam: JSON.stringify({ code })
  });
  */
  
  console.log(`发送短信到 ${phone}: 验证码是 ${code}`);
  return true;
};

module.exports = {
  sendSMS
};