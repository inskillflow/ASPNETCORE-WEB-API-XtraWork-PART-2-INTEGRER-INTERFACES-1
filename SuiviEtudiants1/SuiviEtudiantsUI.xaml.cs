using System;
using System.Collections.Generic;

using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Data.SqlClient;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;


namespace SuiviEtudiants1
{
    /// <summary>
    /// Interaction logic for SuiviEtudiantsUI.xaml
    /// </summary>
    public partial class SuiviEtudiantsUI : Window
    {
        bool ouverture = false; 
        SqlConnection connexion; 
        UtilisateurActif utilisateur;
        SqlCommand commande;
        Etudiant etudiant;
        List<Etudiant> etudiants = new List<Etudiant>();


        public SuiviEtudiantsUI(UtilisateurActif actif)
        {
            InitializeComponent();
            utilisateur = actif;
            Title += utilisateur.Prenom + " " + utilisateur.Nom;
            connexion = new SqlConnection(ConfigurationManager.ConnectionStrings["constr"].ConnectionString);
            EmplirListeEtudiants();
            ouverture = true;

        }

        private void EmplirListeEtudiants()
        {
            string selectEtudiant = "SELECT IdEtudiant, Prenom, Nom FROM tblEtudiants WHERE IdInstructeur = '" + utilisateur.IdUtilisateur + "' ORDER BY Nom";
            try
            {
                // Création de notre objet SqlCommand.
                commande = new SqlCommand(selectEtudiant, connexion);
                // Ouverture de notre connexion.
                connexion.Open();
                // Création de notre lecteur d'enregistrements.
                SqlDataReader lecteur = commande.ExecuteReader();
                while (lecteur.Read())
                {
                    // Création d'un nouvel étudiant.
                    etudiant = new Etudiant();
                    // Récupération des informations de l'étudiant.
                    etudiant.idEtudiant = lecteur["IdEtudiant"].ToString(); 
                    etudiant.prenom = lecteur["Prenom"].ToString(); 
                    etudiant.nom = lecteur["Nom"].ToString();
                    // Ajoût de l'étudiant dans la liste.
                    etudiants.Add(etudiant);
                }
                ListeEtudiants.DataContext = etudiants.ToList();

            }

            catch (Exception ex)
            {
                // Affichage de l'erreur en cas de connexion non réussie.
                MessageBox.Show(ex.Message);
            }
            finally
            {
                // Fermeture de notre connexion.
                connexion.Close();
            }


        }

        private void ListeEtudiants_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Quitter si aucun élément sélectionné
            if (ListeEtudiants.SelectedIndex == -1)
            {
                return;
            }

            Etudiant sEtudiant = etudiants[ListeEtudiants.SelectedIndex];
            string selectEtudiant = "SELECT * FROM tblEtudiants WHERE IdEtudiant = '" + sEtudiant.idEtudiant + "'";
            // Création de notre objet SqlCommand.
            commande = new SqlCommand(selectEtudiant, connexion);
            // Ouverture de notre connexion.
            connexion.Open();
            // Création et exécution de notre lecteur d'enregistrement.
            SqlDataReader lecteur = commande.ExecuteReader();
            // Si l'enregistrement a été trouvé.
            if (lecteur.Read())
            {

                // Affichage des informations dans les différents éléments de notre formulaire
                lblID.Content = lecteur["IdEtudiant"];
                txtPrenom.Text = lecteur["Prenom"].ToString();
                txtNom.Text = lecteur["Nom"].ToString();
                txtAdresse.Text = lecteur["Adresse"].ToString(); 
                txtVille.Text = lecteur["Ville"].ToString(); 
                txtProvince.Text = lecteur["Province"].ToString(); 
                txtCodePostal.Text = lecteur["CodePostal"].ToString(); 
                txtTelephone.Text = lecteur["Telephone"].ToString();
                switch (lecteur["Statut"].ToString())
                {
                    case "0":
                        rbActif.IsChecked = true;
                        break;
                    case "1":
                        rbArret.IsChecked = true;
                        break;
                    case "2":
                        rbGradue.IsChecked = true;
                        break;
                }


            }
            connexion.Close();
        }

       
    }
}
