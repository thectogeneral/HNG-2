const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app
const supabase = require('../database/conn'); // Adjust the path to your Supabase connection

describe('POST /auth/register', () => {
  const testUserEmails = ['john@example.com', 'jane@example.com', 'duplicate@example.com', 'test@example.com'];

  async function cleanUpTestUsers() {
    for (const email of testUserEmails) {
        // Fetch the user ID based on the email
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('userId')
            .eq('email', email)
            .single();

        if (user) {
            // Delete from organisation_users where userId matches
            await supabase.from('organisation_users').delete().eq('userId', user.userId);

            // Delete from organisations where created_by matches
            await supabase.from('organisations').delete().eq('created_by', user.userId);

            // Delete the user record
            await supabase.from('users').delete().eq('userId', user.userId);
          }
      }
  }

    beforeAll(async () => {
        await cleanUpTestUsers();
    });

    afterAll(async () => {
        await cleanUpTestUsers();
    });

  it('Should register user successfully with default organisation', async () => {
      const res = await request(app)
          .post('/auth/register')
          .send({
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              password: 'password123',
              phone: '1234567890'
          });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe('john@example.com');
      expect(res.body.data.accessToken).toBeDefined();

      const { data: orgData, error: orgError } = await supabase
          .from('organisations')
          .select('*')
          .eq('created_by', res.body.data.user.userId)
          .single();

      expect(orgData).toBeDefined();
      expect(orgData.name).toBe("John's Organisation");
  });

  it('Should log the user in successfully', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).toHaveProperty('userId');
      expect(res.body.data.user).toHaveProperty('firstName', 'John');
      expect(res.body.data.user).toHaveProperty('lastName', 'Doe');
      expect(res.body.data.user).toHaveProperty('email', 'john@example.com');

  });

  it('Should fail if required fields are missing', async () => {
        const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
      });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors[0]).toHaveProperty('field', 'lastName');
      expect(res.body.errors[0]).toHaveProperty('message', 'Last name is required');
  });

  it('Should fail if there’s duplicate email', async () => {
      await request(app)
          .post('/auth/register')
          .send({
              firstName: 'John',
              lastName: 'Doe',
              email: 'duplicate@example.com',
              password: 'password123',
              phone: '1234567890'
          });

      const res = await request(app)
          .post('/auth/register')
          .send({
              firstName: 'Jane',
              lastName: 'Doe',
              email: 'duplicate@example.com',
              password: 'password123',
              phone: '0987654321'
          });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
  });
});