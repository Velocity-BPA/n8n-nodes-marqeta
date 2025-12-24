/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Marqeta API Endpoints Configuration
 */

export const MARQETA_ENVIRONMENTS = {
	sandbox: 'https://sandbox-api.marqeta.com/v3',
	production: 'https://api.marqeta.com/v3',
} as const;

export const API_ENDPOINTS = {
	// Ping & Status
	ping: '/ping',
	
	// Users
	users: '/users',
	userLookup: '/users/lookup',
	userTransitions: '/usertransitions',
	userNotes: '/users/{token}/notes',
	
	// Cards
	cards: '/cards',
	cardTransitions: '/cardtransitions',
	cardProducts: '/cardproducts',
	cardPins: '/pins',
	cardPan: '/cards/{token}/showpan',
	
	// Transactions
	transactions: '/transactions',
	
	// Authorizations
	authorizations: '/transactions',
	simulate: '/simulate',
	
	// Funding Sources
	fundingSources: '/fundingsources',
	programFunding: '/fundingsources/program',
	achFunding: '/fundingsources/ach',
	paymentCard: '/fundingsources/paymentcard',
	
	// GPA (General Purpose Account)
	gpaOrders: '/gpaorders',
	gpaUnloads: '/gpaorders/unloads',
	
	// Balances
	balances: '/balances',
	
	// KYC
	kyc: '/kyc',
	
	// Businesses
	businesses: '/businesses',
	businessTransitions: '/businesstransitions',
	
	// Velocity Controls
	velocityControls: '/velocitycontrols',
	
	// Authorization Controls
	authControls: '/authcontrols',
	
	// MCC Groups
	mccGroups: '/mccgroups',
	
	// Merchants
	merchants: '/merchants',
	
	// Fees
	fees: '/fees',
	feeTransfers: '/feetransfers',
	
	// Rewards
	rewards: '/rewards',
	
	// Disputes
	disputes: '/disputes',
	chargebacks: '/chargebacks',
	
	// Direct Deposit
	directDeposits: '/directdeposits',
	directDepositAccounts: '/directdeposits/accounts',
	
	// Digital Wallets
	digitalWalletTokens: '/digitalwallettokens',
	digitalWalletTransitions: '/digitalwallettokentransitions',
	
	// Webhooks
	webhooks: '/webhooks',
	
	// Commando Mode
	commandoModes: '/commandomodes',
	
	// Real-Time Decisioning
	realtimeDecisioning: '/realtimefeecgroups',
	
	// Push to Card
	pushToCard: '/pushtocards',
	pushToCardDisbursements: '/pushtocards/disburse',
	
	// Programs
	programs: '/programs',
	
	// Bulk Issuance
	bulkIssuances: '/bulkissuances',
	
	// Reports
	reports: '/reports',
} as const;

export const WEBHOOK_EVENTS = {
	// Transaction Events
	'transaction.authorization': 'Authorization request received',
	'transaction.authorization.advice': 'Authorization advice received',
	'transaction.authorization.clearing': 'Authorization cleared',
	'transaction.authorization.reversal': 'Authorization reversed',
	'transaction.authorization.incremental': 'Incremental authorization',
	'transaction.clearing': 'Transaction cleared',
	'transaction.refund': 'Refund processed',
	'transaction.network.load': 'Network load received',
	'transaction.fee': 'Fee assessed',
	
	// Card Events
	'card.created': 'Card created',
	'card.activated': 'Card activated',
	'card.suspended': 'Card suspended',
	'card.terminated': 'Card terminated',
	'card.reinstated': 'Card reinstated',
	'card.expiring': 'Card expiring soon',
	'card.pin.changed': 'Card PIN changed',
	'card.fulfillment.shipped': 'Card shipped',
	'card.fulfillment.delivered': 'Card delivered',
	
	// User Events
	'user.created': 'User created',
	'user.updated': 'User updated',
	'user.transition': 'User status changed',
	'user.kyc.completed': 'KYC completed',
	'user.kyc.failed': 'KYC failed',
	'user.identity.verified': 'Identity verified',
	
	// Funding Events
	'gpa.credit': 'GPA credit received',
	'gpa.debit': 'GPA debit processed',
	'ach.transfer.completed': 'ACH transfer completed',
	'ach.transfer.failed': 'ACH transfer failed',
	'directdeposit.received': 'Direct deposit received',
	'fundingsource.created': 'Funding source created',
	
	// Digital Wallet Events
	'digitalwallet.token.created': 'Digital wallet token created',
	'digitalwallet.token.activated': 'Digital wallet token activated',
	'digitalwallet.token.suspended': 'Digital wallet token suspended',
	'digitalwallet.provision.requested': 'Provisioning requested',
	'digitalwallet.provision.completed': 'Provisioning completed',
	
	// Dispute Events
	'dispute.created': 'Dispute created',
	'dispute.updated': 'Dispute updated',
	'chargeback.initiated': 'Chargeback initiated',
	'chargeback.resolved': 'Chargeback resolved',
	
	// Business Events
	'business.created': 'Business created',
	'business.updated': 'Business updated',
	'business.transition': 'Business status changed',
	
	// Velocity Events
	'velocity.limit.reached': 'Velocity limit reached',
	'velocity.limit.warning': 'Spending limit warning',
	'transaction.declined.velocity': 'Transaction declined - velocity',
	
	// Commando Mode Events
	'commandomode.enabled': 'Commando mode enabled',
	'commandomode.disabled': 'Commando mode disabled',
	'commandomode.transaction': 'Commando mode transaction',
} as const;

export type WebhookEventType = keyof typeof WEBHOOK_EVENTS;
