const { verifyToken, getTokenFromHeader } = require('../utils/jwt');

exports.authenticateToken = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    // 将解码后的信息添加到请求对象中
    req.user = {
      id: decoded.id,
      user_code: decoded.user_code
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '认证失败'
    });
  }
};