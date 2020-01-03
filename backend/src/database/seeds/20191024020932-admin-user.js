const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Administrador',
          email: 'admin@gympoint.com',
          provider: true,
          password_hash: bcrypt.hashSync('123456', 8),
          profile_admin: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
