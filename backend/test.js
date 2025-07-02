const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');


const connection = mysql.createConnection({
    host: 'localhost',
    database: 'fydevshop',
    user: 'root',
    password: ''
});

connection.connect(err => {
  if (err) {
    return console.error('Erreur connexion :', err);
  }
  console.log('Connecté à la BDD');

  const qtyToInsert = 2;
  const commandeValider = 1;
  const numerocommande = uuidv4();
  const id_produit = 1; // change avec un id valide
  const id_users = 1;   // change avec un id valide

  console.log('Insertion avec:', qtyToInsert, commandeValider, numerocommande, id_produit, id_users);

  const sqlInsert = `INSERT INTO panier 
    (quantity, commande_valider, numerocommande, id_produit, id_users) 
    VALUES (?, ?, ?, ?, ?)`;

  connection.query(sqlInsert, [qtyToInsert, commandeValider, numerocommande, id_produit, id_users], (err, result) => {
    if (err) {
      console.error('Erreur insert:', err);
    } else {
      console.log('Insert réussi:', result);
    }
    connection.end();
  });
});
