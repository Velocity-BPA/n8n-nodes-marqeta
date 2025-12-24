# n8n-nodes-marqeta

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for the Marqeta card issuing platform, providing 27 resources and 200+ operations for complete card program management, user lifecycle, transactions, KYC verification, digital wallets, and real-time decisioning.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)

## Features

- **Complete User Management**: Create, update, search users with full KYC integration
- **Card Lifecycle**: Issue, activate, suspend, terminate, and manage physical and virtual cards
- **Transaction Processing**: Real-time authorization, clearing, refunds, and reversals
- **GPA Operations**: Load funds, unload funds, balance inquiries
- **Velocity Controls**: Create spending limits and transaction restrictions
- **Digital Wallets**: Apple Pay, Google Pay, Samsung Pay token management
- **Real-Time Webhooks**: Receive instant notifications for all card events
- **Sandbox Simulation**: Test transactions without real money movement
- **PCI Compliant**: Built-in utilities for safe handling of sensitive card data

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-marqeta`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the package
npm install n8n-nodes-marqeta
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-marqeta.git
cd n8n-nodes-marqeta

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-marqeta

# Restart n8n
n8n start
```

## Credentials Setup

### Marqeta API Credentials

| Field | Description |
|-------|-------------|
| **Environment** | Sandbox, Production, or Custom endpoint |
| **Application Token** | Your Marqeta Application Token |
| **Admin Access Token** | Your Master Access Token |
| **Webhook Signature Key** | (Optional) Key for webhook verification |

### Marqeta Program Credentials (Optional)

| Field | Description |
|-------|-------------|
| **Program Short Code** | Your program identifier |
| **Program Funding Source Token** | Default funding source |
| **Default Card Product Token** | Default card product |

## Resources & Operations

### User Resource
- Create, Get, Update, Delete users
- Search users by email, phone, or custom fields
- Get/Update user balance
- Manage user transitions (activate, suspend, close)
- Create and manage user notes
- Get SSN (masked or full)

### Card Resource
- Create cards for users
- Activate, suspend, terminate cards
- Report lost/stolen cards
- Reveal PAN, CVV (PCI compliant)
- Get/Set PIN
- Manage card transitions

### GPA (General Purpose Account)
- Create GPA orders (load funds)
- Create unloads (withdraw funds)
- Get GPA balance
- List GPA orders by user

### Transaction Resource
- Get transaction details
- List transactions by user/card
- Simulate authorization (sandbox)
- Simulate clearing (sandbox)
- Simulate refunds/reversals (sandbox)

### KYC Resource
- Perform identity verification
- Get KYC results
- Override KYC decisions

### Velocity Control Resource
- Create spending limits
- Set daily/weekly/monthly/lifetime limits
- Get available spending balance

### Digital Wallet Resource
- Get wallet tokens
- Manage token states
- Support for Apple Pay, Google Pay, Samsung Pay

### Webhook Resource
- Create/manage webhooks
- Test webhook endpoints
- List webhook events

### Business Resource
- Create/manage business accounts
- Get business balance
- Manage business transitions

### Utility Resource
- Ping API
- Validate card numbers
- Get BIN details

## Trigger Node

The **Marqeta Trigger** node receives real-time webhook events:

### Transaction Events
- `transaction.authorization` - Authorization request
- `transaction.authorization.clearing` - Authorization cleared
- `transaction.authorization.reversal` - Authorization reversed
- `transaction.clearing` - Transaction cleared
- `transaction.refund` - Refund processed

### Card Events
- `card.created` - New card created
- `card.activated` - Card activated
- `card.suspended` - Card suspended
- `card.terminated` - Card terminated
- `card.pin.changed` - PIN changed

### User Events
- `user.created` - User created
- `user.updated` - User updated
- `user.transition` - User status changed
- `user.kyc.completed` - KYC completed
- `user.kyc.failed` - KYC failed

### Funding Events
- `gpa.credit` - Funds loaded
- `gpa.debit` - Funds withdrawn
- `directdeposit.received` - Direct deposit received

## Usage Examples

### Create a User and Issue a Card

```javascript
// Step 1: Create User
{
  "resource": "user",
  "operation": "create",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}

// Step 2: Create Card
{
  "resource": "card",
  "operation": "create",
  "userToken": "{{ $json.token }}",
  "cardProductToken": "your-card-product-token"
}

// Step 3: Activate Card
{
  "resource": "card",
  "operation": "activate",
  "cardToken": "{{ $json.token }}"
}
```

### Load Funds to User

```javascript
{
  "resource": "gpa",
  "operation": "createOrder",
  "userToken": "user-token",
  "amount": 100.00,
  "currency": "USD",
  "fundingSourceToken": "funding-source-token"
}
```

### Set Velocity Control

```javascript
{
  "resource": "velocityControl",
  "operation": "create",
  "userToken": "user-token",
  "amountLimit": 500,
  "velocityWindow": "DAY",
  "name": "Daily Spending Limit"
}
```

## Marqeta Concepts

### Card Product
A template that defines card configuration including:
- Card type (physical/virtual)
- Card network (Visa, Mastercard)
- Spending controls
- Fulfillment options

### GPA (General Purpose Account)
The funding account associated with a user or business. Cards draw funds from the GPA for transactions.

### JIT Funding
Just-In-Time funding allows real-time funding decisions during transaction authorization.

### Velocity Controls
Rules that limit spending based on:
- Transaction amount
- Time window (day, week, month, lifetime)
- MCC restrictions

### Card States
- `UNACTIVATED` - Card issued but not yet activated
- `ACTIVE` - Card is active and usable
- `SUSPENDED` - Card temporarily disabled
- `TERMINATED` - Card permanently disabled

## Error Handling

The node provides detailed error messages for common scenarios:

| Error Code | Description |
|------------|-------------|
| 400110 | Insufficient funds |
| 400122 | Velocity limit exceeded |
| 400130 | Card not active |
| 400200 | Suspected fraud |

## Security Best Practices

1. **Never log full PAN, CVV, or PIN values**
2. Use the provided PCI utilities for masking sensitive data
3. Enable webhook signature verification
4. Use sandbox environment for testing
5. Rotate API credentials regularly
6. Implement idempotency keys for financial operations

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Marqeta API Docs](https://www.marqeta.com/docs/core-api)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-marqeta/issues)
- **Email**: support@velobpa.com

## Acknowledgments

- [Marqeta](https://www.marqeta.com/) for their comprehensive card issuing platform
- [n8n](https://n8n.io/) for the powerful workflow automation platform
- The open-source community for inspiration and support
