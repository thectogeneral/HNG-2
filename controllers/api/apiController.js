const asyncHandler = require('express-async-handler');
const supabase = require('../../database/conn')


exports.get_user = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('userId', id)
        .single();

    if (error || !user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
        status: 'success',
        message: 'User retrieved successfully',
        data: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
        },
    });
});

exports.create_organisation = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.user.userId; 

  const { data: organisation, error } = await supabase
      .from('organisations')
      .insert([
          {
              name: `${name}'s Organisation`,
              description,
              created_by: userId, 
          },
      ])
      .single();

  if (error) {2
      return res.status(400).json({
          status: 'Bad Request',
          message: 'Client error',
          statusCode: 400
      });
  }

  res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
          name: req.body.name,
          description: req.body.description,
          //createdBy: organisation.created_by 
      },
  });
});


exports.get_all_organisations = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId; 
  
    const { data: organisations, error } = await supabase
        .from('organisation_users')
        .select('orgId, organisations(name, description)')
        .eq('userId', userId)
        console.log(organisations)

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Error fetching organisations',
                statusCode: 400
            });
        }

    res.status(200).json({
        status: 'success',
        message: 'Organisations retrieved successfully',
        data: {
            organisations: organisations.map(org => ({
                orgId: org.orgId,
                name: org.organisations.name,
                description: org.organisations.description
            }))
        }
    })
});

exports.get_single_organisation = asyncHandler(async (req, res, next) => {
  const { orgId } = req.params;
    const userId = req.user.userId;

    const { data: organisation, error } = await supabase
        .from('organisations')
        .select('*')
        .eq('orgId', orgId)
        .eq('created_by', userId)
        .single();

    if (error || !organisation) {
        return res.status(404).json({
            status: 'error',
            message: 'Organisation not found',
            statusCode: 404
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Organisation retrieved successfully',
        data: {
            orgId: organisation.orgId,
            name: organisation.name,
            description: organisation.description
        }
    });
});

exports.add_user_to_organisation = asyncHandler(async (req, res, next) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  // Check if organisation exists
  const { data: organisation, error: orgError } = await supabase
      .from('organisations')
      .select('*')
      .eq('orgId', orgId)
      .single();

  if (orgError || !organisation) {
      return res.status(404).json({
          status: 'error',
          message: 'Organisation not found',
          statusCode: 404
      });
  }

  // Check if user exists
  const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

  if (userError || !user) {
      return res.status(404).json({
          status: 'error',
          message: 'User not found',
          statusCode: 404
      });
  }

  // Add user to organisation
  const { data, error } = await supabase
      .from('organisation_users')
      .insert([
          {
              orgId: orgId,
              userId: userId
          }
      ]);
console.log(error)

  if (error) {
      return res.status(400).json({
          status: 'Bad Request',
          message: 'Error adding user to organisation',
          statusCode: 400
      });
  }

  res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully'
  });
});