/**
 * @swagger
 * /api/seller/add/coupon:
 *   post:
 *     summary: Add a new coupon
 *     tags: [Seller/Coupon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SUMMER2024"
 *               description:
 *                 type: string
 *                 example: "Get 20% off on all products"
 *               discount:
 *                 type: number
 *                 example: 20
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "30-01-2025"
 *               maxUses:
 *                 type: integer
 *                 example: 100
 *               usedCount:
 *                 type: integer
 *                 example: 0
 *               minOrderValue:
 *                 type: number
 *                 example: 500
 *               categoriesApplicable:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["60b8d295f9f1b2a7d03c5e6f", "60b8d295f9f1b2a7d03c5e6g"]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                   type: string
 *                 responseData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60b8d295f9f1b2a7d03c5e6f"
 *       500:
 *         description: Failed 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                 responseMessage:
 *                   type: string
 */
