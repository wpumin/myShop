module.exports.isAdmin = (req, res, next) => {
  const { role } = req.user;

  console.log(role);

  try {
    const { role } = req.user;

    if (role === "admin") {
      next();
    } else {
      const error = new Error(
        "Access Denied You don't have permission to access"
      );
      error.statusCode = 403;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
