# NOVA HOMES

Plataforma inmobiliaria: showroom en vivo + seguimiento de construcción + NOVA Private.

## Mundos

- **Público** — descubrir residencias, Build Story, Live Progress, Follow
- **Privado** — solicitud de membresía NOVA Private + tarjeta digital

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Portada premium |
| `/residences` | Feed una casa por pantalla |
| `/residences/[id]` | Build Story + Live Progress + Follow |
| `/private` | NOVA Private |
| `/private/apply` | Solicitud de membresía (4 pasos) |
| `/private/status` | Application received / Member card |
