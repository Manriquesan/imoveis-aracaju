import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export const betSchema = z.object({
  amount: z.number().int().positive('Valor deve ser positivo').max(10000, 'Máximo 10.000'),
});

export const slotBetSchema = betSchema.extend({
  lines: z.number().int().min(1).max(5).default(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BetInput = z.infer<typeof betSchema>;
export type SlotBetInput = z.infer<typeof slotBetSchema>;