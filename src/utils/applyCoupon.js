export function calculateDiscount({ servicePrice, coupon, serviceId }) {
  if (!coupon) {
    return { discountAmount: 0, finalPrice: servicePrice };
  }

  if (!coupon.isActive) {
    throw new Error("Coupon is inactive");
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw new Error("Coupon has expired");
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  if (servicePrice < coupon.minAmount) {
    throw new Error(`Coupon valid from ${coupon.minAmount} €`);
  }

  if (
    coupon.appliesToService &&
    String(coupon.appliesToService) !== String(serviceId)
  ) {
    throw new Error("Coupon is not valid for this service");
  }

  let discountAmount = 0;

  if (coupon.type === "percentage") {
    discountAmount = Number(((servicePrice * coupon.value) / 100).toFixed(2));
  } else if (coupon.type === "fixed") {
    discountAmount = Math.min(coupon.value, servicePrice);
  }

  const finalPrice = Math.max(servicePrice - discountAmount, 0);

  return { discountAmount, finalPrice };
}
