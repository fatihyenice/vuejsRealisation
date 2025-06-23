const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session')

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: 'dev_secret_1234567890',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,       // HTTP local
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 jour
    }
  }));
  

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

    if (!nom_produit || !descriptif_produit || !prix_produit || !urlimage) {
        return res.status(400).json({ message: 'Veuillez remplir les champs vides !' });
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
    const { email, nom, prenom, mdpUn, mdpDeux } = req.body;

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
        return res.status(400).json({ message: "L'adresse mail est indisponible !" });
       }

        bcrypt.hash(mdpUn, 10, (err, hash) => {
            if (err) {
                console.error("Erreur de hashage :", err);
                return res.status(500).json({ message: "Erreur lors du hashage du mot de passe" });
            }

            const sql = "INSERT INTO users(nom,prenom, email, password) VALUES (?,?,?,?)";
            const donnees = [nom,prenom,email, hash];  

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

app.post('/login', (req, res) => {
    const { email, mdp } = req.body
    
    if(!email || !mdp){
        return res.status(400).json({message: "Veuillez remplir les champs vides !"})
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    const emailPassed = [email];

    connection.query(sql, emailPassed, (err, resultats) => {
        if(resultats.length < 1){
            return res.status(400).json({ message: "L'adresse mail est introuvable !" })
        }

        const mdpUserDb = resultats[0].password; 

        bcrypt.compare(mdp, mdpUserDb, (err, result) => {
            if (err) throw err;
          
            if (result) {
                req.session.userId = resultats[0].id;
                req.session.save((err) => {
                    if (err) {
                        console.error("Erreur session :", err);
                        return res.status(500).json({ message: "Erreur de session" });
                    } 
                    return res.status(200).json({ message: "Connecté !"});
                }); 
            } else {
                return res.status(400).json({ message: "Mot de passe incorrect" })
            }
          });
    })
}); 

app.get('/checkSession', (req, res) => {
    if (req.session.userId) {
        const sql = "SELECT * FROM users WHERE id = ? LIMIT 1";
        connection.query(sql, [req.session.userId], (err, result) => {
            if (err) {
                console.error("Erreur lors de la récupération de l'utilisateur :", err);
                return res.status(500).json({ message: "Erreur serveur" });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "Utilisateur introuvable" });
            }

            res.json({
                email: result[0].email, 
                loggedIn: true,
                userId: result[0].id,
                nom: result[0].nom,
                prenom: result[0].prenom,
            });
        });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/logout', (req, res) => { 
    if (req.session.userId) {
        req.session.destroy(err => {
            console.error("Erreur lors de la destruction de session :", err);
        })
        res.clearCookie('connect.sid'); 
        res.json({ message: "Déconnecté avec succès" });
    }  
});

app.listen(3000, () => {
    console.log('Backend lancé sur http://localhost:3000');
});