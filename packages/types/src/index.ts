import { z } from "zod";

export const userSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string().min(1),
	createdAt: z.string().datetime(),
});
export type User = z.infer<typeof userSchema>;

export const createUserInputSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
});
export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const healthSchema = z.object({ status: z.literal("ok") });
export type Health = z.infer<typeof healthSchema>;

// Provider, Product, Service, Request, Bid, Order, Payment, Refund, Dispute, Chat*
export const providerSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	description: z.string().optional(),
});
export type Provider = z.infer<typeof providerSchema>;

export const productSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	priceCents: z.number().int().nonnegative(),
});
export type Product = z.infer<typeof productSchema>;

export const serviceSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	rateCents: z.number().int().nonnegative(),
});
export type Service = z.infer<typeof serviceSchema>;

export const requestSchema = z.object({ id: z.string().uuid(), title: z.string(), details: z.string().optional() });
export type Request = z.infer<typeof requestSchema>;

export const bidSchema = z.object({ id: z.string().uuid(), requestId: z.string().uuid(), amountCents: z.number().int() });
export type Bid = z.infer<typeof bidSchema>;

export const orderSchema = z.object({ id: z.string().uuid(), totalCents: z.number().int(), status: z.enum(["pending","paid","shipped","completed"]) });
export type Order = z.infer<typeof orderSchema>;

export const paymentSchema = z.object({ id: z.string().uuid(), orderId: z.string().uuid(), amountCents: z.number().int() });
export type Payment = z.infer<typeof paymentSchema>;

export const refundSchema = z.object({ id: z.string().uuid(), paymentId: z.string().uuid(), amountCents: z.number().int() });
export type Refund = z.infer<typeof refundSchema>;

export const disputeSchema = z.object({ id: z.string().uuid(), orderId: z.string().uuid(), reason: z.string() });
export type Dispute = z.infer<typeof disputeSchema>;

export const chatMessageSchema = z.object({ id: z.string().uuid(), chatId: z.string().uuid(), senderId: z.string().uuid(), text: z.string(), createdAt: z.string().datetime() });
export type ChatMessage = z.infer<typeof chatMessageSchema>;


