const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session') 
const dayjs = require('dayjs')

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
    connection.query('SELECT * FROM produits ORDER BY -id_produit', (error, result) => {
        if(error){
            console.error("Erreur de récupèration !")
            return;
        }

        res.json(result);
    })
}) 

app.post('/addProduits', checkSession, (req, res) => {
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

            const sql = "INSERT INTO users(nom,prenom, email, password, role) VALUES (?,?,?,?,?)";
            const donnees = [nom,prenom,email, hash, "utilisateur"];  

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

    const sql = "SELECT * FROM produits WHERE id_produit = ? LIMIT 1";
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
    const { email, mdp } = req.body;
    
    if(!email || !mdp){
        return res.status(400).json({message: "Veuillez remplir les champs vides !"});
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    const emailPassed = [email];

    connection.query(sql, emailPassed, (err, resultats) => {
        if(err) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
        if(resultats.length < 1){
            return res.status(400).json({ message: "L'adresse mail est introuvable !" });
        }

        const mdpUserDb = resultats[0].password; 

        bcrypt.compare(mdp, mdpUserDb, (err, result) => {
            if(err) {
                return res.status(500).json({ message: "Erreur serveur lors de la vérification du mot de passe" });
            }
            if (!result) {
                return res.status(400).json({ message: "Mot de passe incorrect" });
            }
 
            req.session.userId = resultats[0].id_users;

            req.session.save((err) => {
                if (err) {
                    console.error("Erreur session :", err);
                    return res.status(500).json({ message: "Erreur de session" });
                }

                const reqPanierSession = "SELECT * FROM panier WHERE id_users = ?";
                connection.query(reqPanierSession, [req.session.userId], (erreur, resultat) => {
                    if (erreur) {
                        return res.status(500).json({ message: "Impossible d'exécuter la requête panier !" });
                    }

                    if(resultat.length === 0) { 
                        return res.status(200).json({ message: "Connecté ! Aucun panier trouvé." });
                    }
 
                    const nowDate = dayjs().format("DD/MM/YYYY");
                    const datesASupprimer = resultat
                        .filter(p => dayjs(p.dateheure).format("DD/MM/YYYY") !== nowDate)
                        .map(p => dayjs(p.dateheure).format("YYYY-MM-DD"));

                    if (datesASupprimer.length === 0) {
                        return res.status(200).json({ message: "Connecté ! Aucun panier ancien à supprimer." });
                    } 
                    const reqDelete = "UPDATE panier SET inactive = ? WHERE id_users = ? AND dateheure IN (?)";
                    connection.query(reqDelete, [1,req.session.userId, datesASupprimer], (erreurDel, resultatDel) => {
                        if (erreurDel) {
                            return res.status(500).json({ message: "Impossible de supprimer les anciennes commandes !" });
                        }
 
                        req.session.OrderCommand = resultat[0].numerocommande;
                        req.session.save(err => {
                            if(err){
                                return res.status(500).json({message: "Impossible de créer la session numéro de commande !"});
                            }
                            return res.status(200).json({ message: "Connecté ! Anciennes commandes supprimées." });
                        });
                    });
                });
            });
        });
    });
});

app.get('/checkSession', (req, res) => {
    if (req.session.userId) {
        const sql = "SELECT * FROM users WHERE id_users = ? LIMIT 1";
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
                userId: result[0].id_users,
                nom: result[0].nom,
                prenom: result[0].prenom,
                role: result[0].role,
            });
        });
    } else {
        res.json({ loggedIn: false });
    }
});

function checkSession(req,res,next){
    if(req.session && req.session.userId){
        next();
    }else{
        res.status(401).json({ message: "Vous n'êtes pas connecté, veuillez vous connecter !"})
    }
} 

app.get('/logout', (req, res) => { 
    if (req.session.userId) {
        req.session.destroy(err => {
            console.error("Erreur lors de la destruction de session :", err);
        })
        res.clearCookie('connect.sid'); 
        res.json({ message: "Déconnecté avec succès" }); 
    }  
});

app.post('/getPanier', checkSession, (req,res) => {
    const userId = req.session.userId;

    if(!userId){
        return res.status(404).json({message: "Impossible de récuperer l'Id de l'utilisateur !"})
    }

    const sql = "SELECT * FROM panier WHERE id_users = ? AND inactive = ?";
    const donnees = [userId, 0];

    connection.query(sql,donnees, (err,result) => {
        if(result.length == 0){
            return res.status(200).json([]);
        }

        const sql2 = "SELECT * FROM panier p INNER JOIN produits prod ON p.id_produit = prod.id_produit WHERE p.id_users = ? AND p.inactive = ?";
        const donnees2 = [userId, 0];

        connection.query(sql2,donnees2, (err, resultat) => {
            if(err){
                return res.json(404).json({message: "Impossible de faire la jointure du panier vers les produits !"});
            }
            return res.status(200).json(resultat);
        })
    })
})

app.post("/addProduitPanier", checkSession, (req, res) => { 
    const idProduit = req.body.idProduit;
    const quantity = req.body.quantity;
    const userId = req.session.userId;

    if (!idProduit || !userId || !quantity) {
        return res.status(400).json({ status: "error", message: "Données manquantes (idProduit, myId, quantity)" });
    }

    if (quantity > 5) {
        return res.status(200).json({ status: "error", message: "La quantité maximale par ajout est de 5." });
    }

    if (quantity <= 0) {
        return res.status(200).json({ status: "error", message: "La quantité ne peut pas être inférieure à 1 ou égale à 0." });
    }

    const sqlGetActives = "SELECT * FROM panier WHERE id_produit = ? AND id_users = ? AND inactive = 0";
    connection.query(sqlGetActives, [idProduit,userId], (err, activeRows) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Erreur lors de la vérification du panier actif", error: err });
        }

        let totalActif = activeRows.reduce((acc, row) => acc + row.quantity, 0);
        if (totalActif >= 5) {
            return res.status(200).json({ status: "error", message: "Quantité maximum atteinte (5 produits) déjà présente dans le panier." });
        }

        let quantityToAdd = quantity;
        if (totalActif + quantity > 5) {
            quantityToAdd = 5 - totalActif;
        }

        if (activeRows.length > 0) { 
            const rowToUpdate = activeRows[0];
            const newQty = Math.min(5, rowToUpdate.quantity + quantityToAdd);

            const sqlUpdate = "UPDATE panier SET quantity = ? WHERE id_panier = ?";
            connection.query(sqlUpdate, [newQty, rowToUpdate.id_panier], (err) => {
                if (err) {
                    return res.status(500).json({ status: "error", message: "Erreur lors de la mise à jour", error: err });
                }
                return res.status(200).json({ status: "success", message: "Quantité mise à jour", quantity: newQty });
            });
        } else { 
            const sqlGetOrder = `
                SELECT numerocommande 
                FROM panier 
                WHERE id_users = ? 
                  AND commande_valider = 1 
                  AND inactive = 0 
                  AND DATE(dateheure) = CURDATE()
                ORDER BY dateheure DESC 
                LIMIT 1`;

            connection.query(sqlGetOrder, [userId], (err, orderResult) => {
                if (err) {
                    return res.status(500).json({ status: "error", message: "Erreur lors de la récupération de la commande active", error: err });
                }

                let numerocommande;
                if (orderResult.length > 0) {
                    numerocommande = orderResult[0].numerocommande;
                } else {
                    const { v4: uuidv4 } = require('uuid');
                    numerocommande = uuidv4();
                }

                const sqlInsert = "INSERT INTO panier (quantity, dateheure, commande_valider, numerocommande, id_produit, id_users) VALUES (?, ?, 1, ?, ?, ?)";
                connection.query(sqlInsert, [quantityToAdd, new Date(), numerocommande, idProduit, userId], (err) => {
                    if (err) {
                        return res.status(500).json({ status: "error", message: "Erreur lors de l'insertion du produit dans le panier", error: err });
                    }
                    return res.status(200).json({ status: "success", message: "Produit ajouté au panier", quantity: quantityToAdd });
                });
            });
        }
    });
});

app.post("/getCountPanier", checkSession, (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(400).json({ status: "error", message: "ID utilisateur manquant" });
    }

    const sql = "SELECT SUM(quantity) AS count FROM panier WHERE id_users = ? AND inactive = ?";

    connection.query(sql, [userId, 0], (err, result) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Erreur lors de la récupération du panier", error: err });
        }

        const count = result[0].count || 0;
        return res.status(200).json({ count });
    });
});

app.post("/supprimerPanier", checkSession, (req, res) => {
    const { idProduit } = req.body;
    const userId = req.session.userId;

    if (!idProduit || !userId) {
        return res.status(400).json({ message: "ID produit ou utilisateur manquant." });
    }
 
    const requeteSuppression = `
        UPDATE panier 
        SET inactive = 1 
        WHERE id_produit = ? AND id_users = ? AND inactive = 0
    `;
    const donneesSuppression = [idProduit, userId];

    connection.query(requeteSuppression, donneesSuppression, (err, resultatSuppression) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la suppression." });
        }

        if (resultatSuppression.affectedRows === 0) {
            return res.status(404).json({ message: "Aucun produit correspondant trouvé à supprimer." });
        }

        const requeteCount = `
            SELECT COUNT(*) AS count 
            FROM panier 
            WHERE id_users = ? AND inactive = 0
        `;

        connection.query(requeteCount, [userId], (err, resultatCount) => {
            if (err) {
                return res.status(500).json({ message: "Erreur lors du comptage des produits." });
            }

            const produitsRestants = resultatCount[0].count;

            if (produitsRestants < 2 && req.session.OrderCommand) {
                delete req.session.OrderCommand;

                req.session.save(err => {
                    if (err) {
                        return res.status(500).json({ message: "Erreur lors de la suppression de la session commande." });
                    }

                    return res.status(200).json({ message: "Produit supprimé. Session commande supprimée." });
                });
            } else {
                return res.status(200).json({ message: "Produit supprimé avec succès." });
            }
        });
    });
});

app.post("/updateProfil", checkSession, (req, res) => { 
    const { nom, prenom, email } = req.body;
    const userId = req.session.userId;  
     
    if (!nom || !prenom || !email) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
     
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Adresse email invalide" });
    }
   
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,}$/;
    if (!nameRegex.test(nom) || !nameRegex.test(prenom)) {
      return res.status(400).json({ message: "Nom ou prénom invalide" });
    }
   
    const sql = "UPDATE users SET nom = ?, prenom = ?, email = ? WHERE id_users = ?";
    const values = [nom, prenom, email, userId];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erreur mise à jour profil :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
       
      res.status(200).json({ message: "Profil mis à jour avec succès" });
    });
});

app.get("/livraisonPass", checkSession, (req, res) => {
    const requete = "SELECT * FROM panier WHERE id_users = ? AND inactive = ? ORDER BY dateheure DESC LIMIT 1";
    const donnees = [req.session.userId, 0];

    connection.query(requete, donnees, (erreur, resultat) => {
        if(erreur){
            return res.status(500).json({ message: "Impossible d'exécuter la requête !" });
        }

        return res.status(200).json({ passed: resultat.length === 1 });
    })
})

app.listen(3000, () => {
    console.log('Backend lancé sur http://localhost:3000');
});