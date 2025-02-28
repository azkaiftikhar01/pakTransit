const { registerAuthController } = require("../../controller/auth/account");
const { loginAuthController } = require("../../controller/auth/account");

exports.registerAuth = async (req, res) => {
  try {
    await registerAuthController(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginAuth = async (req, res) => {
  await loginAuthController(req, res);
};
