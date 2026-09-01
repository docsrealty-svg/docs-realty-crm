"use client";

import { useEffect } from "react";

/**
 * Al abrir un chat el hilo arrancaba arriba, en el mensaje mas viejo. Esto lo lleva
 * al final, que es donde esta la conversacion actual (igual que WhatsApp).
 * La `clave` cambia al cambiar de chat, asi que el efecto vuelve a correr.
 */
export default function ScrollAlFinal({ selector, clave }: { selector: string; clave: string }) {
  useEffect(() => {
    const hilo = document.querySelector<HTMLElement>(selector);
    if (!hilo) return;
    // En dos pasos: el inmediato acomoda, y el del frame siguiente corrige cuando
    // terminan de medirse las imagenes y las burbujas largas.
    hilo.scrollTop = hilo.scrollHeight;
    const id = requestAnimationFrame(() => {
      hilo.scrollTop = hilo.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [selector, clave]);

  return null;
}
