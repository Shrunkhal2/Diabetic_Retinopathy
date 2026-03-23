const adminOnly = (req, res, next) => {
  if (req.doctor && req.doctor.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = adminOnly;
