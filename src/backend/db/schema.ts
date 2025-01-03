import { InferModel } from 'drizzle-orm'
import { doublePrecision, integer, pgTable, serial, text, varchar, date } from 'drizzle-orm/pg-core'

export const tipogasto=pgTable('tipoGasto', {
    id: serial('id').primaryKey(),
    descripcion: varchar('descripcion').default(''),
    categoria: integer('categoria')
    .notNull()
    .references (() => categoria.id),
    responsable: integer('responsable')
    .notNull()
    .references(() => responsable.id),
})
export const responsable=pgTable('responsable', {
    id: serial('id').primaryKey(),
    nombre: varchar('nombre').default('')
})
export const categoria=pgTable('categoria', {
    id: serial('id').primaryKey(),
    descripcion: varchar('descripcion').default('')
})
export const moneda=pgTable('moneda', {
    id: serial('id').primaryKey(),
    descripcion: varchar('descripcion').default('')
})
export const gasto = pgTable('gasto', {
    id: serial('id').primaryKey(),
    fecha: date('fecha'),
    tipogasto_id: integer('tipogasto')
    .notNull()
    .references(() => tipogasto.id),
    tipocambio: doublePrecision('tipocambio').notNull(),
    totalar: doublePrecision('totalar').default(0),
    totaluyu: doublePrecision('total').default(0),
    descripcion: varchar('descripcion').default(''),
    responsable: integer('responsable')
    .notNull()
    .references(() => responsable.id),
})
export const ingreso=pgTable('ingreso', {
    id: serial('id').primaryKey(),
    fecha: date('fecha'),
    responsable: integer('responsable')
    .notNull()
    .references(() => responsable.id),
    moneda: integer('moneda')
    .notNull()
    .references (() => moneda.id),
    importe: doublePrecision('importe').default(0),
    tipoCambio: doublePrecision('tipoCambio').notNull(),
    total: doublePrecision('importe').default(0).notNull(),
    descripcion: varchar('descripcion').default('')
})

{/*CREATE TABLE tipo_cambio_usd_uyu (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    tipo_cambio DECIMAL(10, 2) NOT NULL
); */}
