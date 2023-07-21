const ldap = require('ldapjs');

// Create an LDAP server
const server = ldap.createServer();

// Configure the LDAP server
server.bind('cn=root', function(req, res, next) {
  // You can customize the bind logic here.
  // For simplicity, let's assume a hardcoded password "secret" for the "root" user.
  if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret') {
    return next(new ldap.InvalidCredentialsError());
  }

  // Bind successful
  res.end();
  return next();
});

// Dummy data representing LDAP entries
const dummyData = [
  {
    dn: 'cn=user1,o=example',
    objectClass: ['inetOrgPerson'],
    cn: 'user1',
    sn: 'User1',
  },
  {
    dn: 'cn=user2,o=example',
    objectClass: ['inetOrgPerson'],
    cn: 'user2',
    sn: 'User2',
  },
];

// Configure search
server.search('o=example', function(req, res, next) {
  // You can customize the search logic here.
  const obj = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ['organization'],
      o: 'example',
    }
  };

  res.send(obj);
  res.end();
  return next();
});

// Handle unbind
server.unbind(function(req, res, next) {
  res.end();
  return next();
});

// Start the server
const port = 1389; // LDAP default port
server.listen(port, () => {
  console.log(`LDAP server is listening on port ${port}`);
});
