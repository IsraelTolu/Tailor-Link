const PORT = process.env.PORT || 3000;
const swaggerServers = [];
if (process.env.APP_URL) {
  swaggerServers.push({ url: `${process.env.APP_URL}/api` });
}
swaggerServers.push({ url: '/api' });
swaggerServers.push({ url: '/' });

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Tailor Link API',
    version: '1.0.0',
    description: 'API specification for Tailor Link platform',
    contact: { name: 'Tailor Link Support', email: 'support@tailorlink.example' },
  },
  servers: swaggerServers,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      UserPublic: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fullname: { type: 'string' },
          role: { type: 'string', enum: ['customer', 'tailor', 'admin'] },
          email: { type: 'string' },
          phone: { type: 'string' },
          status: { type: 'string', enum: ['active', 'suspended'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      TailorProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          bio: { type: 'string' },
          address_line: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          availability: { type: 'boolean' },
          approval_status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PricingPlan: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          currency: { type: 'string' },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Booking: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          customer_id: { type: 'string', format: 'uuid' },
          tailor_id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          notes: { type: 'string' },
          status: { type: 'string', enum: ['created', 'accepted', 'in_progress', 'delivered', 'completed', 'cancelled'] },
          price_amount: { type: 'number' },
          currency: { type: 'string' },
          schedule_date: { type: 'string', format: 'date' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      EscrowTransaction: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          booking_id: { type: 'string', format: 'uuid' },
          provider: { type: 'string', enum: ['flutterwave', 'paga'] },
          reference: { type: 'string' },
          amount: { type: 'number' },
          currency: { type: 'string' },
          status: { type: 'string', enum: ['initialized', 'funded', 'released', 'refunded', 'held'] },
          metadata: { type: 'object' },
        },
      },
      DeliveryTracking: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          booking_id: { type: 'string', format: 'uuid' },
          tracking_code: { type: 'string' },
          status: { type: 'string', enum: ['created', 'shipped', 'in_transit', 'delivered', 'failed', 'returned'] },
          carrier: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Message: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          booking_id: { type: 'string', format: 'uuid' },
          sender_id: { type: 'string', format: 'uuid' },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Review: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          booking_id: { type: 'string', format: 'uuid' },
          tailor_id: { type: 'string', format: 'uuid' },
          customer_id: { type: 'string', format: 'uuid' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
          approved_by_admin: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Dispute: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          booking_id: { type: 'string', format: 'uuid' },
          raised_by_user_id: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['open', 'resolved', 'rejected'] },
          reason: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      KycRequirement: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          key: { type: 'string' },
          label: { type: 'string' },
          is_required: { type: 'boolean' },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      GalleryItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          image_path: { type: 'string' },
          url: { type: 'string' },
          original_name: { type: 'string' },
          mime_type: { type: 'string' },
          size_bytes: { type: 'integer' },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Tailors' },
    { name: 'Gallery' },
    { name: 'Users' },
    { name: 'Bookings' },
    { name: 'Delivery' },
    { name: 'Chat' },
    { name: 'Admin' },
    { name: 'Settings' },
    { name: 'Disputes' },
    { name: 'Reviews' },
  ],
  paths: {
    '/': { get: { tags: ['Health'], summary: 'API root', responses: { 200: { description: 'Root message' } } } },
    '/health': { get: { tags: ['Health'], summary: 'Health check', responses: { 200: { description: 'Service status' } } } },

    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['role', 'fullname', 'phone', 'email', 'password'], properties: { role: { type: 'string', enum: ['customer', 'tailor', 'admin'] }, fullname: { type: 'string' }, phone: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } } } } },
        },
        security: [],
        responses: { 201: { description: 'Registered', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, user: { $ref: '#/components/schemas/UserPublic' } } } } } }, 400: { description: 'Validation error' } },
      },
    },
    '/auth/verify-email': {
      get: {
        tags: ['Auth'],
        summary: 'Verify email via token',
        parameters: [{ name: 'token', in: 'query', required: true, schema: { type: 'string' } }],
        security: [],
        responses: { 200: { description: 'Verified' }, 400: { description: 'Invalid token' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email or phone',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['identifier', 'password'], properties: { identifier: { type: 'string' }, password: { type: 'string', format: 'password' } } } } } },
        security: [],
        responses: { 200: { description: 'Auth token and user', content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' }, user: { $ref: '#/components/schemas/UserPublic' } } } } } }, 400: { description: 'Invalid credentials' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } },
        security: [],
        responses: { 200: { description: 'Reset email sent' }, 400: { description: 'Error' } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with token',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['token', 'newPassword'], properties: { token: { type: 'string' }, newPassword: { type: 'string', format: 'password' } } } } } },
        security: [],
        responses: { 200: { description: 'Password reset' }, 400: { description: 'Error' } },
      },
    },

    '/tailors/{userId}/profile': {
      get: {
        tags: ['Tailors'],
        summary: 'Get public tailor profile',
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Profile with plans and review stats' } },
      },
    },
    '/tailors/search': {
      get: {
        tags: ['Tailors'],
        summary: 'Search tailors by location and availability',
        parameters: [
          { name: 'city', in: 'query', schema: { type: 'string' } },
          { name: 'state', in: 'query', schema: { type: 'string' } },
          { name: 'available', in: 'query', schema: { type: 'boolean' } },
          { name: 'approval', in: 'query', schema: { type: 'string', enum: ['pending', 'approved', 'rejected'] } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Paginated tailor list' } },
      },
    },
    '/tailors/{userId}/gallery': {
      get: {
        tags: ['Gallery'],
        summary: 'List gallery images for a tailor',
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'List of gallery items', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/GalleryItem' } } } } } },
      },
    },
    '/tailors/me/gallery': {
      post: {
        tags: ['Gallery'],
        summary: 'Upload a gallery image (tailor only)',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } },
            },
          },
        },
        responses: { 201: { description: 'Created gallery item', content: { 'application/json': { schema: { $ref: '#/components/schemas/GalleryItem' } } } } },
      },
    },
    '/tailors/{userId}/plans': { get: { tags: ['Tailors'], summary: 'List public pricing plans for tailor', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'List of plans', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PricingPlan' } } } } } } } },
    '/tailors/me/profile': {
      get: { tags: ['Tailors'], summary: 'Get my tailor profile', responses: { 200: { description: 'Profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/TailorProfile' } } } } } },
      post: { tags: ['Tailors'], summary: 'Create or update my tailor profile', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { bio: { type: 'string' }, address_line: { type: 'string' }, city: { type: 'string' }, state: { type: 'string' }, country: { type: 'string' } } } } } }, responses: { 200: { description: 'Upserted profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/TailorProfile' } } } } } },
    },
    '/tailors/me/availability': { post: { tags: ['Tailors'], summary: 'Set my availability', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { availability: { type: 'boolean' } } } } } }, responses: { 200: { description: 'Availability set' } } } },
    '/tailors/me/kyc': { post: { tags: ['Tailors'], summary: 'Upload a KYC document', requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { type: { type: 'string' }, file: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'KYC document stored' } } } },
    '/tailors/me/plans': { get: { tags: ['Tailors'], summary: 'List my pricing plans', responses: { 200: { description: 'List of plans', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PricingPlan' } } } } } } }, post: { tags: ['Tailors'], summary: 'Create a pricing plan', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'price'], properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, currency: { type: 'string' } } } } } }, responses: { 201: { description: 'Plan created', content: { 'application/json': { schema: { $ref: '#/components/schemas/PricingPlan' } } } } } } },
    '/tailors/me/plans/{planId}': { put: { tags: ['Tailors'], summary: 'Update a pricing plan', parameters: [{ name: 'planId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, currency: { type: 'string' }, is_active: { type: 'boolean' } } } } } }, responses: { 200: { description: 'Updated plan', content: { 'application/json': { schema: { $ref: '#/components/schemas/PricingPlan' } } } } } }, delete: { tags: ['Tailors'], summary: 'Delete a pricing plan', parameters: [{ name: 'planId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } } },

    '/users/{userId}/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get user public profile',
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserPublic' } } } } },
      },
    },

    '/bookings': {
      post: {
        tags: ['Bookings'],
        summary: 'Create a booking (customer only)',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['tailorId', 'title', 'amount', 'provider'], properties: { tailorId: { type: 'string' }, title: { type: 'string' }, notes: { type: 'string' }, amount: { type: 'number' }, currency: { type: 'string' }, scheduleDate: { type: 'string', format: 'date' }, provider: { type: 'string', enum: ['flutterwave', 'paga'] } } } } } },
        responses: { 201: { description: 'Booking created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Booking' } } } } },
      },
    },
    '/bookings/mine': {
      get: {
        tags: ['Bookings'],
        summary: 'List my bookings with filters',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Paginated bookings list' } },
      },
    },
    '/bookings/{bookingId}/status': { post: { tags: ['Bookings'], summary: 'Update booking status', parameters: [{ name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['newStatus'], properties: { newStatus: { type: 'string' } } } } } }, responses: { 200: { description: 'Updated booking', content: { 'application/json': { schema: { $ref: '#/components/schemas/Booking' } } } } } } },
    '/bookings/{bookingId}/escrow/fund': { post: { tags: ['Bookings'], summary: 'Verify funding into escrow (customer)', parameters: [{ name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['reference'], properties: { reference: { type: 'string' } } } } } }, responses: { 200: { description: 'Escrow funded', content: { 'application/json': { schema: { $ref: '#/components/schemas/EscrowTransaction' } } } } } } },
    '/bookings/{bookingId}/escrow/release': { post: { tags: ['Bookings'], summary: 'Release escrow (admin/superadmin)', parameters: [{ name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Escrow released', content: { 'application/json': { schema: { $ref: '#/components/schemas/EscrowTransaction' } } } } } } },
    '/bookings/{bookingId}/delivery/initiate': { post: { tags: ['Delivery'], summary: 'Initiate delivery (tailor)', parameters: [{ name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { carrier: { type: 'string' } } } } } }, responses: { 201: { description: 'Tracking created', content: { 'application/json': { schema: { $ref: '#/components/schemas/DeliveryTracking' } } } } } } },
    '/bookings/{bookingId}/delivery/status': { post: { tags: ['Delivery'], summary: 'Update delivery status (tailor/admin)', parameters: [{ name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['created', 'shipped', 'in_transit', 'delivered', 'failed', 'returned'] } } } } } }, responses: { 200: { description: 'Tracking updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/DeliveryTracking' } } } } } } },

    '/chat/{bookingId}/messages': {
      post: {
        tags: ['Chat'],
        summary: 'Send a message in booking chat',
        parameters: [{ name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['content'], properties: { content: { type: 'string' } } } } } },
        responses: { 201: { description: 'Message created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } } },
      },
      get: {
        tags: ['Chat'],
        summary: 'List messages for a booking',
        parameters: [{ name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Messages', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Message' } } } } } },
      },
    },

    '/admin/stats': { get: { tags: ['Admin'], summary: 'Get admin dashboard stats', responses: { 200: { description: 'Stats' } } } },
    '/admin/users': { get: { tags: ['Admin'], summary: 'List users with filters', responses: { 200: { description: 'Users list' } } } },

    '/admin/tailors/pending': { get: { tags: ['Admin'], summary: 'List pending tailor approvals', responses: { 200: { description: 'Pending tailors' } } } },
    '/admin/tailors/{userId}/approve': { post: { tags: ['Admin'], summary: 'Approve tailor profile', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Tailor approved' } } } },
    '/admin/tailors/{userId}/reject': { post: { tags: ['Admin'], summary: 'Reject tailor profile', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Tailor rejected' } } } },
    '/admin/tailors/{userId}': { get: { tags: ['Admin'], summary: 'Get tailor context (profile, bookings)', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Tailor context' } } } },
    '/admin/tailors/{userId}/kyc/{docId}/download': { get: { tags: ['Admin'], summary: 'Download a KYC document for a tailor', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }, { name: 'docId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'File stream' } } } },

    '/admin/users/{userId}/status': { patch: { tags: ['Admin'], summary: 'Update user status', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['active', 'suspended'] } } } } } }, responses: { 200: { description: 'Updated user' } } } },
    '/admin/users/{userId}/role': { patch: { tags: ['Admin'], summary: 'Update user role', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['role'], properties: { role: { type: 'string', enum: ['customer', 'tailor', 'admin'] } } } } } }, responses: { 200: { description: 'Updated user' } } } },

    '/admin/settings/kyc': {
      get: { tags: ['Settings'], summary: 'List KYC requirements', responses: { 200: { description: 'List', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/KycRequirement' } } } } } } },
      post: {
        tags: ['Settings'],
        summary: 'Create a KYC requirement',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['key', 'label'], properties: { key: { type: 'string' }, label: { type: 'string' }, is_required: { type: 'boolean' }, is_active: { type: 'boolean' } } } } } },
        responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/KycRequirement' } } } } },
      },
    },
    '/admin/settings/kyc/{id}': {
      put: {
        tags: ['Settings'],
        summary: 'Update a KYC requirement',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { key: { type: 'string' }, label: { type: 'string' }, is_required: { type: 'boolean' }, is_active: { type: 'boolean' } } } } } },
        responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/KycRequirement' } } } } },
      },
      delete: { tags: ['Settings'], summary: 'Delete a KYC requirement', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },

    '/admin/escrow': { get: { tags: ['Admin'], summary: 'List escrow transactions', responses: { 200: { description: 'List of transactions', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/EscrowTransaction' } } } } } } } },
    '/admin/escrow/{txId}/release': { post: { tags: ['Admin'], summary: 'Release escrow funds', parameters: [{ name: 'txId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Released', content: { 'application/json': { schema: { $ref: '#/components/schemas/EscrowTransaction' } } } } } } },
    '/admin/escrow/{txId}/refund': { post: { tags: ['Admin'], summary: 'Refund escrow funds', parameters: [{ name: 'txId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Refunded', content: { 'application/json': { schema: { $ref: '#/components/schemas/EscrowTransaction' } } } } } } },

    '/disputes': { post: { tags: ['Disputes'], summary: 'Create a dispute for a booking', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['bookingId', 'reason'], properties: { bookingId: { type: 'string' }, reason: { type: 'string' } } } } } }, responses: { 201: { description: 'Dispute created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Dispute' } } } } } } },
    '/disputes/mine': { get: { tags: ['Disputes'], summary: 'List my disputes', responses: { 200: { description: 'List of disputes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Dispute' } } } } } } } },

    '/bookings/{bookingId}/reviews': { post: { tags: ['Reviews'], summary: 'Create a review for a booking', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['rating'], properties: { rating: { type: 'integer', minimum: 1, maximum: 5 }, comment: { type: 'string' } } } } } }, responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Review' } } } } } } },
    '/tailors/{tailorId}/reviews': { get: { tags: ['Reviews'], summary: 'List approved reviews for a tailor', parameters: [{ name: 'tailorId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'List', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Review' } } } } } } } },
    '/admin/reviews/pending': { get: { tags: ['Reviews'], summary: 'List pending reviews (admin)', responses: { 200: { description: 'Pending reviews' } } } },
    '/admin/reviews/{reviewId}/approve': { post: { tags: ['Reviews'], summary: 'Approve a review (admin)', parameters: [{ name: 'reviewId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Approved' } } } },
    '/admin/reviews/{reviewId}': { delete: { tags: ['Reviews'], summary: 'Reject/delete a review (admin)', parameters: [{ name: 'reviewId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } } },
  },
};

export default swaggerSpec;