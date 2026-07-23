"use client";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/* Leert den Warenkorb nach erfolgreicher Bestellung (Stripe-Rückkehr).
   Bei Vorkasse leert bereits das Kassenformular vor dem Redirect. */
export default function CartLeeren() {
  const cart = useCart();
  useEffect(() => { cart.clear(); /* eslint-disable-next-line */ }, []);
  return null;
}
