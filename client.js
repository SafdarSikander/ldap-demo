const ldap = require('ldapjs');

// LDAP server configuration
const ldapUrl = 'ldap://localhost:1389';
const bindDN = 'cn=root';
const bindPassword = 'secret';



// Create an LDAP client
const client = ldap.createClient({
  url: ldapUrl,
});

// LDAP client events
client.on('error', (err) => {
  console.error('LDAP client error:', err.message);
  client.unbind();
});

// Connect and bind to the server
client.bind(bindDN, bindPassword, (err) => {
  if (err) {
    console.error('LDAP bind error:', err.message);
    client.unbind();
    return;
  }

  console.log('LDAP bind successful');

  // Perform a search operation
  const searchOptions = {
    scope: 'sub', // Search the whole sub-tree from the baseDN
    filter: '(objectClass=*)', // Search for all objects with any objectClass
    attributes: ['dn', 'o'], // Retrieve only the dn and organization (o) attributes
  };

  const baseDN = 'o=example';
  client.search(baseDN, searchOptions, (searchErr, searchRes) => {
    if (searchErr) {
      console.error('LDAP search error:', searchErr.message);
      client.unbind();
      return;
    }

    searchRes.on('searchEntry', (entry) => {
      console.log('entry: ' + JSON.stringify(entry.pojo));
      if (entry && entry.object) {
        console.log('DN:', entry.object.dn);
        console.log('Organization:', entry.object.o);
      }
    });

    searchRes.on('error', (searchErr) => {
      console.error('LDAP search error:', searchErr.message);
      client.unbind();
    });

    searchRes.on('end', () => {
      console.log('LDAP search finished');
      client.unbind(); // Unbind the client after the search is completed
    });
  });
});
