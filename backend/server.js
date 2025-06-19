const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

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

app.post('/register', (req,res) => {

    const { email, mdpUn, mdpDeux } = req.body;

    if(!email || !mdpDeux || !mdpUn){
        return res.status(400).json({ message: "Adresse mail et mot de passe requis !"})
    }

    const sql = "INSERT INTO users(email,password) VALUES (?,?)";
    const donnees = [email, mdpUn, mdpDeux];

    connection.query(sql,donnees, (err, resultats) => {
        if(err){
            console.error("Une erreur s'est produite !");
            return;
        }

        res.json({message: "Votre inscription à été effectué !"})
    })
})


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