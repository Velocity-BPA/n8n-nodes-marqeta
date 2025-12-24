/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

/**
 * JIT (Just-In-Time) Funding Handler
 * 
 * JIT funding allows real-time funding decisions during transaction authorization.
 * This handler helps build and validate JIT funding responses.
 */

export interface JitFundingRequest {
	type: string;
	state: string;
	token: string;
	user_token: string;
	card_token: string;
	acting_user_token: string;
	amount: number;
	currency_code: string;
	gpa_order_token?: string;
	merchant: {
		name: string;
		city?: string;
		state?: string;
		country?: string;
		mcc: string;
	};
	card_acceptor: {
		name: string;
		mid: string;
		mcc: string;
	};
	gpa: {
		currency_code: string;
		ledger_balance: number;
		available_balance: number;
		pending_credits: number;
		impacted_amount: number;
		balances: Record<string, number>;
	};
	pos: {
		pan_entry_mode: string;
		pin_entry_mode: string;
		terminal_id: string;
		card_holder_presence: boolean;
		card_presence: boolean;
		partial_approval_capable: boolean;
	};
}

export interface JitFundingResponse {
	jit_funding: {
		token: string;
		method: 'pgfs.authorization' | 'pgfs.auth_plus_capture' | 'pgfs.force_capture';
		user_token: string;
		acting_user_token: string;
		amount: number;
		original_jit_funding_token?: string;
		tags?: string;
		memo?: string;
		incremental_authorization_jit_funding_tokens?: string[];
		address_verification?: {
			name?: string;
			street_address?: string;
			zip?: string;
			postal_code?: string;
			request?: {
				street_address?: string;
				zip?: string;
			};
			response?: {
				code: string;
				memo?: string;
			};
		};
	};
}

export interface JitFundingDeclineResponse {
	jit_funding: {
		token: string;
		method: 'pgfs.decline';
		user_token: string;
		amount: number;
		memo?: string;
		decline_reason?: string;
	};
}

/**
 * Build an approval response for JIT funding
 */
export function buildJitApprovalResponse(
	request: JitFundingRequest,
	options: {
		method?: 'pgfs.authorization' | 'pgfs.auth_plus_capture' | 'pgfs.force_capture';
		amount?: number;
		memo?: string;
		tags?: string;
	} = {},
): JitFundingResponse {
	const token = `jit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	
	return {
		jit_funding: {
			token,
			method: options.method || 'pgfs.authorization',
			user_token: request.user_token,
			acting_user_token: request.acting_user_token,
			amount: options.amount ?? request.amount,
			memo: options.memo,
			tags: options.tags,
		},
	};
}

/**
 * Build a decline response for JIT funding
 */
export function buildJitDeclineResponse(
	request: JitFundingRequest,
	reason: string,
	memo?: string,
): JitFundingDeclineResponse {
	const token = `jit_decline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	
	return {
		jit_funding: {
			token,
			method: 'pgfs.decline',
			user_token: request.user_token,
			amount: request.amount,
			memo,
			decline_reason: reason,
		},
	};
}

/**
 * Build a partial approval response for JIT funding
 */
export function buildJitPartialApprovalResponse(
	request: JitFundingRequest,
	approvedAmount: number,
	memo?: string,
): JitFundingResponse | null {
	// Check if partial approval is supported
	if (!request.pos.partial_approval_capable) {
		return null;
	}
	
	if (approvedAmount <= 0 || approvedAmount > request.amount) {
		return null;
	}
	
	const token = `jit_partial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	
	return {
		jit_funding: {
			token,
			method: 'pgfs.authorization',
			user_token: request.user_token,
			acting_user_token: request.acting_user_token,
			amount: approvedAmount,
			memo: memo || `Partial approval: ${approvedAmount} of ${request.amount}`,
		},
	};
}

/**
 * Validate JIT funding request
 */
export function validateJitRequest(request: unknown): request is JitFundingRequest {
	const req = request as JitFundingRequest;
	
	return (
		typeof req === 'object' &&
		req !== null &&
		typeof req.token === 'string' &&
		typeof req.user_token === 'string' &&
		typeof req.card_token === 'string' &&
		typeof req.amount === 'number' &&
		req.amount >= 0 &&
		typeof req.currency_code === 'string'
	);
}

/**
 * Calculate available balance for JIT funding decision
 */
export function calculateAvailableBalance(gpa: JitFundingRequest['gpa']): number {
	return gpa.available_balance + gpa.pending_credits;
}

/**
 * Check if transaction can be fully funded
 */
export function canFullyFund(
	request: JitFundingRequest,
	externalBalance = 0,
): boolean {
	const available = calculateAvailableBalance(request.gpa) + externalBalance;
	return available >= request.amount;
}

/**
 * Build JIT funding configuration for API
 */
export function buildJitFundingConfig(options: {
	programGatewayToken: string;
	enabled: boolean;
	refundsDestination?: 'GATEWAY' | 'GPA' | 'WATERFALL';
}): IDataObject {
	return {
		program_gateway_funding_source_token: options.programGatewayToken,
		enabled: options.enabled,
		refunds_destination: options.refundsDestination || 'GPA',
	};
}

/**
 * Common JIT decline reasons
 */
export const JIT_DECLINE_REASONS = {
	INSUFFICIENT_FUNDS: 'Insufficient funds',
	VELOCITY_EXCEEDED: 'Velocity limit exceeded',
	HIGH_RISK_MERCHANT: 'High risk merchant',
	BLOCKED_MCC: 'Blocked merchant category',
	FRAUD_SUSPECTED: 'Suspected fraud',
	CARD_INACTIVE: 'Card not active',
	USER_SUSPENDED: 'User account suspended',
	SYSTEM_ERROR: 'System error',
} as const;

export type JitDeclineReason = keyof typeof JIT_DECLINE_REASONS;
