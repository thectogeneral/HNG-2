const asyncHandler = require('express-async-handler');
const supabase = require('../../database/conn')
const jwt = require('jsonwebtoken')
const bcrypt =  require('bcryptjs');


exports.register_user = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, phone } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    // Check if the user already exists
    const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
  
    if (existingUser) {
      return res.status(400).json({
        status: 'Bad request',
        message: 'User already exists',
        statusCode: 400
      });
    }
  
    const { data, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
          },
        ])
        .single();
        
  
    if (insertError) {
      return res.status(400).json({
        status: 'Bad request',
        message: 'Registration unsuccessful',
        statusCode: 400
      });
    }

    const { data: user, error: error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    // Generate a JWT token
    const accessToken = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const organisationName = `${user.firstName}'s Organisation`
    const userId = user.userId
    const description = ""

    const { data: organisation, error: err } = await supabase
      .from('organisations')
      .insert([
          {
              name: organisationName,
              description: description,
              created_by: userId,
          },
      ])
      .single();


      const { data: organisation_user, error: er } = await supabase
        .from('organisations')
        .select('*')
        .eq('created_by', userId);

      const organisationId = organisation_user[0].orgId

        const { data: da, error: errr } = await supabase
        .from('organisation_users')
        .insert([
            {
                orgId: organisationId,
                userId: userId
            }
        ]);

      if(errr){
        res.send(errr)
      }
  
  
    // Return the response
    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName, 
          email: user.email,
          phone: user.phone,
        }
      }
    });
});

exports.login_user = asyncHandler(async (req, res, next) => {
  const {  email, password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();


  if (error || !user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  
  }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ "status": "Bad request", "message": "Authentication failed", "statusCode": 401 });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
        {
            userId: user.userId,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expiration time
    );

    // Respond with success and token
    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
            accessToken,
            user: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
        },
    });


});

