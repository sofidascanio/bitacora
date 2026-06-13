# Bitácora

> Una aplicación de productividad para tareas, notas y finanzas personales. Construida con React, Node.js, Express, PostgreSQL y Prisma.

## Descripción General

Bitácora es una herramienta de productividad minimalista con cuatro módulos principales:

- **Tareas** — Tablero Kanban con arrastrar y soltar, subtareas, prioridades y fechas de vencimiento.
- **Notas** — Editor de dos paneles con guardado automático y filtrado por categorías.
- **Calendario** — Vista mensual/semanal con eventos de tareas arrastrables.
- **Gastos** — Seguimiento de finanzas personales con presupuestos y estadísticas mensuales.

---

## Arquitectura

```text
bitacora/
├── client/    # SPA React (Vite)
└── server/    # API REST (Express + Prisma)
```

Cliente y servidor son completamente independientes y se comunican mediante HTTP/REST.
