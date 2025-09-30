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

namespace SuiviEtudiants1
{
    /// <summary>
    /// Interaction logic for frmLoggin.xaml
    /// </summary>
    public partial class frmLoggin : Window
    {
        SqlConnection connexion;
        SqlCommand commande;
        bool ouverture = false;
        public frmLoggin()
        {
            InitializeComponent();
            connexion = new SqlConnection(ConfigurationManager.ConnectionStrings["constr"].ConnectionString);
            txtUtilisateur.Focus();
            ouverture = true;
        }

        private void btnOk_Click(object sender, RoutedEventArgs e)
        {
            // Récupération des valeurs saisies par l’utilisateur  
            //string utilisateur = txtUtilisateur.Text;
            //string motPasse = txtMotPasse.Password;
            // Affichage du message de bienvenue
            //MessageBox.Show($"Bonjour!{Environment.NewLine} Utilisateur:{utilisateur +Environment.NewLine}Mot de passe:{motPasse +Environment.NewLine}", "Bienvenue!", MessageBoxButton.OK,MessageBoxImage.Warning);

            try
            {
                string authentification = "SELECT * FROM tblUtilisateurs WHERE NomUtilisateur = '" + txtUtilisateur.Text + "' AND MotPasse = '" + txtMotPasse.Password +"'";
                commande = new SqlCommand(authentification, connexion);

                connexion.Open();
                SqlDataReader lecteur = commande.ExecuteReader();
                //MessageBox.Show("Connexion à la base de données réussie.");


                if (lecteur.Read())
                {

                    // Création de l'utilisateur actif.
                    UtilisateurActif utilisateur = new UtilisateurActif();
                    // Récupération des informations de notre utilisateur.
                    utilisateur.IdUtilisateur = lecteur["IdUtilisateur"].ToString(); 
                    utilisateur.Prenom = lecteur["Prenom"].ToString(); 
                    utilisateur.Nom = lecteur["Nom"].ToString();
                    // Affichage d'un message de bienvenue.
                    MessageBox.Show("Bienvenue " + utilisateur.Prenom + " " + utilisateur.Nom);
                    
                    // On crée notre nouvelle fenêtre.
                    SuiviEtudiantsUI gestionEtudiant = new SuiviEtudiantsUI(utilisateur);
                    // On affiche notre fenêtre de travail principale.
                    gestionEtudiant.Show();
                    // On modifie la valeur de notre variable ouverture.
                    ouverture = false;
                    // On cache la fenêtre d'accès.
                    this.Close();

                }

                else
                {
                    // Affichage d'un message d'erreur.
                    MessageBox.Show("Les informations saisies ne me permet pas de vous authentifier.");
                    // Préparation de la fenêtre pour la saisie.
                    txtUtilisateur.Text = string.Empty;
                    txtMotPasse.Password = string.Empty;

                    txtUtilisateur.Focus();
                }
            }
            catch (Exception ex)
            {

                MessageBox.Show(ex.Message);
            }
            finally
            {
                // Fermeture de notre connexion.
                connexion.Close();
            }



        }

        private void btnAnnuler_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("Vous avez cliqué sur le bouton ANNULER !", "Attention !", MessageBoxButton.OK, MessageBoxImage.Warning);
        }
    }
}
