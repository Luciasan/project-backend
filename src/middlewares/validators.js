const patchValidator = (req, res, next) => {
  const { title, description, isDone, update_at } = req.body;
  if (
    typeof title == "undefined" ||
    typeof description == "undefined" ||
    typeof isDone == "undefined" ||
    update_at == "undefined"
  ) {
    return res.status(404).json({ message: "falta informacion" });
  }
  if (typeof title !== "string") {
    return res
      .status(400)
      .json({ message: "el title debe ser de tipo string" });
  }
  if (typeof isDone !== "boolean") {
    return res.status(404).json({ message: "isDone debe ser boolean" });
  }
  next();
};

module.exports = {
  patchValidator,
};
