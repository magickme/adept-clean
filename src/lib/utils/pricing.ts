export function formatPrice(price: number): string {
  return (price / 100).toFixed(0);
}

export function getCheckoutUrl(courseId: string, plan: { id: string; price: number }): string {
  return `/checkout?courseId=${courseId}&planId=${plan.id}&price=${plan.price}`;
} 