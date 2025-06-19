const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt')

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'fydevshop',
    user: 'root',
    password: ''
});

connection.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base :', err);
    } else {
        console.log('Connecté à la base MySQL');
    }
});

// Route ping pour vérifier que le backend répond
app.get('/', (req, res) => {
    res.json({ message: 'Backend connecté et prêt !' });
});

app.get('/produits', (req,res) => {
    connection.query('SELECT * FROM produits ORDER BY -id', (error, result) => {
        if(error){
            console.error("Erreur de récupèration !")
            return;
        }

        res.json(result);
    })
}) 

app.post('/addProduits', (req, res) => {
    const { nom_produit, descriptif_produit, prix_produit, urlimage } = req.body;

    if (!nom_produit || !prix_produit) {
        return res.status(400).json({ message: 'Nom et prix requis' });
    }

    const sql = 'INSERT INTO produits (nom_produit, prix, description,  url) VALUES (?, ?, ?, ?)';
    const values = [nom_produit,  prix_produit, descriptif_produit, urlimage];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur d’insertion :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        res.status(201).json({ message: 'Produit ajouté', id: result.insertId });
    });
});

// INSCRIPTION
app.post('/register', (req, res) => {
    const { email, mdpUn, mdpDeux } = req.body;

    if (!email || !mdpUn || !mdpDeux) {
        return res.status(400).json({ message: "Adresse mail et mot de passe requis !" });
    }

    if (mdpUn !== mdpDeux) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas !" });
    }

    

    const reqq = "SELECT email FROM users WHERE email = ?";
    const mail = [email]

    connection.query(reqq, mail, (err,resultats) => {
       if(resultats.length > 0) {
        return res.status(400).json({ message: "Adresse mail utilisé !" });
       }

        bcrypt.hash(mdpUn, 10, (err, hash) => {
            if (err) {
                console.error("Erreur de hashage :", err);
                return res.status(500).json({ message: "Erreur lors du hashage du mot de passe" });
            }

            const sql = "INSERT INTO users(email, password) VALUES (?, ?)";
            const donnees = [email, hash];  

            connection.query(sql, donnees, (err, resultats) => {
                if (err) {
                    console.error("Erreur lors de l'insertion en base :", err);
                    return res.status(500).json({ message: "Erreur lors de la création du compte" });
                }

                res.status(201).json({ message: "Utilisateur enregistré avec succès !" });
            });
        });
    });
});

app.post('/produitsDetail', (req, res) => {

    const { idProd } = req.body;

    const sql = "SELECT * FROM produits WHERE id = ? LIMIT 1";
    const donneespasser = [idProd];

    connection.query(sql, donneespasser, (err, result) => {
        if(err){
            console.error("Une erreur s'est produite !");
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ error: "Produit non trouvé" });
            return;
        }

        res.json(result[0]);
    })
})

app.listen(3000, () => {
    console.log('Backend lancé sur http://localhost:3000');
});