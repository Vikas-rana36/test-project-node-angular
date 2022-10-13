const router = require("express").Router();
const adminAuth = require('../../core/middleware/auth')
const deviceAuth = require('../../core/middleware/deviceAuth')
const validateRequest = require('../../core/middleware/validateRequest')
const {categoryJoiSchema} = require('../../models/admin/categoryModel')
const {createCategory, getCategory, deleteCategory, updateCategory} = require("../../controllers/admin/categoryController");
router.post("/add", validateRequest(categoryJoiSchema), createCategory);
router.get("/listing", getCategory);
router.delete("/delete/:id", deleteCategory);
router.put("/update/:id", updateCategory);


module.exports = router;
